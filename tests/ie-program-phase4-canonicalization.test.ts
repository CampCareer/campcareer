import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260810175121_ie_program_phase4_canonicalization_gate.sql",
  "utf8",
)
const phase4 = readFileSync(
  "docs/data-foundation/ie-program-phase4-canonicalization.md",
  "utf8",
)

test("IE Phase 4 canonicalizes only the reviewed Tier B cohort", () => {
  assert.match(migration, /a<>0 OR b<>28 OR c<>12 OR inst<>9 OR missing<>0/)
  assert.match(migration, /WHERE p\.verification_tier='B'/)
  assert.match(migration, /IE_PROGRAM_SOURCE_HASH/)
  assert.match(migration, /IE_PROGRAM_PHASE3_CANONICAL/)
  assert.match(phase4, /Only the 28 Tier B higher-education programmes are canonicalized/)
})

test("IE Phase 4 keeps new offerings unverified until exact eligible-programme evidence exists", () => {
  assert.match(migration, /'unverified'/)
  assert.match(phase4, /All 28 new offerings remain `unverified`/)
  assert.match(phase4, /does not mean exact TrustEd\/ILEP eligible-programme status has been proven/)
})

test("IE Phase 4 blocks Tier C leakage and preserves approved occupation relations", () => {
  assert.match(migration, /p\.verification_tier='C'/)
  assert.match(migration, /canonical<>28 OR rel<>51 OR careers<>32 OR leaks<>0/)
  assert.match(phase4, /51 approved canonical programme-to-career relations across 32 CampCareer careers/)
})

test("IE Phase 4 preserves legacy IE programmes instead of retiring them", () => {
  assert.match(migration, /LEGACY_COURSES_IE_ID/)
  assert.match(migration, /legacy_active<>2876/)
  assert.doesNotMatch(migration, /SET status='inactive'/)
  assert.match(phase4, /2,876 legacy rows retained/)
})

test("IE Phase 4 canonical views remain server-only and publication-gated", () => {
  assert.match(migration, /WITH \(security_invoker=true\)/)
  assert.match(migration, /REVOKE ALL ON public\.program_catalog_canonical_ie_v1 FROM public,anon,authenticated/)
  assert.match(migration, /REVOKE ALL ON public\.program_occupation_canonical_ie_v1 FROM public,anon,authenticated/)
  assert.match(migration, /GRANT SELECT ON public\.program_catalog_canonical_ie_v1 TO service_role/)
  assert.match(migration, /program_explorer_ie_v1/)
  assert.match(migration, /program_detail_ie_v1/)
  assert.match(phase4, /Phase 5 has not started/)
  assert.match(phase4, /United States Programs is not part of this work/)
})