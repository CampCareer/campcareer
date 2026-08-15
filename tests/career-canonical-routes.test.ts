import assert from "node:assert/strict"
import test from "node:test"
import {
  careerCanonicalPath,
  getCareerRoute,
  getIndexableCareerRoute,
  occupationCanonicalPath,
} from "../src/lib/workspace/occupation-routes"

test("Career canonical paths use human-readable country slugs and stable career ids", () => {
  assert.equal(careerCanonicalPath("AU", "electrician"), "/career/australia/electrician")
  assert.equal(careerCanonicalPath("australia", "registered-nurse"), "/career/australia/registered-nurse")
  assert.equal(careerCanonicalPath("GB", "software-developer"), "/career/united-kingdom/software-developer")
})

test("Career route resolution accepts country codes or launch-country slugs", () => {
  const fromCode = getCareerRoute("CA", "registered-nurse")
  const fromSlug = getCareerRoute("canada", "registered-nurse")

  assert.equal(fromCode?.country.code, "CA")
  assert.equal(fromCode?.path, "/career/canada/registered-nurse")
  assert.deepEqual(fromSlug, fromCode)
})

test("Career indexability remains an explicit publication decision", () => {
  assert.equal(getIndexableCareerRoute("AU", "electrician")?.path, "/career/australia/electrician")
  assert.equal(getIndexableCareerRoute("CA", "registered-nurse"), null)
})

test("invalid country and career identifiers do not resolve", () => {
  assert.equal(getCareerRoute("mars", "electrician"), null)
  assert.equal(getCareerRoute("AU", "not-a-career"), null)
})

test("legacy occupation canonical helper now resolves to the Career surface", () => {
  assert.equal(occupationCanonicalPath("AU", "electrician"), "/career/australia/electrician")
})
