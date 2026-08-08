import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260808185727_publish_us_tier_a_city_metrics_v1.sql",
  "utf8",
)

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("publishes the five-metric contract for US Tier A cities", () => {
  for (const key of metricKeys) assert.ok(migration.includes(`'${key}'`))
  assert.ok(migration.includes("expected 40 rows"))
  assert.ok(migration.includes("count(e.id) <> 5"))
})

test("keeps F-1 work rights qualified", () => {
  assert.ok(migration.includes('"hours":20'))
  assert.ok(migration.includes('"work_context":"f1_on_campus"'))
  assert.ok(migration.includes('"off_campus_requires_separate_authorization":true'))
  assert.ok(migration.includes("https://www.ice.gov/sevis/employment"))
})

test("keeps living costs indicative and evidence-backed", () => {
  assert.ok(migration.includes('"indicative":true'))
  assert.ok(migration.includes("'calculated'"))
  assert.ok(migration.includes("'verified'"))
})
