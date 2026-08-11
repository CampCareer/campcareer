import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260810171125_ie_program_phase3_current_verification.sql",
  "utf8",
)
const phase3 = readFileSync(
  "docs/data-foundation/ie-program-phase3-verification.md",
  "utf8",
)

test("IE Phase 3 keeps exact TrustEd programme evidence as the Tier A gate", () => {
  assert.match(migration, /tier_a_count<>0 OR tier_b_count<>28 OR tier_c_count<>12/)
  assert.match(migration, /exact_trusted_eligible_count<>0/)
  assert.match(migration, /ilep_or_trusted_programme_status='not_programme_verified'/)
  assert.match(migration, /eligible_programme_source_url=NULL/)
  assert.match(phase3, /Tier A count: zero/)
  assert.match(phase3, /Tier B is review-ready, not publication-ready/)
})

test("IE Phase 3 records the bounded current-provider verification result", () => {
  assert.match(migration, /current_provider_count<>30 OR programme_url_count<>30/)
  assert.match(migration, /intl_true_count<>28 OR intl_false_count<>1/)
  assert.match(migration, /full_time_true_count<>27 OR full_time_false_count<>1/)
  assert.match(migration, /open_count<>5 OR closed_count<>22 OR restricted_count<>10 OR unknown_count<>2 OR schedule_unknown_count<>1/)
  assert.match(phase3, /current official provider programme evidence resolved: 30 \/ 32/)
  assert.match(phase3, /Tier A: 0;/)
  assert.match(phase3, /Tier B: 28;/)
  assert.match(phase3, /Tier C: 12\./)
})

test("IE Phase 3 rejects part-time UCD Cybersecurity as a standard Study Visa route", () => {
  assert.match(migration, /2698.*part_time_blended.*'C',false,false,'restricted','rejected'/)
  assert.match(migration, /part-time courses are not eligible for a Study Visa/)
  assert.match(phase3, /UCD MSc Cybersecurity/)
  assert.match(phase3, /not eligible for a Study Visa/)
})

test("IE Phase 3 keeps conditional or unresolved routes in Tier C", () => {
  assert.match(migration, /505,NULL,NULL,'legacy_snapshot_needs_recheck','C'/)
  assert.match(migration, /847,NULL,NULL,'legacy_snapshot_needs_recheck','C'/)
  assert.match(migration, /3459.*'current_provider_verified','C',NULL,true,'restricted'/)
  assert.match(phase3, /University of Limerick Computer Science legacy row/)
  assert.match(phase3, /University of Limerick Electrical Engineering legacy row/)
  assert.match(phase3, /MTU Marine Engineering/)
  assert.match(phase3, /approved international shipping-company sponsorship/)
})

test("IE Phase 3 keeps professional registration separate from educational matching", () => {
  assert.match(migration, /Teaching Council registration/)
  assert.match(migration, /CORU registration and protected-title requirements/)
  assert.match(migration, /title Architect is protected/)
  assert.match(phase3, /Teaching Council registration/)
  assert.match(phase3, /CORU registration/)
  assert.match(phase3, /Register of Architects/)
})

test("IE Phase 3 remains Ireland-only and does not publish routes", () => {
  assert.match(phase3, /No Ireland public explorer\/detail view, sitemap route or canonical publication is created in Phase 3/)
  assert.match(phase3, /United States Programs remains untouched/)
  assert.doesNotMatch(migration, /program_explorer_ie_v1/)
  assert.doesNotMatch(migration, /program_detail_ie_v1/)
  assert.doesNotMatch(migration, /program_catalog_us_staging/)
})
