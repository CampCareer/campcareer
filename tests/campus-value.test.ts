import assert from "node:assert/strict"
import test from "node:test"

import {
  CAMPUS_VALUE_MIN_COMPLETE_ROWS,
  CAMPUS_VALUE_MIN_PROVIDERS,
  CAMPUS_VALUE_WEIGHTS,
  assessCampusValueReadiness,
  scoreCampusValueCohort,
  type CampusValueInput,
} from "../src/lib/campus/campus-value"

const completeRows: CampusValueInput[] = [
  { programmeId: "p1", institutionId: "i1", annualTuition: 30_000, durationMonths: 36, medianEarnings: 80_000, employmentRatePct: 95 },
  { programmeId: "p2", institutionId: "i2", annualTuition: 40_000, durationMonths: 36, medianEarnings: 75_000, employmentRatePct: 90 },
  { programmeId: "p3", institutionId: "i3", annualTuition: 25_000, durationMonths: 36, medianEarnings: 70_000, employmentRatePct: 85 },
  { programmeId: "p4", institutionId: "i4", annualTuition: 35_000, durationMonths: 36, medianEarnings: 85_000, employmentRatePct: 92 },
  { programmeId: "p5", institutionId: "i5", annualTuition: 45_000, durationMonths: 36, medianEarnings: 65_000, employmentRatePct: 80 },
]

test("Campus ROI Score v1 uses the locked 45/30/25 weights", () => {
  assert.deepEqual(CAMPUS_VALUE_WEIGHTS, {
    earnings: 0.45,
    employment: 0.30,
    affordability: 0.25,
  })
})

test("Campus value is not score-ready below the minimum complete programme count", () => {
  const readiness = assessCampusValueReadiness(completeRows.slice(0, 4))
  assert.equal(readiness.ready, false)
  assert.equal(readiness.completeRows, 4)
  assert.equal(readiness.minimumCompleteRows, CAMPUS_VALUE_MIN_COMPLETE_ROWS)
  assert.match(readiness.reasons.join(" "), /at least 5 complete comparable programmes/i)
})

test("Campus value requires at least three providers, not just five programmes", () => {
  const sameProviderRows = completeRows.map((row, index) => ({
    ...row,
    institutionId: index < 3 ? "i1" : "i2",
  }))
  const readiness = assessCampusValueReadiness(sameProviderRows)
  assert.equal(readiness.ready, false)
  assert.equal(readiness.completeRows, 5)
  assert.equal(readiness.providers, 2)
  assert.equal(readiness.minimumProviders, CAMPUS_VALUE_MIN_PROVIDERS)
  assert.match(readiness.reasons.join(" "), /at least 3 providers/i)
})

test("a ready cohort receives transparent percentile-relative scores", () => {
  const result = scoreCampusValueCohort(completeRows)
  assert.equal(result.readiness.ready, true)
  assert.equal(result.readiness.completeRows, 5)
  assert.equal(result.readiness.providers, 5)

  const first = result.rows.find((row) => row.programmeId === "p1")
  assert.ok(first)
  assert.equal(first.totalTuition, 90_000)
  assert.deepEqual(first.scoreBreakdown, {
    earnings: 75,
    employment: 100,
    affordability: 75,
  })
  assert.equal(first.score, 82.5)

  const mostExpensiveLowestOutcome = result.rows.find((row) => row.programmeId === "p5")
  assert.ok(mostExpensiveLowestOutcome)
  assert.equal(mostExpensiveLowestOutcome.score, 0)
})

test("an incomplete programme stays visible but never receives a score", () => {
  const rows = [
    ...completeRows,
    { programmeId: "p6", institutionId: "i6", annualTuition: 20_000, durationMonths: 36, medianEarnings: null, employmentRatePct: 98 },
  ]
  const result = scoreCampusValueCohort(rows)
  assert.equal(result.readiness.ready, true)
  assert.equal(result.readiness.completeRows, 5)

  const incomplete = result.rows.find((row) => row.programmeId === "p6")
  assert.ok(incomplete)
  assert.equal(incomplete.completeValueInput, false)
  assert.equal(incomplete.score, null)
  assert.deepEqual(incomplete.scoreBreakdown, {
    earnings: null,
    employment: null,
    affordability: null,
  })
})

test("tied values receive the same average-rank percentile", () => {
  const rows = completeRows.map((row, index) => ({
    ...row,
    medianEarnings: index < 2 ? 80_000 : row.medianEarnings,
  }))
  const result = scoreCampusValueCohort(rows)
  assert.equal(result.readiness.ready, true)

  const p1 = result.rows.find((row) => row.programmeId === "p1")
  const p2 = result.rows.find((row) => row.programmeId === "p2")
  assert.ok(p1 && p2)
  assert.equal(p1.scoreBreakdown.earnings, p2.scoreBreakdown.earnings)
})
