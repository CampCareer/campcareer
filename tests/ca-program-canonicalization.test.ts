import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260808183500_ca_program_catalog_canonicalization.sql",
  "utf8",
)

test("Canada program catalog canonicalizes all staged source rows", () => {
  assert.match(migration, /source_count<>6638/)
  assert.match(migration, /canonical_count<>6634/)
  assert.match(migration, /source_count_sum<>6638/)
  assert.match(migration, /CA_PROGRAM_CANONICAL_KEY/)
  assert.match(migration, /CA_PROGRAM_CATALOG_SOURCE_HASH/)
  assert.match(migration, /active_institution_count<>49/)
})

test("Canada program canonicalization quality-gates source statuses", () => {
  assert.match(migration, /active_count<>6469/)
  assert.match(migration, /inactive_count<>144/)
  assert.match(migration, /unknown_count<>21/)
  assert.match(migration, /excluded_/)
  assert.match(migration, /pending_review/)
})

test("Canada canonical programs do not invent campus offerings", () => {
  assert.match(migration, /campus_assigned_count<>0/)
  assert.match(migration, /CA_PROGRAM_CATALOG_CANONICAL/)
  assert.match(migration, /legacy_inactive_count<>165/)
  assert.match(migration, /total_active_ca_programmes<>6469/)
})
