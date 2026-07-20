import assert from "node:assert/strict"
import test from "node:test"
import { isPublicProductCountry, PUBLIC_PRODUCT_COUNTRY_CODES } from "../src/lib/product-scope"

test("the public entry surface is Australia-only", () => {
  assert.deepEqual(PUBLIC_PRODUCT_COUNTRY_CODES, ["AU"])
  assert.equal(isPublicProductCountry("AU"), true)
  assert.equal(isPublicProductCountry("au"), true)
  assert.equal(isPublicProductCountry("CA"), false)
  assert.equal(isPublicProductCountry("NZ"), false)
})
