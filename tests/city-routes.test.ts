import assert from "node:assert/strict"
import test from "node:test"
import { auCityPath, normalizeCitySlug } from "../src/lib/cities/city-routes"

test("published Australian city routes are stable and lower-case", () => {
  assert.equal(normalizeCitySlug(" Sydney "), "sydney")
  assert.equal(auCityPath("Sydney"), "/cities/au/sydney")
  assert.equal(auCityPath("MELBOURNE"), "/cities/au/melbourne")
  assert.equal(auCityPath("Brisbane"), "/cities/au/brisbane")
})

test("unpublished or invalid Australian city routes are not linked", () => {
  assert.equal(auCityPath("perth"), null)
  assert.equal(auCityPath("not/a/city"), null)
  assert.equal(auCityPath(null), null)
})
