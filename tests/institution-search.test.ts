import assert from "node:assert/strict"
import test from "node:test"
import {
  buildInstitutionExplorerUrl,
  institutionCountryPath,
  normalizeInstitutionCountrySegment,
  parseInstitutionSearchParams,
} from "../src/lib/institutions/institution-search"

test("institution search params keep only supported filters", () => {
  assert.deepEqual(parseInstitutionSearchParams({}), {
    q: "",
    kind: "all",
    page: 1,
  })

  const parsed = parseInstitutionSearchParams({
    q: "  University of Sydney  ",
    kind: "university",
    page: "3",
  })

  assert.equal(parsed.q, "University of Sydney")
  assert.equal(parsed.kind, "university")
  assert.equal(parsed.page, 3)
  assert.equal(parseInstitutionSearchParams({ kind: "unknown" }).kind, "all")
  assert.equal(parseInstitutionSearchParams({ page: "-2" }).page, 1)
})

test("institution country routes use stable lower-case country segments", () => {
  assert.equal(normalizeInstitutionCountrySegment("au"), "AU")
  assert.equal(normalizeInstitutionCountrySegment("CA"), "CA")
  assert.equal(normalizeInstitutionCountrySegment("us"), null)
  assert.equal(institutionCountryPath("AU"), "/institutions/au")
})

test("institution explorer URLs preserve search filters and omit defaults", () => {
  const filters = parseInstitutionSearchParams({
    q: "Sydney",
    kind: "tafe_vet",
    page: "2",
  })

  assert.equal(
    buildInstitutionExplorerUrl("AU", filters),
    "/institutions/au?q=Sydney&kind=tafe_vet&page=2",
  )
  assert.equal(
    buildInstitutionExplorerUrl("AU", filters, { q: "", kind: "all", page: 1 }),
    "/institutions/au",
  )
})
