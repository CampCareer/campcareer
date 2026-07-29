import assert from "node:assert/strict"
import test from "node:test"
import { isPublicProductCountry, PRODUCT_CORE, PUBLIC_PRODUCT_COUNTRY_CODES } from "../src/lib/product-scope"

test("the public entry surface is Australia-only", () => {
  assert.deepEqual(PUBLIC_PRODUCT_COUNTRY_CODES, ["AU"])
  assert.equal(isPublicProductCountry("AU"), true)
  assert.equal(isPublicProductCountry("au"), true)
  assert.equal(isPublicProductCountry("CA"), false)
  assert.equal(isPublicProductCountry("NZ"), false)
})

test("the product only exposes a route search, route guide, and map", () => {
  assert.deepEqual(PRODUCT_CORE.allowedSurfaces, ["route-search", "route-guide", "maps"])
  assert.deepEqual(PRODUCT_CORE.requiredOutputs, ["visa", "work-conditions", "preparation", "jobs", "courses", "map"])
})
