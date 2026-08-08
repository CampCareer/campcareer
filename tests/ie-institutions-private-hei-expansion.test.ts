import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808145500_ie_qqi_private_hei_expansion.sql", import.meta.url),
  "utf8",
)

test("Ireland QQI Private HEI expansion contains eight source-backed providers", () => {
  const match = migration.match(
    /insert into ie_qqi_private_expansion values\n([\s\S]*?);\n\n-- Fail closed/,
  )
  assert.ok(match)
  const rows = match[1].split("\n").filter((line) => line.trim() === "(" )
  assert.equal(rows.length, 8)
  assert.match(migration, /new_identity_count<>8/)
  assert.match(migration, /combined_identity_count<>14/)
})

test("current private HEI brands replace legacy import names without deleting legacy identifiers", () => {
  assert.match(migration, /irish-college-of-humanities-and-applied-sciences/)
  assert.match(migration, /Innopharma Education/)
  assert.match(migration, /innopharma-education/)
  assert.match(migration, /IICP College/)
  assert.match(migration, /iicp-college/)
  assert.doesNotMatch(migration, /delete from catalog\.institution_identifiers/)
})

test("expanded QQI Private HEIs preserve the Irish programme inventory", () => {
  assert.match(migration, /cohort_program_count<>68/)
  assert.match(migration, /active_program_count<>2876/)
})

test("combined QQI view accepts only source-backed private HEI identity systems", () => {
  assert.match(migration, /institution_identity_ie_qqi_v1/)
  assert.match(migration, /IE_QQI_REVIEWED_PRIVATE_HEI_NAME/)
  assert.match(migration, /IE_QQI_PRIVATE_HEI_NAME/)
  assert.match(migration, /revoke all on public\.institution_identity_ie_qqi_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.institution_identity_ie_qqi_v1 to service_role/)
})
