import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260809094322_publish_ie_tier_a_city_metrics_v1.sql"),
  "utf8",
)

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

const tierA = ["dublin", "cork", "galway", "limerick"] as const

test("IE Phase 4 publishes exactly five verified metrics for four Tier A cities", () => {
  for (const key of metricKeys) assert.match(migration, new RegExp(`'${key}'`))
  for (const slug of tierA) assert.match(migration, new RegExp(`'${slug}'`))
  assert.match(migration, /review_status='verified'/)
  assert.match(migration, /if n<>20/)
})

test("population evidence respects the approved geography scopes", () => {
  assert.match(migration, /'dublin',1458154/)
  assert.match(migration, /Dublin four local-authority areas/)
  assert.match(migration, /'cork',222335/)
  assert.match(migration, /'galway',85856/)
  assert.match(migration, /'limerick',103611/)
  assert.match(migration, /city and suburbs/)
})

test("living-cost evidence is explicitly indicative and source-specific", () => {
  assert.match(migration, /'dublin',2318/)
  assert.match(migration, /'cork',1181,2923/)
  assert.match(migration, /'galway',1628,2128/)
  assert.match(migration, /'limerick',1547\.33,1547\.33/)
  assert.match(migration, /'indicative',true/)
  assert.match(migration, /'calculated'/)
})

test("transport stays in source-native fare units", () => {
  assert.match(migration, /'dublin',1\.00::numeric,'90_minutes'/)
  assert.match(migration, /'cork',0\.85,'single_journey'/)
  assert.match(migration, /'galway',0\.65,'single_journey'/)
  assert.match(migration, /'limerick',0\.65,'single_journey'/)
  assert.match(migration, /'source_native_period',true/)
  assert.doesNotMatch(migration, /monthly_equivalent/)
})

test("Stamp 2 work rights are conditional national evidence", () => {
  assert.match(migration, /"hours_term_time":20/)
  assert.match(migration, /"hours_designated_holidays":40/)
  assert.match(migration, /"context":"stamp_2_student_permission"/)
  assert.match(migration, /"eligibility_conditions_apply":true/)
  assert.match(migration, /"national_rule":true/)
})

test("employment sectors are context, not shortage rankings", () => {
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /Technology/)
  assert.match(migration, /Life sciences/)
  assert.match(migration, /MedTech/)
  assert.match(migration, /Advanced manufacturing/)
})
