import assert from "node:assert/strict"
import test from "node:test"
import {
  buildCountryMetrics,
  formatMoneyRange,
  formatRankingValue,
  type CountryMetricRecord,
} from "../src/lib/workspace/country-metric-contract"

const snapshots = [
  { id: "salary-snapshot", sourceId: "abs", sourceUrl: "https://example.com/abs", dataAsOf: "2025-05-01" },
  { id: "living-snapshot", sourceId: "study", sourceUrl: "https://example.com/living", dataAsOf: "2025-01-01" },
]
const sources = [
  { id: "abs", organisationName: "ABS", sourceName: "Employee earnings" },
  { id: "study", organisationName: "Study Australia", sourceName: "Living costs" },
]

function metric(metricKey: string, value: unknown, sourceSnapshotId: string): CountryMetricRecord {
  return {
    metricKey,
    value,
    sourceSnapshotId,
    unit: metricKey.includes("earnings") ? "AUD/year" : "AUD/month",
    confidence: "high",
    verifiedAt: "2026-08-05T18:30:00Z",
    effectiveFrom: "2025-05-01",
  }
}

test("builds salary and living-cost ranges with ranking values", () => {
  const result = buildCountryMetrics(
    [
      metric(
        "full_time_annual_earnings_range",
        { low: 74048, high: 133120, ranking_value: 98124, currency: "AUD", basis: "middle_50_percent" },
        "salary-snapshot"
      ),
      metric(
        "student_living_cost_monthly_range",
        { low: 1692.62, high: 1942.76, ranking_value: 1816.9, currency: "AUD", scenario: "one_student_sharehouse" },
        "living-snapshot"
      ),
    ],
    snapshots,
    sources
  )

  assert.equal(formatMoneyRange(result.salaryRange), "AUD 74k–133k")
  assert.equal(formatRankingValue(result.salaryRange), "AUD 98k")
  assert.equal(formatMoneyRange(result.livingCostRange), "AUD 1.7k–1.9k")
  assert.equal(result.sources.length, 2)
})

test("falls back to the existing low, average and high living-cost observations", () => {
  const result = buildCountryMetrics(
    [
      metric("student_living_cost_shared_monthly_low", { amount: 1600, currency: "AUD" }, "living-snapshot"),
      metric("student_living_cost_shared_monthly_average", { amount: 1800, currency: "AUD", scenario: "one_student_sharehouse" }, "living-snapshot"),
      metric("student_living_cost_shared_monthly_high", { amount: 2000, currency: "AUD" }, "living-snapshot"),
    ],
    snapshots,
    sources
  )

  assert.equal(result.livingCostRange?.low, 1600)
  assert.equal(result.livingCostRange?.rankingValue, 1800)
  assert.equal(result.livingCostRange?.high, 2000)
})

test("rejects malformed ranges instead of showing misleading values", () => {
  const result = buildCountryMetrics(
    [metric("full_time_annual_earnings_range", { low: 130000, high: 70000, ranking_value: 98000, currency: "AUD" }, "salary-snapshot")],
    snapshots,
    sources
  )

  assert.equal(result.salaryRange, undefined)
  assert.equal(formatMoneyRange(result.salaryRange), "—")
})
