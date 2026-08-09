import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profilePage = readFileSync("src/app/(workspace)/cities/uk/[city]/page.tsx", "utf8")
const profileServer = readFileSync("src/lib/cities/uk-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/united-kingdom-city-dashboard.tsx", "utf8")
const compareServer = readFileSync("src/lib/cities/uk-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const compareMatrix = readFileSync("src/app/(workspace)/compare/united-kingdom-cities-compare-matrix.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const linkageMigration = readFileSync("supabase/migrations/20260808210529_publish_uk_tier_a_city_linkage_v1.sql", "utf8")
const metricsMigration = readFileSync("supabase/migrations/20260808211719_publish_uk_tier_a_city_metrics_v1.sql", "utf8")

const published = [
  "london",
  "manchester",
  "birmingham",
  "edinburgh",
  "glasgow",
  "cardiff",
  "belfast",
  "oxford",
  "cambridge",
  "bristol",
]

const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Phase 8 keeps the UK publication scope bounded to the approved ten cities", () => {
  assert.ok(routes.includes("PUBLISHED_UK_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.doesNotMatch(routes, /PUBLISHED_UK_CITY_SLUGS[\s\S]*"leeds"|PUBLISHED_UK_CITY_SLUGS[\s\S]*"nottingham"/)
  assert.ok(profilePage.includes("if (!isPublishedUkCitySlug(normalized)) notFound()"))
})

test("Phase 8 requires verified read models and the five shared metrics", () => {
  assert.ok(profileServer.includes('.from("city_directory_uk_v1")'))
  assert.ok(profileServer.includes('.from("city_institution_directory_uk_v1")'))
  assert.ok(profileServer.includes('.eq("review_status", "verified")'))
  for (const key of requiredMetrics) {
    assert.ok(profileServer.includes(`"${key}"`))
    assert.ok(compareServer.includes(`"${key}"`))
    assert.ok(metricsMigration.includes(`'${key}'`))
  }
})

test("Phase 8 preserves explicit institution-location evidence and programme verification gap", () => {
  assert.ok(linkageMigration.includes("location_quality','verified_official'"))
  assert.ok(linkageMigration.includes("UK_UKPRN"))
  assert.ok(linkageMigration.includes("programme_assignment_verified',false"))
  assert.ok(profileServer.includes("Institution presence is never used to infer programme delivery"))
  assert.ok(dashboard.includes("not presented as “0 programmes”"))
  assert.ok(compareMatrix.includes("not presented as “0 programmes”"))
  assert.doesNotMatch(compareServer, /profile\.linkedProgramCount > 0/)
})

test("Phase 8 preserves London and Manchester geography boundaries", () => {
  assert.ok(linkageMigration.includes("t.slug='london' and c.region='London'"))
  assert.ok(compareMatrix.includes("Greater London"))
  assert.ok(compareMatrix.includes("named-city/local-authority boundaries"))
  assert.ok(dashboard.includes("Neighbouring authorities are not silently merged"))
})

test("Phase 8 keeps publication metadata and sitemap canonical", () => {
  assert.ok(profilePage.includes("robots: { index: true, follow: true }"))
  assert.ok(profilePage.includes("robots: { index: false, follow: false }"))
  assert.ok(profilePage.includes("alternates: { canonical: `/cities/uk/${normalized}` }"))
  assert.ok(sitemap.includes("PUBLISHED_UK_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_UK_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/uk/${slug}"))
  assert.doesNotMatch(sitemap, /\/cities\/uk\/(leeds|nottingham)/)
})

test("Phase 8 keeps UK City Compare available but noindex", () => {
  assert.ok(comparePage.includes('if (countryCode === "UK")'))
  assert.ok(comparePage.includes("getUkCityComparison"))
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(compareMatrix.includes('countryCode="UK"'))
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "UK", left: profile.slug })'))
})

test("Phase 8 preserves qualified Student visa work-rights copy", () => {
  assert.ok(profileServer.includes("student_visa_full_time_degree_level_or_above_at_compliant_higher_education_provider"))
  assert.ok(dashboard.includes("other study categories can have different or no work permission"))
  assert.ok(compareMatrix.includes("Other categories can differ or have no work permission"))
})
