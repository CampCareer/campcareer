import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const comparison = readFileSync("src/lib/cities/nl-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/netherlands-cities-compare-matrix.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/netherlands-city-dashboard.tsx", "utf8")

const published = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"]
const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Netherlands City Compare uses exactly the five approved Tier A cities", () => {
  assert.match(routes, /PUBLISHED_NL_CITY_SLUGS = \["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"\] as const/)
  assert.ok(comparison.includes("PUBLISHED_NL_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of ["delft", "utrecht", "enschede", "tilburg", "leiden", "nijmegen", "wageningen", "the-hague"]) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NL_CITY_SLUGS = \\[.*"${slug}"`))
  }
})

test("Netherlands compare readiness requires five verified metrics plus institution and location linkage", () => {
  assert.ok(comparison.includes('.from("city_directory_nl_v1")'))
  assert.ok(comparison.includes('.from("report_metric_evidence_city")'))
  assert.ok(comparison.includes('.eq("review_status", "verified")'))
  assert.ok(comparison.includes('.gt("linked_campus_count", 0)'))
  assert.ok(comparison.includes('.gt("linked_institution_count", 0)'))
  for (const metric of requiredMetrics) assert.ok(comparison.includes(`"${metric}"`))
})

test("Programme and HBO completion are not Netherlands City Compare readiness gates", () => {
  assert.doesNotMatch(comparison, /linked_program_count|programme_coverage_status|city_programme_directory_nl_v1/)
  assert.ok(matrix.includes("Programme count does not block city comparison"))
  assert.ok(matrix.includes("HBO coverage remain verification gaps"))
  assert.ok(matrix.includes("research-university core"))
})

test("Netherlands City Compare defaults to Amsterdam versus Maastricht", () => {
  assert.ok(comparison.includes('bySlug.get("amsterdam")'))
  assert.ok(comparison.includes('left.slug === "amsterdam" ? bySlug.get("maastricht") : bySlug.get("amsterdam")'))
  assert.ok(comparison.includes("PUBLISHED_NL_CITY_SLUGS.filter"))
})

test("Compare route supports country NL and renders Netherlands matrix", () => {
  assert.ok(comparePage.includes("getNlCityComparison"))
  assert.ok(comparePage.includes('countryCode === "NL"'))
  assert.ok(comparePage.includes('buildCityCompareCanonicalHref({ country: "NL" })'))
  assert.ok(comparePage.includes("NetherlandsCitiesCompareMatrix"))
  assert.ok(matrix.includes('countryCode="NL"'))
})

test("Netherlands comparison preserves Phase 4 methodology disclosures", () => {
  assert.ok(matrix.includes("CBS municipality boundary"))
  assert.ok(matrix.includes("1 January 2026"))
  assert.ok(matrix.includes("Eindhoven currently uses an explicitly marked national baseline"))
  assert.ok(matrix.includes("Source-native fare products and periods are preserved"))
  assert.ok(matrix.includes("No synthetic monthly equivalent"))
  assert.ok(matrix.includes("up to 16 hours per week or full-time in June, July and August"))
  assert.ok(matrix.includes("employer TWV required"))
})

test("Netherlands city profiles link into Compare while Compare links back to profiles", () => {
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "NL", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
  assert.ok(matrix.includes("/cities/nl/${city.slug}"))
  assert.ok(matrix.includes("/cities/nl/${left.slug}"))
  assert.ok(matrix.includes("/cities/nl/${right.slug}"))
})

test("Compare root remains noindex during Netherlands Phase 6", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
})
