import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808161000_ie_provider_identity_expansion_v3.sql", import.meta.url),
  "utf8",
)

test("Ireland provider expansion normalizes IOB, SOLAS and The Open College", () => {
  assert.match(migration, /'institute-of-banking',[\s\S]*?'iob',[\s\S]*?'IOB'/)
  assert.match(migration, /'solas',[\s\S]*?'SOLAS'/)
  assert.match(migration, /'open-college',[\s\S]*?'The Open College'/)
})

test("Ireland provider expansion uses source-backed identity systems", () => {
  assert.match(migration, /IE_OFFICIAL_PROVIDER_NAME/)
  assert.match(migration, /IE_QQI_PROVIDER_NAME/)
  assert.match(migration, /qsearch\.qqi\.ie\/WebPart\/ProgrammeDetails\?programmeCode=PG22036/)
  assert.match(migration, /qsearch\.qqi\.ie\/WebPart\/ProgrammeDetails\?programmeCode=PG17256/)
  assert.match(migration, /https:\/\/iob\.ie\/info\/ucd/)
})

test("Ireland provider expansion preserves all programme ownership", () => {
  assert.match(migration, /cohort_program_count<>66/)
  assert.match(migration, /active_program_count<>2876/)
  assert.doesNotMatch(migration, /update\s+catalog\.programmes/i)
})

test("Ireland provider identity read model stays service-role only", () => {
  assert.match(migration, /institution_identity_ie_provider_v1/)
  assert.match(migration, /with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.institution_identity_ie_provider_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.institution_identity_ie_provider_v1 to service_role/)
})
