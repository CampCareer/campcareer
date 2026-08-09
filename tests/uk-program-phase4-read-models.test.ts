import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260809214142_uk_program_phase4_read_models.sql",
  "utf8",
)

test("UK Phase 4 preserves reviewed occupation relations on canonical programmes", () => {
  assert.match(migration, /program_occupation_canonical_uk_v1/)
  assert.match(migration, /relation_count<>90/)
  assert.match(migration, /relation_career_count<>56/)
  assert.match(migration, /country_occupation_profiles currently has no UK rows/)
})

test("UK Phase 4 exposes explorer detail and compare projections", () => {
  assert.match(migration, /program_explorer_uk_v1/)
  assert.match(migration, /program_detail_uk_v1/)
  assert.match(migration, /program_compare_uk_v1/)
  assert.match(migration, /explorer_count<>76/)
  assert.match(migration, /detail_count<>76/)
  assert.match(migration, /compare_count<>76/)
})

test("UK Phase 4 does not infer programme city or campus linkage", () => {
  assert.match(migration, /null::uuid as campus_id/)
  assert.match(migration, /null::text as city_slug/)
  assert.match(migration, /city_link_count<>0/)
})

test("UK Phase 4 read models remain server only", () => {
  for (const view of [
    "program_occupation_canonical_uk_v1",
    "program_explorer_uk_v1",
    "program_detail_uk_v1",
    "program_compare_uk_v1",
  ]) {
    assert.match(migration, new RegExp(`REVOKE ALL ON public\\.${view} FROM public,anon,authenticated`, "i"))
    assert.match(migration, new RegExp(`GRANT SELECT ON public\\.${view} TO service_role`, "i"))
  }
})
