import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const baseMigration = readFileSync("supabase/migrations/20260812113315_career_data_foundation_us_carpenter.sql", "utf8")
const methodologyMigration = readFileSync("supabase/migrations/20260812153156_career_data_foundation_methodology_v1.sql", "utf8")
const migrations = `${baseMigration}\n${methodologyMigration}`
const readModel = readFileSync("src/lib/workspace/career-market-read.ts", "utf8")
const foundationRead = readFileSync("src/lib/career-data-foundation/read.ts", "utf8")

 test("foundation keeps raw, normalized, component and snapshot data in separate layers", () => {
  for (const table of [
    "career_raw_observations",
    "career_normalized_metrics",
    "career_score_components",
    "career_opportunity_score_snapshots",
  ]) {
    assert.match(migrations, new RegExp(`create table (if not exists )?public\\.${table}`))
  }
})

test("missing raw data is nullable with unavailable reason enforcement", () => {
  assert.match(baseMigration, /raw_value jsonb/)
  assert.match(baseMigration, /availability = 'unavailable' and raw_value is null/)
  assert.match(baseMigration, /btrim\(coalesce\(reason, ''\)\) <> ''/)
  assert.match(methodologyMigration, /'no_evidence_found'/)
})

test("proxy observations cannot omit their reason", () => {
  assert.match(baseMigration, /directness <> 'proxy' or btrim\(coalesce\(proxy_reason, ''\)\) <> ''/)
  assert.match(methodologyMigration, /CampCareer converts official typical-entry categories/)
})

test("score values and final score remain calculated rather than manually stored", () => {
  assert.match(baseMigration, /score_value numeric generated always as/)
  assert.match(baseMigration, /case when e\.score_ready then round\(e\.score_sum,2\) else null::numeric end as opportunity_score/)
  assert.doesNotMatch(migrations, /opportunity_score\s+numeric\s+not null/i)
  assert.match(methodologyMigration, /career-opportunity-v3-foundation/)
})

test("only US Carpenter is seeded into the foundation methodology update", () => {
  assert.match(methodologyMigration, /'US:carpenter:2026-08-12:v3'/)
  assert.doesNotMatch(methodologyMigration, /AU:registered-nurse/)
  assert.doesNotMatch(methodologyMigration, /AU:carpenter/)
})

test("canonical mapping remains exact SOC 47-2031 with exact O*NET companion mapping", () => {
  assert.match(baseMigration, /'SOC','2018','47-2031','Carpenters','exact','high'/)
  assert.match(baseMigration, /'O\*NET-SOC','2026','47-2031\.00','Carpenters','exact','high'/)
})

test("methodology v1 promotes relational lineage to source of truth", () => {
  for (const table of [
    "career_normalized_metric_inputs",
    "career_score_component_metric_inputs",
    "career_score_component_raw_inputs",
  ]) {
    assert.match(methodologyMigration, new RegExp(`create table if not exists public\\.${table}`))
  }
  assert.match(methodologyMigration, /input_role text not null/)
  assert.match(methodologyMigration, /references public\.career_raw_observations\(observation_key\)/)
  assert.match(methodologyMigration, /references public\.career_normalized_metrics\(normalized_metric_key\)/)
})

test("methodology stores evidence status so conservative zero is not confused with confirmed zero", () => {
  assert.match(methodologyMigration, /evidence_status text not null default 'direct_verified'/)
  assert.match(methodologyMigration, /'no_evidence_found'/)
  assert.match(methodologyMigration, /'confirmed_not_shortage'/)
  assert.match(methodologyMigration, /'insufficient_industry_coverage'/)
  assert.match(methodologyMigration, /'fallback'/)
})

test("subnational licensing evidence separates employee and contractor requirements", () => {
  assert.match(methodologyMigration, /create table if not exists public\.career_foundation_licensing_evidence/)
  assert.match(methodologyMigration, /applies_to text not null/)
  assert.match(methodologyMigration, /'contractor_license'/)
  assert.match(methodologyMigration, /'US:carpenter:CA:C5-contractor'/)
  assert.match(methodologyMigration, /'US:carpenter:NYC:HIC-contractor'/)
  assert.match(methodologyMigration, /contractor\/business rules are stored separately/i)
})

test("visa accessibility stores a primary H-2B route and secondary PERM route without additive route counting", () => {
  assert.match(methodologyMigration, /create table if not exists public\.career_foundation_visa_pathways/)
  assert.match(methodologyMigration, /'US:carpenter:H2B'/)
  assert.match(methodologyMigration, /'US:carpenter:PERM'/)
  assert.match(methodologyMigration, /used_for_primary_score boolean/)
})

test("vacancy scoring evidence is separate from live job opportunities", () => {
  assert.match(methodologyMigration, /clean_distinct_90_day_numerator',false/)
  assert.match(methodologyMigration, /create table if not exists public\.career_foundation_job_opportunities/)
  assert.match(methodologyMigration, /'Trades Specialist - Carpenter'/)
  assert.match(methodologyMigration, /'Carpenter I - Oahu'/)
  assert.match(methodologyMigration, /not itself the Vacancy Score numerator/)
})

test("entry accessibility treats paid employment-linked apprenticeship differently from unpaid pre-employment study", () => {
  assert.match(methodologyMigration, /'us-carpenter-apprenticeship-paid-training'/)
  assert.match(methodologyMigration, /paid employment-linked apprenticeship = 4/i)
  assert.match(methodologyMigration, /14,'career-opportunity-v3-foundation'/)
})

test("rank read model can include a fully evaluated methodology-v1 foundation profile", () => {
  assert.match(baseMigration, /where score_ready=true and publish_ready=true and opportunity_score is not null/)
  assert.match(methodologyMigration, /'US:carpenter:2026-08-12:v3'/)
})

test("career insight suppresses legacy data whenever a foundation row exists", () => {
  assert.match(readModel, /const foundationCountries = new Set/)
  assert.match(readModel, /profiles\.filter\(\(profile\) => !foundationCountries\.has\(profile\.country_code\)\)/)
  assert.match(readModel, /if \(foundation\?\.readiness\.decisionReady\)/)
  assert.match(readModel, /readModelSource: "career_data_foundation"/)
  assert.match(readModel, /if \(foundation\) \{[\s\S]*?profile: null,[\s\S]*?readModelSource: "editorial_only"/)
})

test("foundation compatibility profile still does not fake a clean vacancy count or five-year growth value", () => {
  assert.match(readModel, /vacanciesThreeMonthAvg: null/)
  assert.match(readModel, /employmentGrowth5yPct: null/)
  assert.match(readModel, /opportunityScore: foundation\.opportunityScore/)
  assert.match(readModel, /scoreStatus: foundation\.readiness\.scoreReady \? "foundation_ready" : "not_ready"/)
})

test("foundation API read returns provenance, relational lineage, regulation, visa and live opportunities", () => {
  for (const table of [
    "career_raw_observations",
    "career_normalized_metrics",
    "career_score_components",
    "career_normalized_metric_inputs",
    "career_score_component_metric_inputs",
    "career_score_component_raw_inputs",
    "career_foundation_licensing_evidence",
    "career_foundation_visa_pathways",
    "career_foundation_job_opportunities",
    "career_foundation_blockers",
    "career_foundation_entry_points",
    "career_official_sources",
  ]) {
    assert.match(foundationRead, new RegExp(`from\\(\"${table}\"\)`))
  }
  assert.match(foundationRead, /scoreConfidence/)
  assert.match(foundationRead, /evidenceStatus/)
})
