import assert from "node:assert/strict"
import test from "node:test"
import {
  caAdmissionPresentation,
  caPgwpLabel,
  caPublicationEvidenceLabel,
  formatCaEvidenceDate,
} from "../src/lib/programs/ca-program-presentation"

test("Canada admission presentation distinguishes open, limited, held and no-intake states", () => {
  const open = caAdmissionPresentation(
    "winter_2027_international_application_open_deadline_2026_09_30",
  )
  assert.equal(open.label, "International applications open")
  assert.equal(open.tone, "positive")
  assert.match(open.detail ?? "", /Winter 2027/)
  assert.match(open.detail ?? "", /Deadline Sep 30, 2026/)

  const alternateOpen = caAdmissionPresentation("official_program_page_open_international_2026")
  assert.equal(alternateOpen.label, "International applications open")

  const limited = caAdmissionPresentation(
    "official_program_page_international_open_or_waitlisted_2026_27",
  )
  assert.equal(limited.label, "International availability limited")
  assert.equal(limited.tone, "caution")

  const held = caAdmissionPresentation("international_admissions_on_hold_winter_2027")
  assert.equal(held.label, "International admissions on hold")
  assert.equal(held.tone, "caution")

  const noIntake = caAdmissionPresentation("fall_2027_international_no_intake_unbc_partner_program")
  assert.equal(noIntake.label, "No international intake")
  assert.equal(noIntake.tone, "negative")
  assert.match(noIntake.detail ?? "", /Fall 2027/)
})

test("Canada admission presentation keeps listings and application paths distinct from open claims", () => {
  const listing = caAdmissionPresentation("bcit_current_official_international_program_list_2026")
  assert.equal(listing.label, "Current international program listing")
  assert.equal(listing.tone, "neutral")

  const applicationPath = caAdmissionPresentation(
    "official_current_program_with_international_application_path_fall_2026",
  )
  assert.equal(applicationPath.label, "International application path published")
  assert.equal(applicationPath.tone, "neutral")
  assert.match(applicationPath.detail ?? "", /Fall 2026/)
})

test("Canada publication and PGWP labels avoid internal tier language", () => {
  assert.equal(caPublicationEvidenceLabel("A"), "Official program page verified")
  assert.equal(caPublicationEvidenceLabel("B"), "Reviewed publication record")
  assert.equal(caPgwpLabel("eligible"), "PGWP eligible")
  assert.equal(caPgwpLabel("ineligible"), "PGWP ineligible")
  assert.equal(caPgwpLabel("unknown"), "PGWP not confirmed")
})

test("Canada evidence date formatter is stable in UTC", () => {
  assert.equal(formatCaEvidenceDate("2026-08-09T00:00:00Z"), "Aug 9, 2026")
  assert.equal(formatCaEvidenceDate(null), null)
})
