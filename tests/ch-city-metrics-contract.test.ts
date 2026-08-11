import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260811153800_publish_ch_tier_a_city_metrics_v1.sql", "utf8")

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

test("Switzerland Phase 4 publishes exactly five required metric families per city", () => {
  for (const key of metricKeys) assert.match(migration, new RegExp(key))
  assert.match(migration, /CH Tier A metrics expected 30/)
  assert.match(migration, /Each CH Tier A city must have exactly five verified metrics/)
})

test("Switzerland student work context is national and third-country specific", () => {
  assert.match(migration, /'hours_normal_period',15/)
  assert.match(migration, /'earliest_start_after_study_months',6/)
  assert.match(migration, /'city_specific',false/)
  assert.match(migration, /EU\/EFTA cases can differ/)
})

test("Switzerland source-native cost and transport semantics are preserved", () => {
  assert.match(migration, /'harmonised_index',false/)
  assert.match(migration, /'lugano',null,50,100,'month'/)
  assert.match(migration, /The range is preserved instead of inventing a midpoint/)
  assert.match(migration, /not_shortage_ranking/)
})

test("Deferred Switzerland cities cannot receive Phase 4 rows", () => {
  assert.match(migration, /'neuchatel','bern','st-gallen','lucerne'/)
  assert.match(migration, /Deferred Switzerland city received Phase 4 metrics/)
})
