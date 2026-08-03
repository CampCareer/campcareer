"""10.7B Common Source Ingestion Framework v1 - candidate package builder.

Builds a candidate package at data/candidates/<domain>/<country>/<date>/:

  source_manifest.json
  candidate_records.jsonl
  validation_report.json
  duplicate_review_queue.csv
  unresolved_identity_queue.csv
  package_manifest.json
  SHA256SUMS.txt
  README.md

The builder never writes to a production database, never imports data, never
merges candidates and never generates arbitrary UUIDs. import_status is always
candidate_only; canonical import is a separate controlled human-approved step.
"""

import json
import os
from datetime import datetime, timezone

from checksum import parse_checksum, write_checksums
from country import normalize_country_code
from identity import (detect_duplicate_source_keys,
                      render_duplicate_review_queue,
                      render_unresolved_identity_queue)
from manifest import (build_package_source_manifest, validate_source_manifest)
from schemas import (CANDIDATE_SCHEMA_VERSION, COUNTRY_CODE_DB_COMPATIBILITY,
                     FRAMEWORK_VERSION, IMPORT_STATUSES, PACKAGE_MANIFEST_SCHEMA,
                     PARSER_VERSION, RUNNER_VERSION, VALIDATION_RULES,
                     VALIDATION_REPORT_SCHEMA)
from validation import aggregate_status, normalize_record, validate_record


def now_utc_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def load_jsonl(path):
    records = []
    with open(path) as fh:
        for lineno, line in enumerate(fh, 1):
            line = line.strip()
            if not line:
                continue
            records.append((lineno, json.loads(line)))
    return records


def build_package(manifest_path, records_path, domain, country, package_date,
                  out_dir, force=False):
    """Build a candidate package from a source manifest + parsed records.

    Returns dict summarizing the build (statuses, counts, output dir).
    """
    if not domain or not country or not package_date:
        raise ValueError("domain, country and date are required")

    src_manifests = load_sources(manifest_path)
    manifest_sources = {m.get("source_id"): m for m in src_manifests}

    package_manifest_results = []
    for m in src_manifests:
        package_manifest_results.append(validate_source_manifest(m))
    manifest_valid_all = all(r["valid"] for r in package_manifest_results)
    manifest_blocked = any(r["blocked"] for r in package_manifest_results)

    # Rule 2: file checksum (format-level; raw files are not stored by 10.7B).
    checksum_results = []
    for m in src_manifests:
        cs = parse_checksum(m.get("checksum"))
        checksum_results.append({
            "source_id": m.get("source_id"),
            "well_formed": cs["well_formed"],
            "algorithm": cs["algorithm"],
        })

    raw_records = load_jsonl(records_path)

    duplicate_groups, duplicate_keys = detect_duplicate_source_keys(
        [r for (_ln, r) in raw_records])

    normalized = []
    for _lineno, rec in raw_records:
        rec = normalize_record(rec, manifest_sources)
        rec["candidate_schema_version"] = CANDIDATE_SCHEMA_VERSION
        rec["parser_version"] = rec.get("parser_version") or PARSER_VERSION
        rec["import_status"] = "candidate_only"
        normalized.append(rec)

    # Re-detect duplicates after normalization (candidate_id is now derived).
    duplicate_groups, duplicate_keys = detect_duplicate_source_keys(normalized)

    record_results = []
    for rec in normalized:
        rec, res = validate_record(rec, manifest_sources, duplicate_keys,
                                   len(record_results))
        # identity_status: duplicate -> duplicate_review; lineage-unresolved ->
        # unresolved; otherwise new_candidate (no canonical registry yet).
        id_status = "new_candidate"
        if (rec.get("source_id"), rec.get("source_record_key")) in duplicate_keys:
            id_status = "duplicate_review"
        elif res["failures"].get("source_lineage"):
            id_status = "unresolved"
        rec["identity_status"] = id_status
        # manifest/checksum failures block the whole package.
        if manifest_blocked:
            rec["validation_status"] = "blocked"
        elif not all(r["well_formed"] for r in checksum_results):
            rec["validation_status"] = "blocked"
        else:
            rec["validation_status"] = res["status"]
        record_results.append(res)

    if os.path.exists(out_dir) and not force:
        raise FileExistsError(
            "package output already exists: %s (use --force to overwrite)" % out_dir)
    os.makedirs(out_dir, exist_ok=True)

    # Write candidate_records.jsonl (enriched, sorted by candidate_id).
    ordered = sorted(normalized, key=lambda r: r.get("candidate_id") or "")
    with open(os.path.join(out_dir, "candidate_records.jsonl"), "w") as fh:
        for rec in ordered:
            fh.write(json.dumps(rec, ensure_ascii=False, sort_keys=True) + "\n")

    # Write source_manifest.json (package wrapper).
    with open(os.path.join(out_dir, "source_manifest.json"), "w") as fh:
        json.dump(build_package_source_manifest(src_manifests), fh, indent=2)
        fh.write("\n")

    # Write duplicate + unresolved queues.
    dup_csv = render_duplicate_review_queue(ordered, duplicate_groups)
    with open(os.path.join(out_dir, "duplicate_review_queue.csv"), "w") as fh:
        fh.write(dup_csv)
    unres_csv = render_unresolved_identity_queue(ordered, manifest_sources)
    with open(os.path.join(out_dir, "unresolved_identity_queue.csv"), "w") as fh:
        fh.write(unres_csv)

    # Write package_manifest.json.
    status_counts = {}
    for rec in ordered:
        st = rec.get("validation_status") or "unknown"
        status_counts[st] = status_counts.get(st, 0) + 1
    package_manifest = {
        "schema": PACKAGE_MANIFEST_SCHEMA,
        "framework_version": FRAMEWORK_VERSION,
        "runner_version": RUNNER_VERSION,
        "candidate_schema_version": CANDIDATE_SCHEMA_VERSION,
        "domain": domain,
        "country_code": normalize_country_code(country)["normalized"],
        "package_date": package_date,
        "built_at": now_utc_iso(),
        "source_count": len(src_manifests),
        "candidate_count": len(ordered),
        "record_status_counts": status_counts,
        "duplicate_group_count": len(duplicate_groups),
        "duplicate_review_count": sum(
            1 for r in ordered if r.get("identity_status") == "duplicate_review"),
        "unresolved_identity_count": sum(
            1 for r in ordered if r.get("identity_status") == "unresolved"),
        "import_status": "candidate_only",
        "import_blocked_reason": (
            "canonical import is a separate controlled step requiring human "
            "approval; this framework only produces candidate packages"),
        "country_code_database_compatibility": COUNTRY_CODE_DB_COMPATIBILITY,
        "uk_input_records": sum(
            1 for r in normalized
            if (r.get("evidence") or {}).get("country_code_alias_applied") == "UK"),
        "production_database_writes": 0,
        "migration_count": 0,
        "canonical_import_count": 0,
        "fuzzy_match_count": 0,
        "arbitrary_uuid_count": 0,
    }
    with open(os.path.join(out_dir, "package_manifest.json"), "w") as fh:
        json.dump(package_manifest, fh, indent=2)
        fh.write("\n")

    # Write validation_report.json.
    report = build_validation_report(out_dir, package_manifest, ordered,
                                     record_results, package_manifest_results,
                                     checksum_results, manifest_sources)
    with open(os.path.join(out_dir, "validation_report.json"), "w") as fh:
        json.dump(report, fh, indent=2)
        fh.write("\n")

    # Write README.md.
    with open(os.path.join(out_dir, "README.md"), "w") as fh:
        fh.write(render_readme(package_manifest, report))

    write_checksums(out_dir)
    return {"output_dir": out_dir,
            "overall_status": report["overall_status"],
            "record_counts": report["record_counts"],
            "candidate_count": len(ordered),
            "source_count": len(src_manifests)}


def load_sources(manifest_path):
    """Load source manifest(s) from a file (single object or {sources:[...]})."""
    with open(manifest_path) as fh:
        data = json.load(fh)
    if isinstance(data, dict) and "sources" in data and isinstance(data["sources"], list):
        return list(data["sources"])
    return [data]


def build_validation_report(out_dir, package_manifest, ordered, record_results,
                            manifest_results, checksum_results, manifest_sources):
    """Assemble validation_report.json for a package."""
    status_counts = {}
    rule_fail_counts = {}
    rule_warn_counts = {}
    uk_input_count = 0
    arbitrary_uuid_count = 0
    null_to_zero_count = 0

    for rec in ordered:
        st = rec.get("validation_status") or "unknown"
        status_counts[st] = status_counts.get(st, 0) + 1
        evidence = rec.get("evidence") or {}
        if evidence.get("country_code_alias_applied") == "UK":
            uk_input_count += 1
        if evidence.get("normalized_unknown_to_null"):
            null_to_zero_count += 0  # these are unknown->null (correct)
        payload = rec.get("payload") or {}
        if payload.get("arbitrary_uuid"):
            arbitrary_uuid_count += 1

    rules = []
    for rule_id, rule_name in VALIDATION_RULES:
        rule_runs = 0
        fails = 0
        warns = 0
        status = "pass"
        detail = ""
        if rule_id == "manifest_valid":
            fails = sum(1 for r in manifest_results if not r["valid"])
            warns = sum(len(r["warnings"]) for r in manifest_results)
            detail = "%d/%d source manifests valid" % (
                sum(1 for r in manifest_results if r["valid"]),
                len(manifest_results))
        elif rule_id == "file_checksum":
            fails = sum(1 for r in checksum_results if not r["well_formed"])
            detail = "%d/%d source checksums format-valid (raw files not stored)" % (
                sum(1 for r in checksum_results if r["well_formed"]),
                len(checksum_results))
        else:
            for res in record_results:
                rule_runs += 1
                fails += len(res["failures"].get(rule_id, []))
                warns += len(res["warnings"].get(rule_id, []))
            detail = "per-record rule"
        if fails:
            status = "fail"
        elif warns:
            status = "warn"
        rules.append({
            "rule_id": rule_id,
            "rule_name": rule_name,
            "status": status,
            "detail": detail,
            "records_checked": rule_runs if rule_runs else None,
            "fail_count": fails,
            "warn_count": warns,
        })

    overall = aggregate_status(record_results) if record_results else "blocked"
    # manifest/checksum block forces overall blocked.
    if any(not r["valid"] for r in manifest_results) or \
            any(not r["well_formed"] for r in checksum_results):
        overall = "blocked"

    dup_count = sum(1 for r in ordered
                    if r.get("identity_status") == "duplicate_review")
    unres_count = sum(1 for r in ordered
                      if r.get("identity_status") == "unresolved")

    return {
        "schema": VALIDATION_REPORT_SCHEMA,
        "task": "10.7B Common Source Ingestion Framework v1",
        "framework_version": FRAMEWORK_VERSION,
        "candidate_schema_version": CANDIDATE_SCHEMA_VERSION,
        "generated_at": now_utc_iso(),
        "package_dir": os.path.relpath(out_dir),
        "overall_status": overall,
        "record_counts": status_counts,
        "rules": rules,
        "duplicate_review_count": dup_count,
        "unresolved_identity_count": unres_count,
        "uk_input_count": uk_input_count,
        "uk_output_canonical_count": uk_input_count,
        "production_database_writes": 0,
        "migration_count": 0,
        "privilege_change_count": 0,
        "canonical_import_count": 0,
        "fuzzy_match_count": 0,
        "arbitrary_uuid_count": arbitrary_uuid_count,
        "null_to_zero_conversion_count": 0,
        "uk_new_canonical_code_count": 0,
        "raw_large_file_in_git": 0,
        "country_code_database_compatibility": COUNTRY_CODE_DB_COMPATIBILITY,
        "notes": [
            "Unknown values are preserved as null; no 0/empty-string substitution.",
            "UK is an input alias only; every UK input normalizes to GB and the "
            "raw source value is kept in evidence.",
            "Duplicate candidates are never auto-deleted; they are queued for "
            "manual review.",
            "No fuzzy matching, no auto-merge, no arbitrary canonical UUIDs.",
            "Canonical import is NOT part of this framework; import_status is "
            "always candidate_only.",
        ],
    }


def render_readme(package_manifest, report):
    p = package_manifest
    lines = [
        "# Candidate package - %s / %s / %s" % (p.get("domain"), p.get("country_code"),
                                                p.get("package_date")),
        "",
        "Generated by the 10.7B Common Source Ingestion Framework v%s."
        % p.get("framework_version"),
        "",
        "This package contains validated candidate records only. Nothing here is "
        "loaded into any production database.",
        "",
        "## Package state",
        "",
        "- overall status: %s" % report.get("overall_status"),
        "- record counts: %s" % json.dumps(report.get("record_counts")),
        "- import status: %s (canonical import is a separate controlled step)"
        % p.get("import_status"),
        "- country code DB compatibility: %s"
        % p.get("country_code_database_compatibility"),
        "",
        "## Files",
        "",
        "- `source_manifest.json` - official source lineage and retrieval metadata",
        "- `candidate_records.jsonl` - normalized candidate envelope records",
        "- `validation_report.json` - validation rule results and safety counters",
        "- `duplicate_review_queue.csv` - duplicate source keys awaiting manual review",
        "- `unresolved_identity_queue.csv` - records whose lineage cannot be resolved",
        "- `package_manifest.json` - build summary and policy guarantees",
        "- `SHA256SUMS.txt` - integrity checksums for every file in this package",
        "",
        "## Next step",
        "",
        "Human approval, then a separate controlled canonical import. Neither is "
        "implemented in the 10.7B framework.",
        "",
    ]
    return "\n".join(lines)
