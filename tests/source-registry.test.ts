import assert from "node:assert/strict"
import test from "node:test"
import { LAUNCH_COUNTRY_CODES } from "../src/data/launch-countries"
import { CORE_DATA_CATEGORIES, SOURCE_REGISTRY, getSourceRegistryCoverageIssues } from "../src/data/source-registry"

test("the source registry covers every launch country and core category", () => {
  assert.deepEqual(new Set(SOURCE_REGISTRY.map((source) => source.country)), new Set(LAUNCH_COUNTRY_CODES))
  assert.deepEqual(getSourceRegistryCoverageIssues(), [])
})

test("Japan is evidence-listed but cannot support ranked results yet", () => {
  const japanSources = SOURCE_REGISTRY.filter((source) => source.country === "JP")

  assert.equal(japanSources.length, CORE_DATA_CATEGORIES.length)
  assert.ok(japanSources.every((source) => source.reviewStatus === "review-required"))
  assert.ok(japanSources.every((source) => source.confidence === "official"))
  assert.ok(japanSources.every((source) => source.sourceUrl.startsWith("https://")))
})
