import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const migration = readFileSync("supabase/migrations/20260813215516_api_request_rate_limit.sql", "utf8")
const limiter = readFileSync("src/lib/api-rate-limit.ts", "utf8")

test("public endpoint rate limits are atomic, short-lived and service-role-only", () => {
  assert.match(migration, /create table public\.api_request_rate_limits/i)
  assert.match(migration, /primary key \(endpoint, request_fingerprint, window_started\)/i)
  assert.match(migration, /alter table public\.api_request_rate_limits enable row level security/i)
  assert.match(migration, /revoke all on table public\.api_request_rate_limits from anon, authenticated/i)
  assert.match(migration, /security invoker/i)
  assert.match(migration, /on conflict \(endpoint, request_fingerprint, window_started\)/i)
  assert.match(migration, /where api_request_rate_limits\.request_count < p_limit/i)
  assert.match(migration, /interval '2 days'/i)
  assert.match(migration, /revoke all on function public\.enforce_api_rate_limit/i)
  assert.match(migration, /grant execute on function public\.enforce_api_rate_limit[\s\S]*?to service_role/i)
})

test("endpoint code fails closed when durable enforcement is unavailable", () => {
  assert.match(limiter, /status: 503/)
  assert.match(limiter, /supabaseAdmin\.rpc\("enforce_api_rate_limit"/)
  for (const route of [
    "src/app/api/career-path/route.ts",
    "src/app/api/feedback/route.ts",
    "src/app/api/feedback/screenshot-upload/route.ts",
    "src/app/api/reports/launch-interest/route.ts",
    "src/app/api/route-requests/route.ts",
    "src/app/api/v1/country-launch-requests/route.ts",
    "src/app/api/v1/decision-plans/save-intent/route.ts",
  ]) {
    assert.match(readFileSync(route, "utf8"), /enforceRateLimit/)
    assert.match(readFileSync(route, "utf8"), /hasSameOrigin/)
  }
})

test("public country-demand counts are edge-cacheable", () => {
  const route = readFileSync("src/app/api/v1/country-launch-requests/route.ts", "utf8")
  assert.match(route, /s-maxage=60/)
  assert.match(route, /stale-while-revalidate=300/)
})
