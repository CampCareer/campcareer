#!/usr/bin/env bash
# ============================================================================
# run-canonical-read-only-observability-validation.sh
# CampCareer 10.7A-1 - validation harness for the canonical read-only runner.
#
# Runs the runner in four modes and validates the produced artifacts:
#   1. no-access        (no DB env; expects exit 2, verdict B, checksums)
#   2. mocked success   (fake psql via PATH; expects exit 0, verdict A,
#                        observed=true, checksums)
#   3. mocked partial   (fake psql failing SQL 04 + one count; expects exit 3,
#                        successful results preserved, failures error)
#   4. mocked failure   (read-only check fails; expects exit 1, verdict C,
#                        best-effort checksums)
# plus shell syntax, SQL forbidden scan, identifier-regex test, checksum
# verification, JSON parse, CSV consistency, secret scan and git diff --check.
#
# Optional engine checks (RUN_ENGINE_CHECKS=1): typecheck, lint, test, build.
#
# The merged report is written to $VALIDATION_OUTPUT_DIR/validation_report.json
# (default: the 2026-08-02 canonical observability artifact directory).
#
# Usage:
#   VALIDATION_OUTPUT_DIR=/path/to/out RUN_ENGINE_CHECKS=1 \
#     ./scripts/data-foundation/tests/run-canonical-read-only-observability-validation.sh
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
RUNNER="$ROOT/scripts/data-foundation/run-canonical-read-only-audit.sh"
BUILD_SCRIPT="$ROOT/scripts/data-foundation/build-canonical-observability.py"
MANIFEST="$ROOT/scripts/data-foundation/canonical-tables.json"
SQL_DIR="$ROOT/data/audits/canonical-read-only-observability/2026-08-02/sql"
FIXTURES_DIR="$ROOT/scripts/data-foundation/tests/fixtures"
VALIDATION_OUTPUT_DIR="${VALIDATION_OUTPUT_DIR:-$ROOT/data/audits/canonical-read-only-observability/2026-08-02}"
RUN_ENGINE_CHECKS="${RUN_ENGINE_CHECKS:-0}"

RESULTS_FILE="$(mktemp)"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$RESULTS_FILE" "$TMP_ROOT"' EXIT

record() { printf '%s\t%s\t%s\n' "$1" "$2" "$3" >> "$RESULTS_FILE"; }
pass() { record "$1" "pass" "${2:-}"; }
fail() { record "$1" "fail" "${2:-}"; }
CHKSUM_BAD=0

echo "10.7A-1 runner validation"
echo "  temp root     : $TMP_ROOT"
echo "  output report : $VALIDATION_OUTPUT_DIR/validation_report.json"

# ---------------------------------------------------------------------------
# 1. Runner shell syntax
# ---------------------------------------------------------------------------
if bash -n "$RUNNER"; then
  pass runner_shell_syntax
else
  fail runner_shell_syntax "bash -n failed"
fi

# ---------------------------------------------------------------------------
# 2. SQL forbidden-statement scan
# ---------------------------------------------------------------------------
FORBIDDEN_RE='^\s*\b(insert|update|delete|upsert|merge|truncate|alter table|create table|create index|create view|create schema|drop table|drop view|grant|revoke|copy|call|do|vacuum|analyze|refresh|commit)\b'
SQL_BAD=0
SQL_FILES=""
for f in 01_schema_inventory.sql 02_table_counts.sql 03_country_entity_counts.sql 04_relationship_checks.sql 05_privilege_audit.sql 06_migration_status.sql; do
  SQL_FILES="$SQL_FILES $f"
  if grep -vE '^\s*--' "$SQL_DIR/$f" | grep -niE "$FORBIDDEN_RE" >/dev/null 2>&1; then
    SQL_BAD=1
  fi
done
if [ "$SQL_BAD" = 0 ]; then
  pass sql_forbidden_scan "0 forbidden statements across:$SQL_FILES"
else
  fail sql_forbidden_scan "forbidden statement detected"
fi

# ---------------------------------------------------------------------------
# 3. Identifier validation regex test
# ---------------------------------------------------------------------------
is_valid_identifier() { printf '%s' "$1" | grep -qE '^[a-z_][a-z0-9_]*$'; }
ID_BAD=0
for good in core countries ingest1 _tmp abc_123; do
  is_valid_identifier "$good" || { echo "  id-regex: '$good' should pass" >&2; ID_BAD=1; }
done
for bad in Core "1core" "core.table" "core table" "" "core-table"; do
  if is_valid_identifier "$bad"; then echo "  id-regex: '$bad' should fail" >&2; ID_BAD=1; fi
done
if [ "$ID_BAD" = 0 ]; then
  pass identifier_validation_test "regex ^[a-z_][a-z0-9_]*\$ accepted/failed expected cases"
else
  fail identifier_validation_test "regex behaved unexpectedly"
fi

# ---------------------------------------------------------------------------
# Shared assertion helpers
# ---------------------------------------------------------------------------
jq_true()  { jq -e "$2" "$1" >/dev/null 2>&1; }
jq_eq()    { [ "$(jq -r "$2" "$1" 2>/dev/null)" = "$3" ]; }

run_runner() { # out_dir, then extra env as KEY=VALUE...
  local out="$1"; shift
  local env_args=()
  local kv
  for kv in "$@"; do env_args+=("$kv"); done
  env "${env_args[@]}" \
    AUDIT_OUTPUT_DIR="$out" AUDIT_SQL_DIR="$SQL_DIR" \
    "$RUNNER" >"$TMP_ROOT/runner-${out##*/}.stdout.log" 2>"$TMP_ROOT/runner-${out##*/}.stderr.log"
  echo "$?"
}

verify_checksums() {
  ( cd "$1" && shasum -a 256 -c SHA256SUMS.txt >/dev/null 2>&1 ) || CHKSUM_BAD=1
}

# ---------------------------------------------------------------------------
# 4. no-access test
# ---------------------------------------------------------------------------
NA_OUT="$TMP_ROOT/no_access"
mkdir -p "$NA_OUT"
NA_RC="$(run_runner "$NA_OUT" -u SUPABASE_DB_URL -u DIRECT_URL -u DATABASE_URL -u POSTGRES_URL)"
NA_OK=0
[ "$NA_RC" = 2 ] || { echo "  no-access: expected exit 2, got $NA_RC" >&2; NA_OK=1; }
[ -f "$NA_OUT/observation_summary.json" ] || { echo "  no-access: missing observation_summary.json" >&2; NA_OK=1; }
[ -f "$NA_OUT/SHA256SUMS.txt" ] || { echo "  no-access: missing SHA256SUMS.txt" >&2; NA_OK=1; }
jq_eq "$NA_OUT/observation_summary.json" '.verdict' "B. Conditional Pass" || { echo "  no-access: verdict mismatch" >&2; NA_OK=1; }
jq_true "$NA_OUT/observation_summary.json" '.canonical_database_observed == false' || { echo "  no-access: observed should be false" >&2; NA_OK=1; }
jq_true "$NA_OUT/observation_summary.json" '.transaction_read_only_verified == false' || { echo "  no-access: txn_read_only should be false" >&2; NA_OK=1; }
jq_true "$NA_OUT/observation_summary.json" '.exit_code == 2' || { echo "  no-access: exit_code mismatch" >&2; NA_OK=1; }
jq_eq "$NA_OUT/audit_manifest.json" '.canonical_database_observed' "false" || { echo "  no-access: manifest observed mismatch" >&2; NA_OK=1; }
verify_checksums "$NA_OUT" || { echo "  no-access: checksum verification failed" >&2; NA_OK=1; }
if [ "$NA_OK" = 0 ]; then
  pass mode_test_no_access "exit 2, verdict B, observed=false, checksums OK"
else
  fail mode_test_no_access "exit=$NA_RC"
fi

# ---------------------------------------------------------------------------
# 5. mocked success test
# ---------------------------------------------------------------------------
SUC_OUT="$TMP_ROOT/success"
mkdir -p "$SUC_OUT"
SUC_RC="$(run_runner "$SUC_OUT" \
  "PATH=$FIXTURES_DIR:$PATH" "MOCK_FIXTURES_DIR=$FIXTURES_DIR" \
  "SUPABASE_DB_URL=postgresql://mock:mock@127.0.0.1:5432/mockdb")"
SUC_OK=0
[ "$SUC_RC" = 0 ] || { echo "  success: expected exit 0, got $SUC_RC" >&2; SUC_OK=1; }
[ -f "$SUC_OUT/observation_summary.json" ] || { echo "  success: missing observation_summary.json" >&2; SUC_OK=1; }
jq_eq "$SUC_OUT/observation_summary.json" '.verdict' "A. Pass" || { echo "  success: verdict mismatch" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.canonical_database_observed == true' || { echo "  success: observed should be true" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.transaction_read_only_verified == true' || { echo "  success: txn_read_only should be true" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.exit_code == 0' || { echo "  success: exit_code mismatch" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.counters.total_relations_observed == 4' || { echo "  success: relations counter" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.counters.total_tables_counted == 4' || { echo "  success: tables counter" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.counters.failed_count_queries == 0' || { echo "  success: failed counts" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/observation_summary.json" '.counters.relationship_gap_count == 1' || { echo "  success: gap counter" >&2; SUC_OK=1; }
jq_eq "$SUC_OUT/audit_manifest.json" '.canonical_database_observed' "true" || { echo "  success: manifest observed" >&2; SUC_OK=1; }
jq_eq "$SUC_OUT/audit_manifest.json" '.exit_code' "0" || { echo "  success: manifest exit_code" >&2; SUC_OK=1; }
jq_eq "$SUC_OUT/audit_manifest.json" '.direct_database_access' "available" || { echo "  success: manifest access" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/metadata.json" '.connection_used == true' || { echo "  success: metadata connection_used" >&2; SUC_OK=1; }
jq_true "$SUC_OUT/metadata.json" '.transaction_read_only_verified == true' || { echo "  success: metadata txn_read_only" >&2; SUC_OK=1; }
grep -q '^core,countries,5,observed' "$SUC_OUT/canonical_table_counts.csv" || { echo "  success: count not observed" >&2; SUC_OK=1; }
[ -f "$SUC_OUT/SHA256SUMS.txt" ] || { echo "  success: missing SHA256SUMS.txt" >&2; SUC_OK=1; }
verify_checksums "$SUC_OUT" || { echo "  success: checksum verification failed" >&2; SUC_OK=1; }
if [ "$SUC_OK" = 0 ]; then
  pass mode_test_mocked_success "exit 0, verdict A, observed=true, counts reflected, checksums OK"
else
  fail mode_test_mocked_success "exit=$SUC_RC"
fi

# ---------------------------------------------------------------------------
# 6. mocked partial test
# ---------------------------------------------------------------------------
PAR_OUT="$TMP_ROOT/partial"
mkdir -p "$PAR_OUT"
PAR_RC="$(run_runner "$PAR_OUT" \
  "PATH=$FIXTURES_DIR:$PATH" "MOCK_FIXTURES_DIR=$FIXTURES_DIR" "MOCK_PARTIAL=1" \
  "SUPABASE_DB_URL=postgresql://mock:mock@127.0.0.1:5432/mockdb")"
PAR_OK=0
[ "$PAR_RC" = 3 ] || { echo "  partial: expected exit 3, got $PAR_RC" >&2; PAR_OK=1; }
[ -f "$PAR_OUT/observation_summary.json" ] || { echo "  partial: missing observation_summary.json" >&2; PAR_OK=1; }
jq_eq "$PAR_OUT/observation_summary.json" '.verdict' "B. Conditional Pass" || { echo "  partial: verdict mismatch" >&2; PAR_OK=1; }
jq_true "$PAR_OUT/observation_summary.json" '.counters.failed_count_queries == 1' || { echo "  partial: failed_count_queries" >&2; PAR_OK=1; }
jq_true "$PAR_OUT/observation_summary.json" '.counters.total_tables_counted == 3' || { echo "  partial: tables counted should preserve successes" >&2; PAR_OK=1; }
jq_eq "$PAR_OUT/observation_summary.json" '.sections.relationship_checks.status' "partial" || { echo "  partial: relationship section status" >&2; PAR_OK=1; }
jq_eq "$PAR_OUT/observation_summary.json" '.sections.canonical_schema.status' "observed" || { echo "  partial: successful section must stay observed" >&2; PAR_OK=1; }
grep -q '^evidence,review_events,,error' "$PAR_OUT/canonical_table_counts.csv" || { echo "  partial: failed count must be error" >&2; PAR_OK=1; }
grep -q '^core,countries,5,observed' "$PAR_OUT/canonical_table_counts.csv" || { echo "  partial: successful count must be preserved" >&2; PAR_OK=1; }
[ -f "$PAR_OUT/SHA256SUMS.txt" ] || { echo "  partial: missing SHA256SUMS.txt" >&2; PAR_OK=1; }
verify_checksums "$PAR_OUT" || { echo "  partial: checksum verification failed" >&2; PAR_OK=1; }
if [ "$PAR_OK" = 0 ]; then
  pass mode_test_mocked_partial "exit 3, verdict B, successes preserved, failures error, checksums OK"
else
  fail mode_test_mocked_partial "exit=$PAR_RC"
fi

# ---------------------------------------------------------------------------
# 7. mocked failure test (exit 1, best-effort checksums)
# ---------------------------------------------------------------------------
FAL_OUT="$TMP_ROOT/failure"
mkdir -p "$FAL_OUT"
FAL_RC="$(run_runner "$FAL_OUT" \
  "PATH=$FIXTURES_DIR:$PATH" "MOCK_FIXTURES_DIR=$FIXTURES_DIR" "MOCK_FAIL_READONLY=1" \
  "SUPABASE_DB_URL=postgresql://mock:mock@127.0.0.1:5432/mockdb")"
FAL_OK=0
[ "$FAL_RC" = 1 ] || { echo "  failure: expected exit 1, got $FAL_RC" >&2; FAL_OK=1; }
jq_eq "$FAL_OUT/observation_summary.json" '.verdict' "C. Hold" || { echo "  failure: verdict mismatch" >&2; FAL_OK=1; }
jq_true "$FAL_OUT/observation_summary.json" '.canonical_database_observed == false' || { echo "  failure: observed must stay false" >&2; FAL_OK=1; }
jq_eq "$FAL_OUT/audit_manifest.json" '.exit_code' "1" || { echo "  failure: manifest exit_code" >&2; FAL_OK=1; }
[ -f "$FAL_OUT/SHA256SUMS.txt" ] && verify_checksums "$FAL_OUT" || { echo "  failure: best-effort checksums missing/invalid" >&2; FAL_OK=1; }
if [ "$FAL_OK" = 0 ]; then
  pass mode_test_mocked_failure "exit 1, verdict C, best-effort SHA256SUMS.txt OK"
else
  fail mode_test_mocked_failure "exit=$FAL_RC"
fi

# ---------------------------------------------------------------------------
# 8. JSON parse + CSV consistency across all output dirs
# ---------------------------------------------------------------------------
JSON_BAD=0
CSV_BAD=0
for d in "$NA_OUT" "$SUC_OUT" "$PAR_OUT" "$FAL_OUT"; do
  for j in "$d"/*.json; do
    jq -e '.' "$j" >/dev/null 2>&1 || { echo "  json parse failed: $j" >&2; JSON_BAD=1; }
  done
done
# no-access static CSVs must enumerate all 87 canonical tables (header + 87 rows).
NA_TABLES="$(wc -l < "$NA_OUT/table_counts.csv" | tr -d '[:space:]')"
NA_SCHEMAS="$(wc -l < "$NA_OUT/schema_inventory.csv" | tr -d '[:space:]')"
NA_REL="$(wc -l < "$NA_OUT/relationship_checks.csv" | tr -d '[:space:]')"
SUC_TABLES="$(wc -l < "$SUC_OUT/canonical_table_counts.csv" | tr -d '[:space:]')"
[ "$NA_TABLES" = 88 ] || { echo "  csv: no-access table_counts rows != 88 (got $NA_TABLES)" >&2; CSV_BAD=1; }
[ "$NA_SCHEMAS" = 88 ] || { echo "  csv: no-access schema_inventory rows != 88 (got $NA_SCHEMAS)" >&2; CSV_BAD=1; }
[ "$NA_REL" = 13 ] || { echo "  csv: relationship_checks rows != 13 (got $NA_REL)" >&2; CSV_BAD=1; }
[ "$SUC_TABLES" = 5 ] || { echo "  csv: success canonical_table_counts rows != 5 (got $SUC_TABLES)" >&2; CSV_BAD=1; }
if [ "$JSON_BAD" = 0 ]; then pass json_parse "all JSON files parse"; else fail json_parse; fi
if [ "$CSV_BAD" = 0 ]; then pass csv_consistency "headers/row counts verified"; else fail csv_consistency; fi

# ---------------------------------------------------------------------------
# 9. Secret scan (artifacts + runner + builder + fixtures)
# ---------------------------------------------------------------------------
SEC_BAD=0
SEC_SCAN_TARGETS=("$NA_OUT" "$SUC_OUT" "$PAR_OUT" "$FAL_OUT" "$RUNNER" "$BUILD_SCRIPT" "$FIXTURES_DIR")
if grep -RInE 'postgres(ql)?://[^/[:space:]]+:[^/@[:space:]]+@|[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}' "${SEC_SCAN_TARGETS[@]}" >/dev/null 2>&1; then
  SEC_BAD=1
fi
if [ "$SEC_BAD" = 0 ]; then pass secret_scan "no connection-string credentials or JWT-like tokens"; else fail secret_scan; fi

# ---------------------------------------------------------------------------
# 10. git diff --check
# ---------------------------------------------------------------------------
if git -C "$ROOT" diff --check >/dev/null 2>&1; then
  pass git_diff_check "git diff --check clean"
else
  fail git_diff_check "whitespace errors present"
fi

# ---------------------------------------------------------------------------
# 11. optional engine checks (typecheck / lint / test / build)
# ---------------------------------------------------------------------------
if [ "$RUN_ENGINE_CHECKS" = 1 ]; then
  ( cd "$ROOT" && npm run typecheck >/dev/null 2>&1 ) && pass engine_typecheck "exit 0" || fail engine_typecheck
  ( cd "$ROOT" && npm run lint >/dev/null 2>&1 ) && pass engine_lint "exit 0" || fail engine_lint
  ( cd "$ROOT" && npm run test >/dev/null 2>&1 ) && pass engine_test "exit 0" || fail engine_test
  ( cd "$ROOT" && npm run build >/dev/null 2>&1 ) && pass engine_build "exit 0" || fail engine_build
else
  record engine_typecheck not_run "RUN_ENGINE_CHECKS=0"
  record engine_lint not_run "RUN_ENGINE_CHECKS=0"
  record engine_test not_run "RUN_ENGINE_CHECKS=0"
  record engine_build not_run "RUN_ENGINE_CHECKS=0"
fi

if [ "$CHKSUM_BAD" = 0 ]; then
  pass checksum_verification "SHA256SUMS.txt verified for all four output dirs"
else
  fail checksum_verification "one or more checksum verifications failed"
fi

# ---------------------------------------------------------------------------
# Write validation_report.json
# ---------------------------------------------------------------------------
mkdir -p "$VALIDATION_OUTPUT_DIR"
GIT_BRANCH="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
GIT_SHA="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unknown)"
NA_OBS_DATE="$(jq -r '.observation_date // ""' "$NA_OUT/audit_manifest.json" 2>/dev/null || echo '')"
python3 - "$VALIDATION_OUTPUT_DIR" "$RESULTS_FILE" "$GIT_BRANCH" "$GIT_SHA" "$NA_RC" "$SUC_RC" "$PAR_RC" "$FAL_RC" "$NA_OBS_DATE" <<'PYEOF'
import json, os, sys

outdir, results_file, branch, sha = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
rcs = {"no_access": sys.argv[5], "mocked_success": sys.argv[6],
       "mocked_partial": sys.argv[7], "mocked_failure": sys.argv[8]}
obs_date = sys.argv[9]

local_manifest = os.path.join(outdir, "audit_manifest.json")
if os.path.exists(local_manifest):
    try:
        with open(local_manifest) as fh:
            obs_date = json.load(fh).get("observation_date") or obs_date
    except Exception:
        pass

results = {}
with open(results_file) as fh:
    for line in fh:
        line = line.rstrip("\n")
        if not line:
            continue
        name, status, detail = line.split("\t", 2)
        results[name] = {"status": status, "detail": detail}

mode_results = {}
for mode, key in (("no_access", "mode_test_no_access"),
                  ("mocked_success", "mode_test_mocked_success"),
                  ("mocked_partial", "mode_test_mocked_partial"),
                  ("mocked_failure", "mode_test_mocked_failure")):
    mode_results[mode] = {
        "exit_code": rcs[mode],
        "status": results.get(key, {}).get("status", "unknown"),
    }

report = {
    "schema": "campcareer.canonical-read-only-observability.validation_report.v1",
    "task": "10.7A-1 Canonical Read-Only Observability Runner Correction",
    "observation_date": obs_date or None,
    "git": {"branch": branch, "commit": sha},
    "runner_shell_syntax": results.get("runner_shell_syntax", {}),
    "sql_forbidden_scan": results.get("sql_forbidden_scan", {}),
    "identifier_validation_test": results.get("identifier_validation_test", {}),
    "mode_tests": mode_results,
    "checksum_verification": results.get("checksum_verification", {"status": "n/a"}),
    "json_parse": results.get("json_parse", {}),
    "csv_consistency": results.get("csv_consistency", {}),
    "secret_scan": results.get("secret_scan", {}),
    "typecheck": results.get("engine_typecheck", {}),
    "lint": results.get("engine_lint", {}),
    "test": results.get("engine_test", {}),
    "build": results.get("engine_build", {}),
    "git_diff_check": results.get("git_diff_check", {}),
    "production_write_count": 0,
    "migration_count": 0,
    "privilege_change_count": 0,
    "database_impact_note": "Observability-only: no DB writes, no migrations, no privilege or exposure changes.",
}

with open(os.path.join(outdir, "validation_report.json"), "w") as fh:
    json.dump(report, fh, indent=2)
    fh.write("\n")
print("validation_report.json written to", os.path.join(outdir, "validation_report.json"))
PYEOF

echo "Validation harness complete."
