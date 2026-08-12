import assert from "node:assert/strict"
import test from "node:test"

import {
  calculateFoundationOpportunityScore,
  chooseCareerReadModelSource,
  isFoundationRankable,
  scoreFoundationComponent,
  validateFoundationScoreInput,
} from "../src/lib/career-data-foundation/opportunity-score"
import { FOUNDATION_COMPONENT_MAXIMA } from "../src/lib/career-data-foundation/types"

test("foundation score weights preserve the 100 point opportunity model", () => {
  assert.equal(Object.values(FOUNDATION_COMPONENT_MAXIMA).reduce((sum, value) => sum + value, 0), 100)
})

test("US Carpenter scoreable components are deterministic", () => {
  assert.equal(scoreFoundationComponent({ componentKey: "relative_salary", normalizedValue: 29.12 / 24.51, availability: "available", directness: "direct" }), 6.88)
  assert.equal(scoreFoundationComponent({ componentKey: "projected_growth", normalizedValue: 4.5 - 3.1, availability: "available", directness: "direct" }), 5.7)

  const momentumRatio = (74_100 / 959_000) / (18_863_300 / 169_956_100)
  assert.equal(scoreFoundationComponent({ componentKey: "employment_momentum", normalizedValue: momentumRatio, availability: "available", directness: "direct" }), 3.48)
  assert.equal(scoreFoundationComponent({
    componentKey: "entry_accessibility",
    normalizedValue: 10,
    availability: "available",
    directness: "proxy",
    proxyReason: "BLS qualitative entry categories mapped to a documented ordinal CampCareer rubric.",
  }), 10)
})

test("missing data never becomes zero", () => {
  const unavailable = {
    componentKey: "vacancy_intensity" as const,
    normalizedValue: null,
    availability: "unavailable" as const,
    directness: "direct" as const,
    reason: "No validated nationwide comparable vacancy statistic.",
  }

  assert.equal(scoreFoundationComponent(unavailable), null)
  assert.deepEqual(validateFoundationScoreInput(unavailable), [])
  assert.equal(calculateFoundationOpportunityScore([unavailable]), null)
})

test("unavailable and proxy observations require explicit explanations", () => {
  assert.deepEqual(
    validateFoundationScoreInput({ componentKey: "shortage_signal", normalizedValue: null, availability: "unavailable", directness: "direct" }),
    ["unavailable components require a reason"],
  )
  assert.deepEqual(
    validateFoundationScoreInput({ componentKey: "entry_accessibility", normalizedValue: 10, availability: "available", directness: "proxy" }),
    ["proxy components require proxyReason"],
  )
})

test("an incomplete US Carpenter component set cannot yield a final score", () => {
  const inputs = [
    { componentKey: "employment_momentum" as const, normalizedValue: (74_100 / 959_000) / (18_863_300 / 169_956_100), availability: "available" as const, directness: "direct" as const },
    { componentKey: "entry_accessibility" as const, normalizedValue: 10, availability: "available" as const, directness: "proxy" as const, proxyReason: "Documented ordinal proxy." },
    { componentKey: "relative_salary" as const, normalizedValue: 29.12 / 24.51, availability: "available" as const, directness: "direct" as const },
    { componentKey: "projected_growth" as const, normalizedValue: 1.4, availability: "available" as const, directness: "direct" as const },
  ]

  assert.equal(calculateFoundationOpportunityScore(inputs), null)
  assert.equal(isFoundationRankable({ decisionReady: true, scoreReady: false, publishReady: false, opportunityScore: null }), false)
})

test("foundation precedence prevents legacy US Carpenter from winning selection", () => {
  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: true, legacyAvailable: true }), "career_data_foundation")
  assert.equal(chooseCareerReadModelSource({ foundationExists: true, foundationDecisionReady: false, legacyAvailable: true }), "editorial_only")
})

test("Australia Registered Nurse remains on the legacy reference path when no foundation exists", () => {
  assert.equal(chooseCareerReadModelSource({ foundationExists: false, foundationDecisionReady: false, legacyAvailable: true }), "legacy_country_occupation")
})
