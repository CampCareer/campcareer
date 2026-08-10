import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260809212018_uk_program_phase4_canonicalization.sql",
  "utf8",
)

test("UK Phase 4 canonicalizes only the verified Tier A/B cohort", () => {
  assert.match(migration, /publishable_count<>76/)
  assert.match(migration, /tier_a_count<>75/)
  assert.match(migration, /tier_b_count<>1/)
  assert.match(migration, /institution_count<>19/)
  assert.match(migration, /verification_tier IN \('A','B'\)/)
  assert.match(migration, /tier_c_leak_count>0/)
})

test("UK canonical programme identities use stable source identity instead of staging IDs", () => {
  assert.match(migration, /source_name\|\|chr\(31\)\|\|p\.source_program_key/)
  assert.match(migration, /UK_PROGRAM_SOURCE_HASH/)
  assert.match(migration, /UK\|PROGRAM\|/)
  assert.match(migration, /UK\|OFFERING\|/)
  assert.doesNotMatch(migration, /p\.id::text/)
})

test("UK Phase 4 does not invent programme campus linkage", () => {
  assert.match(migration, /offering_with_campus_count<>0/)
  assert.match(migration, /UK_PROGRAM_PHASE3_CANONICAL/)
  assert.match(migration, /campus_id,market/)
})

test("UK Phase 4 retires but preserves the 185 legacy programme cohort", () => {
  assert.match(migration, /LEGACY_COURSES_UK_ID/)
  assert.match(migration, /legacy_inactive_count<>185/)
  assert.match(migration, /legacy_stale_offering_count<>185/)
  assert.match(migration, /total_uk_programme_count<>261/)
  assert.match(migration, /active_uk_programme_count<>76/)
})

test("UK canonical read model remains server-only and security-invoker", () => {
  assert.match(migration, /program_catalog_canonical_uk_v1/)
  assert.match(migration, /security_invoker=true/)
  assert.match(migration, /REVOKE ALL ON public\.program_catalog_canonical_uk_v1 FROM public,anon,authenticated/)
  assert.match(migration, /GRANT SELECT ON public\.program_catalog_canonical_uk_v1 TO service_role/)
})
