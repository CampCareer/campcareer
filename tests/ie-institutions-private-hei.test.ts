import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808131500_ie_qqi_private_hei_foundation.sql", import.meta.url),
  "utf8",
)

test("QQI private HEI cohort is source-backed", () => {
  assert.match(migration, /IE_QQI_REVIEWED_PRIVATE_HEI_NAME/)
  assert.match(migration, /quality-assurance-education-training\/reviews/)
  assert.match(migration, /private_identity_count<>6/)
  assert.doesNotMatch(migration, /IE_QQI_PROVIDER_CODE/)
})

test("Griffith city entities consolidate to one institution parent", () => {
  assert.match(migration, /'griffith-college','griffith-college-dublin'/)
  assert.match(migration, /'griffith-college','griffith-college-cork'/)
  assert.match(migration, /'griffith-college','griffith-college-limerick'/)
  assert.match(migration, /griffith_programs<>58/)
  assert.match(migration, /ie_private_campus_resolution/)
})

test("Ireland inventory remains stable after private HEI normalization", () => {
  assert.match(migration, /active_programs<>2876/)
  assert.match(migration, /offering_count<>2876/)
  assert.match(migration, /active_institutions<>183/)
})
