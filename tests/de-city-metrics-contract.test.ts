import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260810170732_publish_de_tier_a_city_metrics_v1.sql"),
  "utf8",
)

const cities = [
  "berlin", "munich", "hamburg", "aachen", "bonn",
  "dresden", "heidelberg", "karlsruhe", "tuebingen",
] as const

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

test("Germany Phase 4 is bounded to nine Tier A cities and five decision metrics", () => {
  for (const city of cities) assert.match(migration, new RegExp(`'${city}'`))
  for (const key of metricKeys) assert.ok(migration.includes(`'${key}'`))
  assert.match(migration, /total_n<>45/)
  assert.match(migration, /count\(r\.metric_key\)<>5/)
})

test("Germany population metrics preserve the municipality and AGS contract", () => {
  assert.match(migration, /destatis_gvisys_municipality/)
  assert.match(migration, /'11000000'/)
  assert.match(migration, /'09162000'/)
  assert.match(migration, /'02000000'/)
  assert.match(migration, /'05334002'/)
  assert.match(migration, /'05314000'/)
  assert.match(migration, /'14612000'/)
  assert.match(migration, /'08221000'/)
  assert.match(migration, /'08212000'/)
  assert.match(migration, /'08416041'/)
  assert.match(migration, /'reference_date','2024-12-31'/)
  assert.match(migration, /official_municipality_code_ags/)
})

test("student living costs remain indicative and source-native", () => {
  assert.match(migration, /methodology_varies_by_city',true/)
  assert.match(migration, /'berlin',900::numeric,1150::numeric/)
  assert.match(migration, /'munich',1500,1500/)
  assert.match(migration, /'hamburg',1000,1600/)
  assert.match(migration, /'dresden',750,900/)
  assert.match(migration, /'heidelberg',895,2013/)
  assert.match(migration, /'karlsruhe',800,900/)
  assert.match(migration, /germany_average_local_guidance/)
  assert.match(migration, /t\.slug='tuebingen' then 'low'/)
})

test("2026/27 transport references preserve eligibility and source periods", () => {
  assert.match(migration, /'berlin',226\.80/)
  assert.match(migration, /'hamburg',226\.80/)
  assert.match(migration, /'aachen',226\.80/)
  assert.match(migration, /'bonn',226\.80/)
  assert.match(migration, /'dresden',226\.80/)
  assert.match(migration, /'munich',43/)
  assert.match(migration, /'karlsruhe',45/)
  assert.match(migration, /'tuebingen',45/)
  assert.match(migration, /public_transport_budget_range/)
  assert.match(migration, /eligibility_or_enrolment_conditions_apply',true/)
  assert.match(migration, /source_native_period',true/)
})

test("international student work rights are a shared Germany rule", () => {
  assert.match(migration, /'hours_term_time',20/)
  assert.match(migration, /'full_days_per_year',140/)
  assert.match(migration, /'half_days_per_year',280/)
  assert.match(migration, /'full_time_during_semester_breaks',true/)
  assert.match(migration, /'student_auxiliary_task_exception',true/)
  assert.match(migration, /'national_rule',true/)
  assert.match(migration, /make-it-in-germany\.com/)
})

test("employment sectors are context rather than shortage or job guarantees", () => {
  assert.match(migration, /'not_shortage_ranking',true/)
  assert.match(migration, /'not_job_guarantee',true/)
  assert.match(migration, /Microelectronics and semiconductors/)
  assert.match(migration, /Medical technology/)
  assert.match(migration, /Information and communication technology/)
})

test("Phase 4 cannot silently promote city programme delivery", () => {
  assert.match(migration, /public\.city_programme_directory_de_v1/)
  assert.match(migration, /programme_n<>0/)
  assert.match(migration, /must not infer programme delivery/)
})
