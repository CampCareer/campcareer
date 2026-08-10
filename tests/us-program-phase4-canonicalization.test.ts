import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const canonicalization = readFileSync(
  "supabase/migrations/20260810201717_us_program_phase4_canonicalization.sql",
  "utf8",
)
const readModels = readFileSync(
  "supabase/migrations/20260810201804_us_program_phase4_read_models.sql",
  "utf8",
)
const doc = readFileSync(
  "docs/data-foundation/us-program-phase4-canonicalization.md",
  "utf8",
)

test("US Phase 4 canonicalizes only the verified bounded cohort", () => {
  assert.match(canonicalization, /24 verified programmes across 8 providers/)
  assert.match(canonicalization, /65 approved relations \/ 42 careers \/ 0 outside target 80/)
  assert.match(canonicalization, /phase3_verified_current_program/)
  assert.match(canonicalization, /x\.verification_status = 'verified'/)
  assert.match(canonicalization, /expected no pre-existing canonical US programmes/)
})

test("US Phase 4 uses deterministic source identity rather than staging ids", () => {
  assert.match(canonicalization, /US\|PROGRAM\|/)
  assert.match(canonicalization, /US\|OFFERING\|/)
  assert.match(canonicalization, /p\.source_name \|\| chr\(31\) \|\| p\.source_program_key/)
  assert.match(canonicalization, /US_PROGRAM_SOURCE_HASH/)
  assert.match(canonicalization, /US_PROGRAM_PHASE3_CANONICAL/)
  assert.doesNotMatch(canonicalization, /p\.id::uuid/)
})

test("US Phase 4 preserves award and CIP evidence without fabricating a qualification framework", () => {
  assert.match(canonicalization, /p\.award_level/)
  assert.match(canonicalization, /CASE WHEN p\.cip_evidence_status = 'verified' THEN p\.cip_code ELSE NULL END/)
  assert.match(canonicalization, /NULL::uuid/)
  assert.match(canonicalization, /qualification_level_link_count <> 0/)
  assert.match(doc, /qualification_level_id = NULL/)
  assert.match(doc, /0 U\.S\. rows in `core\.qualification_frameworks`/)
})

test("US Phase 4 does not convert provider F-1 context into programme-level international eligibility", () => {
  assert.match(canonicalization, /'unknown'/)
  assert.match(canonicalization, /programme-level international market remains unresolved/)
  assert.match(readModels, /'review_ready'::text AS publication_status/)
  assert.match(readModels, /false AS indexable/)
  assert.match(readModels, /programme_specific_international_eligibility_unresolved/)
  assert.match(readModels, /international_positive_count <> 0 OR schedule_unknown_count <> 24/)
  assert.match(doc, /programme-specific `international_students_eligible=true`: 0/)
})

test("US Phase 4 preserves relation nuance while offering a shared normalized relation", () => {
  assert.match(readModels, /o\.relation_type AS source_relation_type/)
  assert.match(readModels, /WHEN o\.relation_type = 'direct' THEN 'direct'/)
  assert.match(readModels, /ELSE 'related'/)
  assert.match(readModels, /relation_count <> 65 OR career_count <> 42 OR outside_target_count <> 0/)
  assert.match(doc, /`common_pathway` -> `related`/)
})

test("US Phase 4 carries exact-CIP STEM uncertainty forward", () => {
  assert.match(readModels, /stem_designated_cip/)
  assert.match(readModels, /stem_positive_count <> 4 OR exact_cip_stem_unresolved_count <> 2/)
  assert.match(doc, /positive STEM-designated CIP: 4/)
  assert.match(doc, /exact CIP with deliberately unresolved STEM state: 2/)
})

test("US Phase 4 never invents programme campus or city", () => {
  assert.match(canonicalization, /campus_id = NULL/)
  assert.match(canonicalization, /campus_link_count <> 0/)
  assert.match(readModels, /NULL::uuid AS campus_id/)
  assert.match(readModels, /NULL::text AS city_slug/)
  assert.match(readModels, /NULL::text AS city_name/)
  assert.match(readModels, /campus_link_count <> 0/)
})

test("US Phase 4 views are security-invoker and service-role-only", () => {
  for (const view of [
    "program_catalog_canonical_us_v1",
    "program_occupation_canonical_us_v1",
    "program_explorer_us_v1",
    "program_detail_us_v1",
    "program_compare_us_v1",
  ]) {
    const migration = view === "program_catalog_canonical_us_v1" ? canonicalization : readModels
    assert.match(migration, new RegExp(`VIEW public\\.${view}`))
    assert.match(migration, /WITH \(security_invoker = true\)/)
    assert.match(migration, new RegExp(`REVOKE ALL ON public\\.${view} FROM public, anon, authenticated`))
    assert.match(migration, new RegExp(`GRANT SELECT ON public\\.${view} TO service_role`))
  }
})

test("US Phase 4 read models expose exactly the canonical review cohort", () => {
  assert.match(readModels, /explorer_count <> 24 OR detail_count <> 24 OR compare_count <> 24/)
  assert.match(readModels, /indexable_count <> 0 OR review_ready_count <> 24/)
  assert.match(doc, /Canonical programmes \| 24/)
  assert.match(doc, /Explorer rows \| 24/)
  assert.match(doc, /Indexable rows \| 0/)
})
