import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync("supabase/migrations/20260812002829_publish_jp_tier_a_city_metrics_v1.sql", "utf8")
const doc = fs.readFileSync("docs/data-foundation/jp-city-metrics-v1.md", "utf8")

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Japan Phase 4 publishes exactly five guarded metric families", () => {
  for (const key of metricKeys) assert.ok(migration.includes(`'${key}'`), `missing ${key}`)
  assert.match(migration, /JP Phase 4 expected 35 verified metric rows/)
  assert.match(migration, /Every JP Tier A city must have exactly five metrics/)
})

test("Japan metrics preserve non-comparable national and source-native semantics", () => {
  assert.match(migration, /'city_specific',false/)
  assert.match(migration, /'ranking_safe',false/)
  assert.match(migration, /'source_native_period',true/)
  assert.match(migration, /'permission_required',true/)
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /'not_job_guarantee',true/)
  assert.match(doc, /no cheapest-city ordering is allowed/)
})

test("Japan metric read model is private", () => {
  assert.match(migration, /city_metric_directory_jp_v1 with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.city_metric_directory_jp_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_metric_directory_jp_v1 to service_role/)
})
