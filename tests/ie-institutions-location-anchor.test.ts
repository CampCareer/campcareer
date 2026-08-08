import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808134500_ie_location_anchor_quality.sql", import.meta.url),
  "utf8",
)

test("Ireland location foundation keeps Qualifax-derived campuses as fallback anchors", () => {
  assert.match(migration, /legacy_qualifax_reported/)
  assert.match(migration, /display_policy','fallback_only'/)
  assert.match(migration, /anchor_count<>235/)
  assert.match(migration, /offering_count<>2876 or anchored_offering_count<>2876/)
})

test("Ireland location foundation does not invent geography rows from messy locality strings", () => {
  assert.match(migration, /Exact-match only/)
  assert.match(migration, /unsafe_city_insert_count<>0/)
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
})

test("Ireland fallback location read model remains service-role only", () => {
  assert.match(migration, /institution_location_ie_v1/)
  assert.match(migration, /revoke all on public\.institution_location_ie_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.institution_location_ie_v1 to service_role/)
})
