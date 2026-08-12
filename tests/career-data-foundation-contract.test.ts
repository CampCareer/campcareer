import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260812113315_career_data_foundation_us_carpenter.sql", "utf8")
const readModel = readFileSync("src/lib/workspace/career-market-read.ts", "utf8")
const foundationRead = readFileSync("src/lib/career-data-foundation/read.ts", "utf8")

test("foundation keeps raw, normalized, component and snapshot data in separate layers", () => {
  for (const table of [
    "career_raw_observations",
    "career_normalized_metrics",
    "career_score_components",
    "career_opportunity_score_snapshots",
  ]) {
    assert.match(migration, new RegExp(`create table public\\.${table}`))
  }
})

test("missing raw data is nullable with unavailable reason enforcement", () => {
  assert.match(migration, /raw_value jsonb/)
  assert.match(migration, /availability = 'unavailable' and raw_value is null/)
  assert.match(migration, /btrim\(coalesce\(reason, ''\)\) <> ''/)
})

test("proxy observations cannot omit their reason", () => {
  assert.match(migration, /directness <> 'proxy' or btrim\(coalesce\(proxy_reason, ''\)\) <> ''/)
  assert.match(migration, /The rubric is a CampCareer proxy and is not a BLS score/)
})

test("score values and final score are calculated, not seeded", () => {
  assert.match(migration, /score_value numeric generated always as/)
  assert.match(migration, /case when e\.score_ready then round\(e\.score_sum,2\) else null::numeric end as opportunity_score/)
  assert.doesNotMatch(migration, /opportunity_score\s+numeric\s+not null/i)
})

test("only US Carpenter is seeded into the new foundation", () => {
  const profileInsert = migration.match(/insert into public\.career_foundation_profiles[\s\S]*?on conflict \(profile_key\)/)?.[0] ?? ""
  assert.match(profileInsert, /'US:carpenter','US','carpenter'/)
  assert.doesNotMatch(profileInsert, /AU:registered-nurse/)
  assert.equal((profileInsert.match(/'US:carpenter'/g) ?? []).length, 1)
})

test("canonical mapping is exact SOC 47-2031 with an exact O*NET companion mapping", () => {
  assert.match(migration, /'SOC','2018','47-2031','Carpenters','exact','high'/)
  assert.match(migration, /'O\*NET-SOC','2026','47-2031\.00','Carpenters','exact','high'/)
})

test("rank read model excludes decision-ready but score-incomplete profiles", () => {
  assert.match(migration, /where score_ready=true and publish_ready=true and opportunity_score is not null/)
})

test("career insight suppresses legacy data whenever a foundation row exists", () => {
  assert.match(readModel, /const foundationCountries = new Set/)
  assert.match(readModel, /profiles\.filter\(\(profile\) => !foundationCountries\.has\(profile\.country_code\)\)/)
  assert.match(readModel, /if \(foundation\?\.readiness\.decisionReady\)/)
  assert.match(readModel, /readModelSource: "career_data_foundation"/)
  assert.match(readModel, /if \(foundation\) \{[\s\S]*?profile: null,[\s\S]*?readModelSource: "editorial_only"/)
})

test("foundation compatibility profile does not fake vacancy, five-year growth or score", () => {
  assert.match(readModel, /vacanciesThreeMonthAvg: null/)
  assert.match(readModel, /employmentGrowth5yPct: null/)
  assert.match(readModel, /opportunityScore: foundation\.opportunityScore/)
  assert.match(readModel, /scoreStatus: foundation\.readiness\.scoreReady \? "foundation_ready" : "not_ready"/)
})

test("foundation API read returns provenance, normalization, components and blockers", () => {
  for (const table of [
    "career_raw_observations",
    "career_normalized_metrics",
    "career_score_components",
    "career_foundation_blockers",
    "career_foundation_entry_points",
    "career_official_sources",
  ]) {
    assert.match(foundationRead, new RegExp(`from\\(\"${table}\"\)`))
  }
})
