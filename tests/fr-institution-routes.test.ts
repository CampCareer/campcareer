import assert from "node:assert/strict"
import test from "node:test"
import {
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
} from "../src/lib/institutions/institution-search"

test("France institution routes use the canonical lower-case country segment", () => {
  assert.equal(normalizeInstitutionCountrySegment("fr"), "FR")
  assert.equal(normalizeInstitutionCountrySegment("FR"), "FR")
  assert.equal(institutionCountryPath("FR"), "/institutions/fr")
  assert.equal(
    institutionDetailPath("FR", "Universite-Paris-Saclay"),
    "/institutions/fr/universite-paris-saclay",
  )
})
