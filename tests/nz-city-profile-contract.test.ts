import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/nz-city-profile.server.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/nz/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/new-zealand-city-dashboard.tsx", "utf8")

const published = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"]
const deferred = ["palmerston-north", "lincoln", "tauranga"]

test("New Zealand city profile scope is exactly the approved five Tier A cities", () => {
  assert.match(
    routes,
    /PUBLISHED_NZ_CITY_SLUGS = \["auckland", "christchurch", "hamilton", "wellington", "dunedin"\] as const/,
  )
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NZ_CITY_SLUGS = \\[.*"${slug}"`))
  }
  assert.ok(routes.includes("isPublishedNzCitySlug"))
  assert.ok(routes.includes("nzCityPath"))
  assert.ok(routes.includes("/cities/nz/${slug}"))
})

test("New Zealand profile reads only verified city linkage and metric read models", () => {
  assert.ok(profile.includes('.from("city_directory_nz_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_nz_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("city_programme_directory_nz_v1"\)/)
  assert.doesNotMatch(profile, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
})

test("New Zealand profile requires the five shared city metrics", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(profile.includes(`"${key}"`))
})

test("New Zealand institution presentation preserves provider identity and official teaching locations", () => {
  assert.ok(profile.includes("provider_number,provider_source_url,website_url"))
  assert.ok(profile.includes("location_source_url,location_quality,record_scope"))
  assert.ok(dashboard.includes("initial verified teaching-campus set"))
  assert.ok(dashboard.includes("canonical NZ provider identity and explicit official teaching-location evidence"))
  assert.ok(dashboard.includes("NZQA source"))
})

test("New Zealand programme gap is explicit and institution presence never becomes programme delivery", () => {
  assert.ok(profile.includes("Institution or campus presence is never used to infer programme delivery"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.doesNotMatch(profile, /linkedProgramCount:\s*0/)
})

test("New Zealand work-rights copy preserves the conditional 25-hour rule", () => {
  assert.ok(profile.includes("hours_term_time"))
  assert.ok(profile.includes("effective_from"))
  assert.ok(profile.includes("full_time_during_eligible_scheduled_breaks"))
  assert.ok(dashboard.includes("hoursTermTime ?? 25"))
  assert.ok(dashboard.includes("individual eVisa control"))
  assert.ok(dashboard.includes("eligible scheduled breaks"))
})

test("New Zealand transport and population keep source methodology visible", () => {
  assert.ok(profile.includes("eligibility_or_fare_card_required"))
  assert.ok(profile.includes("source_native_period"))
  assert.ok(profile.includes("geography_kind"))
  assert.ok(dashboard.includes("Source-native fare period"))
  assert.ok(dashboard.includes("Population evidence keeps its own source geography label visible"))
})

test("Phase 7 New Zealand profiles are published while linking to City Compare", () => {
  assert.ok(page.includes("generateStaticParams"))
  assert.ok(page.includes("PUBLISHED_NZ_CITY_SLUGS"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("/cities/nz/${normalized}"))
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "NZ", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
})
