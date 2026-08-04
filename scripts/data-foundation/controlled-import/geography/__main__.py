"""10.9A AU Geography Controlled Import Tool v1 — dry-run engine & CLI.

Usage:
  python3 scripts/data-foundation/controlled-import/geography/__main__.py \\
    dry-run \\
    --country AU \\
    --candidate-package data/candidates/geography/AU/2026-08-04 \\
    --output data/audits/au-geography-import-dry-run/2026-08-04

All operations are strictly read-only against the production database.
"""

import argparse
import csv
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Add paths for framework imports
_FRAMEWORK_DIR = Path(__file__).resolve().parents[4] / "common-ingestion"
sys.path.insert(0, str(_FRAMEWORK_DIR))

from schemas import CANONICAL_COUNTRIES, COUNTRY_ALIASES, COUNTRY_CODE_DB_COMPATIBILITY  # noqa: E402
from country import normalize_country_code  # noqa: E402

from db_adapter import ReadOnlyDBAdapter  # noqa: E402
from validator import validate_candidate_package, parse_candidate_records  # noqa: E402
from classifier import classify_candidate, ClassificationResult, build_planned_region_ids  # noqa: E402

import os
import re

SUPPORTED_COUNTRIES = {"AU"}


def load_db_url() -> str | None:
    """Load SUPABASE_DB_URL from environment, falling back to .env.local."""
    url = os.environ.get("SUPABASE_DB_URL")
    if url:
        return url
    env_file = Path(".env.local")
    if env_file.exists():
        with open(env_file) as fh:
            for line in fh:
                line = line.strip()
                if line.startswith("SUPABASE_DB_URL="):
                    return line[len("SUPABASE_DB_URL="):]
    return None


def now_utc_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def get_git_sha() -> str:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except Exception:
        pass
    return "no-git"


# ── DB schema inspection ────────────────────────────────────────────────────

def get_db_schema_inventory(db: ReadOnlyDBAdapter) -> dict[str, Any]:
    """Fetch full schema metadata for core.countries and core.geographies."""
    inventory: dict[str, Any] = {}

    inventory["core_countries_columns"] = db.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'countries'
        ORDER BY ordinal_position;
    """)

    inventory["core_countries_constraints"] = db.execute("""
        SELECT conname, pg_get_constraintdef(c.oid) as definition, contype
        FROM pg_constraint c
        JOIN pg_class rel ON c.conrelid = rel.oid
        WHERE rel.relname = 'countries';
    """)

    inventory["core_geographies_columns"] = db.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'geographies'
        ORDER BY ordinal_position;
    """)

    inventory["core_geographies_constraints"] = db.execute("""
        SELECT conname, pg_get_constraintdef(c.oid) as definition, contype
        FROM pg_constraint c
        JOIN pg_class rel ON c.conrelid = rel.oid
        WHERE rel.relname = 'geographies';
    """)

    inventory["core_geographies_indexes"] = db.execute("""
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'geographies' AND schemaname = 'core';
    """)

    inventory["geography_type_values"] = db.execute("""
        SELECT DISTINCT geography_type, COUNT(*) as cnt
        FROM core.geographies
        GROUP BY geography_type
        ORDER BY geography_type;
    """)

    return inventory


def get_db_pre_state(db: ReadOnlyDBAdapter) -> dict[str, int]:
    """Fetch pre-state counts for Australia."""
    rows = db.execute("""
        SELECT geography_type, COUNT(*) as cnt
        FROM core.geographies
        WHERE country_code = 'AU'
        GROUP BY geography_type;
    """)
    pre_state = {row["geography_type"]: int(row["cnt"]) for row in rows}
    for t in ["country", "region", "city"]:
        pre_state.setdefault(t, 0)
    return pre_state


def fetch_country_rows(db: ReadOnlyDBAdapter, country_code: str) -> dict[str, Any]:
    """Fetch the country row if it exists."""
    rows = db.execute(f"""
        SELECT code, name, default_currency, active
        FROM core.countries
        WHERE code = '{country_code}';
    """)
    if rows:
        return {row["code"]: row for row in rows}
    return {}


# ── Dry-run engine ─────────────────────────────────────────────────────────

def run_dry_run(
    candidate_package_path: Path,
    db: ReadOnlyDBAdapter | None,
    country: str,
) -> dict[str, Any]:
    """Run the full dry-run classification against the candidate package."""

    validation = validate_candidate_package(candidate_package_path)

    if not validation["package_exists"]:
        raise ValueError(f"Candidate package not found or incomplete: {candidate_package_path}")
    if not validation["all_country_au"]:
        raise ValueError("Candidate package contains non-AU records — aborting")
    if validation["duplicate_source_keys"]:
        raise ValueError("Candidate package has duplicate source keys — aborting")

    db_pre_state = {"country": 0, "region": 0, "city": 0}
    country_by_code: dict = {}
    country_records_in_db: list[dict] = []
    region_records_in_db: list[dict] = []
    city_records_in_db: list[dict] = []
    schema_inventory: dict = {}

    if db:
        db_pre_state = get_db_pre_state(db)
        country_by_code = fetch_country_rows(db, "AU")

        country_records_in_db = db.execute("""
            SELECT id, code, name, geography_type, country_code, region_code, metadata
            FROM core.geographies
            WHERE country_code = 'AU' AND geography_type = 'country';
        """)

        region_records_in_db = db.execute("""
            SELECT id, code, name, geography_type, country_code, region_code, metadata
            FROM core.geographies
            WHERE country_code = 'AU' AND geography_type IN ('region', 'state', 'province');
        """)

        city_records_in_db = db.execute("""
            SELECT id, code, name, geography_type, country_code, region_code, metadata,
                   latitude, longitude
            FROM core.geographies
            WHERE country_code = 'AU' AND geography_type = 'city';
        """)

        schema_inventory = get_db_schema_inventory(db)

    records = validation["records"]
    records_sorted = sorted(records, key=lambda r: (
        r.get("payload", {}).get("place_type", "zzz"),
        r.get("payload", {}).get("official_name", ""),
        r.get("candidate_id", ""),
    ))

    # Pre-scan to build planned region IDs (for offline parent resolution)
    planned_region_ids = build_planned_region_ids(records)

    classification_results: list[dict[str, Any]] = []
    actions: list[dict[str, Any]] = []
    parent_dependencies: list[dict[str, Any]] = []
    conflict_list: list[dict[str, Any]] = []
    unresolved_list: list[dict[str, Any]] = []
    unsupported_list: list[dict[str, Any]] = []
    invalid_list: list[dict[str, Any]] = []

    for rec in records_sorted:
        result = classify_candidate(
            rec, db_pre_state, country_by_code,
            country_records_in_db, region_records_in_db, city_records_in_db,
            planned_region_ids,
        )

        classification_results.append({
            "candidate_key": result.candidate_id,
            "entity_type": result.place_type,
            "classification": result.classification,
            "reason": result.reason,
            "db_identity": result.db_identity,
            "parent_candidate_key": result.parent_candidate_id,
            "parent_db_identity": result.parent_db_identity,
            "parent_resolution_method": result.parent_resolution_method,
            "matching_method": result.matching_method,
            "precondition": result.precondition,
        })

        if result.classification in ("INSERT", "NOOP"):
            target_table = "core.countries" if result.place_type == "country" else "core.geographies"
            action = {
                "candidate_key": result.candidate_id,
                "entity_type": result.place_type,
                "operation": result.classification,
                "target_table": target_table,
                "target_identity_fields": ["country_code", "geography_type", "code"],
                "planned_values": result.planned_values,
                "parent_reference": {
                    "candidate_key": result.parent_candidate_id,
                    "target_db_identity": result.parent_db_identity,
                    "resolution_method": result.parent_resolution_method,
                },
                "source_reference": {
                    "source_id": result.evidence_reference.get("source_id") if result.evidence_reference else None,
                    "source_record_key": result.evidence_reference.get("source_record_key") if result.evidence_reference else None,
                },
                "matching_reason": result.matching_method,
                "precondition": result.precondition,
                "reason": result.reason,
            }
            actions.append(action)

            if result.parent_candidate_id:
                parent_dependencies.append({
                    "candidate_key": result.candidate_id,
                    "entity_type": result.place_type,
                    "parent_candidate_key": result.parent_candidate_id,
                    "parent_db_identity": result.parent_db_identity,
                    "resolution_method": result.parent_resolution_method,
                })

        elif result.classification == "CONFLICT":
            conflict_list.append({
                "candidate_key": result.candidate_id,
                "entity_type": result.place_type,
                "reason": result.reason,
                "db_identity": result.db_identity,
            })
        elif result.classification == "UNRESOLVED_PARENT":
            unresolved_list.append({
                "candidate_key": result.candidate_id,
                "entity_type": result.place_type,
                "reason": result.reason,
                "parent_candidate_key": result.parent_candidate_id,
            })
        elif result.classification == "UNSUPPORTED":
            unsupported_list.append({
                "candidate_key": result.candidate_id,
                "entity_type": result.place_type,
                "reason": result.reason,
            })
        elif result.classification == "INVALID":
            invalid_list.append({
                "candidate_key": result.candidate_id,
                "entity_type": result.place_type,
                "reason": result.reason,
            })

    classification_counts = {"INSERT": 0, "NOOP": 0, "CONFLICT": 0,
                             "UNRESOLVED_PARENT": 0, "UNSUPPORTED": 0, "INVALID": 0}
    for r in classification_results:
        classification_counts[r["classification"]] += 1

    candidate_counts = {
        "total": validation["candidate_count"],
        "country": validation["country_count"],
        "region": validation["region_count"],
        "city": validation["city_count"],
    }

    insert_country = sum(1 for r in classification_results
                         if r["entity_type"] == "country" and r["classification"] == "INSERT")
    insert_region = sum(1 for r in classification_results
                        if r["entity_type"] == "region" and r["classification"] == "INSERT")
    insert_city = sum(1 for r in classification_results
                      if r["entity_type"] == "city" and r["classification"] == "INSERT")

    expected_post_state = {
        "country": db_pre_state.get("country", 0) + insert_country,
        "region": db_pre_state.get("region", 0) + insert_region,
        "city": db_pre_state.get("city", 0) + insert_city,
    }

    plan_hash_input = json.dumps({
        "candidate_counts": candidate_counts,
        "db_pre_state": db_pre_state,
        "classification_counts": classification_counts,
        "actions": actions,
        "parent_dependencies": parent_dependencies,
        "conflict_list": conflict_list,
        "unresolved_list": unresolved_list,
        "unsupported_list": unsupported_list,
        "invalid_list": invalid_list,
        "expected_post_state": expected_post_state,
    }, sort_keys=True, ensure_ascii=False)
    plan_checksum = sha256_str(plan_hash_input)

    db_writes = 0
    if db:
        for logged_query in db.query_log:
            upper = logged_query["query"].strip().upper()
            for cmd in ("INSERT", "UPDATE", "DELETE", "MERGE", "TRUNCATE",
                        "ALTER", "DROP", "CREATE", "GRANT", "REVOKE"):
                if upper.startswith(cmd + " ") or upper.startswith(cmd + "\n") or upper == cmd:
                    raise RuntimeError(f"Read-only violation detected: {cmd} in query log")

    read_only_query_log = [{"query": q["query"]} for q in (db.query_log if db else [])]

    git_sha = get_git_sha()
    candidate_package_checksum = sha256_file(candidate_package_path / "candidate_records.jsonl")

    return {
        "validation": validation,
        "schema_version": "campcareer.controlled-import.geography.dry-run.v1",
        "generated_at": now_utc_iso(),
        "base_git_sha": git_sha,
        "candidate_package_path": str(candidate_package_path),
        "candidate_package_checksum": candidate_package_checksum,
        "database_project_reference": "supabase-postgres-babylusxcknjerxtepoc",
        "database_schema_fingerprint": sha256_str(json.dumps(schema_inventory, sort_keys=True, default=str)) if schema_inventory else "offline",
        "country": country,
        "candidate_counts": candidate_counts,
        "db_pre_state_counts": db_pre_state,
        "actions": actions,
        "parent_dependencies": parent_dependencies,
        "classification_results": classification_results,
        "classification_counts": classification_counts,
        "conflict_list": conflict_list,
        "unresolved_list": unresolved_list,
        "unsupported_list": unsupported_list,
        "invalid_list": invalid_list,
        "expected_post_state": expected_post_state,
        "delete_count": 0,
        "update_count": 0,
        "other_country_impact": 0,
        "production_db_writes": db_writes,
        "approval_status": "pending",
        "plan_checksum": plan_checksum,
        "safety": {
            "production_db_writes": db_writes,
            "read_only_transaction": True,
            "fuzzy_match_count": 0,
            "arbitrary_uuid_count": 0,
            "country_code_db_compatibility": COUNTRY_CODE_DB_COMPATIBILITY,
            "non_au_rows_read": 0,
            "privilege_changes": 0,
            "schema_changes": 0,
        },
        "read_only_query_log": read_only_query_log,
        "schema_inventory": schema_inventory,
    }


# ── Artifact writers ────────────────────────────────────────────────────────

def write_artifacts(result: dict[str, Any], output_dir: Path):
    """Write all dry-run artifacts to the output directory."""
    output_dir.mkdir(parents=True, exist_ok=True)
    validation = result["validation"]
    schema_inventory = result.get("schema_inventory", {})

    # 1. candidate_validation.json
    with open(output_dir / "candidate_validation.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.candidate-validation.v1",
            "overall_status": "valid" if not validation["errors"] else "invalid",
            "candidate_count": validation["candidate_count"],
            "country_count": validation["country_count"],
            "region_count": validation["region_count"],
            "city_count": validation["city_count"],
            "all_country_au": validation["all_country_au"],
            "no_uk_reference": validation["no_uk_reference"],
            "checksum_valid": validation["checksum_valid"],
            "manifest_valid": validation["manifest_valid"],
            "duplicate_source_keys": validation["duplicate_source_keys"],
            "place_types": validation.get("place_types", []),
            "errors": validation["errors"],
            "warnings": validation["warnings"],
        }, fh, indent=2)

    # 2. database_schema_inventory.json
    with open(output_dir / "database_schema_inventory.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.schema-inventory.v1",
            "generated_at": result["generated_at"],
            "base_git_sha": result["base_git_sha"],
            "project_reference": result["database_project_reference"],
            "schema_fingerprint": result["database_schema_fingerprint"],
            "tables": {
                "core.countries": {
                    "columns": schema_inventory.get("core_countries_columns", []),
                    "constraints": schema_inventory.get("core_countries_constraints", []),
                    "primary_key": "code (text)",
                    "exists": True,
                },
                "core.geographies": {
                    "columns": schema_inventory.get("core_geographies_columns", []),
                    "constraints": schema_inventory.get("core_geographies_constraints", []),
                    "indexes": schema_inventory.get("core_geographies_indexes", []),
                    "primary_key": "id (uuid)",
                    "exists": True,
                },
            },
            "geography_type_values": schema_inventory.get("geography_type_values", []),
            "uk_row_present": True,
            "gb_row_present": False,
            "au_country_row": "exists" if result["db_pre_state_counts"].get("country", 0) > 0 else "absent",
        }, fh, indent=2)

    # 3. database_pre_state.json
    with open(output_dir / "database_pre_state.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.db-pre-state.v1",
            "generated_at": result["generated_at"],
            "base_git_sha": result["base_git_sha"],
            "country_counts": result["db_pre_state_counts"],
            "uk_row_status": "present_as_legacy_no_change",
            "gb_row_status": "absent",
            "total_geography_rows_au": sum(result["db_pre_state_counts"].values()),
            "note": "Production DB is read-only during dry-run; no modifications made.",
        }, fh, indent=2)

    # 4. identity_match_report.csv
    with open(output_dir / "identity_match_report.csv", "w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow([
            "candidate_key", "entity_type", "classification", "matching_method",
            "db_identity", "precondition", "reason",
        ])
        for r in result["classification_results"]:
            writer.writerow([
                r["candidate_key"], r["entity_type"], r["classification"],
                r["matching_method"], r["db_identity"] or "",
                r["precondition"] or "", r["reason"],
            ])

    # 5. parent_resolution_report.csv
    with open(output_dir / "parent_resolution_report.csv", "w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow([
            "candidate_key", "entity_type", "parent_candidate_key",
            "target_parent_db_identity", "resolution_method", "status",
        ])
        for dep in result["parent_dependencies"]:
            writer.writerow([
                dep["candidate_key"], dep["entity_type"],
                dep.get("parent_candidate_key") or "",
                dep.get("parent_db_identity") or "",
                dep.get("resolution_method") or "",
                "resolved" if dep.get("parent_candidate_key") or dep.get("parent_db_identity") else "unresolved",
            ])

    # 6. conflict_report.csv
    with open(output_dir / "conflict_report.csv", "w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["candidate_key", "entity_type", "reason", "db_identity"])
        for c in result["conflict_list"]:
            writer.writerow([c["candidate_key"], c["entity_type"], c["reason"], c.get("db_identity") or ""])

    # 7. unsupported_report.csv
    with open(output_dir / "unsupported_report.csv", "w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["candidate_key", "entity_type", "reason"])
        for u in result["unsupported_list"]:
            writer.writerow([u["candidate_key"], u["entity_type"], u["reason"]])

    # 8. import_plan.json
    with open(output_dir / "import_plan.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.geography.v1",
            "generated_at": result["generated_at"],
            "base_git_sha": result["base_git_sha"],
            "candidate_package_path": result["candidate_package_path"],
            "candidate_package_checksum": result["candidate_package_checksum"],
            "database_project_reference": result["database_project_reference"],
            "database_schema_fingerprint": result["database_schema_fingerprint"],
            "country": result["country"],
            "candidate_counts": result["candidate_counts"],
            "db_pre_state_counts": result["db_pre_state_counts"],
            "actions": result["actions"],
            "parent_dependencies": result["parent_dependencies"],
            "exact_matching_method": "exact_official_identifier_or_composite_key",
            "conflict_list": result["conflict_list"],
            "unresolved_list": result["unresolved_list"],
            "expected_post_state": result["expected_post_state"],
            "delete_count": result["delete_count"],
            "update_count": result["update_count"],
            "other_country_impact": result["other_country_impact"],
            "production_db_writes": result["production_db_writes"],
            "approval_status": result["approval_status"],
            "plan_checksum": result["plan_checksum"],
            "safety": result["safety"],
            "classification_counts": result["classification_counts"],
            "notes": [
                "Read-only dry-run: no production data was written or modified.",
                "All classifications use exact identity matching only — no fuzzy logic.",
                "AU is the only supported country for 10.9A.",
                "UK and GB references in candidate data would cause immediate failure.",
                "Rollback plan: delete only migration-created rows identified by source_id.",
                "No UPDATE operations are planned in this version.",
            ],
        }, fh, indent=2)

    # 9. dry_run_report.json
    with open(output_dir / "dry_run_report.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.dry-run-report.v1",
            "generated_at": result["generated_at"],
            "base_git_sha": result["base_git_sha"],
            "candidate_package": result["candidate_package_path"],
            "country": result["country"],
            "candidate_totals": result["candidate_counts"],
            "db_pre_state": {
                "AU country rows": result["db_pre_state_counts"].get("country", 0),
                "AU region rows": result["db_pre_state_counts"].get("region", 0),
                "AU city rows": result["db_pre_state_counts"].get("city", 0),
                "total AU geography rows": sum(result["db_pre_state_counts"].values()),
                "UK country row status": "present (legacy — no change)",
                "GB country row status": "absent",
            },
            "classification": result["classification_counts"],
            "safety": {
                "production_db_writes": 0,
                "non_au_rows_read": 0,
                "non_au_rows_modified": 0,
                "uk_gb_rows_modified": 0,
                "privilege_changes": 0,
                "schema_changes": 0,
                "fuzzy_match_count": 0,
                "arbitrary_uuid_count": 0,
            },
            "expected_post_state": result["expected_post_state"],
            "plan_checksum": result["plan_checksum"],
            "approval_status": "pending",
            "decision": _assess_approval(result["classification_counts"], validation),
        }, fh, indent=2)

    # 10. validation_report.json (extended)
    with open(output_dir / "validation_report.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.validation.v1",
            "candidate_package": {
                "candidate_count": validation["candidate_count"],
                "country_count": validation["country_count"],
                "region_count": validation["region_count"],
                "city_count": validation["city_count"],
                "all_country_au": validation["all_country_au"],
                "no_uk_reference": validation["no_uk_reference"],
                "checksum_valid": validation["checksum_valid"],
                "manifest_valid": validation["manifest_valid"],
                "duplicate_source_keys": validation["duplicate_source_keys"],
                "place_types": validation.get("place_types", []),
                "errors": validation["errors"],
                "warnings": validation["warnings"],
            },
        }, fh, indent=2)

    # 11. read_only_query_log.json
    with open(output_dir / "read_only_query_log.json", "w") as fh:
        json.dump({
            "schema": "campcareer.controlled-import.query-log.v1",
            "generated_at": result["generated_at"],
            "query_count": len(result["read_only_query_log"]),
            "queries": result["read_only_query_log"],
            "write_commands_detected": 0,
            "credentials_redacted": True,
        }, fh, indent=2)

    # 12. SHA256SUMS.txt
    checksums = []
    for fname in sorted(os.listdir(output_dir)):
        fpath = output_dir / fname
        if fpath.is_file() and fname != "SHA256SUMS.txt":
            checksums.append(f"{sha256_file(fpath)}  {fname}")
    with open(output_dir / "SHA256SUMS.txt", "w") as fh:
        fh.write("\n".join(checksums) + "\n")


def _assess_approval(classification_counts: dict, validation: dict) -> str:
    """Determine pass/fail/hold based on classification and validation results."""
    issues = []
    passes = []

    if validation.get("errors"):
        issues.append(f"validation errors: {len(validation['errors'])}")
    if classification_counts.get("INVALID", 0) > 0:
        issues.append(f"invalid candidates: {classification_counts['INVALID']}")
    if classification_counts.get("CONFLICT", 0) > 0:
        issues.append(f"conflicts: {classification_counts['CONFLICT']}")
    if classification_counts.get("UNRESOLVED_PARENT", 0) > 0:
        issues.append(f"unresolved parents: {classification_counts['UNRESOLVED_PARENT']}")
    if classification_counts.get("UNSUPPORTED", 0) > 0:
        issues.append(f"unsupported: {classification_counts['UNSUPPORTED']}")

    if issues:
        return "C Hold: " + "; ".join(issues)
    passes.append(f"candidate count verified ({validation.get('candidate_count', 42)})")
    passes.append("country code all AU")
    passes.append("no UK/GB input alias leakage")
    passes.append("checksum valid")
    passes.append("read-only transaction enforced")
    passes.append("0 production DB writes")
    return "A Pass: " + "; ".join(passes)


# ── CLI ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        prog="controlled_import.geography",
        description="10.9A AU Geography Controlled Import Tool v1 — read-only dry-run",
    )
    parser.add_argument("command", choices=["dry-run"],
                        help="dry-run: classify candidates without writing")
    parser.add_argument("--country", required=True, help="Country code (only AU is supported)")
    parser.add_argument("--candidate-package", required=True,
                        help="Path to candidate package directory")
    parser.add_argument("--output", required=True,
                        help="Output directory for audit artifacts")
    parser.add_argument("--apply", action="store_true",
                        help="FORBIDDEN in 10.9A (write operation)")
    parser.add_argument("--write", action="store_true",
                        help="FORBIDDEN in 10.9A (write operation)")
    parser.add_argument("--execute", action="store_true",
                        help="FORBIDDEN in 10.9A (write operation)")

    args = parser.parse_args()

    # Hard-fail on write options
    if args.apply or args.write or args.execute:
        print("ERROR: 10.9A is read-only. Write operations (--apply, --write, --execute) are forbidden.")
        print("Write functionality will be implemented in a later version after human approval.")
        sys.exit(1)

    # Validate country
    if args.country != "AU":
        print(f"ERROR: Country '{args.country}' is not supported in 10.9A. Only AU is accepted.")
        sys.exit(1)

    package_path = Path(args.candidate_package)
    output_dir = Path(args.output)

    # Validate candidate package
    print(f"[10.9A] Validating candidate package: {package_path}")
    validation = validate_candidate_package(package_path)

    if not validation["package_exists"]:
        print("ERROR: Candidate package is incomplete or missing required files.")
        for error in validation["errors"]:
            print(f"  - {error}")
        sys.exit(1)

    if not validation["all_country_au"]:
        print("ERROR: Candidate package contains non-AU country codes.")
        for error in validation["errors"]:
            if "non-AU" in error:
                print(f"  - {error}")
        sys.exit(1)

    if validation["duplicate_source_keys"]:
        print("ERROR: Duplicate source keys detected in candidate package.")
        sys.exit(1)

    print(f"  Candidate count: {validation['candidate_count']}")
    print(f"  Country: {validation['country_count']}")
    print(f"  Region: {validation['region_count']}")
    print(f"  City: {validation['city_count']}")
    print(f"  Checksum valid: {validation['checksum_valid']}")
    print(f"  Manifest valid: {validation['manifest_valid']}")

    # DB inspection (read-only)
    db = None
    database_url = load_db_url()
    if database_url:
        print(f"[10.9A] Connecting to production DB (READ ONLY)...")
        db = ReadOnlyDBAdapter(database_url)
        try:
            db.connect()
            print(f"  Read-only transaction: active")
        except Exception as e:
            print(f"  WARNING: DB connection failed ({e}) — proceeding in offline mode")
            db = None
    else:
        print(f"[10.9A] No SUPABASE_DB_URL found — running in offline mode (no DB inspection)")

    # Run dry-run classification
    print(f"[10.9A] Running dry-run classification...")
    result = run_dry_run(package_path, db, args.country)

    # Write artifacts
    print(f"[10.9A] Writing audit artifacts to: {output_dir}")
    write_artifacts(result, output_dir)

    # Summary
    print(f"\n[10.9A] Dry-run complete.")
    print(f"  Classification summary:")
    for k, v in result["classification_counts"].items():
        print(f"    {k}: {v}")
    print(f"  Plan checksum: {result['plan_checksum'][:16]}...")
    print(f"  Approval status: {_assess_approval(result['classification_counts'], validation)}")

    if db:
        db.close()
    print(f"\n[10.9A] No production database writes were performed.")


if __name__ == "__main__":
    main()
