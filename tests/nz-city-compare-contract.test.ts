import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const comparison = readFileSync("src/lib/cities/nz-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/new-zealand-cities-compare-matrix.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/new-zealand-city-dashboard.tsx", "utf8")

const published = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"]
const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("New Zealand City Compare uses exactly the five approved Tier A cities", () => {
  assert.match(routes, /PUBLISHED_NZ_CITY_SLUGS = \["auckland", "christchurch", "hamilton", "wellington", "dunedin"\] as const/)
  assert.ok(comparison.includes("PUBLISHED_NZ_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of ["palmerston-north", "lincoln", "tauranga"]) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NZ_CITY_SLUGS = \\[.*"${slug}"`))
  }
})

test("New Zealand compare readiness requires five verified metrics plus institution and campus linkage", () => {
  assert.ok(comparison.includes('.from("city_directory_nz_v1")'))
  assert.ok(comparison.includes('.from("report_metric_evidence_city")'))
  assert.ok(comparison.includes('.eq("review_status", "verified")'))
  assert.ok(comparison.includes('.gt("linked_campus_count", 0)'))
  assert.ok(comparison.includes('.gt("linked_institution_count", 0)'))
  for (const metric of requiredMetrics) assert.ok(comparison.includes(`"${metric}"`))
})

test("Programme verification is not a New Zealand City Compare readiness gate", () => {
  assert.doesNotMatch(comparison, /linked_program_count|programme_coverage_status|city_programme_directory_nz_v1/)
  assert.ok(matrix.includes("does not block city comparison"))
  assert.ok(matrix.includes("Programme coverage therefore remains verification pending"))
})

test("New Zealand City Compare defaults to Auckland versus Christchurch", () => {
  assert.ok(comparison.includes('bySlug.get("auckland")'))
  assert.ok(comparison.includes('left.slug === "auckland" ? bySlug.get("christchurch") : bySlug.get("auckland")'))
  assert.ok(comparison.includes("PUBLISHED_NZ_CITY_SLUGS.filter"))
  assert.ok(comparison.includes("profiles.map"))
})

test("Compare route supports country NZ and renders New Zealand matrix", () => {
  assert.ok(comparePage.includes("getNzCityComparison"))
  assert.ok(comparePage.includes('countryCode === "NZ"'))
  assert.ok(comparePage.includes('buildCityCompareCanonicalHref({ country: "NZ" })'))
  assert.ok(comparePage.includes("NewZealandCitiesCompareMatrix"))
  assert.ok(matrix.includes('countryCode="NZ"'))
})

test("New Zealand comparison preserves source methodology disclosures", () => {
  assert.ok(matrix.includes("Stats NZ urban-area study scope"))
  assert.ok(matrix.includes("Source-native fare products are preserved"))
  assert.ok(matrix.includes("no synthetic monthly fare is created"))
  assert.ok(matrix.includes("up to 25 hours per week during term from 3 November 2025"))
  assert.ok(matrix.includes("individual eVisa conditions control"))
  assert.ok(matrix.includes("source geography visible"))
  assert.ok(matrix.includes("territorial-authority place summaries"))
})

test("New Zealand city profiles link into Compare while Compare links back to profiles", () => {
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "NZ", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
  assert.ok(matrix.includes("/cities/nz/${city.slug}"))
  assert.ok(matrix.includes("/cities/nz/${left.slug}"))
  assert.ok(matrix.includes("/cities/nz/${right.slug}"))
})

test("Compare root remains noindex during Phase 6", () => {
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
})
