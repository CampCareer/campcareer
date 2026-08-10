import assert from "node:assert/strict"
import test from "node:test"
import {
  buildInstitutionExplorerUrl,
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
  normalizeInstitutionSlugSegment,
  parseInstitutionSearchParams,
} from "../src/lib/institutions/institution-search"

test("institution search params keep only supported filters", () => {
  assert.deepEqual(parseInstitutionSearchParams({}), { q: "", city: "", kind: "all", page: 1 })
  const parsed = parseInstitutionSearchParams({ q: "  University of Sydney  ", city: "  Sydney ", kind: "university", page: "3" })
  assert.equal(parsed.q, "University of Sydney")
  assert.equal(parsed.city, "Sydney")
  assert.equal(parsed.kind, "university")
  assert.equal(parsed.page, 3)
  assert.equal(parseInstitutionSearchParams({ kind: "unknown" }).kind, "all")
  assert.equal(parseInstitutionSearchParams({ page: "-2" }).page, 1)
})

test("institution country routes use stable lower-case country segments", () => {
  assert.equal(normalizeInstitutionCountrySegment("au"), "AU")
  assert.equal(normalizeInstitutionCountrySegment("CA"), "CA")
  assert.equal(normalizeInstitutionCountrySegment("uk"), "UK")
  assert.equal(normalizeInstitutionCountrySegment("nl"), "NL")
  assert.equal(normalizeInstitutionCountrySegment("nz"), "NZ")
  assert.equal(normalizeInstitutionCountrySegment("sg"), "SG")
  assert.equal(normalizeInstitutionCountrySegment("de"), "DE")
  assert.equal(normalizeInstitutionCountrySegment("us"), "US")
  assert.equal(institutionCountryPath("AU"), "/institutions/au")
  assert.equal(institutionCountryPath("UK"), "/institutions/uk")
  assert.equal(institutionCountryPath("NL"), "/institutions/nl")
  assert.equal(institutionCountryPath("NZ"), "/institutions/nz")
  assert.equal(institutionCountryPath("SG"), "/institutions/sg")
  assert.equal(institutionCountryPath("DE"), "/institutions/de")
})

test("institution detail paths normalize stable persisted slugs", () => {
  assert.equal(normalizeInstitutionSlugSegment("University-of-Sydney"), "university-of-sydney")
  assert.equal(normalizeInstitutionSlugSegment("not/a/slug"), null)
  assert.equal(institutionDetailPath("CA", "University-of-Toronto"), "/institutions/ca/university-of-toronto")
  assert.equal(institutionDetailPath("UK", "City-St-Georges-University-of-London"), "/institutions/uk/city-st-georges-university-of-london")
  assert.equal(institutionDetailPath("NL", "Delft-University-of-Technology"), "/institutions/nl/delft-university-of-technology")
  assert.equal(institutionDetailPath("NZ", "University-of-Auckland"), "/institutions/nz/university-of-auckland")
  assert.equal(institutionDetailPath("SG", "National-University-of-Singapore"), "/institutions/sg/national-university-of-singapore")
  assert.equal(institutionDetailPath("DE", "RWTH-Aachen-University"), "/institutions/de/rwth-aachen-university")
  assert.throws(() => institutionDetailPath("AU", "bad/slug"))
})

test("institution explorer URLs preserve search filters and omit defaults", () => {
  const filters = parseInstitutionSearchParams({ q: "Sydney", city: "Sydney", kind: "tafe_vet", page: "2" })
  assert.equal(buildInstitutionExplorerUrl("AU", filters), "/institutions/au?q=Sydney&city=Sydney&kind=tafe_vet&page=2")
  assert.equal(buildInstitutionExplorerUrl("AU", filters, { q: "", city: "", kind: "all", page: 1 }), "/institutions/au")
})
