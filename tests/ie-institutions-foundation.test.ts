import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808124500_ie_institution_identity_foundation.sql", import.meta.url),
  "utf8",
)

test("Ireland foundation consolidates current technological universities", () => {
  assert.match(migration, /atlantic-technological-university/)
  assert.match(migration, /munster-technological-university/)
  assert.match(migration, /south-east-technological-university/)
  assert.match(migration, /technological-university-of-the-shannon/)
  assert.match(migration, /ie_campus_resolution/)
  assert.match(migration, /update catalog\.programme_offerings/)
})

test("Ireland foundation preserves programme and offering inventory", () => {
  assert.match(migration, /active_programs<>2876/)
  assert.match(migration, /offering_count<>2876/)
  assert.match(migration, /active_institutions<>185/)
  assert.match(migration, /programme_parent_failures>0/)
})

test("Ireland HEA identity is source-backed and not presented as a fabricated provider code", () => {
  assert.match(migration, /IE_HEA_LISTED_HEI_NAME/)
  assert.match(migration, /https:\/\/hea\.ie\/higher-education-institutions\//)
  assert.match(migration, /institution_identity_ie_v1/)
  assert.match(migration, /hea_identity_count<>17/)
  assert.doesNotMatch(migration, /IE_HEA_PROVIDER_CODE/)
})

test("current Irish university aliases are retained inactive rather than deleted", () => {
  assert.match(migration, /'university-of-galway','nui-galway'/)
  assert.match(migration, /set status='inactive'/)
  assert.match(migration, /institution_normalization','ie_current_parent_v1'/)
})
