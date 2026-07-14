import assert from "node:assert/strict"
import test from "node:test"
import {
  CANONICAL_CAREERS,
  careersForCategory,
  isExactApprovedMapping,
} from "../src/data/career-comparison-catalog"
import { STUDY_CATEGORIES } from "../src/data/study-concepts"
import { LAUNCH_COUNTRIES } from "../src/data/launch-countries"
import { recommendCareerCountriesV4 } from "../src/lib/study-product/career-recommendation-v4"
import {
  NEW_COUNTRY_CODES,
  getNewCountryReleaseGate,
  isCountryDecisionReady,
  isCountrySearchIndexable,
} from "../src/lib/new-country-release-gate"
import {
  DEFAULT_RECOMMENDATION_INPUT,
  recommendCountries,
} from "../src/lib/country-recommendation"

test("new country packs cannot enter search or ranked comparison before release", () => {
  const unreleasedCountries = NEW_COUNTRY_CODES
  for (const countryCode of unreleasedCountries) {
    const gate = getNewCountryReleaseGate(countryCode)
    assert.equal(gate?.stage, "REVIEW_REQUIRED")
    assert.equal(isCountrySearchIndexable(countryCode), false)
    assert.equal(isCountryDecisionReady(countryCode), false)
  }
})

test("the legacy country scorecard also excludes gated countries", () => {
  const unreleasedCountries = NEW_COUNTRY_CODES
  const result = recommendCountries(DEFAULT_RECOMMENDATION_INPUT)
  assert.ok(
    result.every((country) => !unreleasedCountries.includes(country.code as typeof unreleasedCountries[number])),
  )
})

test("the canonical job catalogue has exactly eight careers in every launch category", () => {
  assert.equal(LAUNCH_COUNTRIES.length, 20)
  assert.equal(CANONICAL_CAREERS.length, 80)
  assert.equal(new Set(CANONICAL_CAREERS.map((career) => career.id)).size, CANONICAL_CAREERS.length)

  for (const category of STUDY_CATEGORIES) {
    assert.equal(careersForCategory(category.id).length, 8, category.label + " must have eight canonical careers")
  }
})

test("V4 does not turn legacy field scores into a public career ranking", () => {
  const result = recommendCareerCountriesV4({
    locale: "en",
    targetCareerId: "registered-nurse",
    priority: "CAREER_OUTCOME",
  })
  assert.equal(result.rankedCountries.length, 0)
  assert.equal(result.unrankedCountries.length, 20)
})

test("only an exact, reviewed mapping can support a cross-country career comparison", () => {
  assert.equal(
    isExactApprovedMapping({
      countryCode: "NZ",
      canonicalCareerId: "carpenter",
      officialSystem: "ANZSCO",
      officialSystemVersion: "2022",
      officialCode: "331212",
      relation: "related",
      sourceUrl: "https://example.com",
      sourceCheckedAt: "2026-07-13",
      reviewStatus: "approved",
    }),
    false,
  )

  assert.equal(
    isExactApprovedMapping({
      countryCode: "NZ",
      canonicalCareerId: "carpenter",
      officialSystem: "ANZSCO",
      officialSystemVersion: "2022",
      officialCode: "331212",
      relation: "exact",
      sourceUrl: "https://example.com",
      sourceCheckedAt: "2026-07-13",
      reviewStatus: "approved",
    }),
    true,
  )
})
