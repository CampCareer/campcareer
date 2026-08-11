import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const comparison = readFileSync("src/lib/cities/de-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/germany-cities-compare-matrix.tsx", "utf8")
const profilePage = readFileSync("src/app/(workspace)/cities/de/[city]/page.tsx", "utf8")

const published = ["berlin", "munich", "hamburg", "aachen", "bonn", "dresden", "heidelberg", "karlsruhe", "tuebingen"]

test("Germany City Compare uses exactly the nine Phase 5 route cities", () => {
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.ok(comparison.includes("PUBLISHED_DE_CITY_SLUGS"))
  assert.ok(comparison.includes('.from("city_directory_de_v1")'))
})

test("Germany compare readiness requires five metrics plus institution and teaching-location linkage", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(comparison.includes(`"${key}"`))
  assert.ok(comparison.includes('.gt("linked_campus_count", 0)'))
  assert.ok(comparison.includes('.gt("linked_institution_count", 0)'))
  assert.doesNotMatch(comparison, /linked_program_count|programme_coverage_status/)
})

test("Germany comparison defaults to Berlin versus Munich and prevents duplicate-city pairs", () => {
  assert.ok(comparison.includes('bySlug.get("berlin")'))
  assert.ok(comparison.includes('bySlug.get("munich")'))
  assert.ok(comparison.includes("rightSlug !== left.slug"))
  assert.ok(comparison.includes("left.slug === right.slug"))
})

test("shared Compare page routes country DE to the Germany matrix", () => {
  assert.ok(comparePage.includes('countryCode === "DE"'))
  assert.ok(comparePage.includes("getDeCityComparison"))
  assert.ok(comparePage.includes("GermanyCitiesCompareMatrix"))
  assert.ok(comparePage.includes('buildCityCompareCanonicalHref({ country: "DE" })'))
  assert.ok(comparePage.includes("robots: { index: false, follow: false }"))
})

test("Germany Compare preserves municipality, source-native transport and federal work semantics", () => {
  assert.ok(matrix.includes("official Destatis / GV-ISys municipality boundary"))
  assert.ok(matrix.includes("AGS"))
  assert.ok(matrix.includes("Source-native ticket products and periods are preserved"))
  assert.ok(matrix.includes("eligibility conditions"))
  assert.ok(matrix.includes("140"))
  assert.ok(matrix.includes("280"))
  assert.ok(matrix.includes("national, not a city differentiator"))
})

test("Germany Compare keeps programme delivery verification pending and links back to profiles", () => {
  assert.ok(matrix.includes("Verified Germany city programme delivery is still pending"))
  assert.ok(matrix.includes("does not infer programme delivery"))
  assert.ok(matrix.includes("/cities/de/${city.slug}"))
  assert.ok(profilePage.includes('buildCityCompareCanonicalHref({ country: "DE", left: profile.slug })'))
  assert.ok(profilePage.includes("Compare {profile.name}"))
})
