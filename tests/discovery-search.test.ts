import test from "node:test"
import assert from "node:assert/strict"
import { CANONICAL_CAREERS, careersForCategory } from "../src/data/career-comparison-catalog"
import { buildCountryRankings, buildMajorRecommendations, buildUniversityMatches, parseSearchIntent } from "../src/lib/discovery/search-contract"

test("discovery intent requires canonical career, fixed budget, and fixed goal", () => {
  const intent = parseSearchIntent({ career: "registered-nurse", budget: "50000-75000", goal: "career-outcomes", currency: "usd" })
  assert.equal(intent?.career.id, "registered-nurse")
  assert.equal(intent?.currency, "USD")
  assert.equal(parseSearchIntent({ career: "not-a-career", budget: "50000-75000", goal: "career-outcomes", currency: "USD" }), null)
})

test("the canonical catalogue remains 10 categories of eight careers", () => {
  assert.equal(CANONICAL_CAREERS.length, 80)
  const categories = new Set(CANONICAL_CAREERS.map((career) => career.categoryId))
  assert.equal(categories.size, 10)
  for (const category of categories) assert.equal(careersForCategory(category).length, 8)
})

test("country rankings do not publish a fabricated order without three evidence-complete countries", () => {
  const intent = parseSearchIntent({ career: "registered-nurse", budget: "50000-75000", goal: "career-outcomes", currency: "USD" })!
  const result = buildCountryRankings(intent)
  assert.equal(result.data.rankingAvailable, false)
  assert.equal(result.data.ranked.length, 0)
  assert.equal(result.readiness, "review_required")
})

test("major and university discovery reject unsupported countries and careers", () => {
  assert.equal(buildMajorRecommendations({ countryCode: "XX", goal: "career-outcomes" }), null)
  assert.equal(buildUniversityMatches({ countryCode: "AU", career: "not-a-career", budget: "50000-75000" }), null)
})
