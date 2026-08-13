import assert from "node:assert/strict"
import test from "node:test"

import {
  canShowPublicMarketScore,
  selectComparableCareerRecommendations,
} from "../src/lib/workspace/career-market-safety"
import type { CareerMarketProfile, CareerMarketRecommendation } from "../src/lib/workspace/career-market-contract"

const recommendation = (overrides: Partial<CareerMarketRecommendation> = {}): CareerMarketRecommendation => ({
  countryCode: "AU",
  countryName: "Australia",
  officialTitle: "Registered Nurses",
  opportunityScore: 72,
  scoreStatus: "published",
  scoreMethodologyVersion: "career-opportunity-v4",
  registrationRequired: true,
  publicationStatus: "decision_ready",
  demand: null,
  ...overrides,
})

test("provisional and mismatched methodology scores never create a country ranking", () => {
  assert.deepEqual(selectComparableCareerRecommendations([
    recommendation({ countryCode: "AU", scoreStatus: "provisional" }),
    recommendation({ countryCode: "CA", countryName: "Canada", scoreStatus: "provisional" }),
  ]), [])

  assert.deepEqual(selectComparableCareerRecommendations([
    recommendation({ countryCode: "AU", scoreMethodologyVersion: "au-v1" }),
    recommendation({ countryCode: "CA", countryName: "Canada", scoreMethodologyVersion: "ca-v1" }),
  ]), [])
})

test("a shortlist requires at least two decision-ready scores from one methodology", () => {
  const shortlist = selectComparableCareerRecommendations([
    recommendation({ countryCode: "US", countryName: "United States", opportunityScore: 61, scoreMethodologyVersion: "foundation-v4", scoreStatus: "foundation_ready" }),
    recommendation({ countryCode: "AU", countryName: "Australia", opportunityScore: 54, scoreMethodologyVersion: "foundation-v4", scoreStatus: "foundation_ready" }),
    recommendation({ countryCode: "CA", countryName: "Canada", opportunityScore: 88, scoreMethodologyVersion: "ca-v1" }),
  ])

  assert.deepEqual(shortlist.map((item) => item.countryCode), ["US", "AU"])
})

test("only released individual market scores are shown publicly", () => {
  const profile = (scoreStatus: CareerMarketProfile["metric"]["scoreStatus"], publicationStatus: CareerMarketProfile["publicationStatus"]): CareerMarketProfile => ({
    profileKey: "AU:registered-nurse",
    countryCode: "AU",
    canonicalCareerId: "registered-nurse",
    officialTitle: "Registered Nurse",
    officialCodeSystem: "ANZSCO",
    officialCodeVersion: "2022",
    officialUnitGroupCode: "2544",
    currency: "AUD",
    registrationRequired: true,
    registrationAuthority: "NMBA",
    registrationUrl: "https://www.nursingmidwiferyboard.gov.au/",
    publicationStatus,
    sourceCheckedAt: "2026-08-13",
    metric: {
      asOfDate: "2026-08-13",
      employmentTotal: null,
      medianWeeklyEarnings: null,
      medianHourlyEarnings: null,
      annualisedMedianSalary: null,
      allOccupationsMedianWeekly: null,
      partTimeSharePct: null,
      femaleSharePct: null,
      medianAge: null,
      averageFullTimeHours: null,
      vacanciesThreeMonthAvg: null,
      vacancyPeriod: null,
      vacancyYoyPct: null,
      employmentGrowth5yPct: null,
      employmentGrowth10yPct: null,
      opportunityScore: 54,
      scoreMethodologyVersion: "au-v1",
      scoreStatus,
      scoreEvidence: {},
      score: { shortage: 0, vacancyIntensity: 0, employerDiversity: 0, vacancyTrend: 0, entryLevel: 0, salary: 0, growth: 0, visa: 0, entryBurden: 0 },
      sourceCheckedAt: "2026-08-13",
    },
    specialisations: [],
    regions: [],
    links: [],
    programLinks: [],
  })

  assert.equal(canShowPublicMarketScore(profile("provisional", "decision_ready")), false)
  assert.equal(canShowPublicMarketScore(profile("published", "profile_ready")), false)
  assert.equal(canShowPublicMarketScore(profile("published", "decision_ready")), true)
})
