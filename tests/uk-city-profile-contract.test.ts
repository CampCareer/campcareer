import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/uk-city-profile.server.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/uk/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/united-kingdom-city-dashboard.tsx", "utf8")

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

test("UK city profile scope is exactly the approved ten Tier A cities", () => {
  assert.ok(routes.includes("PUBLISHED_UK_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.doesNotMatch(routes, /PUBLISHED_UK_CITY_SLUGS[\s\S]*"leeds"|PUBLISHED_UK_CITY_SLUGS[\s\S]*"nottingham"/)
  assert.ok(routes.includes("isPublishedUkCitySlug"))
  assert.ok(routes.includes("ukCityPath"))
})

test("UK profile reads only published city linkage and verified metric read models", () => {
  assert.ok(profile.includes('.from("city_directory_uk_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_uk_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
})

test("UK profile requires the five shared city metrics", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(profile.includes(`"${key}"`))
})

test("UK institution presentation preserves verified identity and location evidence", () => {
  assert.ok(profile.includes("institution_slug,ukprn,website_url"))
  assert.ok(profile.includes("location_source_url,location_quality,record_scope"))
  assert.ok(profile.includes("/institutions/uk/${row.institution_slug}"))
  assert.ok(dashboard.includes("8-digit UKPRN"))
  assert.ok(dashboard.includes("verified official location evidence"))
})

test("UK programme gap is explicit and institution presence never becomes programme delivery", () => {
  assert.ok(profile.includes("Institution presence is never used to infer programme delivery"))
  assert.ok(dashboard.includes("not presented as “0 programmes”"))
  assert.ok(dashboard.includes("programme-offering-to-campus evidence"))
})

test("UK work-rights copy keeps Student visa qualification", () => {
  assert.ok(profile.includes("student_visa_full_time_degree_level_or_above_at_compliant_higher_education_provider"))
  assert.ok(profile.includes("full_time_outside_term"))
  assert.ok(dashboard.includes("Degree-level full-time study at a compliant HEP during term time"))
  assert.ok(dashboard.includes("other study categories can have different or no work permission"))
})

test("London scope is Greater London and Phase 5 stays out of Compare/SEO publication", () => {
  assert.ok(profile.includes('city.study_destination_scope === "greater_london"'))
  assert.ok(dashboard.includes("London uses the Greater London study-destination boundary"))
  assert.ok(page.includes("generateStaticParams"))
  assert.ok(page.includes("PUBLISHED_UK_CITY_SLUGS"))
  assert.ok(page.includes("robots: { index: false, follow: true }"))
  assert.doesNotMatch(dashboard, /buildCityCompareCanonicalHref|Compare .*<|country: "UK"/)
})
