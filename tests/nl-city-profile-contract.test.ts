import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/nl-city-profile.server.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/nl/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/netherlands-city-dashboard.tsx", "utf8")

const published = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"]
const deferred = ["delft", "utrecht", "enschede", "tilburg", "leiden", "nijmegen", "wageningen", "the-hague"]

test("Netherlands city profile scope is exactly the approved five Tier A cities", () => {
  assert.match(
    routes,
    /PUBLISHED_NL_CITY_SLUGS = \["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"\] as const/,
  )
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NL_CITY_SLUGS = \\[.*"${slug}"`))
  }
  assert.ok(routes.includes("isPublishedNlCitySlug"))
  assert.ok(routes.includes("nlCityPath"))
  assert.ok(routes.includes("/cities/nl/${slug}"))
})

test("Netherlands profile reads only verified city linkage and metric evidence", () => {
  assert.ok(profile.includes('.from("city_directory_nl_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_nl_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("city_programme_directory_nl_v1"\)/)
  assert.doesNotMatch(profile, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
})

test("Netherlands profile requires all five Phase 4 metrics", () => {
  for (const key of [
    "city_population",
    "student_living_cost_monthly_range",
    "student_transport_reference",
    "student_work_hours_week",
    "employment_focus_sectors",
  ]) assert.ok(profile.includes(`"${key}"`))
})

test("institution presentation preserves BRIN and official location evidence while disclosing HBO gap", () => {
  assert.ok(profile.includes("brin_code,brin_source_url,linkage_basis"))
  assert.ok(dashboard.includes("BRIN source"))
  assert.ok(dashboard.includes("Legacy listed-campus and registry-address duplicates are not counted"))
  assert.ok(profile.includes("Dutch HBO providers remain an explicit expansion gap"))
})

test("programme delivery remains evidence-gated rather than inferred from institution presence", () => {
  assert.ok(profile.includes("explicit verified offering-to-campus link"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.doesNotMatch(profile, /linkedProgramCount:\s*0/)
})

test("population and living-cost methodology are visible", () => {
  assert.ok(profile.includes("cbs_municipality"))
  assert.ok(profile.includes("municipality_code"))
  assert.ok(profile.includes("reference_scope"))
  assert.ok(profile.includes("city_specific"))
  assert.ok(dashboard.includes("National baseline"))
  assert.ok(dashboard.includes("Living-cost methodology"))
})

test("transport remains source-native and work context preserves the 16-hour/TWV summer alternative", () => {
  assert.ok(profile.includes("source_native_period"))
  assert.ok(profile.includes("student_specific"))
  assert.ok(profile.includes("full_time_months"))
  assert.ok(profile.includes("employer_work_permit_required"))
  assert.ok(profile.includes("choice_required"))
  assert.ok(dashboard.includes("hoursTermTime ?? 16"))
  assert.ok(dashboard.includes("The employer needs a TWV"))
})

test("Phase 7 Netherlands routes are indexable and profiles link into City Compare", () => {
  assert.ok(page.includes("generateStaticParams"))
  assert.ok(page.includes("PUBLISHED_NL_CITY_SLUGS"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("/cities/nl/${normalized}"))
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "NL", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
})
