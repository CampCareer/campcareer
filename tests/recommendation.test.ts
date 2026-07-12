import assert from "node:assert/strict"
import test from "node:test"
import { recommendStudyCountries } from "../src/lib/study-product/recommendation"
import { getCountryOptions, isIsoCountryCode } from "../src/lib/study-product/countries"

const BASE_INPUT = {
  locale: "en" as const,
  originCountry: "IN",
  targetConceptId: "nursing",
  firstYearBudget: { amount: 3_000_000, currency: "INR" },
  priority: "CAREER_OUTCOME" as const,
}

test("recommendations are deterministic and hide internal scores", () => {
  const first = recommendStudyCountries(BASE_INPUT)
  const second = recommendStudyCountries(BASE_INPUT)

  assert.deepEqual(
    { ...first, generatedAt: "ignored" },
    { ...second, generatedAt: "ignored" },
  )
  assert.ok(first.rankedCountries.length >= 2)
  assert.ok(first.rankedCountries.every((country) => !("score" in country)))
  assert.ok(first.rankedCountries.every((country) => country.metrics.every((metric) => metric.sourceId && metric.sourceName && metric.asOf)))
  assert.ok(first.rankedCountries.every((country) => country.metrics.some((metric) => metric.sourceUrl?.startsWith("https://"))))
})

test("a trade concept never inherits a broad parent ranking", () => {
  const result = recommendStudyCountries({
    ...BASE_INPUT,
    targetConceptId: "carpentry",
  })

  assert.equal(result.rankedCountries.length, 0)
  assert.ok(result.unrankedCountries.some((country) => country.coverage === "PATHWAY_READY"))
})

test("the selected priority can change country order", () => {
  const career = recommendStudyCountries(BASE_INPUT)
  const cost = recommendStudyCountries({ ...BASE_INPUT, priority: "LOWER_COST" })

  assert.notDeepEqual(
    career.rankedCountries.map((country) => country.countryCode),
    cost.rankedCountries.map((country) => country.countryCode),
  )
})

test("V3 recommendations work without an origin country or personal budget", () => {
  const result = recommendStudyCountries({
    locale: "en",
    targetConceptId: "nursing",
    priority: "LOWER_COST",
  })

  assert.ok(result.rankedCountries.length >= 2)
  assert.ok(result.rankedCountries.every((country) => country.originComparison.status === "NOT_SELECTED"))
})

test("origin comparisons never invent a same-occupation salary delta", () => {
  const result = recommendStudyCountries({
    locale: "en",
    targetConceptId: "nursing",
    priority: "CAREER_OUTCOME",
    originCountry: "SG",
  })

  assert.ok(result.rankedCountries.every((country) => country.originComparison.status === "UNAVAILABLE"))
  assert.ok(result.rankedCountries.every((country) => country.originComparison.salaryDifferenceUsd === undefined))
})

test("global country selector contains the 249 official ISO alpha-2 entries", () => {
  const countries = getCountryOptions("en")
  assert.equal(countries.length, 249)
  assert.ok(isIsoCountryCode("US"))
  assert.ok(isIsoCountryCode("CN"))
  assert.equal(isIsoCountryCode("XK"), false)
})
