import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811211725_publish_kr_tier_a_city_metrics_v1.sql",
  "utf8",
)

test("Korea Phase 4 publishes exactly five metric families for six cities", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(migration.includes(key), `missing ${key}`)
  assert.match(migration, /expected 30 verified metric rows/)
  assert.match(migration, /Every KR Tier A city must have exactly five metrics/)
})

test("Korea living cost, transport and work metrics preserve methodology", () => {
  assert.match(migration, /national_student_living_cost_planning_range/)
  assert.match(migration, /'city_specific',false/)
  assert.match(migration, /'ranking_safe',false/)
  assert.match(migration, /'source_native_period',true/)
  assert.match(migration, /'national_rule',true/)
  assert.match(migration, /'conditional_permission_required',true/)
})

test("Korea employment context is not a shortage ranking or job guarantee", () => {
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /'not_job_guarantee',true/)
  assert.match(migration, /city_metric_directory_kr_v1 with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.city_metric_directory_kr_v1 from public,anon,authenticated/)
})
