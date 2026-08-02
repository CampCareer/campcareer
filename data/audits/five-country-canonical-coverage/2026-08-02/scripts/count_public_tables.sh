#!/usr/bin/env bash
# Read-only Supabase REST count audit for the public schema (2026-08-02).
# Uses the service-role key strictly for SELECT/count via PostgREST.
# Output: TSV rows of table, count, http_status
set -euo pipefail

SR=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' .env.local | cut -d= -f2- | tr -d '"')
URL=$(grep '^NEXT_PUBLIC_SUPABASE_URL=' .env.local | cut -d= -f2- | tr -d '"')

OUT="data/audits/five-country-canonical-coverage/2026-08-02/public_schema_counts.tsv"
: > "$OUT"

python3 - "$SR" "$URL" "$OUT" <<'PY'
import json, subprocess, sys
sr, url, out = sys.argv[1], sys.argv[2], sys.argv[3]
openapi = json.load(open("/tmp/cc_openapi.json"))
paths = [p for p in openapi.get("paths", {}) if p.startswith("/") and not p.startswith("/rpc/")]
lines = []
for p in sorted(paths):
    table = p.lstrip("/")
    if not table:
        continue
    # Try id column first, fallback to * projection.
    proj = "id"
    r = subprocess.run(
        ["curl", "-s", "-m", "40", "-D", "-", "-o", "/dev/null",
         "-H", f"apikey: {sr}", "-H", f"Authorization: Bearer {sr}",
         "-H", "Prefer: count=exact", "-H", "Range: 0-0",
         f"{url}/rest/v1/{table}?select={proj}"],
        capture_output=True, text=True)
    headers = r.stdout
    cr = [ln for ln in headers.splitlines() if ln.lower().startswith("content-range:")]
    if not cr:
        r = subprocess.run(
            ["curl", "-s", "-m", "40", "-D", "-", "-o", "/dev/null",
             "-H", f"apikey: {sr}", "-H", f"Authorization: Bearer {sr}",
             "-H", "Prefer: count=exact", "-H", "Range: 0-0",
             f"{url}/rest/v1/{table}?select=*"],
            capture_output=True, text=True)
        headers = r.stdout
        cr = [ln for ln in headers.splitlines() if ln.lower().startswith("content-range:")]
    count = cr[0].split()[-1].split("/")[-1] if cr else "?"
    http = headers.splitlines()[0].split()[-1] if headers.splitlines() else "?"
    lines.append(f"{table}\t{count}\t{http}")
open(out, "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
PY
