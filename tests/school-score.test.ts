import assert from "node:assert/strict"
import test from "node:test"
import { scoreSchools } from "../src/lib/school-score"

test("weights earnings, employment, and affordability on a 100-point scale", () => {
  const [weighted] = scoreSchools([
    { id: "weighted", country: "us", tuition: 200, median_earnings: 300, employment_rate: 80 },
    { id: "best-value", country: "us", tuition: 100, median_earnings: 200, employment_rate: 90 },
    { id: "lowest", country: "us", tuition: 300, median_earnings: 100, employment_rate: 70 },
  ])

  assert.deepEqual(weighted.score_breakdown, {
    earnings: 100,
    employment: 50,
    affordability: 50,
  })
  assert.equal(weighted.score, 72.5)
})

test("uses average-rank percentiles so tied metrics receive the same score", () => {
  const [first, second, third] = scoreSchools([
    { id: "first", country: "us", tuition: 10, median_earnings: 100, employment_rate: 90 },
    { id: "second", country: "us", tuition: 20, median_earnings: 100, employment_rate: 90 },
    { id: "third", country: "us", tuition: 30, median_earnings: 50, employment_rate: 80 },
  ])

  assert.deepEqual(first.score_breakdown, { earnings: 75, employment: 75, affordability: 100 })
  assert.deepEqual(second.score_breakdown, { earnings: 75, employment: 75, affordability: 50 })
  assert.deepEqual(third.score_breakdown, { earnings: 0, employment: 0, affordability: 0 })
})

test("returns a null score for incomplete or invalid metrics without adding those rows to the cohort", () => {
  const [best, lowest, missingEarnings, invalidEmployment] = scoreSchools([
    { id: "best", country: "us", tuition: 10, median_earnings: 200, employment_rate: 95 },
    { id: "lowest", country: "us", tuition: 20, median_earnings: 100, employment_rate: 80 },
    { id: "missing-earnings", country: "us", tuition: 1, median_earnings: null, employment_rate: 100 },
    { id: "invalid-employment", country: "us", tuition: 1, median_earnings: 1_000, employment_rate: 101 },
  ])

  assert.equal(best.score, 100)
  assert.equal(lowest.score, 0)
  assert.equal(missingEarnings.score, null)
  assert.equal(invalidEmployment.score, null)
  assert.equal(missingEarnings.total_tuition, 4)
  assert.deepEqual(invalidEmployment.score_breakdown, {
    earnings: null,
    employment: null,
    affordability: null,
  })
})

test("calculates affordability from annual tuition and the duration-aware total cost", () => {
  const [shorterDegree, defaultUsDegree] = scoreSchools([
    {
      id: "shorter-degree",
      country: "us",
      tuition: 10_000,
      duration_years: 3,
      median_earnings: 100,
      employment_rate: 90,
    },
    {
      id: "default-us-degree",
      country: "us",
      tuition: 10_000,
      median_earnings: 100,
      employment_rate: 90,
    },
  ])

  assert.equal(shorterDegree.total_tuition, 30_000)
  assert.equal(defaultUsDegree.total_tuition, 40_000)
  assert.equal(shorterDegree.score_breakdown.affordability, 100)
  assert.equal(defaultUsDegree.score_breakdown.affordability, 0)
})
