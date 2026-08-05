"""10.9B AU Geography Controlled Apply Tool v1 — production apply engine.

Usage:
  python3 scripts/data-foundation/controlled-import/geography/apply.py \
    --country AU \
    --plan data/audits/au-geography-import-dry-run/2026-08-04-approved/import_plan.json \
    --expected-plan-sha 39c2bbb1202cc636e6f1bc93f9f13cef597f4820041e26ddb34a5e4a0c10da14 \
    --expected-plan-checksum a457dfa9de27dc32db40210f0006835f794d541bebac7146d0da0878d398ef56 \
    --apply \
    --confirm APPLY_AU_GEOGRAPHY_42

Safety gates:
- Rejects non-AU country codes
- Rejects any plan whose SHA-256 or plan_checksum mismatches the approved values
- Rejects UPDATE, DELETE, UPSERT, fuzzy match, schema migration
- Single SERIALIZABLE transaction with advisory lock
- Full pre-state verification inside transaction
- Full post-insert verification before COMMIT
- Automatic ROLLBACK on any failure
"""

import hashlib
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

_FRAMEWORK_DIR = Path(__file__).resolve().parents[4] / "common-ingestion"
sys.path.insert(0, str(_FRAMEWORK_DIR))

APPROVED_CITY_NAMES = [
    "Melbourne", "Sydney", "Brisbane", "Perth", "Adelaide", "Gold Coast",
    "Newcastle", "Canberra", "Sunshine Coast", "Central Coast", "Wollongong",
    "Geelong", "Hobart", "Townsville", "Cairns", "Toowoomba", "Darwin",
    "Ballarat", "Bendigo", "Albury", "Launceston", "Mackay", "Bunbury",
    "Rockhampton", "Bundaberg", "Coffs Harbour", "Hervey Bay", "Wagga Wagga",
    "Shepparton", "Mildura", "Port Macquarie", "Gladstone",
]

APPROVED_PLAN_SHA = "39c2bbb1202cc636e6f1bc93f9f13cef597f4820041e26ddb34a5e4a0c10da14"
APPROVED_PLAN_CHECKSUM = "a457dfa9de27dc32db40210f0006835f794d541bebac7146d0da0878d398ef56"
EXPECTED_INSERT_COUNT = 41
EXPECTED_NOOP_COUNT = 1
EXPECTED_REGION_COUNT = 9
EXPECTED_CITY_COUNT = 32

AU_REPRESENTATIVE_NAME_MAP = {
    "Gold Coast - Tweed Heads": "Gold Coast",
    "Newcastle - Maitland": "Newcastle",
    "Canberra - Queanbeyan": "Canberra",
    "Albury - Wodonga": "Albury",
    "Shepparton - Mooroopna": "Shepparton",
    "Mildura - Buronga": "Mildura",
}


class DryRunVerificationError(Exception):
    """Raised when the approved plan fingerprint doesn't match."""


class SafetyGateError(Exception):
    """Raised when a safety gate rejects the apply."""


class TransactionError(Exception):
    """Raised when a transaction fails."""


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def load_db_url() -> str | None:
    env_url = os.environ.get("SUPABASE_DB_URL")
    if env_url:
        return env_url
    env_path = Path(".env.local")
    if env_path.exists():
        lines = env_path.read_text().splitlines()
        for line in lines:
            line = line.strip()
            if line.startswith("SUPABASE_DB_URL="):
                return line.split("=", 1)[1].strip()
    return None


def verify_plan_fingerprint(plan_path: Path) -> dict[str, Any]:
    actual_sha = sha256_file(plan_path)
    if actual_sha != APPROVED_PLAN_SHA:
        raise DryRunVerificationError(
            f"Plan SHA-256 mismatch: got {actual_sha}, expected {APPROVED_PLAN_SHA}"
        )

    with open(plan_path) as f:
        plan = json.load(f)

    actual_checksum = plan.get("plan_checksum", "")
    if actual_checksum != APPROVED_PLAN_CHECKSUM:
        raise DryRunVerificationError(
            f"Plan checksum mismatch: got {actual_checksum}, expected {APPROVED_PLAN_CHECKSUM}"
        )

    return plan


def verify_plan_content(plan: dict[str, Any]) -> None:
    counts = plan.get("classification_counts", {})
    if counts.get("INSERT") != EXPECTED_INSERT_COUNT:
        raise DryRunVerificationError(
            f"Plan classification INSERT mismatch: {counts.get('INSERT')} != {EXPECTED_INSERT_COUNT}"
        )
    if counts.get("NOOP") != EXPECTED_NOOP_COUNT:
        raise DryRunVerificationError(
            f"Plan classification NOOP mismatch: {counts.get('NOOP')} != {EXPECTED_NOOP_COUNT}"
        )

    actions = plan.get("actions", [])
    country_actions = [a for a in actions if a["entity_type"] == "country"]
    region_actions = [a for a in actions if a["entity_type"] == "region"]
    city_actions = [a for a in actions if a["entity_type"] == "city"]

    if len(country_actions) != 1:
        raise DryRunVerificationError(
            f"Plan country actions mismatch: {len(country_actions)} != 1"
        )
    if len(region_actions) != EXPECTED_REGION_COUNT:
        raise DryRunVerificationError(
            f"Plan region actions mismatch: {len(region_actions)} != {EXPECTED_REGION_COUNT}"
        )
    if len(city_actions) != EXPECTED_CITY_COUNT:
        raise DryRunVerificationError(
            f"Plan city actions mismatch: {len(city_actions)} != {EXPECTED_CITY_COUNT}"
        )

    # Verify no UPDATE/DELETE/UPSERT operations
    actual_ops = set(a.get("operation") for a in actions)
    forbidden_ops = {"UPDATE", "DELETE", "UPSERT"}
    if actual_ops & forbidden_ops:
        raise SafetyGateError(
            f"Forbidden operations in plan: {actual_ops & forbidden_ops}"
        )

    # Verify all operations are INSERT or NOOP
    allowed_ops = {"INSERT", "NOOP"}
    if not actual_ops.issubset(allowed_ops):
        raise SafetyGateError(
            f"Unexpected operations in plan: {actual_ops - allowed_ops}"
        )

    # Verify all cities are in approved list
    city_names = set(a.get("planned_values", {}).get("short_name", "") for a in city_actions)
    approved_set = set(APPROVED_CITY_NAMES)
    if city_names != approved_set:
        extra = city_names - approved_set
        missing = approved_set - city_names
        raise SafetyGateError(
            f"City set mismatch. Extra: {extra}, Missing: {missing}"
        )


def generate_uuid(candidate_key: str) -> str:
    """Generate a deterministic UUID from a candidate key."""
    h = hashlib.sha256(f"au-geography-{candidate_key}".encode()).hexdigest()[:32]
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def preflight_readonly(database_url: str) -> dict[str, Any]:
    """Run read-only preflight queries before apply."""
    results = {}

    rows = _psql_query(database_url, "SELECT COUNT(*) AS cnt FROM core.countries WHERE code = 'AU';")
    results["au_country_count"] = int(rows[0]["cnt"]) if rows else 0

    rows = _psql_query(database_url, """
        SELECT geography_type, COUNT(*) AS cnt
        FROM core.geographies
        WHERE country_code = 'AU'
        GROUP BY geography_type;
    """)
    counts = {r["geography_type"]: int(r["cnt"]) for r in rows}
    results["au_region_count"] = counts.get("region", 0) + counts.get("state", 0) + counts.get("province", 0)
    results["au_city_count"] = counts.get("city", 0)

    rows = _psql_query(database_url, "SELECT COUNT(*) AS cnt FROM core.countries WHERE code IN ('UK', 'GB');")
    results["uk_gb_country_count"] = int(rows[0]["cnt"]) if rows else 0

    rows = _psql_query(database_url, "SELECT COUNT(*) AS cnt FROM core.geographies WHERE country_code IN ('UK', 'GB');")
    results["uk_gb_geography_count"] = int(rows[0]["cnt"]) if rows else 0

    return results


def _psql_query(database_url: str, sql: str) -> list[dict[str, Any]]:
    """Execute a read-only SQL query via psql and return rows as list of dicts."""
    # Wrap in read-only transaction
    wrapped = f"BEGIN TRANSACTION READ ONLY;\n{sql}\nCOMMIT;"
    cmd = ["psql", database_url, "-A", "-F", "\t", "-c", wrapped]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise TransactionError(f"psql query failed: {result.stderr.strip()}")
    stdout = result.stdout.strip()
    if not stdout:
        return []
    lines = stdout.split("\n")
    data_lines = [
        l for l in lines
        if l.strip() not in ("BEGIN", "COMMIT", "ROLLBACK")
        and not l.strip().startswith("(")
        and l.strip() != ""
    ]
    if not data_lines:
        return []
    cols = [c.strip() for c in data_lines[0].split("\t")]
    rows = []
    for line in data_lines[1:]:
        vals = line.split("\t")
        rows.append(dict(zip(cols, vals)))
    return rows


def build_apply_sql(plan: dict[str, Any]) -> str:
    """Build the full transaction SQL for the apply operation."""
    actions = plan["actions"]

    country_actions = [a for a in actions if a["entity_type"] == "country"]
    region_actions = [a for a in actions if a["operation"] == "INSERT" and a["entity_type"] == "region"]
    city_actions = [a for a in actions if a["operation"] == "INSERT" and a["entity_type"] == "city"]

    noop_count = sum(1 for a in actions if a["operation"] == "NOOP")
    insert_count = sum(1 for a in actions if a["operation"] == "INSERT")

    if insert_count != EXPECTED_INSERT_COUNT:
        raise TransactionError(
            f"Insert count mismatch: {insert_count} != {EXPECTED_INSERT_COUNT}"
        )
    if noop_count != EXPECTED_NOOP_COUNT:
        raise TransactionError(
            f"Noop count mismatch: {noop_count} != {EXPECTED_NOOP_COUNT}"
        )

    sql_lines = []

    # Advisory lock (10942 = hex of "109B" without the 'B' = 0x10942... let's use a fixed number)
    sql_lines.append("SELECT pg_advisory_lock(10942);")

    # Pre-state verification
    sql_lines.append("""
DO $$
DECLARE
    au_country_cnt INTEGER;
    au_region_cnt INTEGER;
    uk_gb_country_cnt INTEGER;
BEGIN
    SELECT COUNT(*) INTO au_country_cnt FROM core.countries WHERE code = 'AU';
    IF au_country_cnt != 1 THEN
        RAISE EXCEPTION 'Pre-state check failed: expected 1 AU country row, found %', au_country_cnt;
    END IF;
    SELECT COUNT(*) INTO au_region_cnt
    FROM core.geographies
    WHERE country_code = 'AU' AND geography_type = 'region';
    IF au_region_cnt != 0 THEN
        RAISE EXCEPTION 'Pre-state check failed: expected 0 AU region rows, found %', au_region_cnt;
    END IF;
    SELECT COUNT(*) INTO uk_gb_country_cnt FROM core.countries WHERE code IN ('UK', 'GB');
END $$;
""")

    # Generate region UUIDs and build INSERT statements
    region_uuid_map = {}
    for action in region_actions:
        candidate_key = action["candidate_key"]
        region_uuid = generate_uuid(candidate_key)
        region_uuid_map[candidate_key] = region_uuid

        pv = action["planned_values"]
        metadata_json = json.dumps(pv.get("metadata", {}))
        lat = pv.get("latitude")
        lng = pv.get("longitude")

        # Regions are top-level geographies — parent_id is NULL (country linkage
        # is via country_code FK to core.countries)
        sql_lines.append(f"""
INSERT INTO core.geographies (
    id, country_code, geography_type, code, name,
    region_code, latitude, longitude,
    parent_id, metadata, created_at, updated_at
) VALUES (
    '{region_uuid}'::uuid,
    '{pv["country_code"]}',
    '{pv["geography_type"]}',
    {f"'{pv['code']}'" if pv.get("code") else "NULL"},
    '{pv["name"]}',
    {f"'{pv['region_code']}'" if pv.get("region_code") else "NULL"},
    {f"{lat}" if lat is not None else "NULL"},
    {f"{lng}" if lng is not None else "NULL"},
    NULL,
    '{metadata_json}'::jsonb,
    NOW(),
    NOW()
);
""")

    # Build city INSERT statements
    for action in city_actions:
        candidate_key = action["candidate_key"]
        city_uuid = generate_uuid(candidate_key)

        pv = action["planned_values"]
        parent_key = action.get("parent_reference", {}).get("candidate_key")
        parent_id_sql = "NULL"
        if parent_key and parent_key in region_uuid_map:
            parent_id_sql = f"'{region_uuid_map[parent_key]}'::uuid"

        metadata_json = json.dumps(pv.get("metadata", {}))
        lat = pv.get("latitude")
        lng = pv.get("longitude")

        sql_lines.append(f"""
INSERT INTO core.geographies (
    id, country_code, geography_type, code, name,
    region_code, latitude, longitude,
    parent_id, metadata, created_at, updated_at
) VALUES (
    '{city_uuid}'::uuid,
    '{pv["country_code"]}',
    '{pv["geography_type"]}',
    {f"'{pv['code']}'" if pv.get("code") else "NULL"},
    '{pv["name"]}',
    {f"'{pv['region_code']}'" if pv.get("region_code") else "NULL"},
    {f"{lat}" if lat is not None else "NULL"},
    {f"{lng}" if lng is not None else "NULL"},
    {parent_id_sql},
    '{metadata_json}'::jsonb,
    NOW(),
    NOW()
);
""")

    # Post-insert verification
    sql_lines.append("""
DO $$
DECLARE
    region_inserted INTEGER;
    city_inserted INTEGER;
    au_country_cnt INTEGER;
    orphan_count INTEGER;
    dup_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO region_inserted
    FROM core.geographies
    WHERE country_code = 'AU' AND geography_type = 'region';

    IF region_inserted != 9 THEN
        RAISE EXCEPTION 'Post-state check failed: expected 9 AU regions, found %', region_inserted;
    END IF;

    SELECT COUNT(*) INTO city_inserted
    FROM core.geographies
    WHERE country_code = 'AU' AND geography_type = 'city';

    IF city_inserted != 51 THEN
        RAISE EXCEPTION 'Post-state check failed: expected 51 AU cities (19 pre-existing + 32 new), found %', city_inserted;
    END IF;

    SELECT COUNT(*) INTO au_country_cnt FROM core.countries WHERE code = 'AU';
    IF au_country_cnt != 1 THEN
        RAISE EXCEPTION 'Post-state check failed: expected 1 AU country in core.countries, found %', au_country_cnt;
    END IF;

    -- Check for orphaned cities (cities without parent region)
    SELECT COUNT(*) INTO orphan_count
    FROM core.geographies g
    WHERE g.country_code = 'AU'
      AND g.geography_type = 'city'
      AND g.parent_id IS NOT NULL
      AND NOT EXISTS (
          SELECT 1 FROM core.geographies p
          WHERE p.id = g.parent_id AND p.geography_type = 'region'
      );

    IF orphan_count > 0 THEN
        RAISE EXCEPTION 'Orphan city check failed: % cities without valid parent region', orphan_count;
    END IF;

    -- Check for duplicate canonical identity
    SELECT COUNT(*) INTO dup_count
    FROM (
        SELECT country_code, geography_type, code, COUNT(*) as cnt
        FROM core.geographies
        WHERE country_code = 'AU'
        GROUP BY country_code, geography_type, code
        HAVING COUNT(*) > 1
    ) dups;

    IF dup_count > 0 THEN
        RAISE EXCEPTION 'Duplicate canonical identity check failed: % duplicate groups', dup_count;
    END IF;
END $$;
""")

    # The transaction will be committed by the caller
    return "\n".join(sql_lines)


def apply_to_production(plan: dict[str, Any], database_url: str) -> dict[str, Any]:
    """Execute the full apply transaction."""
    sql = build_apply_sql(plan)

    # Write SQL to temp file and execute via psql
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False) as f:
        f.write("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n")
        f.write(sql)
        f.write("\nCOMMIT;\n")
        temp_sql_path = f.name

    try:
        cmd = ["psql", database_url, "-f", temp_sql_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            raise TransactionError(f"psql apply failed: {result.stderr.strip()}")

        return {
            "success": True,
            "stdout": result.stdout[:500],
            "stderr": result.stderr[:500],
        }
    finally:
        os.unlink(temp_sql_path)


def post_commit_verification(database_url: str) -> dict[str, Any]:
    """Run read-only verification after COMMIT."""
    results = {}

    # Count AU country
    rows = _psql_query(database_url, "SELECT COUNT(*) AS cnt FROM core.countries WHERE code = 'AU';")
    results["au_country_count"] = int(rows[0]["cnt"]) if rows else 0

    # Count AU regions
    rows = _psql_query(database_url, """
        SELECT COUNT(*) AS cnt FROM core.geographies
        WHERE country_code = 'AU' AND geography_type = 'region';
    """)
    results["au_region_count"] = int(rows[0]["cnt"]) if rows else 0

    results["au_region_count"] = int(rows[0]["cnt"]) if rows else 0

    # Count AU cities (pre-existing 19 + 32 new = 51)
    rows = _psql_query(database_url, """
        SELECT COUNT(*) AS cnt FROM core.geographies
        WHERE country_code = 'AU' AND geography_type = 'city';
    """)
    results["au_city_count"] = int(rows[0]["cnt"]) if rows else 0

    # Verify exactly 51 cities (19 pre-existing + 32 approved)
    if results["au_city_count"] != 51:
        raise TransactionError(
            f"Post-state: AU city count should be 51, got {results['au_city_count']}"
        )

    # Verify no orphans
    rows = _psql_query(database_url, """
        SELECT COUNT(*) AS cnt
        FROM core.geographies g
        WHERE g.country_code = 'AU'
          AND g.geography_type = 'city'
          AND g.parent_id IS NOT NULL
          AND NOT EXISTS (
              SELECT 1 FROM core.geographies p
              WHERE p.id = g.parent_id AND p.geography_type = 'region'
          );
    """)
    results["orphan_count"] = int(rows[0]["cnt"]) if rows else 0

    # Verify no duplicates
    rows = _psql_query(database_url, """
        SELECT COUNT(*) AS cnt
        FROM (
            SELECT country_code, geography_type, code, COUNT(*) as cnt
            FROM core.geographies
            WHERE country_code = 'AU'
            GROUP BY country_code, geography_type, code
            HAVING COUNT(*) > 1
        ) dups;
    """)
    results["duplicate_count"] = int(rows[0]["cnt"]) if rows else 0

    # UK/GB unchanged
    rows = _psql_query(database_url, "SELECT COUNT(*) AS cnt FROM core.countries WHERE code IN ('UK', 'GB');")
    results["uk_gb_country_count"] = int(rows[0]["cnt"]) if rows else 0

    rows = _psql_query(database_url, "SELECT COUNT(*) AS cnt FROM core.geographies WHERE country_code IN ('UK', 'GB');")
    results["uk_gb_geography_count"] = int(rows[0]["cnt"]) if rows else 0

    # Verify approved cities exist with normalized names
    approved_check = []
    for city in APPROVED_CITY_NAMES:
        rows = _psql_query(database_url, f"""
            SELECT COUNT(*) AS cnt
            FROM core.geographies
            WHERE country_code = 'AU' AND geography_type = 'city' AND name = '{city}';
        """)
        cnt = int(rows[0]["cnt"]) if rows else 0
        approved_check.append({"city": city, "found": cnt > 0, "count": cnt})

    results["approved_city_verification"] = approved_check

    return results


def run_apply(plan_path: str, expected_sha: str, expected_checksum: str, confirm: str, country: str) -> dict[str, Any]:
    """Run the full 10.9B apply workflow."""
    if country != "AU":
        raise SafetyGateError(f"Country '{country}' is not supported. Only AU is accepted.")

    if confirm != "APPLY_AU_GEOGRAPHY_42":
        raise SafetyGateError(
            f"Invalid confirmation token. Expected 'APPLY_AU_GEOGRAPHY_42'"
        )

    plan_file = Path(plan_path)

    # 1. Verify plan fingerprint
    plan = verify_plan_fingerprint(plan_file)

    # 2. Verify expected SHA and checksum explicitly
    actual_sha = sha256_file(plan_file)
    if actual_sha != expected_sha:
        raise DryRunVerificationError(
            f"SHA mismatch: {actual_sha} != {expected_sha}"
        )
    if plan.get("plan_checksum") != expected_checksum:
        raise DryRunVerificationError(
            f"Checksum mismatch: {plan.get('plan_checksum')} != {expected_checksum}"
        )

    # 3. Verify plan content
    verify_plan_content(plan)

    # 4. Load DB URL
    database_url = load_db_url()
    if not database_url:
        raise SafetyGateError("SUPABASE_DB_URL not found — cannot apply without production DB")

    # 5. Run preflight (read-only)
    pre_state = preflight_readonly(database_url)

    # Verify pre-state
    if pre_state["au_country_count"] != 1:
        raise TransactionError(
            f"Preflight: AU country count should be 1, got {pre_state['au_country_count']}"
        )
    if pre_state["au_region_count"] != 0:
        raise TransactionError(
            f"Preflight: AU region count should be 0, got {pre_state['au_region_count']}"
        )

    # 6. Execute apply transaction
    pre_other_country = {
        "country_count": pre_state["uk_gb_country_count"],
        "geography_count": pre_state["uk_gb_geography_count"],
    }

    apply_result = apply_to_production(plan, database_url)

    # 7. Post-commit verification
    post_state = post_commit_verification(database_url)

    # Verify post-state matches expectations
    post_other_country = {
        "country_count": post_state["uk_gb_country_count"],
        "geography_count": post_state["uk_gb_geography_count"],
    }

    verification_passed = (
        post_state["au_country_count"] == 1 and
        post_state["au_region_count"] == 9 and
        post_state["au_city_count"] == 51 and
        post_state["orphan_count"] == 0 and
        post_state["duplicate_count"] == 0 and
        pre_other_country == post_other_country and
        all(c["found"] for c in post_state["approved_city_verification"])
    )

    return {
        "status": "applied" if verification_passed else "applied_with_verification_failure",
        "preflight": pre_state,
        "apply_result": apply_result,
        "post_state": post_state,
        "verification_passed": verification_passed,
    }
