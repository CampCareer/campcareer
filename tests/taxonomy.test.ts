import assert from "node:assert/strict"
import test from "node:test"
import {
  normalizeTaxonomyQuery,
  STUDY_CATEGORIES,
  STUDY_CONCEPTS,
} from "../src/data/study-concepts"

test("taxonomy exposes ten exploration categories and broad course kinds", () => {
  assert.equal(STUDY_CATEGORIES.length, 10)
  assert.ok(STUDY_CONCEPTS.length > 5)
  assert.deepEqual(
    new Set(STUDY_CONCEPTS.map((concept) => concept.kind)),
    new Set(["STUDY_FIELD", "QUALIFICATION", "TRADE_PATHWAY"]),
  )
})

test("trade and Korean aliases are represented without inventing concepts", () => {
  const carpentry = STUDY_CONCEPTS.find((concept) => concept.id === "carpentry")
  const tiling = STUDY_CONCEPTS.find((concept) => concept.id === "wall-floor-tiling")

  assert.ok(carpentry?.aliases.includes("certificate iii carpentry"))
  assert.ok(carpentry?.aliasesKo.includes("목수"))
  assert.ok(tiling?.officialCodes?.some((code) => code.system === "OSCA"))
  assert.ok(tiling?.officialCodes?.some((code) => code.system === "ANZSCO"))
  assert.equal(normalizeTaxonomyQuery("  Certificate III: Carpentry! "), "certificate iii carpentry")
})

test("concept identifiers and slugs are unique", () => {
  assert.equal(new Set(STUDY_CONCEPTS.map((concept) => concept.id)).size, STUDY_CONCEPTS.length)
  assert.equal(new Set(STUDY_CONCEPTS.map((concept) => concept.slug)).size, STUDY_CONCEPTS.length)
})
