import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260810132813_nz_program_phase3_verification.sql",
  "utf8",
)

test("NZ Phase 3 stays inside the bounded occupation-led cohort", () => {
  assert.match(migration, /expected 24 programme\/international rows 1:1/)
  assert.match(migration, /expected 39 approved relations across 35 careers/)
  assert.match(migration, /canonical 80-career target set/)
  assert.match(migration, /country_code = 'CA'/)
  assert.match(migration, /relations outside canonical 80/)
})

test("NZ Phase 3 requires source-backed international and Code evidence for Tier A", () => {
  assert.match(migration, /international_students_eligible = TRUE/)
  assert.match(migration, /code_signatory_status = 'confirmed'/)
  assert.match(migration, /verification_status = 'verified'/)
  assert.match(migration, /THEN 'A'/)
  assert.match(migration, /tier_a <> 24 OR tier_b <> 0 OR tier_c <> 0/)
  assert.match(migration, /verified_international <> 24 OR code_confirmed <> 24/)
})

test("NZ Phase 3 does not confuse publication readiness with a current open window", () => {
  assert.match(migration, /A current application window is NOT required/)
  assert.match(migration, /international_admission_status = 'eligible_schedule_unknown'/)
  assert.match(migration, /open_count <> 6 OR schedule_unknown_count <> 18/)
})

test("NZ Phase 3 records only source-backed live application windows", () => {
  const expected = [
    ["otago-bphysio", "2026-08-13"],
    ["otago-bpharm", "2026-08-13"],
    ["otago-bmlsc", "2026-08-13"],
    ["waikato-btchg-early-childhood", "2026-08-24"],
    ["waikato-btchg-primary", "2026-08-24"],
    ["massey-bav-air-transport-pilot", "2026-10-01"],
  ] as const

  for (const [key, deadline] of expected) {
    assert.match(migration, new RegExp(`'${key}', DATE '${deadline}'`))
  }
})

test("NZ Phase 3 preserves visa and professional-registration boundaries", () => {
  assert.match(
    migration,
    /https:\/\/www\.immigration\.govt\.nz\/study\/after-you-finish-your-study\/qualifications-needed-for-a-post-study-work-visa\//,
  )
  assert.match(migration, /do not guarantee a student visa/)
  assert.match(migration, /professional registration\/licensing requirements remain separate/)

  for (const career of [
    "registered-nurse",
    "midwife",
    "physiotherapist",
    "pharmacist",
    "social-worker",
    "early-childhood-teacher",
    "primary-school-teacher",
    "commercial-pilot",
  ]) {
    assert.match(migration, new RegExp(`'${career}'`))
  }
})

test("NZ Phase 3 does not assert programme delivery locations", () => {
  assert.match(migration, /programme_delivery_verified IS TRUE OR programme_delivery_source_url IS NOT NULL/)
  assert.match(migration, /delivery_assertions <> 0/)
  assert.match(migration, /programme delivery location was asserted before canonical location integration/)
})
