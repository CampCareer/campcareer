import assert from "node:assert/strict"
import test from "node:test"
import {
  AU_ROUTE_CANDIDATES,
  AU_ROUTE_CATEGORIES,
  findAustraliaRouteCandidates,
} from "../src/data/route-taxonomy"

test("the Australia launch taxonomy has twelve human-first browse categories", () => {
  assert.equal(AU_ROUTE_CATEGORIES.length, 12)
  assert.ok(AU_ROUTE_CATEGORIES.some((category) => category.id === "beauty-wellness"))
  assert.ok(AU_ROUTE_CATEGORIES.some((category) => category.id === "law-public-service"))
})

test("the Australia launch catalogue covers every category with canonical work intents", () => {
  assert.equal(AU_ROUTE_CANDIDATES.length, 30)
  for (const category of AU_ROUTE_CATEGORIES) {
    assert.ok(AU_ROUTE_CANDIDATES.some((candidate) => candidate.categoryId === category.id), category.id)
  }
  assert.ok(AU_ROUTE_CANDIDATES.every((candidate) => candidate.oscaCodes.length > 0))
})

test("search starts with the user's words instead of requiring category knowledge", () => {
  assert.equal(findAustraliaRouteCandidates("뷰티")[0]?.id, "beauty-therapist")
  assert.equal(findAustraliaRouteCandidates("차일드 케어")[0]?.id, "early-childhood-educator")
  assert.equal(findAustraliaRouteCandidates("software developer")[0]?.id, "software-engineer")
  assert.equal(findAustraliaRouteCandidates("광산 현장")[0]?.id, "mining-site-work")
})
