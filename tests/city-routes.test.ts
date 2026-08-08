import assert from "node:assert/strict"
import test from "node:test"
import { auCityPath, normalizeCitySlug } from "../src/lib/cities/city-routes"

test("published Australian city routes are stable and lower-case", () => {
  assert.equal(normalizeCitySlug(" Sydney "), "sydney")
  assert.equal(auCityPath("Sydney"), "/cities/au/sydney")
  assert.equal(auCityPath("MELBOURNE"), "/cities/au/melbourne")
  assert.equal(auCityPath("Brisbane"), "/cities/au/brisbane")
  assert.equal(auCityPath("Perth"), "/cities/au/perth")
  assert.equal(auCityPath("Adelaide"), "/cities/au/adelaide")
})

test("unpublished or invalid Australian city routes are not linked", () => {
  assert.equal(auCityPath("canberra"), null)
  assert.equal(auCityPath("not/a/city"), null)
  assert.equal(auCityPath(null), null)
})
