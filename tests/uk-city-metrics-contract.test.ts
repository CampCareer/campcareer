import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260808211719_publish_uk_tier_a_city_metrics_v1.sql"),
  "utf8",
)

const tierASlugs = [
  "london",
  "manchester",
  "birmingham",
  "edinburgh",
  "glasgow",
  "cardiff",
  "belfast",
  "oxford",
  "cambridge",
  "bristol",
] as const

const requiredMetricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

test("UK Phase 4 is bounded to the ten approved Tier A cities and five metric keys", () => {
  for (const slug of tierASlugs) assert.match(migration, new RegExp(`'${slug}'`))
  for (const metricKey of requiredMetricKeys) assert.match(migration, new RegExp(`'${metricKey}'`))

  assert.match(migration, /expected exactly 10 cities/)
  assert.match(migration, /expected exactly 50 metric rows/)
  assert.match(migration, /exactly five verified core metrics/)
  assert.match(migration, /review_status='verified'/)
})

test("population follows the Phase 2 city boundary contract", () => {
  assert.match(migration, /9089736/)
  assert.match(migration, /sum_33_greater_london_local_authorities/)
  assert.match(migration, /Manchester local authority/)
  assert.match(migration, /City of Edinburgh council area/)
  assert.match(migration, /Belfast local government district/)
  assert.match(migration, /Bristol, City of local authority/)
  assert.match(migration, /2024-06-30/)
  assert.match(migration, /Office for National Statistics/)
})

test("living-cost evidence remains indicative and source-specific", () => {
  assert.match(migration, /student_living_cost_monthly_range/)
  assert.match(migration, /'GBP'/)
  assert.match(migration, /'month'/)
  assert.match(migration, /'indicative',true/)
  assert.match(migration, /1812\.67/)
  assert.match(migration, /1484,1503/)
  assert.match(migration, /1405,2105/)
  assert.match(migration, /1125\.91,1304\.80/)
  assert.match(migration, /reference_academic_year/)
})

test("transport keeps the official source-native ticket period", () => {
  assert.match(migration, /tfl_18plus_student_oyster_zones_1_2_travelcard/)
  assert.match(migration, /bee_network_28_day_anybus_young_person_student/)
  assert.match(migration, /lothian_student_ridacard_4_week/)
  assert.match(migration, /translink_ylink_metro_glider_day_ticket/)
  assert.match(migration, /cpca_tiger_pass_under_25_bus_fare/)
  assert.match(migration, /student_specific_discount/)
})

test("Student visa work rule is national, conditional and degree-level specific", () => {
  assert.match(migration, /"hours":20/)
  assert.match(migration, /week_during_term_time/)
  assert.match(migration, /full_time_degree_level_or_above_at_compliant_higher_education_provider/)
  assert.match(migration, /"full_time_outside_term":true/)
  assert.match(migration, /"eligibility_conditions_apply":true/)
  assert.match(migration, /Below-degree, part-time and other study categories can have different or no work permission/)
  assert.match(migration, /Immigration Rules Appendix Student/)
})

test("employment context records regional evidence explicitly where city-only evidence is unsuitable", () => {
  assert.match(migration, /Greater Manchester frontier sectors; regional career context for Manchester city/)
  assert.match(migration, /Cardiff Capital Region priority-growth context for Cardiff/)
  assert.match(migration, /regional career context for Cambridge/)
  assert.match(migration, /City of Edinburgh Economic Needs Study key sectors/)
})
