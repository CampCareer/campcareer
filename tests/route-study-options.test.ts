import assert from "node:assert/strict"
import test from "node:test"
import { matchesExactAuRouteCourse } from "../src/data/au-route-course-matchers"
import { parsePositiveAud, parseTuitionYear, parseVerifiedCampuses } from "../src/data/au-route-study-contract"
import { ROUTE_GUIDES } from "../src/data/route-guides"
import { getAuRouteCourseMatcher } from "../src/data/au-route-course-matchers"

test("every published route has a career-specific course or training matcher", () => {
  for (const guide of ROUTE_GUIDES) {
    assert.ok(guide.candidateId, guide.id)
    assert.ok(getAuRouteCourseMatcher(guide.candidateId!), guide.candidateId)
  }
})

test("exact route matching rejects broad-field and research-degree false positives", () => {
  assert.equal(matchesExactAuRouteCourse("registered-nurse", "Bachelor of Nursing"), true)
  assert.equal(matchesExactAuRouteCourse("beauty-therapist", "Certificate IV in Beauty Therapy"), true)
  assert.equal(matchesExactAuRouteCourse("beauty-therapist", "Certificate IV in Kitchen Management"), false)
  assert.equal(matchesExactAuRouteCourse("civil-engineer", "Master of Engineering (Civil Engineering)"), true)
  assert.equal(matchesExactAuRouteCourse("civil-engineer", "Doctor of Philosophy (Civil Engineering)"), false)
  assert.equal(matchesExactAuRouteCourse("software-engineer", "Master of Philosophy (Computer Science)"), false)
})

test("zero tuition and unstructured campus claims cannot be published as course facts", () => {
  assert.equal(parsePositiveAud(0), null)
  assert.equal(parsePositiveAud("A$0"), null)
  assert.equal(parsePositiveAud({ amountAud: 55500 }), 55500)
  assert.equal(parseTuitionYear({ amountAud: 55500, year: 2026 }), 2026)
  assert.equal(parseTuitionYear({ amountAud: 55500, year: 0 }), null)
  assert.deepEqual(parseVerifiedCampuses("Sydney"), [])
  assert.deepEqual(
    parseVerifiedCampuses({ campuses: [{ name: "Kensington", state: "NSW" }, { name: "Kensington", state: "NSW" }] }),
    [{ name: "Kensington", state: "NSW" }],
  )
})
