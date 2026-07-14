import assert from "node:assert/strict"
import test from "node:test"
import {
  DECISION_CAREER_IDS,
  getDecisionCareers,
  parseComparisonScenario,
  resolveDecisionCareer,
  resolveLaunchCountries,
} from "../src/lib/comparison/public-contract"
import { LAUNCH_COUNTRIES } from "../src/data/launch-countries"

test("the public destination registry keeps the agreed twenty-country release order", () => {
  assert.deepEqual(
    LAUNCH_COUNTRIES.map((country) => country.code),
    ["AU", "CA", "US", "UK", "IE", "DE", "NL", "BE", "FR", "ES", "SG", "KR", "JP", "NZ", "NO", "SE", "DK", "FI", "CH", "AE"],
  )
})

test("decision-ready comparison cohort contains the agreed twelve careers", () => {
  assert.equal(DECISION_CAREER_IDS.length, 12)
  assert.deepEqual(getDecisionCareers().map((career) => career.id), DECISION_CAREER_IDS)
})

test("a supported major resolves to its exact public career intent", () => {
  assert.equal(resolveDecisionCareer(null, "computer-science")?.id, "software-developer")
  assert.equal(resolveDecisionCareer("registered-nurse", null)?.label, "Registered Nurse")
  assert.equal(resolveDecisionCareer("data-analyst", null), null)
})

test("comparison request country selection stays within the twenty-country launch perimeter and four-card limit", () => {
  const countries = resolveLaunchCountries(["AU", "CA", "US", "UK", "IE", "XX"])
  assert.deepEqual(countries.map((country) => country.code), ["AU", "CA", "US", "UK"])
})

test("comparison scenarios retain user inputs without accepting impossible budgets", () => {
  assert.deepEqual(
    parseComparisonScenario({
      degreeYears: "1.5",
      annualTuition: "24000",
      currency: "USD",
      studentHousing: "studio",
      graduateHousing: "city_one_bedroom",
    }),
    {
      degreeYears: 1.5,
      annualTuition: { amount: 24000, currency: "USD", basis: "annual tuition entered by visitor" },
      studentHousing: "studio",
      graduateHousing: "city_one_bedroom",
      taxHousehold: "single_no_dependants",
    },
  )
  assert.equal(
    parseComparisonScenario({
      degreeYears: "99",
      annualTuition: "-1",
      currency: "USD",
      studentHousing: "not-a-house",
      graduateHousing: "not-a-house",
    }).annualTuition,
    undefined,
  )
})
