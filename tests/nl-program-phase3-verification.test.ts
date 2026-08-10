import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260810104453_nl_program_phase3_verification.sql",
  "utf8",
)

test("NL Phase 3 enforces the verified 37-programme cohort", () => {
  assert.match(migration, /programme_count <> 37/)
  assert.match(migration, /international_count <> 37/)
  assert.match(migration, /duplicate_provider_title_groups/)
  assert.match(migration, /duplicate_recognition_groups/)
  assert.match(migration, /incomplete_approved_link_count/)
})

test("NL Phase 3 assigns conservative publication tiers", () => {
  assert.match(migration, /tier_a_count <> 26/)
  assert.match(migration, /tier_b_count <> 0/)
  assert.match(migration, /tier_c_count <> 11/)
  assert.match(migration, /x\.international_students_eligible IS TRUE/)
  assert.match(migration, /tier_c_with_canonical_provider/)
})

test("NL Phase 3 keeps application state separate from eligibility", () => {
  assert.match(migration, /canonical_admission_state/)
  assert.match(migration, /closed_2026_2027_application_window/)
  assert.match(migration, /closed_count <> 1/)
  assert.match(migration, /schedule_unknown_count <> 36/)
})

test("NL Phase 3 upgrades Twente to exact programme identities", () => {
  assert.match(migration, /utwente-business-information-technology','56066'/)
  assert.match(migration, /utwente-civil-engineering','50352'/)
  assert.match(migration, /utwente-mechanical-engineering','50439'/)
  assert.match(migration, /exact_twente_count <> 11/)
})

test("NL Phase 3 does not promote HBO candidates as a side effect", () => {
  assert.match(migration, /p\.institution_id IS NULL/)
  assert.match(migration, /p\.education_sector = 'HBO'/)
  assert.doesNotMatch(migration, /INSERT INTO catalog\.institutions/i)
})
