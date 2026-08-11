import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260811101355_us_program_phase5_release_gate.sql",
  "utf8",
)

const doc = readFileSync(
  "docs/data-foundation/us-program-phase5-release-gate.md",
  "utf8",
)

test("US Phase 5 records an explicit server-only release gate", () => {
  assert.match(migration, /program_publication_gate_us_v1/)
  assert.match(migration, /WITH \(security_invoker=true\)/)
  assert.match(migration, /REVOKE ALL .* FROM public, anon, authenticated/)
  assert.match(migration, /GRANT SELECT .* TO service_role/)
})

test("US Phase 5 does not promote provider SEVP context to programme eligibility", () => {
  assert.match(migration, /international_students_eligible IS TRUE/)
  assert.match(migration, /offering_market IN \('international','both'\)/)
  assert.match(migration, /programme_specific_international_eligibility_required/)
  assert.match(migration, /programme_international_positive_count <> 0/)
  assert.match(migration, /international_market_offering_count <> 0/)
  assert.match(doc, /provider-level SEVP \/ F-1 context separate from programme-specific international eligibility/)
})

test("US Phase 5 preserves the 24-programme non-publication boundary", () => {
  assert.match(migration, /canonical_count <> 24/)
  assert.match(migration, /tier_a_count <> 24/)
  assert.match(migration, /verified_offering_count <> 24/)
  assert.match(migration, /publishable_count <> 0/)
  assert.match(migration, /indexable IS TRUE/)
  assert.match(doc, /All 24 explorer rows remain `review_ready` and `indexable=false`/)
})

test("US Phase 5 keeps programme location and SEO publication gated", () => {
  assert.match(migration, /campus_link_count <> 0/)
  assert.match(doc, /programme-specific delivery evidence/)
  assert.match(doc, /No U\.S\. programme should be added to an SEO allowlist or programme sitemap/)
})
