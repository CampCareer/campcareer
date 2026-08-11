import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const compareServer = readFileSync("src/lib/cities/fr-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/france-cities-compare-matrix.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/france-city-dashboard.tsx", "utf8")

const metrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_year",
  "employment_focus_sectors",
]

test("France compare readiness requires all five verified metrics and institution linkage", () => {
  for (const key of metrics) assert.ok(compareServer.includes(`"${key}"`))
  assert.ok(compareServer.includes('.eq("review_status", "verified")'))
  assert.ok(compareServer.includes('.gt("linked_campus_count", 0)'))
  assert.ok(compareServer.includes('.gt("linked_institution_count", 0)'))
})

test("France compare defaults to Paris versus Paris-Saclay and rejects same-city pairs", () => {
  assert.ok(compareServer.includes('bySlug.get("paris")'))
  assert.ok(compareServer.includes('bySlug.get("paris-saclay")'))
  assert.ok(compareServer.includes("left.slug === right.slug"))
})

test("generic compare page routes FR city comparisons through the France matrix", () => {
  assert.ok(comparePage.includes('if (countryCode === "FR")'))
  assert.ok(comparePage.includes("getFrCityComparison"))
  assert.ok(comparePage.includes("FranceCitiesCompareMatrix"))
  assert.ok(comparePage.includes('buildCityCompareCanonicalHref({ country: "FR" })'))
})

test("France compare keeps geography and methodology differences explicit", () => {
  assert.ok(matrix.includes("commune and an EPCI"))
  assert.ok(matrix.includes("Public geography"))
  assert.ok(matrix.includes("no synthetic monthly normalization"))
  assert.ok(matrix.includes("964-hour student-work rule"))
  assert.ok(matrix.includes("not shortage rankings, job guarantees or immigration eligibility"))
})

test("France compare never turns national programme offerings into city delivery", () => {
  assert.ok(matrix.includes("132 verified national offering records"))
  assert.ok(matrix.includes("remain excluded from city comparison"))
  assert.doesNotMatch(compareServer, /city_programme_directory_fr_v1/)
})

test("France city profiles link back into the country-scoped compare surface", () => {
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "FR", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
})
