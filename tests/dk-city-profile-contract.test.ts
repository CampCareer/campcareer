import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/dk-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/denmark-city-dashboard.tsx", "utf8")
const page = readFileSync("src/app/(workspace)/cities/dk/[city]/page.tsx", "utf8")
const metrics = readFileSync("supabase/migrations/20260810202207_publish_dk_tier_a_city_metrics_v1.sql", "utf8")

const published = ["copenhagen", "frederiksberg", "odense", "aarhus", "aalborg"]
const deferred = ["lyngby", "roskilde", "sonderborg", "kolding", "esbjerg"]

test("Denmark Phase 5 route scope is exactly the approved five Tier A cities", () => {
  assert.match(routes, /PUBLISHED_DK_CITY_SLUGS = \["copenhagen", "frederiksberg", "odense", "aarhus", "aalborg"\] as const/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) assert.doesNotMatch(routes, new RegExp(`PUBLISHED_DK_CITY_SLUGS = \\[.*"${slug}"`))
  assert.ok(routes.includes("isPublishedDkCitySlug"))
  assert.ok(routes.includes("dkCityPath"))
  assert.ok(routes.includes("/cities/dk/${slug}"))
})

test("Denmark profile reads only verified city read models and verified metric evidence", () => {
  assert.ok(profile.includes('.from("city_directory_dk_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_dk_v1")'))
  assert.ok(profile.includes('.from("city_programme_directory_dk_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
})

test("Denmark profile presents bounded verified-partial programme coverage", () => {
  assert.ok(profile.includes('.limit(8)'))
  assert.ok(profile.includes('status: "verified_partial"'))
  assert.ok(profile.includes("explicit Study in Denmark source city"))
  assert.ok(profile.includes("not a complete inventory"))
  assert.ok(dashboard.includes("verified partial coverage"))
  assert.ok(dashboard.includes("not an exhaustive municipality catalogue"))
})

test("professional-provider incompleteness remains explicit", () => {
  assert.ok(dashboard.includes("professional higher-education providers are still an explicit coverage gap"))
  assert.ok(dashboard.includes("verified university core"))
})

test("living-cost and transport limitations are visible", () => {
  assert.ok(metrics.includes("'reference_scope','national_baseline'"))
  assert.ok(metrics.includes("'city_specific',false"))
  assert.ok(metrics.includes("'source_native_period',true"))
  assert.ok(metrics.includes("'student_specific',false"))
  assert.ok(dashboard.includes("not city-specific"))
  assert.ok(dashboard.includes("not a universal student concession"))
})

test("work context stays monthly and is never presented as a weekly entitlement", () => {
  assert.ok(profile.includes("hours_normal_period"))
  assert.ok(profile.includes("normal_period_months"))
  assert.ok(profile.includes("full_time_months"))
  assert.ok(dashboard.includes("hoursNormalPeriod"))
  assert.ok(dashboard.includes("hours per month"))
  assert.ok(dashboard.includes("not converted to a weekly entitlement"))
  assert.doesNotMatch(dashboard, /h \/ week/)
})

test("published Denmark profiles are indexable while unsupported routes fail closed and Compare remains disabled", () => {
  assert.ok(page.includes("generateStaticParams"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("alternates: { canonical: `/cities/dk/${normalized}` }"))
  assert.ok(page.includes("notFound()"))
  assert.doesNotMatch(dashboard, /buildCityCompareCanonicalHref/)
  assert.doesNotMatch(dashboard, /Compare \{profile\.name\}/)
})
