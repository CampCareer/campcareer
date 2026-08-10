import assert from "node:assert/strict"
import test from "node:test"
import { LAUNCH_COUNTRY_CODES } from "@/data/launch-countries"
import {
  CITIZENSHIP_COUNTRIES,
  CITIZENSHIP_OPTIONS,
  OTHER_CITIZENSHIP,
  getCitizenshipCountry,
  isCitizenshipCountryCode,
  isCitizenshipSelection,
} from "@/data/citizenship-countries"

test("citizenship registry contains the 20 launch countries and 10 priority source countries", () => {
  assert.equal(CITIZENSHIP_COUNTRIES.length, 30)
  assert.equal(new Set(CITIZENSHIP_COUNTRIES.map((country) => country.code)).size, 30)

  for (const launchCountryCode of LAUNCH_COUNTRY_CODES) {
    assert.ok(getCitizenshipCountry(launchCountryCode), `${launchCountryCode} should be available as a citizenship`)
  }

  assert.deepEqual(
    CITIZENSHIP_COUNTRIES
      .filter((country) => country.market === "priority-source-country")
      .map((country) => country.code),
    ["IN", "CN", "PH", "VN", "ID", "NP", "PK", "BD", "NG", "BR"],
  )
})

test("unlisted citizenship remains a selection state instead of a country", () => {
  assert.equal(OTHER_CITIZENSHIP.value, "OTHER")
  assert.equal(CITIZENSHIP_OPTIONS.at(-1), OTHER_CITIZENSHIP)
  assert.equal(getCitizenshipCountry(OTHER_CITIZENSHIP.value), null)
  assert.equal(isCitizenshipCountryCode("OTHER"), false)
  assert.equal(isCitizenshipSelection("OTHER"), true)
  assert.equal(isCitizenshipSelection("XX"), false)
})

test("United Kingdom keeps the CampCareer code while exposing its ISO code", () => {
  assert.deepEqual(getCitizenshipCountry("uk"), {
    code: "UK",
    isoCode: "GB",
    name: "United Kingdom",
    market: "launch-country",
  })
})
