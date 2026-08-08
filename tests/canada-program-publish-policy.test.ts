import assert from "node:assert/strict"
import test from "node:test"
import {
  caProgramPgwpState,
  classifyCaProgramPublication,
  type CaProgramPublicationInput,
} from "../src/lib/programs/ca-publish-policy"

const base: CaProgramPublicationInput = {
  title: "Bachelor of Applied Science",
  institutionId: "ca-test-university",
  sourceUrl: "https://example.edu/programs",
  sourceAsOf: "2026-08-08",
  collectedAt: "2026-08-08T12:00:00Z",
  sourceStatus: "official_catalog_listed_2026",
  officialProgramUrl: "https://example.edu/programs/applied-science",
  matchedDliNumber: "O123456789",
  internationalStudentsEligible: true,
  internationalProgramAdmissionStatus: "international_program_listed_current",
  irccProgramEligible: true,
}

test("Tier A requires a publishable row with a program-specific official URL", () => {
  assert.deepEqual(classifyCaProgramPublication(base), {
    tier: "A", holdReason: null, pgwpState: "eligible", indexableDetail: true,
  })
})

test("Tier B permits catalogue discovery but not indexing when the program URL is missing", () => {
  const decision = classifyCaProgramPublication({ ...base, officialProgramUrl: null })
  assert.equal(decision.tier, "B")
  assert.equal(decision.indexableDetail, false)
})

test("missing DLI evidence holds a program in Tier C", () => {
  const decision = classifyCaProgramPublication({ ...base, matchedDliNumber: null })
  assert.equal(decision.tier, "C")
  assert.equal(decision.holdReason, "missing_dli")
})

test("suspended and excluded rows never publish", () => {
  assert.equal(classifyCaProgramPublication({ ...base, sourceStatus: "suspended_2026_27" }).holdReason, "suspended")
  assert.equal(classifyCaProgramPublication({ ...base, sourceStatus: "excluded_non_core_pathway" }).holdReason, "excluded_non_core")
})

test("closed international admissions hold a program", () => {
  for (const admissionStatus of [
    "international_unavailable_or_not_open_for_current_2026_27_intake",
    "international_program_confirmed_current_but_september_2026_new_applications_closed_2027_opens_october_2026",
  ]) {
    const decision = classifyCaProgramPublication({ ...base, internationalProgramAdmissionStatus: admissionStatus })
    assert.equal(decision.tier, "C")
    assert.equal(decision.holdReason, "admission_closed_or_restricted")
  }
})

test("program-level international admission must be verified before publication", () => {
  for (const admissionStatus of [
    null,
    "institution_dli_confirmed_program_level_admission_not_yet_verified",
    "school_pgwp_aligned_check_current_intake_availability",
    "school_pgwp_aligned_list_current_program_availability_should_be_checked",
    "school_pgwp_aligned_program_availability_separate",
    "nbcc_pgwp_status_verified_current_intake_check_application_portal",
    "program_pgwp_noneligible_current_intake_separate",
  ]) {
    const decision = classifyCaProgramPublication({ ...base, internationalProgramAdmissionStatus: admissionStatus })
    assert.equal(decision.tier, "C")
    assert.equal(decision.holdReason, "admission_unverified")
  }
})

test("PGWP unknown remains unknown and is never inferred", () => {
  assert.equal(caProgramPgwpState(null), "unknown")
  const decision = classifyCaProgramPublication({ ...base, irccProgramEligible: null })
  assert.equal(decision.pgwpState, "unknown")
  assert.equal(decision.tier, "A")
})

test("explicit PGWP ineligibility does not by itself remove a valid study program", () => {
  const decision = classifyCaProgramPublication({ ...base, irccProgramEligible: false })
  assert.equal(decision.tier, "A")
  assert.equal(decision.pgwpState, "ineligible")
})
