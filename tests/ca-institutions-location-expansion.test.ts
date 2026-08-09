import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260808180500_ca_institution_location_expansion.sql",
  "utf8",
)

test("Canada acquired institution locations are source-backed and display-only", () => {
  assert.match(migration, /ca_institution_locations_v2/)
  assert.match(migration, /source_backed_official_catalog/)
  assert.match(migration, /ircc_dli_location/)
  assert.match(migration, /programme offerings incorrectly assigned to v2 display locations/)
  assert.match(migration, /v2_location_count<>55/)
  assert.match(migration, /v2_institution_count<>32/)
  assert.match(migration, /display_institution_count<>62/)
  assert.match(migration, /preferred_total<>115/)
})

test("Canada location expansion keeps missing DLI identity nullable", () => {
  assert.match(migration, /left join public\.institution_identity_ca_v1/)
  assert.match(migration, /nunavut-arctic-college/)
  assert.doesNotMatch(migration, /fabricated identifier/)
})
