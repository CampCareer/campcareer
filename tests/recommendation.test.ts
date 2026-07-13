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

test("V3 remains deterministic but cannot publish a legacy field-score ranking", () => {
  const first = recommendStudyCountries(BASE_INPUT)
  const second = recommendStudyCountries(BASE_INPUT)

  assert.deepEqual(
    { ...first, generatedAt: "ignored" },
    { ...second, generatedAt: "ignored" },
  )
  assert.equal(first.rankedCountries.length, 0)
  assert.ok(first.unrankedCountries.length > 0)
})

test("a trade concept never inherits a broad parent ranking", () => {
  const result = recommendStudyCountries({
    ...BASE_INPUT,
    targetConceptId: "carpentry",
  })

  assert.equal(result.rankedCountries.length, 0)
  assert.ok(result.unrankedCountries.some((country) => country.coverage === "PATHWAY_READY"))
})

test("priority does not produce a V3 ranking before exact career evidence is published", () => {
  const career = recommendStudyCountries(BASE_INPUT)
  const cost = recommendStudyCountries({ ...BASE_INPUT, priority: "LOWER_COST" })

  assert.deepEqual(career.rankedCountries, cost.rankedCountries)
})

test("V3 accepts no origin country or personal budget without fabricating a result", () => {
  const result = recommendStudyCountries({
    locale: "en",
    targetConceptId: "nursing",
    priority: "LOWER_COST",
  })

  assert.equal(result.rankedCountries.length, 0)
  assert.ok(result.unrankedCountries.length > 0)
})

test("origin comparisons never invent a same-occupation salary delta", () => {
  const result = recommendStudyCountries({
    locale: "en",
    targetConceptId: "nursing",
    priority: "CAREER_OUTCOME",
    originCountry: "SG",
  })

  assert.equal(result.rankedCountries.length, 0)
})

test("global country selector contains the 249 official ISO alpha-2 entries", () => {
  const countries = getCountryOptions("en")
  assert.equal(countries.length, 249)
  assert.ok(isIsoCountryCode("US"))
  assert.ok(isIsoCountryCode("CN"))
  assert.equal(isIsoCountryCode("XK"), false)
})
