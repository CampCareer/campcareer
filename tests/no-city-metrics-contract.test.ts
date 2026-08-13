import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811125500_publish_no_tier_a_city_metrics_v1.sql",
  "utf8",
)

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Norway Phase 4 publishes exactly five metrics for five cities", () => {
  for (const key of metricKeys) assert.ok(migration.includes(`'${key}'`), `missing ${key}`)
  assert.match(migration, /Tier A metrics expected 25/)
  assert.match(migration, /exactly five verified metrics/)
})

test("Norway Phase 4 preserves national-vs-city metric semantics", () => {
  assert.match(migration, /'city_specific',false/)
  assert.match(migration, /'national_rule',true/)
  assert.match(migration, /not a city differentiator/)
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /v\(slug,amount,period,kind,student_specific,note,source,url\)/)
  assert.match(migration, /\('tromso',265,'30_days'.*false/)
})

test("Norway Phase 4 carries current 2026 student references", () => {
  assert.match(migration, /'low',15488,'high',15488/)
  assert.match(migration, /'hours_normal_period',20/)
  assert.match(migration, /'oslo',393/)
  assert.match(migration, /'trondheim',425/)
  assert.match(migration, /'stavanger',396/)
  assert.match(migration, /'as',551/)
  assert.match(migration, /'tromso',265/)
})
