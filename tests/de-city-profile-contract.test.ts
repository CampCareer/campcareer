import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/de-city-profile.server.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/de/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/germany-city-dashboard.tsx", "utf8")

const published = [
  "berlin",
  "munich",
  "hamburg",
  "aachen",
  "bonn",
  "dresden",
  "heidelberg",
  "karlsruhe",
  "tuebingen",
]
const deferred = ["frankfurt", "cologne", "leipzig", "muenster", "stuttgart", "freiburg"]

test("Germany city profile scope is exactly the approved nine Tier A municipalities", () => {
  assert.match(routes, /PUBLISHED_DE_CITY_SLUGS = \[/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_DE_CITY_SLUGS = \\[.*"${slug}"`))
  }
  assert.ok(routes.includes("isPublishedDeCitySlug"))
  assert.ok(routes.includes("deCityPath"))
  assert.ok(routes.includes("/cities/de/${slug}"))
})

test("Germany profile reads only verified city linkage and metric read models", () => {
  assert.ok(profile.includes('.from("city_directory_de_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_de_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("city_programme_directory_de_v1"\)/)
  assert.doesNotMatch(profile, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
})

test("Germany profile requires all five Phase 4 city metrics", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(profile.includes(`"${key}"`))
})

test("Germany population presentation preserves municipality and AGS evidence", () => {
  assert.ok(profile.includes("geography_kind"))
  assert.ok(profile.includes("populationValue.ags"))
  assert.ok(dashboard.includes("official Destatis / GV-ISys municipality boundary"))
  assert.ok(dashboard.includes("AGS ${profile.population.ags}"))
  assert.ok(dashboard.includes("Metro areas, neighbouring municipalities"))
})

test("Germany institution presentation preserves verified domain and teaching-location evidence", () => {
  assert.ok(profile.includes("verified_domain,identity_source_url,website_url"))
  assert.ok(profile.includes("location_source_url,location_quality,record_scope"))
  assert.ok(dashboard.includes("Verified domain"))
  assert.ok(dashboard.includes("initial verified teaching-location set"))
  assert.ok(dashboard.includes("Location source"))
})

test("Germany programme coverage remains verification pending rather than inferred zero availability", () => {
  assert.ok(profile.includes("current city seed relationships do not prove campus-specific delivery"))
  assert.ok(profile.includes("Institution or teaching-location presence is never used to infer programme delivery"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.doesNotMatch(profile, /linkedProgramCount:\s*0/)
})

test("Germany transport handles source-native single values and ranges", () => {
  assert.ok(profile.includes("transportValue.amount"))
  assert.ok(profile.includes("transportValue.low"))
  assert.ok(profile.includes("transportValue.high"))
  assert.ok(profile.includes("eligibility_or_enrolment_conditions_apply"))
  assert.ok(profile.includes("source_native_period"))
  assert.ok(dashboard.includes("Source-native ticket period"))
})

test("Germany work-rights copy preserves the federal 20-hour and 140/280-day context", () => {
  assert.ok(profile.includes("hours_term_time"))
  assert.ok(profile.includes("full_days_per_year"))
  assert.ok(profile.includes("half_days_per_year"))
  assert.ok(profile.includes("student_auxiliary_task_exception"))
  assert.ok(dashboard.includes("hoursTermTime ?? 20"))
  assert.ok(dashboard.includes("fullDaysPerYear ?? 140"))
  assert.ok(dashboard.includes("halfDaysPerYear ?? 280"))
  assert.ok(dashboard.includes("eligible third-country students"))
})

test("Phase 5 Germany profiles stay noindex and do not enable Compare early", () => {
  assert.ok(page.includes("generateStaticParams"))
  assert.ok(page.includes("PUBLISHED_DE_CITY_SLUGS"))
  assert.ok(page.includes("robots: { index: false, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("/cities/de/${normalized}"))
  assert.doesNotMatch(dashboard, /buildCityCompareCanonicalHref|Compare \{profile\.name\}/)
})
