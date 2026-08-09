import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada program filters use product language instead of internal pipeline labels", () => {
  const source = readFileSync("src/app/(workspace)/programs/ca-programs-filters.tsx", "utf8")

  assert.ok(!source.includes("Phase 3"))
  assert.ok(!source.includes("Approved"))
  assert.ok(!source.includes("unknown을 유지"))
  assert.ok(!source.includes("Unknown is preserved"))

  assert.ok(source.includes("Program city"))
  assert.ok(source.includes("All program cities"))
  assert.ok(source.includes("Source evidence"))
  assert.ok(source.includes("All reviewed programs"))
})

test("Canada city and compare surfaces avoid internal canonical and approval jargon", () => {
  const city = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")
  const compare = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(!city.includes("Canonical institutions"))
  assert.ok(!city.includes("canonical institution and location records"))
  assert.ok(!city.includes(" canonical "))
  assert.ok(!city.includes("Unknown is not treated as ineligible"))
  assert.ok(city.includes("Institutions with {profile.name} locations"))
  assert.ok(city.includes("verified {institution.campuses.length === 1 ? \"location\" : \"locations\"}"))
  assert.ok(city.includes("Not confirmed does not mean ineligible"))

  assert.ok(!compare.includes("Canonical location records"))
  assert.ok(!compare.includes("approved target-career coverage"))
  assert.ok(compare.includes("Verified location records"))
  assert.ok(compare.includes("reviewed target-career coverage"))
})
