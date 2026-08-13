import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  calculateFoundationOpportunityScore,
  chooseCareerReadModelSource,
  foundationScoreConfidence,
  scoreVacancyIntensity,
} from "../src/lib/career-data-foundation/opportunity-score"

const base = readFileSync("supabase/migrations/20260813024158_career_data_foundation_au_carpenter.sql", "utf8")
const whiteCardSource = readFileSync("supabase/migrations/20260813121943_correct_au_carpenter_white_card_source.sql", "utf8")
const whiteCardLineage = readFileSync("supabase/migrations/20260813122026_correct_au_carpenter_white_card_lineage.sql", "utf8")
const vacancyRaw = readFileSync("supabase/migrations/20260813122259_strengthen_au_carpenter_vacancy_raw_evidence.sql", "utf8")
const vacancyMetric = readFileSync("supabase/migrations/20260813122309_strengthen_au_carpenter_vacancy_normalization.sql", "utf8")
const vacancyComponent = readFileSync("supabase/migrations/20260813122317_strengthen_au_carpenter_vacancy_component.sql", "utf8")
const allMigrations = [base, whiteCardSource, whiteCardLineage, vacancyRaw, vacancyMetric, vacancyComponent].join("\n")

const capture = (text: string, pattern: RegExp) => {
  const match = text.match(pattern)
  assert.ok(match?.[1], `missing numeric capture: ${pattern}`)
  return Number(match[1])
}

test("AU raw market inputs reproduce frozen normalized values and 53.98", () => {
  const fiveYearChangePct = capture(base, /'change_pct',([0-9.]+),'years',5/)
  const nationalStart = capture(base, /'au-all-employment-nov-2019'[\s\S]*?to_jsonb\((\d+)\)/)
  const nationalEnd = capture(base, /'au-all-employment-nov-2024'[\s\S]*?to_jsonb\((\d+)\)/)
  const occupationCagr = Math.pow(1 + fiveYearChangePct / 100, 1 / 5) - 1
  const nationalCagr = Math.pow(nationalEnd / nationalStart, 1 / 5) - 1
  const momentum = (occupationCagr - nationalCagr) * 100
  assert.ok(Math.abs(momentum + 0.4189258298143761) < 1e-12)

  const occupationWage = capture(base, /'au-carpenters-joiners-hourly-wage-2025'[\s\S]*?to_jsonb\((\d+)\)/)
  const nationalWage = capture(base, /'au-all-hourly-wage-2025'[\s\S]*?to_jsonb\((\d+)\)/)
  const salaryRatio = occupationWage / nationalWage
  assert.ok(Math.abs(salaryRatio - 0.9574468085106383) < 1e-12)

  assert.match(base, /'employment_2025',149259,'employment_2035',165554,'years',10/)
  assert.match(base, /'employment_2025',14701000,'employment_2035',16655500,'years',10/)
  const occupationProjectedCagr = Math.pow(165554 / 149259, 1 / 10) - 1
  const nationalProjectedCagr = Math.pow(16655500 / 14701000, 1 / 10) - 1
  const projectedGrowth = (occupationProjectedCagr - nationalProjectedCagr) * 100
  assert.ok(Math.abs(projectedGrowth + 0.21454259569968492) < 1e-12)

  const yoy = capture(base, /'yoy_pct',(\d+)/)
  const persistenceBonus: 0 | 1 = yoy >= 0 ? 1 : 0
  const vacancy = scoreVacancyIntensity({ intensity: "low", persistenceBonus, sourceQuality: "official_partial", hasEmploymentDenominator: true })
  assert.equal(vacancy, 4)

  assert.equal(calculateFoundationOpportunityScore([
    { componentKey: "shortage_signal", normalizedValue: 12, availability: "available", directness: "direct", evidenceStatus: "direct_verified" },
    { componentKey: "vacancy_intensity", normalizedValue: vacancy, availability: "available", directness: "proxy", proxyReason: "Official IVI fallback.", reason: "No clean distinct 90-day numerator.", evidenceStatus: "fallback" },
    { componentKey: "industry_diversity", normalizedValue: 0, availability: "available", directness: "proxy", proxyReason: "No comparable HHI shares.", reason: "Insufficient comparable industry coverage.", evidenceStatus: "insufficient_industry_coverage" },
    { componentKey: "employment_momentum", normalizedValue: momentum, availability: "available", directness: "proxy", proxyReason: "ANZSCO 3312 broader history.", evidenceStatus: "derived" },
    { componentKey: "entry_accessibility", normalizedValue: 14, availability: "available", directness: "proxy", proxyReason: "Official training evidence mapped to rubric.", evidenceStatus: "proxy" },
    { componentKey: "relative_salary", normalizedValue: salaryRatio, availability: "available", directness: "proxy", proxyReason: "ANZSCO 3312 broader wage.", evidenceStatus: "derived" },
    { componentKey: "projected_growth", normalizedValue: projectedGrowth, availability: "available", directness: "proxy", proxyReason: "ANZSCO 3312 broader projection.", evidenceStatus: "derived" },
    { componentKey: "visa_accessibility", normalizedValue: 9, availability: "available", directness: "proxy", proxyReason: "Official 189 route mapped to rubric.", evidenceStatus: "proxy" },
    { componentKey: "entry_burden", normalizedValue: 2, availability: "available", directness: "proxy", proxyReason: "White Card requirement mapped to rubric.", evidenceStatus: "proxy" },
  ]), 53.98)
})

test("AU corrective migrations preserve evidence semantics", () => {
  assert.match(base, /'AU:carpenter:OSCA:372132'/)
  assert.match(whiteCardSource, /CPCWHS1001 Prepare to work safely in the construction industry/)
  assert.match(whiteCardLineage, /source_key='au-training-cpcwhs1001'/)
  assert.match(whiteCardLineage, /evidence_key='AU:carpenter:white-card'/)
  assert.match(vacancyRaw, /'persistence_comparator','same_period_previous_year'/)
  assert.match(vacancyRaw, /'persistence_supported',true/)
  assert.match(vacancyMetric, /year-over-year persistence 1 equals 4/)
  assert.match(vacancyComponent, /same-period persistence 1 equals 4/)
  assert.match(base, /clean_distinct_90_day_numerator',false/)
  assert.match(base, /'industry_diversity'[\s\S]*'insufficient_industry_coverage'/)
})

test("AU Carpenter keeps route, licensing, precedence and confidence guards", () => {
  assert.match(allMigrations, /'AU:carpenter:189'[\s\S]*true/)
  assert.match(allMigrations, /'AU:carpenter:482'[\s\S]*false/)
  assert.match(allMigrations, /Employee of a registered builder does not need a Carpenter licence/)
  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: true, legacyAvailable: true }), "career_data_foundation")
  assert.doesNotMatch(allMigrations, /AU:registered-nurse/)
  assert.equal(foundationScoreConfidence({ scoreReady: true, components: [
    { directness: "direct", evidenceStatus: "direct_verified", mappingQuality: "high", confidence: 0.9 },
    { directness: "proxy", evidenceStatus: "fallback", mappingQuality: "medium", confidence: 0.75 },
  ] }), "estimated")
})
