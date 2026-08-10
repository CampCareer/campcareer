import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260810220332_publish_se_tier_a_city_metrics_v1.sql",
  "utf8",
)

const keys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Sweden publishes exactly the five city metric families", () => {
  for (const key of keys) assert.ok(migration.includes(key), `missing ${key}`)
  assert.match(migration, /n<>30/)
  assert.match(migration, /count\(r\.metric_key\)<>5/)
})

test("Sweden national student references are not presented as city rankings", () => {
  assert.match(migration, /'city_specific',false/)
  assert.match(migration, /'hours_normal_period',15/)
  assert.match(migration, /'2026-06-11'/)
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /'source_native_period',true/)
})
