import assert from "node:assert/strict"
import test from "node:test"
import {
  normalizeSavedCareerResultInput,
  toSavedCareerResultWrite,
} from "../src/lib/workspace/saved-career-result"

const savedResult = {
  countryCode: "au",
  occupationId: "registered-nurse",
  personalised: true,
  evidenceCheckedAt: "2026-08-13T14:30:00.000Z",
  nextAction: "review_registration",
} as const

test("a saved result accepts only a canonical country and career, with minimal resume data", () => {
  assert.deepEqual(normalizeSavedCareerResultInput(savedResult), {
    countryCode: "AU",
    occupationId: "registered-nurse",
    personalised: true,
    evidenceCheckedAt: "2026-08-13",
    nextAction: "review_registration",
  })
})

test("a saved result rejects arbitrary destinations, careers and next actions", () => {
  assert.equal(normalizeSavedCareerResultInput({ ...savedResult, countryCode: "ZZ" }), null)
  assert.equal(normalizeSavedCareerResultInput({ ...savedResult, occupationId: "free-form-notes" }), null)
  assert.equal(normalizeSavedCareerResultInput({ ...savedResult, nextAction: "email-me" }), null)
  assert.equal(normalizeSavedCareerResultInput({ ...savedResult, personalised: "yes" }), null)
})

test("the database write contains no free-form or personalisation-answer fields", () => {
  const normalised = normalizeSavedCareerResultInput(savedResult)
  assert.ok(normalised)
  assert.deepEqual(toSavedCareerResultWrite(normalised, "2026-08-13T15:00:00.000Z"), {
    country_code: "AU",
    occupation_id: "registered-nurse",
    personalised: true,
    evidence_checked_at: "2026-08-13",
    next_action: "review_registration",
    updated_at: "2026-08-13T15:00:00.000Z",
  })
})
