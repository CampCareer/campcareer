import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  calculateFoundationOpportunityScore,
  chooseCareerReadModelSource,
  foundationScoreConfidence,
  scoreEntryAccessibility,
  scoreEntryBurden,
  scoreFoundationComponent,
  scoreIndustryDiversity,
  scoreVacancyIntensity,
  scoreVisaAccessibility,
} from "../src/lib/career-data-foundation/opportunity-score"

const migration = readFileSync(
  "supabase/migrations/20260813230900_career_data_foundation_au_electrician.sql",
  "utf8",
)

const capture = (text: string, pattern: RegExp) => {
  const match = text.match(pattern)
  assert.ok(match?.[1], `missing numeric capture: ${pattern}`)
  return Number(match[1])
}

test("AU Electrician raw market inputs reproduce frozen 57.62 score", () => {
  const fiveYearChangePct = capture(migration, /'change_pct',([0-9.]+),'years',5/)
  const nationalStart = capture(migration, /'au-all-employment-nov-2019-electrician'[\s\S]*?to_jsonb\((\d+)\)/)
  const nationalEnd = capture(migration, /'au-all-employment-nov-2024-electrician'[\s\S]*?to_jsonb\((\d+)\)/)
  const occupationCagr = Math.pow(1 + fiveYearChangePct / 100, 1 / 5) - 1
  const nationalCagr = Math.pow(nationalEnd / nationalStart, 1 / 5) - 1
  const momentum = (occupationCagr - nationalCagr) * 100
  assert.ok(Math.abs(momentum - 1.282555604065072) < 1e-12)
  assert.equal(scoreFoundationComponent({
    componentKey: "employment_momentum",
    normalizedValue: momentum,
    availability: "available",
    directness: "proxy",
    proxyReason: "ANZSCO 3411 broader history.",
    evidenceStatus: "derived",
  }), 8.21)

  const occupationWage = capture(migration, /'au-electricians-hourly-wage-2025'[\s\S]*?to_jsonb\((\d+)\)/)
  const nationalWage = capture(migration, /'au-all-hourly-wage-2025-electrician'[\s\S]*?to_jsonb\((\d+)\)/)
  const salaryRatio = occupationWage / nationalWage
  assert.ok(Math.abs(salaryRatio - 1.1702127659574468) < 1e-12)
  assert.equal(scoreFoundationComponent({
    componentKey: "relative_salary",
    normalizedValue: salaryRatio,
    availability: "available",
    directness: "proxy",
    proxyReason: "ANZSCO 3411 broader wage.",
    evidenceStatus: "derived",
  }), 6.70)

  assert.match(migration, /'employment_2025',194917,'employment_2035',218278,'years',10/)
  assert.match(migration, /'employment_2025',14701000,'employment_2035',16655500,'years',10/)
  const occupationProjectedCagr = Math.pow(218278 / 194917, 1 / 10) - 1
  const nationalProjectedCagr = Math.pow(16655500 / 14701000, 1 / 10) - 1
  const projectedGrowth = (occupationProjectedCagr - nationalProjectedCagr) * 100
  assert.ok(Math.abs(projectedGrowth + 0.11768549129480554) < 1e-12)
  assert.equal(scoreFoundationComponent({
    componentKey: "projected_growth",
    normalizedValue: projectedGrowth,
    availability: "available",
    directness: "proxy",
    proxyReason: "ANZSCO 3411 broader projection.",
    evidenceStatus: "derived",
  }), 4.71)

  const vacancy = scoreVacancyIntensity({
    intensity: "low",
    persistenceBonus: 0,
    sourceQuality: "official_partial",
    hasEmploymentDenominator: true,
  })
  assert.equal(vacancy, 3)

  const industry = scoreIndustryDiversity({
    hhi: null,
    topIndustrySharePct: null,
    coveragePct: null,
    comparableBroadSectors: false,
  })
  assert.deepEqual(industry, { score: 0, evidenceStatus: "insufficient_industry_coverage" })

  const entryAccessibility = scoreEntryAccessibility({ educationPoints: 7, relatedExperiencePoints: 3, trainingPoints: 4 })
  const visaAccessibility = scoreVisaAccessibility({ occupationApplicability: 3, employerDependency: 3, eligibilityBurden: 1, longTermPathway: 2 })
  const entryBurden = scoreEntryBurden({ geographicScopeBurden: 2, legalRequirementBurden: 1.5, acquisitionDifficultyBurden: 1.5 })
  assert.equal(entryAccessibility, 14)
  assert.equal(visaAccessibility, 9)
  assert.equal(entryBurden, 0)

  assert.equal(calculateFoundationOpportunityScore([
    { componentKey: "shortage_signal", normalizedValue: 12, availability: "available", directness: "direct", evidenceStatus: "direct_verified" },
    { componentKey: "vacancy_intensity", normalizedValue: vacancy, availability: "available", directness: "proxy", proxyReason: "Official IVI fallback.", reason: "No clean distinct 90-day numerator or persistence comparator.", evidenceStatus: "fallback" },
    { componentKey: "industry_diversity", normalizedValue: industry.score, availability: "available", directness: "proxy", proxyReason: "No comparable HHI shares.", reason: "Insufficient comparable industry coverage.", evidenceStatus: "insufficient_industry_coverage" },
    { componentKey: "employment_momentum", normalizedValue: momentum, availability: "available", directness: "proxy", proxyReason: "ANZSCO 3411 broader history.", evidenceStatus: "derived" },
    { componentKey: "entry_accessibility", normalizedValue: entryAccessibility, availability: "available", directness: "proxy", proxyReason: "Official training evidence mapped to rubric.", evidenceStatus: "proxy" },
    { componentKey: "relative_salary", normalizedValue: salaryRatio, availability: "available", directness: "proxy", proxyReason: "ANZSCO 3411 broader wage.", evidenceStatus: "derived" },
    { componentKey: "projected_growth", normalizedValue: projectedGrowth, availability: "available", directness: "proxy", proxyReason: "ANZSCO 3411 broader projection.", evidenceStatus: "derived" },
    { componentKey: "visa_accessibility", normalizedValue: visaAccessibility, availability: "available", directness: "proxy", proxyReason: "Official subclass 189 route mapped to rubric.", evidenceStatus: "proxy" },
    { componentKey: "entry_burden", normalizedValue: entryBurden, availability: "available", directness: "proxy", proxyReason: "Official occupational licensing evidence mapped to rubric.", evidenceStatus: "proxy" },
  ]), 57.62)
})

test("AU Electrician migration preserves exact mapping and conservative evidence semantics", () => {
  assert.match(migration, /'AU:electrician:OSCA:381231'[\s\S]*'exact','high'/)
  assert.match(migration, /'AU:electrician:ANZSCO:341111'[\s\S]*'exact','high'/)
  assert.match(migration, /'AU:electrician:ANZSCO:3411'[\s\S]*'broader','medium'/)

  assert.match(migration, /'Australia','S','ACT','S','NSW','S','NT','S','QLD','S','SA','S','TAS','S','VIC','S','WA','S'/)
  assert.match(migration, /clean_distinct_90_day_numerator',false/)
  assert.match(migration, /'persistence_supported',false/)
  assert.match(migration, /'vacancy_intensity'[\s\S]*'fallback'/)

  assert.match(migration, /'shares_available',false/)
  assert.match(migration, /'industry_diversity'[\s\S]*'insufficient_industry_coverage'/)
  assert.doesNotMatch(migration, /industry_hhi',\s*[0-9]/)

  assert.match(migration, /UEE30820 Certificate III in Electrotechnology Electrician/)
  assert.match(migration, /paid_on_the_job_training',true/)
  assert.match(migration, /Exact 341111 median earnings are not published/)
  assert.match(migration, /'au-electricians-hourly-wage-2025','AU:electrician','AU:electrician:ANZSCO:3411'/)

  assert.doesNotMatch(migration, /nwivisas/i)
  assert.doesNotMatch(migration, /seek\.com/i)
})

test("AU Electrician migration freezes route, licensing and relational lineage", () => {
  assert.match(migration, /'AU:electrician:2026-08-14:v1'/)
  assert.match(migration, /array\['shortage_signal','vacancy_intensity','industry_diversity','employment_momentum','entry_accessibility','relative_salary','projected_growth','visa_accessibility','entry_burden'\]/)

  const metricLinks = [...migration.matchAll(/'AU:electrician:2026-08-14:v1','(?:shortage_signal|vacancy_intensity|industry_diversity|employment_momentum|entry_accessibility|relative_salary|projected_growth|visa_accessibility|entry_burden)','AU:electrician:[^']+','scored_metric'/g)]
  assert.equal(metricLinks.length, 9)
  assert.match(migration, /insert into public\.career_score_component_raw_inputs/)
  assert.match(migration, /join public\.career_normalized_metric_inputs/)

  assert.match(migration, /'AU:electrician:189'[\s\S]*,3,3,1,2,true/)
  assert.match(migration, /'AU:electrician:482'[\s\S]*false/)
  assert.match(migration, /'AU:electrician:NSW:occupational'[\s\S]*'occupational_license',true,'employee'/)
  assert.match(migration, /'AU:electrician:VIC:international'[\s\S]*'occupational_license',true,'employee'/)
  assert.match(migration, /'AU:electrician:licensing','AU:electrician','licensing','hard'/)
  assert.match(migration, /OSAP\/OTSR/)
  assert.match(migration, /Australian context gap training/)

  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: true, legacyAvailable: true }), "career_data_foundation")
  assert.equal(foundationScoreConfidence({
    scoreReady: true,
    components: [
      { directness: "direct", evidenceStatus: "direct_verified", mappingQuality: "high", confidence: 0.94 },
      { directness: "proxy", evidenceStatus: "fallback", mappingQuality: "medium", confidence: 0.72 },
    ],
  }), "estimated")
})
