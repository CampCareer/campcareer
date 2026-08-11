import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260810200123_us_program_phase3_verification.sql",
  "utf8",
)

const doc = readFileSync(
  "docs/data-foundation/us-program-phase3-verification.md",
  "utf8",
)

test("US Phase 3 verifies only the bounded Phase 2 cohort", () => {
  assert.match(migration, /expected 24 programmes \/ 8 providers/)
  assert.match(migration, /expected 65 relations \/ 42 careers/)
  assert.match(migration, /expected 6 exact verified CIP rows/)
  assert.match(migration, /phase3_verified_current_program/)
  assert.match(migration, /expected 24 current programmes across 8 providers/)
})

test("US Phase 3 confirms provider F-1 context without claiming programme admission", () => {
  assert.match(migration, /sevp_status = 'confirmed'/)
  assert.match(migration, /Provider-level F-1\/I-20 sponsorship confirmed; not programme-delivery evidence/)
  assert.match(migration, /international_students_eligible = true/)
  assert.match(migration, /programme_intl_positive_count <> 0/)
  assert.match(migration, /schedule_unknown_count <> 24/)
  assert.match(doc, /international_students_eligible` remains `NULL`/)
  assert.match(doc, /international_admission_status` remains `eligible_schedule_unknown`/)
})

test("US Phase 3 keeps visa, OPT and STEM OPT as separate applicant-sensitive layers", () => {
  assert.match(migration, /travel\.state\.gov\/content\/travel\/en\/us-visas\/study\/student-visa\.html/)
  assert.match(migration, /programme existence alone does not guarantee OPT/)
  assert.match(migration, /exact qualifying CIP must appear on the DHS STEM list/)
  assert.match(migration, /DSO\/USCIS\/employer requirements remain separate/)
  assert.match(doc, /visa result is never guaranteed/)
})

test("US Phase 3 only assigns positive STEM state to exact reviewed CIP", () => {
  for (const cip of ["01.1001", "04.0902", "11.0101", "11.0103"]) {
    assert.match(migration, new RegExp(`WHEN '${cip.replace(".", "\\.")}' THEN true`))
  }

  for (const cip of ["52.0901", "52.0904"]) {
    assert.match(migration, new RegExp(`WHEN '${cip.replace(".", "\\.")}' THEN reviewer_note`))
  }

  assert.match(migration, /stem_positive_count <> 4 OR exact_cip_stem_unresolved_count <> 2/)
  assert.match(migration, /stem_designated_cip IS NULL/)
  assert.match(doc, /`NULL` is preferable to an unsupported negative claim/)
})

test("US Phase 3 strengthens regulated programme accreditation without claiming licensure", () => {
  for (const key of [
    "umich-bse-civil-engineering",
    "uw-bs-civil-engineering",
    "uw-basw-social-welfare",
    "utaustin-bs-civil-engineering",
    "psu-bs-mechanical-engineering",
  ]) {
    assert.match(migration, new RegExp(`source_program_key = '${key}'`))
  }

  assert.match(migration, /Engineering Accreditation Commission of ABET/)
  assert.match(migration, /Council on Social Work Education \(CSWE\) accredited/)
  assert.match(doc, /Accreditation is not licensure/)
})

test("US Phase 3 never creates programme location claims", () => {
  assert.match(migration, /programme_delivery_verified = true/)
  assert.match(migration, /delivery_count <> 0/)
  assert.match(migration, /does NOT create a programme delivery campus\/city assertion/)
  assert.match(doc, /programme city\/campus assertions: 0/)
})
