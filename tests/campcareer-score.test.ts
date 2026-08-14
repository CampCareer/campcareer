import assert from "node:assert/strict"
import test from "node:test"

import {
  CAMPCAREER_SCORE_VERSION,
  calculateCampCareerScore,
  campCareerScoreFromFoundationComponents,
  campCareerScoreFromLegacyBreakdown,
  campCareerVerdict,
} from "../src/lib/campcareer-score"

test("CampCareer Score v1 is exactly Demand 40 + Pay 30 + Entry 30", () => {
  const score = calculateCampCareerScore({
    shortage: { score: 20, max: 20 },
    vacancyIntensity: { score: 15, max: 15 },
    employerDiversity: { score: 5, max: 5 },
    demandTrend: { score: 4, max: 10 },
    growth: { score: 4, max: 10 },
    pay: { score: 8, max: 10 },
    entryAccess: { score: 9, max: 15 },
    entryBurden: { score: 3, max: 5 },
  })

  assert.deepEqual(score, {
    version: CAMPCAREER_SCORE_VERSION,
    total: 74,
    demand: 8,
    pay: 8,
    entry: 6,
    verdict: "strong",
  })
  assert.equal(score?.total, (score?.demand ?? 0) * 4 + (score?.pay ?? 0) * 3 + (score?.entry ?? 0) * 3)
})

test("Australia Electrician legacy evidence becomes an explainable 78/100", () => {
  const score = campCareerScoreFromLegacyBreakdown({
    shortage: 20,
    vacancyIntensity: 15,
    employerDiversity: 5,
    vacancyTrend: 8,
    entryLevel: 13,
    salary: 8,
    growth: 7,
    entryBurden: 2,
  })

  assert.deepEqual(score, {
    version: CAMPCAREER_SCORE_VERSION,
    total: 78,
    demand: 9,
    pay: 8,
    entry: 6,
    verdict: "strong",
  })
})

test("visa is not an input to the CampCareer Score", () => {
  const input = {
    shortage: 12,
    vacancyIntensity: 9,
    employerDiversity: 3,
    vacancyTrend: 6,
    entryLevel: 9,
    salary: 7,
    growth: 6,
    entryBurden: 3,
  }
  const score = campCareerScoreFromLegacyBreakdown(input)
  assert.equal(score?.total, 63)
  assert.equal("visa" in input, false)
})

test("foundation components map to the same three public dimensions", () => {
  const score = campCareerScoreFromFoundationComponents([
    { componentKey: "shortage_signal", scoreValue: 12, maxScore: 20, availability: "available" },
    { componentKey: "vacancy_intensity", scoreValue: 9, maxScore: 15, availability: "available" },
    { componentKey: "industry_diversity", scoreValue: 3, maxScore: 5, availability: "available" },
    { componentKey: "employment_momentum", scoreValue: 5, maxScore: 10, availability: "available" },
    { componentKey: "projected_growth", scoreValue: 7, maxScore: 10, availability: "available" },
    { componentKey: "relative_salary", scoreValue: 8, maxScore: 10, availability: "available" },
    { componentKey: "entry_accessibility", scoreValue: 9, maxScore: 15, availability: "available" },
    { componentKey: "entry_burden", scoreValue: 3, maxScore: 5, availability: "available" },
    { componentKey: "visa_accessibility", scoreValue: 10, maxScore: 10, availability: "available" },
  ])

  assert.deepEqual(score, {
    version: CAMPCAREER_SCORE_VERSION,
    total: 66,
    demand: 6,
    pay: 8,
    entry: 6,
    verdict: "strong",
  })
})

test("missing required public evidence produces no score rather than a guessed score", () => {
  const score = campCareerScoreFromFoundationComponents([
    { componentKey: "shortage_signal", scoreValue: 12, maxScore: 20, availability: "available" },
    { componentKey: "vacancy_intensity", scoreValue: null, maxScore: 15, availability: "unavailable" },
    { componentKey: "industry_diversity", scoreValue: 3, maxScore: 5, availability: "available" },
    { componentKey: "employment_momentum", scoreValue: 5, maxScore: 10, availability: "available" },
    { componentKey: "projected_growth", scoreValue: 7, maxScore: 10, availability: "available" },
    { componentKey: "relative_salary", scoreValue: 8, maxScore: 10, availability: "available" },
    { componentKey: "entry_accessibility", scoreValue: 9, maxScore: 15, availability: "available" },
    { componentKey: "entry_burden", scoreValue: 3, maxScore: 5, availability: "available" },
  ])
  assert.equal(score, null)
})

test("verdict bands are stable and easy to explain", () => {
  assert.equal(campCareerVerdict(80), "excellent")
  assert.equal(campCareerVerdict(79), "strong")
  assert.equal(campCareerVerdict(65), "strong")
  assert.equal(campCareerVerdict(64), "mixed")
  assert.equal(campCareerVerdict(50), "mixed")
  assert.equal(campCareerVerdict(49), "challenging")
  assert.equal(campCareerVerdict(35), "challenging")
  assert.equal(campCareerVerdict(34), "tough")
})
