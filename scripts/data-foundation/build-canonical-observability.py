#!/usr/bin/env python3
"""build-canonical-observability.py

CampCareer 10.7A-1: transforms raw psql CSV outputs (or the static manifest)
into the official canonical observability artifacts.

This script NEVER touches a database. It reads only:
  - raw psql --csv outputs under $CC_OUTDIR/raw (observed mode), or
  - the static canonical-tables.json manifest (no-access mode),
and writes the official artifacts + byte-identical legacy-compat copies.

State is passed via environment variables (never via argv, so no secrets can
leak into process listings):
  CC_MODE              no_access | success | partial | failure
  CC_OUTDIR            output directory
  CC_MANIFEST          path to canonical-tables.json
  CC_TXN_READONLY      true | false
  CC_ACCESS            available | unavailable
  CC_FAILED_SQL_FILES  space-separated list of failed SQL files (partial)
  CC_FAILED_COUNTS     integer count of failed per-table count queries
  CC_API_PRIVATE_DB    observed | unavailable  (api_private DB observation state)

It prints a single JSON object to stdout with derived counters for the runner:
  total_relations_observed, total_tables_counted, failed_count_queries,
  privilege_risk_count, relationship_gap_count, gap007_status,
  transaction_read_only.
"""

import csv
import io
import json
import os
import sys

MODE = os.environ.get("CC_MODE", "no_access")
OUTDIR = os.environ["CC_OUTDIR"]
MANIFEST = os.environ.get("CC_MANIFEST", "")
TXN_READONLY = os.environ.get("CC_TXN_READONLY", "false")
ACCESS = os.environ.get("CC_ACCESS", "unavailable")
FAILED_SQL_FILES = os.environ.get("CC_FAILED_SQL_FILES", "").split()
FAILED_COUNTS = int(os.environ.get("CC_FAILED_COUNTS", "0"))
API_PRIVATE_DB = os.environ.get("CC_API_PRIVATE_DB", "unavailable")

OBSERVED = MODE in ("success", "partial")

# Legacy entity list + relationship resolution for the static country counts.
ENTITIES = [
    ("countries", "resolved"),
    ("geographies", "resolved"),
    ("institutions", "resolved"),
    ("campuses", "resolved"),
    ("programmes", "resolved_via_institutions"),
    ("programme_offerings", "resolved_via_programmes"),
    ("programme_fees", "resolved_via_offerings"),
    ("programme_identifiers", "resolved_via_programmes"),
    ("occupations", "resolved"),
    ("occupation_identifiers", "resolved_via_occupations"),
    ("sources", "resolved"),
    ("source_snapshots", "resolved_via_sources"),
    ("metric_observations", "resolved_via_source_snapshots"),
    ("source_register_records", "resolved_via_metric_observations"),
    ("labour_outcome_observations", "resolved"),
    ("claims", "relationship_unresolved"),
    ("claim_evidence", "relationship_unresolved"),
    ("review_events", "relationship_unresolved"),
    ("study_concepts", "relationship_unresolved"),
]
COUNTRIES = ["AU", "GB", "US", "CA", "IE"]

# Legacy no-access resolution labels: the 10.7A static writer recorded every
# country-linked entity as "resolved" (except the four relationship-unresolved
# entities). Kept byte-identical here; the canonical_* artifacts use the richer
# resolution labels from the 03 SQL.
LEGACY_RESOLUTION = {ent: "resolved" for ent, _ in ENTITIES}
for _ent in ("claims", "claim_evidence", "review_events", "study_concepts"):
    LEGACY_RESOLUTION[_ent] = "relationship_unresolved"

CHECK_ROWS = [
    ("tables_without_primary_key", "all_canonical_tables", "count"),
    ("duplicate_canonical_country_code", "core.countries", "count"),
    ("uk_country_code_observed", "core.countries", "count"),
    ("orphan_campus", "catalog.campuses", "count"),
    ("orphan_programme", "catalog.programmes", "count"),
    ("orphan_programme_offering", "catalog.programme_offerings", "count"),
    ("orphan_programme_identifier", "catalog.programme_identifiers", "count"),
    ("orphan_occupation_identifier", "taxonomy.occupation_identifiers", "count"),
    ("orphan_source_snapshot", "evidence.source_snapshots", "count"),
    ("metric_observation_without_source", "evidence.metric_observations", "count"),
    ("verified_without_reviewed_date", "evidence.metric_observations", "count"),
    ("duplicate_programme_title", "catalog.programmes", "count"),
]
SCHEMAS = ["core", "catalog", "taxonomy", "evidence", "labour", "reporting", "ingest"]
ROLES = ["anon", "authenticated", "service_role"]
PRIVILEGES = ["USAGE", "SELECT", "INSERT", "UPDATE", "DELETE"]
GAP007_VERSION = "20260712121724"

# Known psql --csv result-set headers per SQL file (used to split multi-result
# output that repeats or changes columns between statements).
HEADER_RELATIONS = ("schema_name", "relation_name", "relation_type", "owner", "rls_enabled",
                    "has_primary_key", "foreign_key_count", "has_country_column",
                    "has_created_updated", "has_reviewed_date", "has_source_or_snapshot_column")
HEADER_SCHEMA_PRESENCE = ("schema_name", "schema_owner", "table_count", "view_count", "materialized_view_count")
HEADER_ENTITY = ("entity", "country_code", "actual_count", "resolution_status")
HEADER_CHECK = ("check_name", "subject", "result_count", "result_kind")
HEADER_USAGE = ("schema_name", "role_name", "has_schema_usage")
HEADER_TABLE_PRIVS = ("schema_name", "role_name", "tables_select", "tables_insert",
                      "tables_update", "tables_delete", "tables_total")
HEADER_OWNERS = ("schema_name", "schema_owner", "roles_with_usage")
HEADER_MIGRATION_VERSION = ("migration_version", "migration_version_recorded")
HEADER_GAP_TABLES = ("concept_career_mappings", "career_compensation_observations",
                     "housing_cost_observations", "country_comparison_coverage", "partner_profiles",
                     "partner_members", "lead_requests", "lead_assignments", "lead_status_events")
HEADER_RLS = ("table_schema", "table_name", "rls_enabled")
HEADER_COHORT = ("decision_plans", "plan_save_intents", "canonical_concepts",
                 "course_offerings", "taxonomy_nodes")


def write_csv(path, header, rows):
    with open(path, "w", newline="") as fh:
        writer = csv.writer(fh, lineterminator="\n")
        writer.writerow(header)
        for r in rows:
            writer.writerow(r)


def write_json(path, obj):
    with open(path, "w") as fh:
        json.dump(obj, fh, indent=2)
        fh.write("\n")


def write_csv_all_quoted(path, header, rows):
    """Write a CSV with every data field quoted (matches legacy jq @csv output,
    which leaves the header unquoted but quotes every row field)."""
    with open(path, "w", newline="") as fh:
        fh.write(",".join(header) + "\n")
        writer = csv.writer(fh, lineterminator="\n", quoting=csv.QUOTE_ALL)
        for r in rows:
            writer.writerow(r)


def write_legacy_summary(path, summary):
    """Write summary.json in the exact 10.7A single-line-section layout."""
    s = summary["sections"]
    text = (
        "{\n"
        '  "schema": "campcareer.canonical-read-only-audit.summary.v1",\n'
        f'  "verdict": {json.dumps(summary["verdict"])},\n'
        f'  "verdict_reason": {json.dumps(summary["verdict_reason"])},\n'
        f'  "direct_database_access": {json.dumps(summary["direct_database_access"])},\n'
        f'  "canonical_database_observed": {str(summary["canonical_database_observed"]).lower()},\n'
        '  "sections": {\n'
        f'    "canonical_schema": {{ "status": {json.dumps(s["canonical_schema"]["status"])}, "observation_source": {json.dumps(s["canonical_schema"]["observation_source"])} }},\n'
        f'    "five_country_counts": {{ "status": {json.dumps(s["five_country_counts"]["status"])} }},\n'
        f'    "relationship_checks": {{ "status": {json.dumps(s["relationship_checks"]["status"])} }},\n'
        f'    "privilege_audit": {{ "status": {json.dumps(s["privilege_audit"]["status"])} }},\n'
        f'    "gap007": {{ "status": {json.dumps(s["gap007"]["status"])} }}\n'
        "  },\n"
        "  \"database_write_operations\": 0,\n"
        "  \"migration_changes\": 0,\n"
        "  \"privilege_or_exposure_changes\": 0,\n"
        f'  "exit_code": {json.dumps(summary["exit_code"])}\n'
        "}\n"
    )
    with open(path, "w") as fh:
        fh.write(text)


def read_manifest():
    with open(MANIFEST) as fh:
        return json.load(fh)


def read_blocks(path, known_headers=None):
    """Split a psql --csv output file into (header, rows) blocks.

    psql --csv repeats the header row before each result set. A block ends when
    a header row is seen again. Because consecutive result sets can have
    DIFFERENT columns (e.g. 01_schema_inventory returns two result sets), a
    header row is recognised as either the first row, a repeat of the current
    block's header, or a row matching one of the known result-set headers.
    Header rows never appear in data for the controlled queries used here.
    """
    if not os.path.exists(path):
        return []
    with open(path, newline="") as fh:
        raw = fh.read()
    reader = csv.reader(io.StringIO(raw))
    rows = [r for r in reader if r]
    known = {tuple(h) for h in (known_headers or [])}
    blocks = []
    header = None
    data = []
    first = True
    for r in rows:
        key = tuple(r)
        is_header = False
        if first:
            is_header = True
            first = False
        elif key == header or key in known:
            is_header = True
        if is_header:
            if header is not None:
                blocks.append((header, data))
            header = key
            data = []
        else:
            data.append(r)
    if header is not None:
        blocks.append((header, data))
    return blocks


def truthy(v):
    if v is None:
        return False
    if isinstance(v, bool):
        return v
    s = str(v).strip().lower()
    if s in ("true", "t", "1", "yes", "on"):
        return True
    if s in ("false", "f", "0", "no", "off", ""):
        return False
    try:
        return float(v) > 0
    except (TypeError, ValueError):
        return False


def to_int(v):
    s = str(v).strip()
    try:
        return int(float(s))
    except (TypeError, ValueError):
        return None


# ---------------------------------------------------------------------------
# canonical_schema_inventory.csv
# ---------------------------------------------------------------------------
def build_schema_inventory():
    header = [
        "schema_name", "relation_name", "relation_type", "owner", "rls_enabled",
        "has_primary_key", "foreign_key_count", "has_country_column",
        "has_created_updated", "has_reviewed_date", "has_source_or_snapshot_column",
        "observation_status", "observation_source",
    ]
    if OBSERVED:
        blocks = read_blocks(os.path.join(OUTDIR, "raw", "01_schema_inventory.csv"),
                             [HEADER_RELATIONS, HEADER_SCHEMA_PRESENCE])
        rows = []
        observed = len(blocks) > 0
        schema_presence = []
        for header_i, data in blocks:
            if header_i == HEADER_RELATIONS:
                for r in data:
                    d = dict(zip(header_i, r))
                    rows.append([
                        d.get("schema_name"), d.get("relation_name"),
                        d.get("relation_type"), d.get("owner"), d.get("rls_enabled"),
                        d.get("has_primary_key"), d.get("foreign_key_count"),
                        d.get("has_country_column"), d.get("has_created_updated"),
                        d.get("has_reviewed_date"), d.get("has_source_or_snapshot_column"),
                        "observed", "observed_database",
                    ])
            elif header_i == HEADER_SCHEMA_PRESENCE:
                schema_presence = [dict(zip(header_i, r)) for r in data]
        return header, rows, observed, schema_presence
    manifest = read_manifest()
    rows = []
    for schema, tables in manifest["schemas"].items():
        for t in tables:
            rows.append([schema, t, "table", "", "", "", "", "", "", "", "",
                         "unavailable", "static_migration_analysis"])
    return header, rows, False, []


# ---------------------------------------------------------------------------
# canonical_table_counts.csv
# ---------------------------------------------------------------------------
def build_table_counts():
    header = ["schema_name", "table_name", "actual_row_count", "count_status", "observation_source"]
    if OBSERVED:
        path = os.path.join(OUTDIR, "raw", "table_counts_raw.csv")
        rows = []
        counted = 0
        if os.path.exists(path):
            with open(path, newline="") as fh:
                reader = csv.reader(fh)
                for r in reader:
                    if not r or r[0] == "schema_name":
                        continue
                    schema, table, n = r[0], r[1], r[2]
                    if n.strip() == "error":
                        status = "error"
                        count = ""
                    else:
                        status = "observed"
                        count = n
                        counted += 1
                    rows.append([schema, table, count, status, "observed_database"])
        return header, rows, counted
    manifest = read_manifest()
    rows = []
    for schema, tables in manifest["schemas"].items():
        for t in tables:
            rows.append([schema, t, "", "unavailable", "static_migration_analysis"])
    return header, rows, 0


# ---------------------------------------------------------------------------
# canonical_country_entity_counts.csv
# ---------------------------------------------------------------------------
def build_country_entity_counts():
    header = ["entity", "country_code", "actual_count", "count_status", "resolution_status", "observation_source"]
    if OBSERVED:
        blocks = read_blocks(os.path.join(OUTDIR, "raw", "03_country_entity_counts.csv"),
                             [HEADER_ENTITY])
        rows = []
        for header_i, data in blocks:
            if header_i != HEADER_ENTITY:
                continue
            for r in data:
                d = dict(zip(header_i, r))
                rows.append([
                    d.get("entity"), d.get("country_code"), d.get("actual_count"),
                    "observed", d.get("resolution_status"), "observed_database",
                ])
        return header, rows
    rows = []
    for ent, res in ENTITIES:
        for code in COUNTRIES:
            rows.append([ent, code, "", "unavailable", res, "static_migration_analysis"])
        if res == "relationship_unresolved":
            rows.append([ent, "", "", "unavailable", res, "static_migration_analysis"])
    return header, rows


# ---------------------------------------------------------------------------
# canonical_relationship_checks.csv
# ---------------------------------------------------------------------------
def build_relationship_checks():
    header = ["check_name", "subject", "result_count", "result_kind", "check_status", "observation_source"]
    if OBSERVED:
        blocks = read_blocks(os.path.join(OUTDIR, "raw", "04_relationship_checks.csv"),
                             [HEADER_CHECK])
        rows = []
        seen = set()
        for header_i, data in blocks:
            if header_i != HEADER_CHECK:
                continue
            for r in data:
                d = dict(zip(header_i, r))
                name = d.get("check_name")
                if name in seen:
                    continue
                seen.add(name)
                rows.append([
                    name, d.get("subject"), d.get("result_count"),
                    d.get("result_kind"), "observed", "observed_database",
                ])
        return header, rows
    rows = []
    for name, subject, kind in CHECK_ROWS:
        rows.append([name, subject, "", kind, "unavailable", "static_migration_analysis"])
    return header, rows


# ---------------------------------------------------------------------------
# canonical_privilege_audit.csv
# ---------------------------------------------------------------------------
def build_privilege_audit():
    header = ["schema_name", "role_name", "privilege", "has_privilege", "status", "observation_source"]
    if OBSERVED:
        blocks = read_blocks(os.path.join(OUTDIR, "raw", "05_privilege_audit.csv"),
                             [HEADER_USAGE, HEADER_TABLE_PRIVS, HEADER_OWNERS])
        rows = []
        usage = {}
        table_privs = {}
        for header_i, data in blocks:
            if header_i == HEADER_USAGE:
                for r in data:
                    d = dict(zip(header_i, r))
                    usage[(d["schema_name"], d["role_name"])] = d.get("has_schema_usage")
            elif header_i == HEADER_TABLE_PRIVS:
                for r in data:
                    d = dict(zip(header_i, r))
                    table_privs[(d["schema_name"], d["role_name"])] = d
        for schema in SCHEMAS + ["api_private"]:
            for role in ROLES:
                u = usage.get((schema, role), "")
                rows.append([schema, role, "USAGE", u, "observed", "observed_database"])
                tp = table_privs.get((schema, role))
                for priv in ("SELECT", "INSERT", "UPDATE", "DELETE"):
                    if tp is not None:
                        val = tp.get("tables_" + priv.lower(), "0")
                        rows.append([schema, role, priv, val, "observed", "observed_database"])
                    else:
                        rows.append([schema, role, priv, "", "observed", "observed_database"])
        return header, rows
    rows = []
    for schema in SCHEMAS + ["api_private"]:
        for role in ROLES:
            for priv in PRIVILEGES:
                rows.append([schema, role, priv, "", "unavailable", "static_migration_analysis"])
    return header, rows


# ---------------------------------------------------------------------------
# migration_status.json + gap007_verification.json
# ---------------------------------------------------------------------------
def build_gap007():
    if OBSERVED:
        blocks = read_blocks(os.path.join(OUTDIR, "raw", "06_migration_status.csv"),
                             [HEADER_MIGRATION_VERSION, HEADER_GAP_TABLES, HEADER_RLS, HEADER_COHORT])
        by_name = {}
        for header_i, data in blocks:
            name = header_i[0]
            by_name[name] = [dict(zip(header_i, r)) for r in data]

        recorded = None
        tables = []
        rls = []
        cohort = []
        for name, rows in by_name.items():
            if name == "migration_version":
                for r in rows:
                    recorded = truthy(r.get("migration_version_recorded"))
            elif name == "concept_career_mappings":
                for r in rows:
                    for col in (
                        "concept_career_mappings", "career_compensation_observations",
                        "housing_cost_observations", "country_comparison_coverage",
                        "partner_profiles", "partner_members", "lead_requests",
                        "lead_assignments", "lead_status_events",
                    ):
                        if col in r:
                            tables.append({"table": col, "present": truthy(r[col])})
            elif name == "table_schema":
                rls = rows
            elif name == "decision_plans":
                cohort = rows

        status = "observed_from_database"
        return {
            "migration_version": GAP007_VERSION,
            "status": status,
            "migration_applied": recorded,
            "tables_present": tables,
            "rls_enabled": rls,
            "cohort_tables": cohort,
            "postgrest_404_cause": "not_observable_via_direct_sql",
            "runtime_graceful_degradation": "static_verified",
            "requires_direct_recheck": True,
        }
    return {
        "migration_version": GAP007_VERSION,
        "status": "database_access_unavailable",
        "migration_applied": None,
        "tables_present": None,
        "rls_enabled": None,
        "cohort_tables": None,
        "postgrest_404_cause": None,
        "runtime_graceful_degradation": "static_verified",
        "requires_direct_recheck": True,
    }


def migration_status_json(gap007):
    if not OBSERVED:
        return {
            "schema": "campcareer.canonical-read-only-audit.migration_status.v1",
            "gap007": {
                "migration_version": GAP007_VERSION,
                "status": "database_access_unavailable",
                "migration_version_recorded": None,
                "tables_present": None,
                "rls_enabled": None,
                "postgrest_404_cause": None,
                "runtime_graceful_degradation": None,
                "observation_source": "static (no direct database access)",
            },
        }
    return {
        "schema": "campcareer.canonical-read-only-audit.migration_status.v1",
        "gap007": {
            "migration_version": gap007["migration_version"],
            "status": gap007["status"],
            "migration_version_recorded": gap007["migration_applied"],
            "tables_present": gap007["tables_present"],
            "rls_enabled": gap007["rls_enabled"],
            "postgrest_404_cause": gap007["postgrest_404_cause"],
            "runtime_graceful_degradation": gap007["runtime_graceful_degradation"],
            "observation_source": "observed_database",
        },
    }


def section_status():
    if MODE == "success":
        return "observed"
    if MODE == "partial":
        return "partial"
    return "unavailable"


def build_legacy_summary(gap007):
    """Legacy summary.json (campcareer.canonical-read-only-audit.summary.v1).

    Kept in the 10.7A shape so existing consumers keep working; the official
    observation_summary.json carries the full corrected fields.
    """
    if MODE == "no_access":
        verdict = "B. Conditional Pass"
        reason = ("Reusable read-only observability tooling, SQL files and artifact schema are "
                  "complete. Canonical database counts could not be observed because no direct "
                  "database credential or psql access was available at run time.")
        exit_code = "2"
    elif MODE == "success":
        verdict = "A. Pass"
        reason = "All read-only observability SQL files executed inside READ ONLY transactions and all artifacts reflect observed database state."
        exit_code = "0"
    elif MODE == "partial":
        verdict = "B. Conditional Pass"
        reason = ("Some observability queries failed. Successful results are preserved as observed; "
                  "failed queries are recorded as error/unavailable and not fabricated.")
        exit_code = "3"
    else:
        verdict = "C. Hold"
        reason = "Runner failed before observation could complete; artifacts reflect failure state."
        exit_code = "1"

    st = section_status()
    schema_source = "observed_database" if OBSERVED and schema_sections_observed else (
        "static_migration_analysis" if not OBSERVED else "partial")

    return {
        "schema": "campcareer.canonical-read-only-audit.summary.v1",
        "verdict": verdict,
        "verdict_reason": reason,
        "direct_database_access": ACCESS,
        "canonical_database_observed": OBSERVED,
        "sections": {
            "canonical_schema": {"status": st, "observation_source": schema_source},
            "five_country_counts": {"status": st},
            "relationship_checks": {"status": st},
            "privilege_audit": {"status": st},
            "gap007": {"status": gap007["status"]},
        },
        "database_write_operations": 0,
        "migration_changes": 0,
        "privilege_or_exposure_changes": 0,
        "exit_code": exit_code,
    }


def build_api_private_observation():
    db_verified = OBSERVED and API_PRIVATE_DB == "observed"
    return {
        "schema": "campcareer.canonical-read-only-observability.api_private_observation.v1",
        "observation_type": "repository_static_scan",
        "database_observation_status": "verified" if db_verified else "unavailable",
        "repository_static_scan_status": "complete",
        "browser_direct_access_found": False,
        "client_schema_api_private_calls": 0,
        "service_role_client_exposure_found": False,
        "service_role_client_exposure_note": (
            "Static analysis only: the single api_private consumer imports 'server-only' and uses "
            "supabaseAdmin; no browser path calls schema('api_private'). Migrations "
            "20260802123403 / 20260802123729 / 20260802123754 revoke api_private defaults from "
            "service_role and PUBLIC. No live privilege or REST verification was performed."),
        "known_read_models": [
            "api_private.au_nursing_programme_catalog_v1",
            "api_private.au_nursing_programme_fees_v1",
            "api_private.au_nursing_programme_requirements_v1",
            "api_private.au_nursing_programme_evidence_v1",
        ],
        "consumer": {
            "file": "src/lib/data-foundation/compare-adapters/au-nursing-programmes-repository.ts",
            "import": "server-only",
            "client": "supabaseAdmin",
            "browser_path": False,
        },
        "country_coverage": {
            "read_models": "au_nursing_* v1 views (AU nursing programme compare)",
            "note": "No other country read models were found in api_private during the static scan.",
        },
        "limitations": [
            "Repository static scan only; no live PostgREST exposure test was performed.",
            "database_observation_status reflects whether a read-only psql connection was verified in this run, not a REST exposure test.",
            "Requires direct re-check after a DB credential is provided.",
        ],
    }


# ---------------------------------------------------------------------------
# Derived counters
# ---------------------------------------------------------------------------
def compute_counters(schema_rows, schema_observed, table_rows, tables_counted,
                     country_rows, relationship_rows, privilege_rows, gap007):
    if not OBSERVED:
        return {
            "total_relations_observed": None,
            "total_tables_counted": None,
            "failed_count_queries": None,
            "privilege_risk_count": None,
            "relationship_gap_count": None,
            "gap007_status": gap007["status"],
            "transaction_read_only": TXN_READONLY,
        }

    failed_counts = sum(1 for r in table_rows if r[3] == "error")

    privilege_risk = 0
    for r in privilege_rows:
        schema, role, priv, has, status = r[0], r[1], r[2], r[3], r[4]
        if role not in ("anon", "authenticated"):
            continue
        if status != "observed":
            continue
        if priv == "USAGE" and truthy(has):
            privilege_risk += 1
        elif priv in ("SELECT", "INSERT", "UPDATE", "DELETE") and truthy(has):
            privilege_risk += 1

    gap = 0
    for r in relationship_rows:
        if r[0] == "uk_country_code_observed":
            continue
        n = to_int(r[2])
        if n is not None and n > 0:
            gap += 1

    return {
        "total_relations_observed": (len(schema_rows) if schema_observed else None),
        "total_tables_counted": tables_counted,
        "failed_count_queries": failed_counts,
        "privilege_risk_count": privilege_risk,
        "relationship_gap_count": gap,
        "gap007_status": gap007["status"],
        "transaction_read_only": TXN_READONLY,
    }


def build_legacy_country_rows():
    rows = []
    for ent, _res in ENTITIES:
        for code in COUNTRIES:
            rows.append([ent, code, "", "unavailable", "resolved", "static_migration_analysis"])
        if LEGACY_RESOLUTION[ent] == "relationship_unresolved":
            rows.append([ent, "", "", "unavailable", "relationship_unresolved", "static_migration_analysis"])
    return rows


# ---------------------------------------------------------------------------
# observation_summary.json + summary.json (byte-identical)
# ---------------------------------------------------------------------------
def build_summary(counters, gap007, observed):
    if MODE == "no_access":
        verdict = "B. Conditional Pass"
        reason = ("Reusable read-only observability tooling, SQL files and artifact schema are "
                  "complete. Canonical database counts could not be observed because no direct "
                  "database credential or psql access was available at run time.")
        exit_code = 2
    elif MODE == "success":
        verdict = "A. Pass"
        reason = "All read-only observability SQL files executed inside READ ONLY transactions and all artifacts reflect observed database state."
        exit_code = 0
    elif MODE == "partial":
        verdict = "B. Conditional Pass"
        reason = ("Some observability queries failed. Successful results are preserved as observed; "
                  "failed queries are recorded as error/unavailable and not fabricated.")
        exit_code = 3
    else:  # failure
        verdict = "C. Hold"
        reason = "Runner failed before observation could complete; artifacts reflect failure state."
        exit_code = 1

    sections = {
        "canonical_schema": {
            "status": ("observed" if observed and schema_sections_observed else
                       ("partial" if MODE == "partial" else "unavailable")),
        },
        "five_country_counts": {
            "status": ("observed" if observed and MODE == "success" else
                       ("partial" if MODE == "partial" else "unavailable")),
        },
        "relationship_checks": {
            "status": ("observed" if observed and MODE == "success" else
                       ("partial" if MODE == "partial" else "unavailable")),
        },
        "privilege_audit": {
            "status": ("observed" if observed and MODE == "success" else
                       ("partial" if MODE == "partial" else "unavailable")),
        },
        "gap007": {"status": gap007["status"]},
    }

    return {
        "schema": "campcareer.canonical-read-only-audit.observation_summary.v1",
        "verdict": verdict,
        "verdict_reason": reason,
        "direct_database_access": ACCESS,
        "canonical_database_observed": observed,
        "transaction_read_only_verified": (TXN_READONLY == "true"),
        "failed_sql_files": FAILED_SQL_FILES,
        "counters": counters,
        "sections": sections,
        "database_write_operations": 0,
        "migration_changes": 0,
        "privilege_or_exposure_changes": 0,
        "exit_code": exit_code,
    }


schema_sections_observed = False


def main():
    global schema_sections_observed
    os.makedirs(OUTDIR, exist_ok=True)

    schema_header, schema_rows, schema_observed, schema_presence = build_schema_inventory()
    schema_sections_observed = schema_observed
    table_header, table_rows, tables_counted = build_table_counts()
    country_header, country_rows = build_country_entity_counts()
    rel_header, rel_rows = build_relationship_checks()
    priv_header, priv_rows = build_privilege_audit()
    gap007 = build_gap007()

    # Official canonical_* artifacts.
    write_csv(os.path.join(OUTDIR, "canonical_schema_inventory.csv"), schema_header, schema_rows)
    write_csv(os.path.join(OUTDIR, "canonical_table_counts.csv"), table_header, table_rows)
    write_csv(os.path.join(OUTDIR, "canonical_country_entity_counts.csv"), country_header, country_rows)
    write_csv(os.path.join(OUTDIR, "canonical_relationship_checks.csv"), rel_header, rel_rows)
    write_csv(os.path.join(OUTDIR, "canonical_privilege_audit.csv"), priv_header, priv_rows)

    # Legacy-compat CSV copies (byte-identical to the 10.7A static writers in
    # no-access mode; documented in 10.7A-1).
    legacy_schema_header = [
        "schema_name", "relation_name", "relation_type", "owner", "rls_enabled",
        "has_primary_key", "foreign_key_count", "has_country_column",
        "has_created_updated", "has_reviewed_date", "has_source_or_snapshot_column",
        "observation_status", "observation_source",
    ]
    if OBSERVED:
        write_csv_all_quoted(os.path.join(OUTDIR, "schema_inventory.csv"), legacy_schema_header, schema_rows)
    else:
        legacy_schema_rows = []
        for r in schema_rows:
            legacy_schema_rows.append([r[0], r[1], r[2], "null", "null", "null", "null",
                                       "null", "null", "null", "null", r[11], r[12]])
        write_csv_all_quoted(os.path.join(OUTDIR, "schema_inventory.csv"), legacy_schema_header, legacy_schema_rows)

    write_csv_all_quoted(os.path.join(OUTDIR, "table_counts.csv"), table_header, table_rows)
    legacy_country_rows = country_rows if OBSERVED else build_legacy_country_rows()
    write_csv(os.path.join(OUTDIR, "country_entity_counts.csv"), country_header, legacy_country_rows)
    write_csv(os.path.join(OUTDIR, "relationship_checks.csv"),
              ["check_name", "subject", "result_count", "result_kind", "check_status"],
              [r[:5] for r in rel_rows])
    write_csv(os.path.join(OUTDIR, "privilege_audit.csv"),
              ["schema_name", "role_name", "privilege", "has_privilege", "status"],
              [r[:5] for r in priv_rows])

    # Legacy JSON variants (empty -> null to match 10.7A semantics).
    legacy_rows = [[None if v == "" else v for v in r] for r in schema_rows]
    write_json(os.path.join(OUTDIR, "schema_inventory.json"),
               {"schema": "campcareer.canonical-read-only-audit.schema_inventory.v1",
                "observed": OBSERVED,
                "rows": [dict(zip(legacy_schema_header, r)) for r in legacy_rows]})
    write_json(os.path.join(OUTDIR, "table_counts.json"),
               {"schema": "campcareer.canonical-read-only-audit.table_counts.v1",
                "observed": OBSERVED,
                "rows": [dict(zip(table_header, [None if v == "" else v for v in r])) for r in table_rows]})

    write_json(os.path.join(OUTDIR, "migration_status.json"), migration_status_json(gap007))
    write_json(os.path.join(OUTDIR, "gap007_verification.json"),
               {"schema": "campcareer.canonical-read-only-audit.gap007_verification.v1",
                "gap007": gap007})
    write_json(os.path.join(OUTDIR, "api_private_observation.json"), build_api_private_observation())

    counters = compute_counters(schema_rows, schema_observed, table_rows, tables_counted,
                                country_rows, rel_rows, priv_rows, gap007)
    summary = build_summary(counters, gap007, OBSERVED)
    write_json(os.path.join(OUTDIR, "observation_summary.json"), summary)
    write_legacy_summary(os.path.join(OUTDIR, "summary.json"), build_legacy_summary(gap007))

    print(json.dumps(counters))


if __name__ == "__main__":
    main()
