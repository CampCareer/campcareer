import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readRepoFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

const locationQa = readRepoFile(
  "supabase/migrations/20260808212500_nl_campus_location_quality.sql",
)

test("NL location policy preserves 13 legacy anchors and publishes 13 registry-backed locations", () => {
  assert.match(locationQa, /Expected 13 NL legacy location anchors/)
  assert.match(locationQa, /Expected 13 registry-backed NL locations across 13 institutions/)
  assert.match(locationQa, /legacy_location_anchor/)
  assert.match(locationQa, /verified_registry_city/)
  assert.match(locationQa, /government_registry/)
  assert.match(locationQa, /DUO_RIO/)
})

test("NL registry locations use official provenance without inventing precise campus coordinates", () => {
  assert.match(locationQa, /onderwijsdata[.]duo[.]nl/)
  assert.match(locationQa, /coordinate_precision', 'not_asserted'/)
  assert.match(locationQa, /programme_assignment_verified', false/)
  assert.match(locationQa, /must not assert unverified precise coordinates/)
})

test("NL location read model prefers verified registry locations and remains service-role only", () => {
  assert.match(locationQa, /institution_location_nl_v1/)
  assert.match(locationQa, /display_policy', 'preferred'/)
  assert.match(locationQa, /display_policy', 'fallback_only'/)
  assert.match(locationQa, /with \(security_invoker = true\)/)
  assert.match(locationQa, /revoke all on public[.]institution_location_nl_v1 from public, anon, authenticated/)
  assert.match(locationQa, /grant select on public[.]institution_location_nl_v1 to service_role/)
})
