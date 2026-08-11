import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const canonicalMigration = readFileSync(
  "supabase/migrations/20260810163650_nz_program_phase4_canonicalization.sql",
  "utf8",
)

const readModelMigration = readFileSync(
  "supabase/migrations/20260810163727_nz_program_phase4_read_models.sql",
  "utf8",
)

test("NZ Phase 4 canonicalizes only the verified bounded Tier A cohort", () => {
  assert.match(canonicalMigration, /tier_a_count<>24/)
  assert.match(canonicalMigration, /institution_count<>8/)
  assert.match(canonicalMigration, /approved_relation_count<>39/)
  assert.match(canonicalMigration, /relation_career_count<>35/)
  assert.match(canonicalMigration, /WHERE p\.verification_tier='A'/)
})

test("NZ canonical programme and offering IDs use stable source identity", () => {
  assert.match(canonicalMigration, /NZ\|PROGRAM\|/)
  assert.match(canonicalMigration, /NZ\|OFFERING\|/)
  assert.match(canonicalMigration, /NZ_PROGRAM_SOURCE_HASH/)
  assert.match(canonicalMigration, /source_name\|\|chr\(31\)\|\|p\.source_program_key/)
  assert.doesNotMatch(canonicalMigration, /p\.id::text/)
})

test("NZ Phase 4 preserves NZQCF metadata without inventing core qualification links", () => {
  assert.match(canonicalMigration, /qualification_level_id=NULL/)
  assert.match(canonicalMigration, /p\.nzqcf_level/)
  assert.match(canonicalMigration, /p\.nzqcf_credits/)
  assert.match(readModelMigration, /c\.nzqcf_level/)
  assert.match(readModelMigration, /c\.nzqcf_credits/)
})

test("NZ Phase 4 does not invent programme campus or city linkage", () => {
  assert.match(canonicalMigration, /campus_id=NULL/)
  assert.match(canonicalMigration, /offering_with_campus_count<>0/)
  assert.match(readModelMigration, /null::uuid AS campus_id/)
  assert.match(readModelMigration, /null::text AS city_slug/)
  assert.match(readModelMigration, /city_link_count<>0/)
})

test("NZ Phase 4 canonical views remain server-only and security-invoker", () => {
  for (const view of [
    "program_catalog_canonical_nz_v1",
    "program_occupation_canonical_nz_v1",
    "program_explorer_nz_v1",
    "program_detail_nz_v1",
    "program_compare_nz_v1",
  ]) {
    const source = view === "program_catalog_canonical_nz_v1" ? canonicalMigration : readModelMigration
    assert.match(source, new RegExp(view))
  }

  assert.match(canonicalMigration, /security_invoker=true/)
  assert.match(readModelMigration, /security_invoker=true/)
  assert.match(canonicalMigration, /REVOKE ALL ON public\.program_catalog_canonical_nz_v1 FROM public,anon,authenticated/)
  assert.match(readModelMigration, /GRANT SELECT ON public\.program_detail_nz_v1 TO service_role/)
})

test("NZ Phase 4 read models preserve occupation and admission semantics", () => {
  assert.match(readModelMigration, /relation_count<>39 OR relation_career_count<>35/)
  assert.match(readModelMigration, /explorer_count<>24 OR indexable_count<>24/)
  assert.match(readModelMigration, /open_count<>6 OR schedule_unknown_count<>18/)
  assert.match(readModelMigration, /CASE WHEN o\.relation_type='direct' THEN 'direct' ELSE 'related' END/)
  assert.match(readModelMigration, /post_study_work_context/)
  assert.match(readModelMigration, /code_signatory_status/)
})

test("NZ Phase 4 stays inside the canonical 80 occupation boundary", () => {
  assert.match(readModelMigration, /program_occupation_match_rules/)
  assert.match(readModelMigration, /m\.country_code='CA'/)
  assert.match(readModelMigration, /m\.review_status='approved'/)
  assert.match(readModelMigration, /non_target_relation_count>0/)
})
