import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260810164813_publish_nl_tier_a_city_metrics_v1.sql"),
  "utf8",
)

const tierA = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"] as const
const metrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

test("Netherlands Phase 4 publishes exactly the five required metrics for Tier A", () => {
  for (const slug of tierA) assert.match(migration, new RegExp(`'${slug}'`))
  for (const metric of metrics) assert.match(migration, new RegExp(`'${metric}'`))
  assert.match(migration, /total_n<>25/)
  assert.match(migration, /count\(r\.metric_key\)<>5/)
})

test("population evidence uses the Phase 2 CBS municipality contract", () => {
  assert.match(migration, /'cbs_municipality'/)
  assert.match(migration, /'GM0363'/)
  assert.match(migration, /'GM0935'/)
  assert.match(migration, /'GM0599'/)
  assert.match(migration, /'GM0014'/)
  assert.match(migration, /'GM0772'/)
  assert.match(migration, /'2026-01-01'/)
})

test("living-cost evidence preserves source semantics and labels Eindhoven as a national baseline", () => {
  assert.match(migration, /city_university_reference/)
  assert.match(migration, /city_university_budget_proxy/)
  assert.match(migration, /national_baseline/)
  assert.match(migration, /reference_scope/)
  assert.match(migration, /city_specific/)
})

test("transport references remain source-native instead of fabricated monthly equivalents", () => {
  assert.match(migration, /source_native_period/)
  assert.match(migration, /gvb_1_hour/)
  assert.match(migration, /arriva_limburg_offpeak/)
  assert.match(migration, /ret_2_hour/)
  assert.match(migration, /arriva_noord_offpeak/)
  assert.match(migration, /bravo_single_ride/)
})

test("student work context preserves the national 16-hour/TWV rule and summer alternative", () => {
  assert.match(migration, /'hours_term_time',16/)
  assert.match(migration, /employer_work_permit_required/)
  assert.match(migration, /choice_required/)
  assert.match(migration, /'June','July','August'/)
  assert.match(migration, /self_employment_rule_separate/)
})

test("employment sectors are context rather than shortage rankings", () => {
  assert.match(migration, /not_shortage_ranking/)
  assert.match(migration, /Municipal economy and sector datasets/)
  assert.match(migration, /Municipal Economic Vision 2040/)
  assert.match(migration, /Municipal 2026 economic-development focus/)
  assert.match(migration, /Municipal economic profile and knowledge ecosystem/)
  assert.match(migration, /Municipal Brainport knowledge and manufacturing context/)
})
