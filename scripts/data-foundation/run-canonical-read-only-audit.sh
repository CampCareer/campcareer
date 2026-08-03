#!/usr/bin/env bash
# ============================================================================
# run-canonical-read-only-audit.sh
# CampCareer 10.7A / 10.7A-1 Canonical Read-Only Observability v1 runner.
#
# Reads ONLY the canonical schemas (core, catalog, taxonomy, evidence, labour,
# reporting, ingest) with strictly read-only SQL. NEVER writes to the
# database, NEVER applies migrations, NEVER imports data, NEVER changes
# privileges or RLS. All SQL files are executed inside a READ ONLY
# transaction and rolled back.
#
# Database credentials:
#   - NO connection-string argument is accepted.
#   - The connection URL is taken ONLY from allowlisted environment
#     variables (checked in order):
#         SUPABASE_DB_URL | DIRECT_URL | DATABASE_URL | POSTGRES_URL
#   - Secrets are NEVER printed by this script.
#
# Exit codes:
#   0  success          - all SQL files executed and parsed
#   1  failure          - tooling/validation/execution error
#   2  no-access        - no DB URL present; skeleton artifacts generated
#                         (canonical counts unavailable; verdict B path)
#   3  partial          - some SQL files failed, others succeeded
#
# Artifacts are produced by scripts/data-foundation/build-canonical-
# observability.py (never by static overwrite after a successful observation).
# SHA256SUMS.txt is written on every exit (best-effort on exit 1).
#
# Usage:
#   AUDIT_OUTPUT_DIR=/path/to/out SUPABASE_DB_URL='postgresql://...' \
#     ./scripts/data-foundation/run-canonical-read-only-audit.sh
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT_NAME="run-canonical-read-only-audit.sh"
SCRIPT_VERSION="1.1.0"

AUDIT_SQL_DIR="${AUDIT_SQL_DIR:-$ROOT/data/audits/canonical-read-only-observability/2026-08-02/sql}"
AUDIT_OUTPUT_DIR="${AUDIT_OUTPUT_DIR:-$ROOT/data/audits/canonical-read-only-observability/$(date +%Y-%m-%d)}"
MANIFEST="$ROOT/scripts/data-foundation/canonical-tables.json"
BUILD_SCRIPT="$ROOT/scripts/data-foundation/build-canonical-observability.py"

ALLOWED_SCHEMAS="core catalog taxonomy evidence labour reporting ingest"
ALLOWED_SQL_FILES="01_schema_inventory.sql 02_table_counts.sql 03_country_entity_counts.sql 04_relationship_checks.sql 05_privilege_audit.sql 06_migration_status.sql"

# psql location (libpq preferred when present; otherwise PATH).
PSQL_BIN="$(command -v psql || true)"
[ -z "$PSQL_BIN" ] && [ -x /opt/homebrew/opt/libpq/bin/psql ] && PSQL_BIN="/opt/homebrew/opt/libpq/bin/psql"
if [ -z "$PSQL_BIN" ] || [ ! -x "$PSQL_BIN" ]; then
  echo "ERROR: psql not found. Install libpq or add psql to PATH." >&2
  exit 1
fi
if ! "$PSQL_BIN" --version >/dev/null 2>&1; then
  echo "ERROR: psql binary not runnable: $PSQL_BIN" >&2
  exit 1
fi
PSQL_VERSION="$("$PSQL_BIN" --version | sed -E 's/.*\(PostgreSQL\) ([0-9]+).*/\1/')"

# ---------------------------------------------------------------------------
# Allowlisted environment variable resolution (never echo the URL).
# ---------------------------------------------------------------------------
DB_URL=""
for var in SUPABASE_DB_URL DIRECT_URL DATABASE_URL POSTGRES_URL; do
  if [ -n "${!var:-}" ]; then
    DB_URL="${!var}"
    break
  fi
done

if [ -n "$DB_URL" ]; then
  if printf '%s' "$DB_URL" | grep -qiE '^(postgres(ql)?|postgres)://'; then
    :
  else
    echo "ERROR: \$SUPABASE_DB_URL etc must be a postgres:// URL." >&2
    exit 1
  fi
  HAS_DB=1
else
  HAS_DB=0
fi

mkdir -p "$AUDIT_OUTPUT_DIR"

# ---------------------------------------------------------------------------
# Run-state (updated after the access-mode attempt, used for manifest/metadata).
# ---------------------------------------------------------------------------
RUN_MODE="no_access"      # no_access | success | partial | failure
CONNECTION_USED=false
TXN_READONLY=false
FAILED_SQL_FILES=""
FAILED_COUNTS=0

OBS_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
GIT_BRANCH="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
GIT_SHA="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unknown)"
PROJECT_REF="$(jq -r '.ref // "unknown"' "$ROOT/supabase/.temp/linked-project.json" 2>/dev/null || echo unknown)"

# ---------------------------------------------------------------------------
# Artifact generation helpers (write-only to $AUDIT_OUTPUT_DIR).
# ---------------------------------------------------------------------------
write_manifest() {
  local access="$([ "$HAS_DB" = 1 ] && echo available || echo unavailable)"
  local observed="false"
  local exit_code="2"
  case "$RUN_MODE" in
    success) observed=true; exit_code=0 ;;
    partial) observed=true; exit_code=3 ;;
    failure) observed=false; exit_code=1 ;;
  esac
  cat > "$AUDIT_OUTPUT_DIR/audit_manifest.json" <<EOF
{
  "schema": "campcareer.canonical-read-only-audit.manifest.v1",
  "task": "10.7A Canonical Read-Only Observability v1",
  "description": "Read-only observability of CampCareer canonical (private) schemas. No data collection, no migrations, no privilege or exposure changes.",
  "observation_date": "$OBS_DATE",
  "git": { "branch": "$GIT_BRANCH", "commit": "$GIT_SHA" },
  "supabase_project_ref": "$PROJECT_REF",
  "direct_database_access": "$access",
  "canonical_database_observed": $observed,
  "runner": { "script": "$SCRIPT_NAME", "version": "$SCRIPT_VERSION", "psql_version": "$PSQL_VERSION" },
  "sql_files": $(printf '["%s"]' "$(printf '%s' "$ALLOWED_SQL_FILES" | sed 's/ /", "/g')"),
  "exit_code": $exit_code
}
EOF
}

write_metadata() {
  local access_method="none"
  local txn_readonly="false"
  if [ "$HAS_DB" = 1 ]; then
    access_method="psql"
  fi
  if [ "$TXN_READONLY" = true ]; then
    txn_readonly="true"
  fi
  cat > "$AUDIT_OUTPUT_DIR/metadata.json" <<EOF
{
  "schema": "campcareer.canonical-read-only-audit.metadata.v1",
  "observation_date": "$OBS_DATE",
  "direct_connection_method": "$access_method",
  "connection_used": $CONNECTION_USED,
  "transaction_read_only_verified": $txn_readonly,
  "statement_timeout": "120s",
  "lock_timeout": "5s",
  "psql": { "binary": "$PSQL_BIN", "version": "$PSQL_VERSION" },
  "supabase_project_ref": "$PROJECT_REF",
  "allowed_connection_env_vars": ["SUPABASE_DB_URL", "DIRECT_URL", "DATABASE_URL", "POSTGRES_URL"],
  "secrets_printed": false
}
EOF
}

write_checksums() {
  local rc
  cd "$AUDIT_OUTPUT_DIR" || { echo "ERROR: cannot enter $AUDIT_OUTPUT_DIR" >&2; return 1; }
  find . -type f ! -name SHA256SUMS ! -name SHA256SUMS.txt -print0 | sort -z | xargs -0 shasum -a 256 > SHA256SUMS.txt
  rc=$?
  cd "$ROOT"
  if [ "$rc" = 0 ]; then
    echo "SHA256SUMS.txt written to $AUDIT_OUTPUT_DIR/SHA256SUMS.txt"
  else
    echo "WARNING: checksum generation failed." >&2
  fi
  return "$rc"
}

# ---------------------------------------------------------------------------
# validation_report.json (actual observation report, auto-generated).
# Records the real credentialed read-only observation, distinct from the
# tooling harness report (validation_report.tooling.json).
# ---------------------------------------------------------------------------
write_validation_report() {
  local observed="false"
  local exit_code="2"
  case "$RUN_MODE" in
    success) observed=true; exit_code=0 ;;
    partial) observed=true; exit_code=3 ;;
    *) return 0 ;;
  esac

  local sql_status=""
  local f base st sep=""
  for f in $ALLOWED_SQL_FILES; do
    base="${f%.sql}"
    st="ok"
    if printf ' %s ' "$FAILED_SQL_FILES " | grep -q " $base "; then
      st="failed"
    fi
    sql_status="$sql_status$sep\"$f\": \"$st\""
    sep=", "
  done

  local ro_verified=false
  [ "$TXN_READONLY" = true ] && ro_verified=true

  cat > "$AUDIT_OUTPUT_DIR/validation_report.json" <<EOF
{
  "schema": "campcareer.canonical-read-only-observability.validation_report.v1",
  "task": "10.7A-2 Credentialed Canonical Read-Only Observation",
  "report_kind": "actual_database_observation",
  "report_scope": "Real credentialed read-only psql observation of the canonical schemas. Tooling-level 4-mode harness results are recorded separately in validation_report.tooling.json.",
  "observation_date": "$OBS_DATE",
  "git": { "branch": "$GIT_BRANCH", "commit": "$GIT_SHA" },
  "supabase_project_ref": "$PROJECT_REF",
  "runner": { "script": "$SCRIPT_NAME", "version": "$SCRIPT_VERSION", "psql_version": "$PSQL_VERSION" },
  "direct_database_access": "available",
  "canonical_database_observed": $observed,
  "transaction_read_only_verified": $ro_verified,
  "sql_files": { $sql_status },
  "exit_code": $exit_code,
  "production_write_count": 0,
  "migration_count": 0,
  "privilege_change_count": 0,
  "database_impact_note": "Observability-only: no DB writes, no migrations, no privilege or exposure changes. Every SQL file executed inside a READ ONLY transaction and rolled back."
}
EOF
}

# ---------------------------------------------------------------------------
# Access-mode execution (only when a DB URL is provided).
# ---------------------------------------------------------------------------
is_valid_identifier() {
  printf '%s' "$1" | grep -qE '^[a-z_][a-z0-9_]*$'
}

run_access_mode() {
  local rc=0
  local results_dir="$AUDIT_OUTPUT_DIR/raw"
  mkdir -p "$results_dir"

  # Verify read-only enforcement in a single throwaway transaction.
  local ro=""
  ro="$(PGOPTIONS='' "$PSQL_BIN" -X -q -A -t -w -d "$DB_URL" -c "BEGIN TRANSACTION READ ONLY; SHOW transaction_read_only; ROLLBACK;" 2>"$results_dir/readonly_check.err")"
  if [ "$?" -ne 0 ]; then
    echo "ERROR: could not verify read-only transaction (see $results_dir/readonly_check.err)." >&2
    CONNECTION_USED=false
    RUN_MODE="failure"
    return 1
  fi
  if [ "$(printf '%s' "$ro" | tr -d '[:space:]')" != "on" ]; then
    echo "ERROR: transaction_read_only did not report 'on'." >&2
    CONNECTION_USED=false
    RUN_MODE="failure"
    return 1
  fi
  CONNECTION_USED=true
  TXN_READONLY=true

  local failed=0
  local file
  for file in $ALLOWED_SQL_FILES; do
    local sql_path="$AUDIT_SQL_DIR/$file"
    if [ ! -f "$sql_path" ]; then
      echo "ERROR: missing SQL file $sql_path" >&2
      failed=1
      FAILED_SQL_FILES="$FAILED_SQL_FILES ${file%.sql}"
      continue
    fi
    local base="${file%.sql}"
    local out_csv="$results_dir/$base.csv"
    local out_err="$results_dir/$base.err"
    # Each SQL file runs inside its own READ ONLY transaction that is always
    # rolled back (never committed). Local timeouts are set per transaction.
    local script
    script="$(
      printf 'BEGIN TRANSACTION READ ONLY;\n'
      printf "SET LOCAL statement_timeout='120s';\n"
      printf "SET LOCAL lock_timeout='5s';\n"
      cat "$sql_path"
      printf '\nROLLBACK;\n'
    )"
    if printf '%s\n' "$script" | "$PSQL_BIN" -X -q -w -d "$DB_URL" --csv \
        -v ON_ERROR_STOP=1 -f - > "$out_csv" 2>"$out_err"; then
      echo "  ok    $file"
    else
      echo "  FAIL  $file (see $out_err)" >&2
      FAILED_SQL_FILES="$FAILED_SQL_FILES $base"
      failed=1
    fi
  done

  # Exact per-table counts (never estimates) from the 02 enumeration.
  # 02 CSV header: schema_name,table_name,relation_type
  local count_csv="$results_dir/table_counts_raw.csv"
  printf 'schema_name,table_name,actual_row_count\n' > "$count_csv"
  if [ -f "$results_dir/02_table_counts.csv" ]; then
    local schema table
    while IFS=',' read -r schema table _; do
      [ "$schema" = "schema_name" ] && continue
      schema="$(printf '%s' "$schema" | tr -d '"')"
      table="$(printf '%s' "$table" | tr -d '"')"
      # Identifier validation (real regex) and schema allowlist enforcement
      # before any SQL is built. Failures produce a safe error record and the
      # count query is skipped - the identifier is never interpolated.
      if ! is_valid_identifier "$schema"; then
        echo "ERROR: invalid schema identifier '$schema' (must match ^[a-z_][a-z0-9_]*\$)." >&2
        printf '%s,%s,error\n' "$schema" "$table" >> "$count_csv"
        failed=1
        continue
      fi
      if ! is_valid_identifier "$table"; then
        echo "ERROR: invalid table identifier '$table' (must match ^[a-z_][a-z0-9_]*\$)." >&2
        printf '%s,%s,error\n' "$schema" "$table" >> "$count_csv"
        failed=1
        continue
      fi
      case " $ALLOWED_SCHEMAS " in
        *" $schema "*) : ;;
        *) echo "ERROR: table $schema.$table outside canonical allowlist." >&2; failed=1; printf '%s,%s,error\n' "$schema" "$table" >> "$count_csv"; continue ;;
      esac
      local n
      n="$(printf 'BEGIN TRANSACTION READ ONLY;\nSET LOCAL statement_timeout='\''120s'\'';\nSET LOCAL lock_timeout='\''5s'\'';\nselect count(*) from "%s"."%s";\nROLLBACK;\n' "$schema" "$table" \
           | "$PSQL_BIN" -X -q -A -t -w -d "$DB_URL" -v ON_ERROR_STOP=1 -f - 2>>"$results_dir/counts.err")"
      if [ "$?" -ne 0 ]; then
        printf '%s,%s,error\n' "$schema" "$table" >> "$count_csv"
        FAILED_COUNTS=$((FAILED_COUNTS + 1))
        failed=1
      else
        printf '%s,%s,%s\n' "$schema" "$table" "$n" >> "$count_csv"
      fi
    done < "$results_dir/02_table_counts.csv"
  fi

  if [ "$failed" = 1 ]; then
    echo "WARNING: some SQL files failed; artifacts reflect partial observation." >&2
    RUN_MODE="partial"
    return 3
  fi
  RUN_MODE="success"
  return 0
}

# ---------------------------------------------------------------------------
# Invoke the artifact builder with the observed/static state.
# ---------------------------------------------------------------------------
invoke_build() {
  local access="$([ "$HAS_DB" = 1 ] && echo available || echo unavailable)"
  local api_private_db="unavailable"
  if [ "$HAS_DB" = 1 ] && [ "$RUN_MODE" != "failure" ]; then
    api_private_db="observed"
  fi
  CC_MODE="$RUN_MODE" \
  CC_OUTDIR="$AUDIT_OUTPUT_DIR" \
  CC_MANIFEST="$MANIFEST" \
  CC_TXN_READONLY="$TXN_READONLY" \
  CC_ACCESS="$access" \
  CC_FAILED_SQL_FILES="$FAILED_SQL_FILES" \
  CC_FAILED_COUNTS="$FAILED_COUNTS" \
  CC_API_PRIVATE_DB="$api_private_db" \
  python3 "$BUILD_SCRIPT"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
echo "CampCareer 10.7A Canonical Read-Only Observability runner v$SCRIPT_VERSION"
echo "  output dir : $AUDIT_OUTPUT_DIR"
echo "  sql dir    : $AUDIT_SQL_DIR"
echo "  db access  : $([ "$HAS_DB" = 1 ] && echo available || echo unavailable)"

# SQL file allowlist + forbidden-statement validation (safety gate).
for file in $ALLOWED_SQL_FILES; do
  [ -f "$AUDIT_SQL_DIR/$file" ] || { echo "ERROR: missing allowed SQL file $AUDIT_SQL_DIR/$file" >&2; exit 1; }
  bad="$(grep -vE '^\s*--' "$AUDIT_SQL_DIR/$file" | grep -niE '^\s*\b(insert|update|delete|upsert|merge|truncate|alter table|create table|create index|create view|create schema|drop table|drop view|grant|revoke|copy|call|do|vacuum|analyze|refresh|commit)\b' || true)"
  if [ -n "$bad" ]; then
    echo "ERROR: forbidden statement in $file:" >&2
    printf '%s\n' "$bad" >&2
    exit 1
  fi
done
[ -f "$MANIFEST" ] || { echo "ERROR: manifest not found: $MANIFEST" >&2; exit 1; }
[ -f "$BUILD_SCRIPT" ] || { echo "ERROR: artifact builder not found: $BUILD_SCRIPT" >&2; exit 1; }

# Metadata / manifest are always written (rewritten below once run-state is known).
write_manifest
write_metadata

if [ "$HAS_DB" = 1 ]; then
  run_access_mode
  rc=$?
  write_manifest
  write_metadata
  invoke_build
  if [ "$rc" = 1 ]; then
    write_checksums >/dev/null 2>&1 || true
    echo "ERROR: access-mode run failed; best-effort failure artifacts written (verdict C. Hold)." >&2
    echo "Provide a working read-only DB credential to observe canonical state." >&2
    exit 1
  fi
  write_validation_report
  write_checksums
  echo "Done. Artifacts in $AUDIT_OUTPUT_DIR"
  exit "$rc"
fi

# No access: skeleton artifacts (verdict B path).
write_manifest
write_metadata
invoke_build
write_checksums
echo "No DB URL provided. Skeleton artifacts written with count_status=unavailable (expected path B)."
echo "Provide one of: SUPABASE_DB_URL / DIRECT_URL / DATABASE_URL / POSTGRES_URL to observe."
exit 2
