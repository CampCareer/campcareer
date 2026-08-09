import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260808183500_ca_program_catalog_canonicalization.sql",
  "utf8",
)
const statusSync = readFileSync(
  "supabase/migrations/20260808184512_ca_program_status_sync_after_phase3.sql",
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

test("Canada base canonicalization quality-gates its historical source-status snapshot", () => {
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
})

test("Canada Phase 3 status sync follows the current staging snapshot instead of a frozen status split", () => {
  assert.match(statusSync, /program_catalog_ca_staging/)
  assert.match(statusSync, /CA_PROGRAM_CANONICAL_KEY/)
  assert.match(statusSync, /Found % Canadian canonical programme statuses out of sync with staging/)
  assert.match(statusSync, /Expected 6634 staged\/canonical Canadian programme groups/)
  assert.match(statusSync, /Expected 6638 Canadian programme source identities/)
  assert.match(statusSync, /Expected active Canadian canonical programmes across all 49 catalog institutions/)
  assert.doesNotMatch(statusSync, /active_count<>\d+/)
  assert.doesNotMatch(statusSync, /inactive_count<>\d+/)
  assert.doesNotMatch(statusSync, /unknown_count<>\d+/)
})
