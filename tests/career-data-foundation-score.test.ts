import assert from "node:assert/strict"
import test from "node:test"

import {
  calculateFoundationOpportunityScore,
  chooseCareerReadModelSource,
  foundationScoreConfidence,
  isFoundationRankable,
  scoreEntryAccessibility,
  scoreEntryBurden,
  scoreFoundationComponent,
  scoreIndustryDiversity,
  scoreShortageSignal,
  scoreVacancyIntensity,
  scoreVisaAccessibility,
  validateFoundationScoreInput,
} from "../src/lib/career-data-foundation/opportunity-score"
import { FOUNDATION_COMPONENT_MAXIMA, FOUNDATION_FORMULA_VERSION } from "../src/lib/career-data-foundation/types"

test("foundation score weights preserve the 100 point opportunity model", () => {
  assert.equal(Object.values(FOUNDATION_COMPONENT_MAXIMA).reduce((sum, value) => sum + value, 0), 100)
  assert.equal(FOUNDATION_FORMULA_VERSION, "career-opportunity-v4-foundation")
})

test("shortage methodology keeps no evidence separate from confirmed non-shortage", () => {
  assert.equal(scoreShortageSignal({ evidenceStatus: "no_evidence_found" }), 0)
  assert.equal(scoreShortageSignal({ evidenceStatus: "confirmed_not_shortage" }), 0)
  assert.equal(scoreShortageSignal({ severity: "shortage", scope: "national", evidenceStatus: "direct" }), 12)
  assert.equal(scoreShortageSignal({ severity: "severe", scope: "broad_subnational", evidenceStatus: "direct" }), 13.5)
  assert.equal(scoreShortageSignal({ severity: "critical", scope: "local", evidenceStatus: "direct" }), 5)
})

test("vacancy methodology uses 90-day band, persistence and evidence-quality cap", () => {
  assert.equal(scoreVacancyIntensity({ intensity: "low", persistenceBonus: 1, sourceQuality: "government_job_portal", hasEmploymentDenominator: false }), 4)
  assert.equal(scoreVacancyIntensity({ intensity: "very_high", persistenceBonus: 3, sourceQuality: "official_comprehensive", hasEmploymentDenominator: true }), 15)
  assert.equal(scoreVacancyIntensity({ intensity: "very_high", persistenceBonus: 3, sourceQuality: "government_job_portal", hasEmploymentDenominator: false }), 9)
  assert.equal(scoreVacancyIntensity({ intensity: "high", persistenceBonus: 3, sourceQuality: "limited_or_unknown_coverage", hasEmploymentDenominator: false }), 6)
})

test("industry diversity follows HHI bands and conservative insufficient-coverage status", () => {
  assert.deepEqual(scoreIndustryDiversity({ hhi: 0.1, topIndustrySharePct: 20, coveragePct: 95, comparableBroadSectors: true }), { score: 5, evidenceStatus: "derived" })
  assert.deepEqual(scoreIndustryDiversity({ hhi: 0.25, topIndustrySharePct: 40, coveragePct: 90, comparableBroadSectors: true }), { score: 3, evidenceStatus: "derived" })
  assert.deepEqual(scoreIndustryDiversity({ hhi: 0.2, topIndustrySharePct: 75, coveragePct: 90, comparableBroadSectors: true }), { score: 0, evidenceStatus: "derived" })
  assert.deepEqual(scoreIndustryDiversity({ hhi: null, topIndustrySharePct: null, coveragePct: 84, comparableBroadSectors: false }), { score: 0, evidenceStatus: "insufficient_industry_coverage" })
})

test("visa, entry burden and entry accessibility rubrics are deterministic", () => {
  assert.equal(scoreVisaAccessibility({ occupationApplicability: 2, employerDependency: 1, eligibilityBurden: 2, longTermPathway: 1 }), 6)
  assert.equal(scoreEntryBurden({ geographicScopeBurden: 0, legalRequirementBurden: 0, acquisitionDifficultyBurden: 0 }), 5)
  assert.equal(scoreEntryBurden({ geographicScopeBurden: 2, legalRequirementBurden: 1.5, acquisitionDifficultyBurden: 1 }), 0.5)
  assert.equal(scoreEntryAccessibility({ educationPoints: 7, relatedExperiencePoints: 3, trainingPoints: 4 }), 14)
})

test("actual momentum and projected growth use the same excess-CAGR scoring scale", () => {
  for (const componentKey of ["employment_momentum", "projected_growth"] as const) {
    assert.equal(scoreFoundationComponent({ componentKey, normalizedValue: -2, availability: "available", directness: "direct", evidenceStatus: "derived" }), 0)
    assert.equal(scoreFoundationComponent({ componentKey, normalizedValue: 0, availability: "available", directness: "direct", evidenceStatus: "derived" }), 5)
    assert.equal(scoreFoundationComponent({ componentKey, normalizedValue: 2, availability: "available", directness: "direct", evidenceStatus: "derived" }), 10)
  }
})

test("US Carpenter v4 components reproduce the database scores", () => {
  assert.equal(scoreFoundationComponent({ componentKey: "shortage_signal", normalizedValue: 0, availability: "available", directness: "proxy", proxyReason: "No-evidence fallback.", reason: "No official shortage evidence.", evidenceStatus: "no_evidence_found" }), 0)
  assert.equal(scoreFoundationComponent({ componentKey: "vacancy_intensity", normalizedValue: 4, availability: "available", directness: "proxy", proxyReason: "Vacancy fallback.", reason: "No clean 90-day numerator.", evidenceStatus: "fallback" }), 4)
  assert.equal(scoreFoundationComponent({ componentKey: "industry_diversity", normalizedValue: 0, availability: "available", directness: "proxy", proxyReason: "Coverage fallback.", reason: "No comparable sector HHI.", evidenceStatus: "insufficient_industry_coverage" }), 0)
  assert.equal(scoreFoundationComponent({ componentKey: "relative_salary", normalizedValue: 29.12 / 24.51, availability: "available", directness: "direct", evidenceStatus: "derived" }), 6.88)
  assert.equal(scoreFoundationComponent({ componentKey: "projected_growth", normalizedValue: 0.1380834031287748, availability: "available", directness: "direct", evidenceStatus: "derived" }), 5.35)
  assert.equal(scoreFoundationComponent({ componentKey: "employment_momentum", normalizedValue: -0.9159141007264449, availability: "available", directness: "direct", evidenceStatus: "derived" }), 2.71)
  assert.equal(scoreFoundationComponent({ componentKey: "entry_accessibility", normalizedValue: 14, availability: "available", directness: "proxy", proxyReason: "Frozen CampCareer rubric.", evidenceStatus: "proxy" }), 14)
  assert.equal(scoreFoundationComponent({ componentKey: "visa_accessibility", normalizedValue: 6, availability: "available", directness: "proxy", proxyReason: "Official routes mapped to rubric.", evidenceStatus: "proxy" }), 6)
  assert.equal(scoreFoundationComponent({ componentKey: "entry_burden", normalizedValue: 5, availability: "available", directness: "proxy", proxyReason: "Subnational evidence mapped to employee rubric.", evidenceStatus: "proxy" }), 5)
})

test("missing raw-style data remains null while completed no-evidence evaluation may score zero", () => {
  const unavailable = {
    componentKey: "vacancy_intensity" as const,
    normalizedValue: null,
    availability: "unavailable" as const,
    directness: "direct" as const,
    reason: "Research is not complete.",
  }
  assert.equal(scoreFoundationComponent(unavailable), null)
  assert.deepEqual(validateFoundationScoreInput(unavailable), [])

  const completedNoEvidence = {
    componentKey: "shortage_signal" as const,
    normalizedValue: 0,
    availability: "available" as const,
    directness: "proxy" as const,
    proxyReason: "Completed official-source review maps no evidence to a conservative zero.",
    reason: "No official shortage evidence was validated.",
    evidenceStatus: "no_evidence_found" as const,
  }
  assert.equal(scoreFoundationComponent(completedNoEvidence), 0)
  assert.deepEqual(validateFoundationScoreInput(completedNoEvidence), [])
})

test("unavailable, proxy and fallback observations require explicit explanations", () => {
  assert.deepEqual(
    validateFoundationScoreInput({ componentKey: "shortage_signal", normalizedValue: null, availability: "unavailable", directness: "direct" }),
    ["unavailable components require a reason"],
  )
  assert.deepEqual(
    validateFoundationScoreInput({ componentKey: "entry_accessibility", normalizedValue: 14, availability: "available", directness: "proxy" }),
    ["proxy components require proxyReason"],
  )
  assert.deepEqual(
    validateFoundationScoreInput({ componentKey: "vacancy_intensity", normalizedValue: 4, availability: "available", directness: "proxy", proxyReason: "Fallback rubric.", evidenceStatus: "fallback" }),
    ["fallback and conservative zero components require a reason"],
  )
})

test("complete US Carpenter methodology v1 yields 43.94 and is rankable", () => {
  const inputs = [
    { componentKey: "shortage_signal" as const, normalizedValue: 0, availability: "available" as const, directness: "proxy" as const, proxyReason: "No-evidence fallback.", reason: "No validated official shortage assessment.", evidenceStatus: "no_evidence_found" as const },
    { componentKey: "vacancy_intensity" as const, normalizedValue: 4, availability: "available" as const, directness: "proxy" as const, proxyReason: "90-day vacancy fallback.", reason: "No clean distinct national numerator.", evidenceStatus: "fallback" as const },
    { componentKey: "industry_diversity" as const, normalizedValue: 0, availability: "available" as const, directness: "proxy" as const, proxyReason: "Conservative HHI fallback.", reason: "Published categories are not cross-country comparable.", evidenceStatus: "insufficient_industry_coverage" as const },
    { componentKey: "employment_momentum" as const, normalizedValue: -0.9159141007264449, availability: "available" as const, directness: "direct" as const, evidenceStatus: "derived" as const },
    { componentKey: "entry_accessibility" as const, normalizedValue: 14, availability: "available" as const, directness: "proxy" as const, proxyReason: "Frozen entry-accessibility rubric.", evidenceStatus: "proxy" as const },
    { componentKey: "relative_salary" as const, normalizedValue: 29.12 / 24.51, availability: "available" as const, directness: "direct" as const, evidenceStatus: "derived" as const },
    { componentKey: "projected_growth" as const, normalizedValue: 0.1380834031287748, availability: "available" as const, directness: "direct" as const, evidenceStatus: "derived" as const },
    { componentKey: "visa_accessibility" as const, normalizedValue: 6, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official visa routes mapped to rubric.", evidenceStatus: "proxy" as const },
    { componentKey: "entry_burden" as const, normalizedValue: 5, availability: "available" as const, directness: "proxy" as const, proxyReason: "Official licensing evidence mapped to general employee rubric.", evidenceStatus: "proxy" as const },
  ]

  assert.equal(calculateFoundationOpportunityScore(inputs), 43.94)
  assert.equal(isFoundationRankable({ decisionReady: true, scoreReady: true, publishReady: true, opportunityScore: 43.94 }), true)
})

test("US Carpenter confidence is estimated because deterministic proxies and fallbacks remain", () => {
  assert.equal(foundationScoreConfidence({
    scoreReady: true,
    components: [
      { directness: "direct", evidenceStatus: "derived", mappingQuality: "high", confidence: 0.98 },
      { directness: "proxy", evidenceStatus: "fallback", mappingQuality: "medium", confidence: 0.65 },
    ],
  }), "estimated")
  assert.equal(foundationScoreConfidence({
    scoreReady: true,
    components: [{ directness: "direct", evidenceStatus: "derived", mappingQuality: "high", confidence: 0.98 }],
  }), "verified")
})

test("foundation precedence prevents legacy US Carpenter from winning selection", () => {
  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: true, legacyAvailable: true }), "career_data_foundation")
  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: false, legacyAvailable: true }), "editorial_only")
})

test("Australia Registered Nurse remains on the legacy reference path when no foundation exists", () => {
  assert.equal(chooseCareerReadModelSource({ foundationExists: false, foundationDecisionReady: false, legacyAvailable: true }), "legacy_country_occupation")
})
