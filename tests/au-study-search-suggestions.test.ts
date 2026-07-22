import assert from "node:assert/strict"
import test from "node:test"
import { getAuStudySearchSuggestions } from "../src/lib/au-study-search-suggestions"

test("technology search assist offers only taxonomy-backed study subjects and careers", () => {
  const suggestions = getAuStudySearchSuggestions({ category: "technology", locale: "en" })

  assert.ok(suggestions.subjects.some((subject) => subject.id === "computer-science"))
  assert.ok(suggestions.careers.some((career) => career.label === "Software Developer"))
  assert.ok(suggestions.careers.every((career) => career.query.length > 0))
})

test("Korean query matches a Korean alias without inventing an unrelated subject", () => {
  const suggestions = getAuStudySearchSuggestions({ category: "health", query: "간호", locale: "ko" })

  assert.deepEqual(suggestions.subjects.map((subject) => subject.id), ["nursing"])
  assert.ok(suggestions.careers.some((career) => career.label === "간호사"))
})
