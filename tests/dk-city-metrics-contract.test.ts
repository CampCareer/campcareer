import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810202207_publish_dk_tier_a_city_metrics_v1.sql", "utf8")
const keys = ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]

test("Denmark Phase 4 contains exactly the shared five metric contracts", () => {
  for (const key of keys) assert.ok(migration.includes(`'${key}'`))
  assert.ok(migration.includes("n<>25"))
  assert.ok(migration.includes("count(r.metric_key)<>5"))
})

test("population is municipality scoped and uses 2026 Q3 values", () => {
  for (const value of ["670389", "105947", "213140", "378270", "226404"]) assert.ok(migration.includes(value))
  assert.ok(migration.includes("dst_municipality"))
  assert.ok(migration.includes("2026Q3"))
  assert.ok(migration.includes("2026-07-01"))
})

test("living cost remains an explicit national baseline rather than false city precision", () => {
  assert.ok(migration.includes("'low',8450"))
  assert.ok(migration.includes("'high',13700"))
  assert.ok(migration.includes("'currency','DKK'"))
  assert.ok(migration.includes("'reference_scope','national_baseline'"))
  assert.ok(migration.includes("'city_specific',false"))
})

test("transport remains source-native and general rather than a universal student concession", () => {
  assert.ok(migration.includes("'source_native_period',true"))
  assert.ok(migration.includes("'student_specific',false"))
  for (const amount of ["24::numeric", "28", "26"]) assert.ok(migration.includes(amount))
})

test("student work rights preserve the official monthly unit", () => {
  assert.ok(migration.includes("'hours_normal_period',90"))
  assert.ok(migration.includes("'period','month'"))
  assert.ok(migration.includes("'June','July','August'"))
  assert.ok(migration.includes("do not convert the monthly cap to a weekly entitlement"))
})

test("employment sectors are contextual and not shortage rankings", () => {
  assert.ok(migration.includes("'not_shortage_ranking',true"))
  assert.ok(migration.includes("Business Strategy 2024-2027"))
  assert.ok(migration.includes("Invest in Odense focus areas"))
  assert.ok(migration.includes("City Brand Aarhus economic strengths"))
  assert.ok(migration.includes("Business Strategy 2023-2026"))
})