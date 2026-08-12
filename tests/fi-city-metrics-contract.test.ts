import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811023616_publish_fi_tier_a_city_metrics_v1.sql",
  "utf8",
)

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Finland city metrics publish exactly five required families per Tier A city", () => {
  for (const key of metricKeys) assert.ok(migration.includes(`'${key}'`), `missing ${key}`)
  assert.match(migration, /n<>40/)
  assert.match(migration, /count\(r\.metric_key\)<>5/)
})

test("Finland city metrics preserve national and source-native semantics", () => {
  assert.match(migration, /'low',900,'high',1200/)
  assert.match(migration, /'city_specific',false/)
  assert.match(migration, /'hours_normal_period',30/)
  assert.match(migration, /'national_rule',true/)
  assert.match(migration, /'source_native_period',true/)
  assert.match(migration, /'turku',1\.90,'2_hours'/)
  assert.match(migration, /'not_shortage_ranking',true/)
})
