import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const comparison = readFileSync("src/lib/cities/ie-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/ireland-cities-compare-matrix.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/ireland-city-dashboard.tsx", "utf8")

const published = ["dublin", "cork", "galway", "limerick"]

const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Ireland City Compare uses exactly the four approved Tier A cities", () => {
  assert.match(routes, /PUBLISHED_IE_CITY_SLUGS = \["dublin", "cork", "galway", "limerick"\] as const/)
  assert.ok(comparison.includes("PUBLISHED_IE_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of ["maynooth", "waterford", "athlone", "sligo", "dundalk", "letterkenny"]) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_IE_CITY_SLUGS = \\[.*"${slug}"`))
  }
})

test("Ireland compare readiness requires five verified metrics plus institution and campus linkage", () => {
  assert.ok(comparison.includes('.from("city_directory_ie_v1")'))
  assert.ok(comparison.includes('.from("report_metric_evidence_city")'))
  assert.ok(comparison.includes('.eq("review_status", "verified")'))
  assert.ok(comparison.includes('.gt("linked_campus_count", 0)'))
  assert.ok(comparison.includes('.gt("linked_institution_count", 0)'))
  for (const metric of requiredMetrics) assert.ok(comparison.includes(`"${metric}"`))
})

test("Programme verification is not a City Compare readiness gate", () => {
  assert.doesNotMatch(comparison, /linked_program_count|programme_coverage_status|city_programme_directory_ie_v1/)
  assert.ok(matrix.includes("does not block city comparison"))
  assert.ok(matrix.includes("verification pending rather than “0 programmes”"))
})

test("Ireland City Compare defaults to Dublin versus Cork and keeps canonical order", () => {
  assert.ok(comparison.includes('bySlug.get("dublin")'))
  assert.ok(comparison.includes('left.slug === "dublin" ? bySlug.get("cork") : bySlug.get("dublin")'))
  assert.ok(comparison.includes("PUBLISHED_IE_CITY_SLUGS.filter"))
  assert.ok(comparison.includes("profiles.map"))
})

test("Compare route supports country IE and renders Ireland matrix", () => {
  assert.ok(comparePage.includes('getIeCityComparison'))
  assert.ok(comparePage.includes('countryCode === "IE"'))
  assert.ok(comparePage.includes('buildCityCompareCanonicalHref({ country: "IE" })'))
  assert.ok(comparePage.includes("IrelandCitiesCompareMatrix"))
  assert.ok(matrix.includes('countryCode="IE"'))
})

test("Ireland comparison preserves scope, transport period and conditional Stamp 2 context", () => {
  assert.ok(matrix.includes("four-local-authority study-market boundary"))
  assert.ok(matrix.includes("TFI source-native fare periods are preserved"))
  assert.ok(matrix.includes("We do not synthesize a monthly figure"))
  assert.ok(matrix.includes("20 hours per week during term and 40 hours during designated holiday periods"))
  assert.ok(matrix.includes("hoursTermTime"))
  assert.ok(matrix.includes("hoursDesignatedHolidays"))
})

test("Ireland city profiles link back into Compare while Compare links to profiles", () => {
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "IE", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
  assert.ok(matrix.includes("/cities/ie/${city.slug}"))
  assert.ok(matrix.includes("/cities/ie/${left.slug}"))
  assert.ok(matrix.includes("/cities/ie/${right.slug}"))
})

test("Compare root remains noindex during Phase 6", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
})
