import assert from "node:assert/strict"
import test from "node:test"
import { CANONICAL_CAREERS } from "../src/data/career-comparison-catalog"
import { STUDY_CONCEPTS } from "../src/data/study-concepts"

test("occupation labels retain separate English and Korean values for locale switching", () => {
  for (const career of CANONICAL_CAREERS) {
    assert.ok(career.label.trim(), `missing English label for ${career.id}`)
    assert.ok(career.labelKo.trim(), `missing Korean label for ${career.id}`)
    assert.notEqual(career.label, career.labelKo, `occupation labels must not be duplicated for ${career.id}`)
  }
})

test("program labels retain separate English and Korean values for locale switching", () => {
  for (const concept of STUDY_CONCEPTS) {
    assert.ok(concept.label.trim(), `missing English label for ${concept.id}`)
    assert.ok(concept.labelKo.trim(), `missing Korean label for ${concept.id}`)
    assert.notEqual(concept.label, concept.labelKo, `program labels must not be duplicated for ${concept.id}`)
  }
})
