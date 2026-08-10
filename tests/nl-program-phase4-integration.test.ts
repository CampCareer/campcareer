import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const canonicalization = readFileSync(
  "supabase/migrations/20260810110748_nl_program_phase4_canonicalization.sql",
  "utf8",
)
const readModels = readFileSync(
  "supabase/migrations/20260810110922_nl_program_phase4_read_models.sql",
  "utf8",
)

test("NL Phase 4 canonicalizes only the Tier A cohort", () => {
  assert.match(canonicalization, /publishable_count<>26/)
  assert.match(canonicalization, /institution_count<>7/)
  assert.match(canonicalization, /WHERE p\.verification_tier='A'/)
  assert.match(canonicalization, /tier_c_leak_count>0/)
  assert.doesNotMatch(canonicalization, /verification_tier IN \('A','B'\)/)
})

test("NL canonical identities are stable and preserve official RIO codes", () => {
  assert.match(canonicalization, /NL\|PROGRAM\|/)
  assert.match(canonicalization, /NL\|OFFERING\|/)
  assert.match(canonicalization, /NL_PROGRAM_SOURCE_HASH/)
  assert.match(canonicalization, /NL_RIO_PROGRAM_CODE/)
  assert.match(canonicalization, /rio_identifier_count<>15/)
  assert.doesNotMatch(canonicalization, /p\.id::text/)
})

test("NL Phase 4 does not invent qualification or campus linkage", () => {
  assert.match(canonicalization, /qualification_level_id,NULL/)
  assert.match(canonicalization, /campus_id,NULL/)
  assert.match(canonicalization, /offering_with_campus_count<>0/)
})

test("NL Phase 4 read models expose 26 indexable programmes and 56 career relations", () => {
  assert.match(readModels, /relation_count<>56/)
  assert.match(readModels, /relation_career_count<>30/)
  assert.match(readModels, /explorer_count<>26/)
  assert.match(readModels, /indexable_count<>26/)
  assert.match(readModels, /detail_count<>26/)
  assert.match(readModels, /compare_count<>26/)
})

test("NL Phase 4 read models remain server-only and location-conservative", () => {
  assert.match(readModels, /WITH \(security_invoker=true\)/)
  assert.match(readModels, /REVOKE ALL ON public\.program_explorer_nl_v1 FROM public,anon,authenticated/)
  assert.match(readModels, /GRANT SELECT ON public\.program_explorer_nl_v1 TO service_role/)
  assert.match(readModels, /null::uuid AS campus_id/)
  assert.match(readModels, /null::text AS city_slug/)
  assert.match(readModels, /city_link_count<>0/)
})
