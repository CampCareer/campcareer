import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profilePage = readFileSync("src/app/(workspace)/cities/nl/[city]/page.tsx", "utf8")
const profileServer = readFileSync("src/lib/cities/nl-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/netherlands-city-dashboard.tsx", "utf8")
const compareServer = readFileSync("src/lib/cities/nl-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const compareMatrix = readFileSync("src/app/(workspace)/compare/netherlands-cities-compare-matrix.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const foundationMigration = readFileSync("supabase/migrations/20260810131602_normalize_nl_tier_a_city_geographies_v1.sql", "utf8")
const linkageMigration = readFileSync("supabase/migrations/20260810132743_publish_nl_tier_a_city_linkage_v1.sql", "utf8")
const metricsMigration = readFileSync("supabase/migrations/20260810164813_publish_nl_tier_a_city_metrics_v1.sql", "utf8")

const published = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"]
const deferred = ["delft", "utrecht", "enschede", "tilburg", "leiden", "nijmegen", "wageningen", "the-hague"]
const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Phase 8 keeps Netherlands publication bounded to the five approved Tier A cities", () => {
  assert.match(
    routes,
    /PUBLISHED_NL_CITY_SLUGS = \["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"\] as const/,
  )
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NL_CITY_SLUGS = \\[.*"${slug}"`))
  }
  assert.ok(profilePage.includes("if (!isPublishedNlCitySlug(normalized)) notFound()"))
})

test("Phase 8 preserves CBS municipality geography normalization and Tier B boundaries", () => {
  assert.ok(foundationMigration.includes("cbs_municipality"))
  for (const code of ["GM0363", "GM0935", "GM0599", "GM0014", "GM0772"]) assert.ok(foundationMigration.includes(code))
  assert.ok(foundationMigration.includes("Netherlands Tier A city normalization expected 5 rows"))
  assert.ok(foundationMigration.includes("Netherlands Tier B geographies were unexpectedly normalized"))
  assert.ok(foundationMigration.includes("phase_3_explicit_location_evidence_required"))
  assert.ok(foundationMigration.includes("Do not automatically include Amstelveen, Diemen"))
  assert.ok(foundationMigration.includes("Do not silently expand the city boundary to Rijnmond"))
  assert.ok(foundationMigration.includes("Do not treat the broader Brainport region"))
})

test("Phase 8 preserves BRIN-backed official location evidence and programme verification rules", () => {
  assert.ok(linkageMigration.includes("NL_BRIN"))
  assert.ok(linkageMigration.includes("nl_city_linkage_v1"))
  assert.ok(linkageMigration.includes("'programme_assignment_verified',false"))
  assert.ok(linkageMigration.includes("po.verification_status='verified'"))
  assert.ok(linkageMigration.includes("grant select on public.city_directory_nl_v1 to service_role"))
  assert.ok(linkageMigration.includes("grant select on public.city_institution_directory_nl_v1 to service_role"))
  assert.ok(linkageMigration.includes("grant select on public.city_programme_directory_nl_v1 to service_role"))
  assert.ok(linkageMigration.includes("NL city programme directory must remain empty until explicit offering campus_id evidence is written"))
  assert.ok(profileServer.includes("explicit verified offering-to-campus link"))
  assert.doesNotMatch(profileServer, /\.from\("city_programme_directory_nl_v1"\)/)
})

test("Phase 8 keeps exactly the five shared verified city metric contracts", () => {
  for (const key of requiredMetrics) {
    assert.ok(metricsMigration.includes(`'${key}'`))
    assert.ok(profileServer.includes(`"${key}"`))
    assert.ok(compareServer.includes(`"${key}"`))
  }
  assert.ok(metricsMigration.includes("total_n<>25"))
  assert.ok(metricsMigration.includes("having count(r.metric_key)<>5"))
  assert.ok(metricsMigration.includes("'source_native_period',true"))
  assert.ok(metricsMigration.includes("'hours_term_time',16"))
  assert.ok(metricsMigration.includes("'employer_work_permit_required',true"))
  assert.ok(metricsMigration.includes("'choice_required',true"))
  assert.ok(metricsMigration.includes("'national_baseline'"))
})

test("Phase 8 keeps profile and Compare on verified server-side read models", () => {
  assert.ok(profileServer.includes('.from("city_directory_nl_v1")'))
  assert.ok(profileServer.includes('.from("city_institution_directory_nl_v1")'))
  assert.ok(profileServer.includes('.from("report_metric_evidence_city")'))
  assert.ok(profileServer.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profileServer, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
  assert.ok(compareServer.includes('.from("city_directory_nl_v1")'))
  assert.ok(compareServer.includes('.from("report_metric_evidence_city")'))
  assert.ok(compareServer.includes('.gt("linked_campus_count", 0)'))
  assert.ok(compareServer.includes('.gt("linked_institution_count", 0)'))
  assert.doesNotMatch(compareServer, /linked_program_count|programme_coverage_status|city_programme_directory_nl_v1/)
})

test("Phase 8 preserves programme/HBO pending disclosures and source methodology caveats", () => {
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.ok(profileServer.includes("Dutch HBO providers remain an explicit expansion gap"))
  assert.ok(compareMatrix.includes("Programme delivery and HBO coverage remain verification gaps"))
  assert.ok(compareMatrix.includes("HBO coverage remains pending"))
  assert.ok(compareMatrix.includes("CBS municipality"))
  assert.ok(compareMatrix.includes("source-native public-transport products"))
  assert.ok(compareMatrix.includes("16 hours per week"))
  assert.ok(compareMatrix.includes("employer TWV"))
})

test("Phase 8 keeps Netherlands city publication canonical and Compare noindex", () => {
  assert.ok(profilePage.includes("robots: { index: true, follow: true }"))
  assert.ok(profilePage.includes("robots: { index: false, follow: false }"))
  assert.ok(profilePage.includes("alternates: { canonical: `/cities/nl/${normalized}` }"))
  assert.ok(sitemap.includes("PUBLISHED_NL_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_NL_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/nl/${slug}"))
  assert.ok(comparePage.includes('if (countryCode === "NL")'))
  assert.ok(comparePage.includes("getNlCityComparison"))
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(compareMatrix.includes('countryCode="NL"'))
  assert.ok(compareServer.includes('bySlug.get("amsterdam")'))
  assert.ok(compareServer.includes('bySlug.get("maastricht")'))
})
