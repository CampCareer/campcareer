import assert from "node:assert/strict"
import test from "node:test"
import { rankAustralianPathways, type AuPathfinderProfile } from "../src/lib/au-pathfinder"

test("Australia pathfinder ranks only the requested study category", () => {
  const profile: AuPathfinderProfile = {
    visa: "student",
    goal: "income",
    budget: "balanced",
    timeline: "flexible",
    studyStage: "school",
    category: "technology",
  }
  const ranked = rankAustralianPathways(profile)

  assert.ok(ranked.length > 0)
  assert.ok(ranked.every((pathway) => pathway.concept.category === "technology"))
  assert.ok(ranked.every((pathway) => pathway.score >= 0 && pathway.score <= 100))
  assert.deepEqual(ranked.map((pathway) => pathway.score), [...ranked.map((pathway) => pathway.score)].sort((a, b) => b - a))
})

test("lower budget and a faster timeline materially change a path score", () => {
  const base: AuPathfinderProfile = {
    visa: "student",
    goal: "income",
    budget: "investment",
    timeline: "flexible",
    studyStage: "school",
    category: "any",
  }
  const costSensitive = rankAustralianPathways({ ...base, budget: "lower", timeline: "fast" })
  const investmentFocused = rankAustralianPathways(base)
  const conceptId = "aged-care"

  assert.notEqual(
    costSensitive.find((pathway) => pathway.concept.id === conceptId)?.score,
    investmentFocused.find((pathway) => pathway.concept.id === conceptId)?.score,
  )
})
