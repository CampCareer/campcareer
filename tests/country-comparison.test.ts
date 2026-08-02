import assert from "node:assert/strict"
import test from "node:test"
import {
  COUNTRY_COMPARE_MAX_LOCATIONS,
  addCountrySlot,
  buildCountryCompareHref,
  cancelEmptyCountrySlot,
  completeCountryLocations,
  fromExternalIsoCountryCode,
  normalizeCountryLocations,
  parseCountryComparisonState,
  removeCountrySlot,
  replaceCityInSlot,
  replaceCountryInSlot,
  resolveComparisonPageType,
  slotsFromCountryLocations,
  toExternalIsoCountryCode,
} from "../src/lib/country-comparison"
import { COUNTRY_COMPARE_CATALOG, getCountryCompareCity } from "../src/data/country-comparison/locations"
import {
  REGISTERED_NURSE_COUNTRY_SHELL,
} from "../src/data/country-comparison/registered-nurse"
import {
  REGISTERED_NURSE_MATRIX_ROWS,
  formatCountryComparisonRow,
} from "../src/data/country-comparison/registered-nurse-rows"
import {
  areSourceIdsKnown,
  isCountryComparisonValueType,
  resolveSourceReferences,
  type MoneyValue,
  type SourceReference,
} from "../src/data/country-comparison/contracts"

test("compare dispatcher keeps Programs default and isolates Countries", () => {
  assert.equal(resolveComparisonPageType(null), "program")
  assert.equal(resolveComparisonPageType("program"), "program")
  assert.equal(resolveComparisonPageType("country"), "country")
  assert.equal(resolveComparisonPageType("career"), "career")
  assert.equal(resolveComparisonPageType("countries"), "unsupported")
})

test("country comparison accepts only the registered nurse starting profile", () => {
  const supported = parseCountryComparisonState(new URLSearchParams("goal=registered-nurse&profile=starting-from-scratch"))
  assert.equal(supported.contextState, "supported")
  assert.equal(supported.locations.length, 0)

  const invalidGoal = parseCountryComparisonState(new URLSearchParams("goal=software-developer&profile=starting-from-scratch"))
  assert.equal(invalidGoal.contextState, "unsupported")

  const invalidProfile = parseCountryComparisonState(new URLSearchParams("goal=registered-nurse&profile=already-qualified"))
  assert.equal(invalidProfile.contextState, "unsupported")
})

test("locations normalize pairs, validate country membership, dedupe countries, and cap at five", () => {
  assert.deepEqual(
    normalizeCountryLocations(" au:SYDNEY , IE:dublin,AU:melbourne,IE:sydney,UK:london,UK:glasgow,AU:brisbane,XX:sydney,IE:unknown"),
    [
      { countryCode: "AU", citySlug: "sydney" },
      { countryCode: "IE", citySlug: "dublin" },
      { countryCode: "UK", citySlug: "london" },
    ],
  )
  assert.deepEqual(normalizeCountryLocations("AU, :sydney, AU:, AU:dublin, IE:sydney"), [])
})

test("country and external ISO codes remain distinct at the adapter boundary", () => {
  assert.equal(toExternalIsoCountryCode("AU"), "AU")
  assert.equal(toExternalIsoCountryCode("IE"), "IE")
  assert.equal(toExternalIsoCountryCode("UK"), "GB")
  assert.equal(fromExternalIsoCountryCode("GB"), "UK")
  assert.equal(fromExternalIsoCountryCode("UK"), null)
})

test("country URLs are canonical and omit incomplete locations", () => {
  assert.equal(
    buildCountryCompareHref([
      { countryCode: "AU", citySlug: "sydney" },
      { countryCode: "IE", citySlug: "dublin" },
    ]),
    "/compare?type=country&goal=registered-nurse&profile=starting-from-scratch&locations=AU:sydney,IE:dublin",
  )
  assert.deepEqual(
    completeCountryLocations([
      { countryCode: "AU", citySlug: null, optional: false },
      { countryCode: "IE", citySlug: "dublin", optional: false },
    ]),
    [{ countryCode: "IE", citySlug: "dublin" }],
  )
})

test("selection helpers reset cities, preserve order, compact removals, and cancel optional slots", () => {
  const initial = slotsFromCountryLocations([
    { countryCode: "AU", citySlug: "sydney" },
    { countryCode: "IE", citySlug: "dublin" },
  ])
  const replaced = replaceCountryInSlot(initial, 0, "UK")
  assert.deepEqual(replaced.map((slot) => [slot.countryCode, slot.citySlug]), [["UK", null], ["IE", "dublin"]])

  const city = getCountryCompareCity("UK", "london")
  assert.ok(city)
  const completed = replaceCityInSlot(replaced, 0, city!)
  assert.deepEqual(completeCountryLocations(completed), [
    { countryCode: "UK", citySlug: "london" },
    { countryCode: "IE", citySlug: "dublin" },
  ])

  const withExtra = addCountrySlot(completed)
  assert.equal(withExtra.length, 3)
  assert.equal(withExtra[2].optional, true)
  assert.equal(cancelEmptyCountrySlot(withExtra, 2).length, 2)

  const removed = removeCountrySlot(completed, 0)
  assert.deepEqual(removed.map((slot) => [slot.countryCode, slot.citySlug]), [["IE", "dublin"], [null, null]])
})

test("selection helpers keep country-city pairs aligned and expose the 0-to-3 state progression", () => {
  const empty = slotsFromCountryLocations([])
  const one = slotsFromCountryLocations([{ countryCode: "AU", citySlug: "sydney" }])
  const two = slotsFromCountryLocations([
    { countryCode: "AU", citySlug: "sydney" },
    { countryCode: "IE", citySlug: "dublin" },
  ])
  const three = slotsFromCountryLocations([
    { countryCode: "AU", citySlug: "sydney" },
    { countryCode: "IE", citySlug: "dublin" },
    { countryCode: "UK", citySlug: "london" },
  ])

  assert.equal(completeCountryLocations(empty).length, 0)
  assert.equal(completeCountryLocations(one).length, 1)
  assert.equal(completeCountryLocations(two).length, 2)
  assert.equal(completeCountryLocations(three).length, 3)

  const mismatchedCity = getCountryCompareCity("IE", "cork")
  assert.ok(mismatchedCity)
  assert.deepEqual(replaceCityInSlot(two, 0, mismatchedCity!), two)
})

test("country selection has a hard five-slot ceiling", () => {
  let slots = slotsFromCountryLocations([
    { countryCode: "AU", citySlug: "sydney" },
    { countryCode: "IE", citySlug: "dublin" },
  ])
  slots = addCountrySlot(slots)
  slots = addCountrySlot(slots)
  slots = addCountrySlot(slots)
  slots = addCountrySlot(slots)
  assert.equal(slots.length, COUNTRY_COMPARE_MAX_LOCATIONS)
  assert.equal(addCountrySlot(slots).length, COUNTRY_COMPARE_MAX_LOCATIONS)
})

test("country parser ignores invalid locations without falling back to another country", () => {
  const parsed = parseCountryComparisonState(new URLSearchParams("goal=registered-nurse&profile=starting-from-scratch&locations=AU:dublin,IE:sydney,UK:london"))
  assert.deepEqual(parsed.locations, [{ countryCode: "UK", citySlug: "london" }])
})

test("AU, IE, and UK share the same null-safe RN contract", () => {
  assert.deepEqual(REGISTERED_NURSE_COUNTRY_SHELL.map((country) => country.countryCode), ["AU", "IE", "UK"])
  for (const country of REGISTERED_NURSE_COUNTRY_SHELL) {
    assert.equal(country.goal, "registered-nurse")
    assert.equal(country.profile, "starting-from-scratch")
    assert.equal(country.audience, "international-student")
    assert.equal(country.qualificationProfile, "no-nursing-qualification-or-registration")
    assert.equal(country.pathway.qualificationRoute, null)
    assert.equal(country.pathway.studyDuration, null)
    assert.equal(country.studyCost.annualTuition, null)
    assert.equal(country.visa.studentVisa, null)
    assert.equal(country.professionalIncome.startingIncome, null)
    assert.equal(country.timeAndInvestment.recoveryPeriod, null)
    assert.deepEqual(country.sources, [])
    assert.equal("cityCost" in country, false)
  }
  assert.deepEqual(COUNTRY_COMPARE_CATALOG.map((country) => country.productCode), ["AU", "IE", "UK"])
})

test("common value types support ranges, null values, and value-type validation", () => {
  const tuitionRange: MoneyValue = {
    currency: "AUD",
    amount: null,
    min: 30000,
    max: 50000,
    period: "year",
    effectiveYear: null,
    valueType: "range",
    sourceIds: [],
  }
  assert.equal(tuitionRange.amount, null)
  assert.equal(tuitionRange.valueType, "range")
  assert.equal(isCountryComparisonValueType("official"), true)
  assert.equal(isCountryComparisonValueType("unavailable"), true)
  assert.equal(isCountryComparisonValueType("fabricated"), false)
})

test("source references resolve known IDs and safely ignore missing IDs", () => {
  const source: SourceReference = {
    id: "source-au-rn-1",
    label: "Example official source",
    url: "https://example.com/source",
    sourceType: "official",
    reviewedAt: null,
    effectiveYear: null,
    verificationStatus: "verified",
  }
  assert.equal(areSourceIdsKnown(["source-au-rn-1"], [source]), true)
  assert.equal(areSourceIdsKnown(["missing-source"], [source]), false)
  assert.deepEqual(resolveSourceReferences(["source-au-rn-1", "missing-source"], [source]), [source])
})

test("RN matrix rows use shared definitions and keep missing values safe", () => {
  const country = REGISTERED_NURSE_COUNTRY_SHELL.find((entry) => entry.countryCode === "AU")!
  const city = getCountryCompareCity("AU", "sydney")
  const context = { country, city, cityCost: null }
  const rowKeys = REGISTERED_NURSE_MATRIX_ROWS.map((row) => row.fieldKey)
  assert.equal(new Set(rowKeys).size, rowKeys.length)
  assert.equal(formatCountryComparisonRow(REGISTERED_NURSE_MATRIX_ROWS.find((row) => row.fieldKey === "studyCost.annualTuition")!, context), "Not available")
  assert.equal(formatCountryComparisonRow(REGISTERED_NURSE_MATRIX_ROWS.find((row) => row.fieldKey === "city.cityName")!, context), "Sydney")
  assert.equal(formatCountryComparisonRow(REGISTERED_NURSE_MATRIX_ROWS.find((row) => row.fieldKey === "currency")!, context), "AUD (A$)")
  assert.deepEqual([...new Set(REGISTERED_NURSE_MATRIX_ROWS.map((row) => row.section))], [
    "Pathway",
    "Study cost",
    "Living in selected city",
    "Visa and post-study",
    "Professional income",
    "Time and investment",
    "Source",
  ])
})
