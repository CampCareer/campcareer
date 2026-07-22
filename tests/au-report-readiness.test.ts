import assert from "node:assert/strict"
import test from "node:test"
import {
  assessCityReportReadiness,
  assessFieldReportReadiness,
  assessRoiIndexReadiness,
  assessUniversityReportReadiness,
  hasFieldResearchCoverage,
  type EvidenceSource,
} from "../src/lib/au-report-readiness"

const referenceDate = new Date("2026-07-22T00:00:00.000Z")

const observedSource = (sourceName: string): EvidenceSource => ({
  sourceName,
  sourceUrl: "https://example.gov.au/data",
  dataAsOf: "2026-06-01",
  lastVerified: "2026-07-18",
  confidence: "high",
  kind: "observed",
})

const completeFieldSignal = {
  concept_id: "nursing",
  salary_median_aud: 89000,
  cost_bachelor_median_aud: 42000,
  cost_diploma_median_aud: null,
  shortage_national_pct: 70,
  outlook_2035_change_pct: 20,
  data_sources: [{ name: "Source", url: "https://example.gov.au/data" }],
  last_verified: "2026-07-18",
}

test("a field requires metric-level evidence rather than only an aggregate snapshot date", () => {
  assert.equal(hasFieldResearchCoverage(completeFieldSignal), true)

  const withoutMetricDates = assessFieldReportReadiness({
    signal: completeFieldSignal,
    sources: { tuition: null, salary: null, labourMarket: null },
  }, referenceDate)
  assert.equal(withoutMetricDates.status, "blocked")
  assert.ok(withoutMetricDates.blockers.some((blocker) => blocker.includes("Tuition source is missing")))

  const complete = assessFieldReportReadiness({
    signal: completeFieldSignal,
    sources: {
      tuition: observedSource("CRICOS"),
      salary: observedSource("ABS"),
      labourMarket: observedSource("Jobs and Skills Australia"),
    },
  }, referenceDate)
  assert.equal(complete.status, "ready")
  assert.equal(complete.confidence, "high")
})

test("city and university reports cannot be sold without the evidence needed for their claims", () => {
  const city = assessCityReportReadiness({
    city: "Sydney",
    annualLivingCostAud: null,
    housingAssumption: null,
    providerCount: null,
    livingCostSource: null,
  }, referenceDate)
  assert.equal(city.status, "blocked")

  const university = assessUniversityReportReadiness({
    institutionId: "university-of-example",
    activeCricosRecord: true,
    verifiedCoursePage: true,
    annualTuitionAud: 40000,
    providerMedianEarningsAud: 75000,
    providerEmploymentRate: 0.82,
    providerCompletionRate: null,
    courseSource: observedSource("CRICOS and provider course page"),
    outcomeSource: observedSource("QILT"),
  }, referenceDate)
  assert.equal(university.status, "ready")
  assert.ok(university.cautions.some((caution) => caution.includes("completion rate")))
})

test("the national ROI Index is blocked until every advertised analysis layer is available", () => {
  const incomplete = assessRoiIndexReadiness({
    bachelorRankingReady: true,
    masterRankingReady: false,
    vetRankingReady: false,
    providerComparisonReady: true,
    graduateOutcomesReady: true,
    cityLivingCostReady: false,
    paybackMethodologyReady: true,
    labourMarketReady: true,
    aiExposureMethodologyReady: false,
    policyReviewReady: true,
    methodologyAndSourcesReady: true,
  })
  assert.equal(incomplete.status, "blocked")
  assert.equal(incomplete.blockers.length, 4)

  const complete = assessRoiIndexReadiness({
    bachelorRankingReady: true,
    masterRankingReady: true,
    vetRankingReady: true,
    providerComparisonReady: true,
    graduateOutcomesReady: true,
    cityLivingCostReady: true,
    paybackMethodologyReady: true,
    labourMarketReady: true,
    aiExposureMethodologyReady: true,
    policyReviewReady: true,
    methodologyAndSourcesReady: true,
  })
  assert.equal(complete.status, "ready")
})
