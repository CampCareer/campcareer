import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profilePage = readFileSync("src/app/(workspace)/cities/nz/[city]/page.tsx", "utf8")
const profileServer = readFileSync("src/lib/cities/nz-city-profile.server.ts", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/new-zealand-city-dashboard.tsx", "utf8")
const compareServer = readFileSync("src/lib/cities/nz-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const compareMatrix = readFileSync("src/app/(workspace)/compare/new-zealand-cities-compare-matrix.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")
const foundationMigration = readFileSync("supabase/migrations/20260809120738_normalize_nz_tier_a_city_geographies_v1.sql", "utf8")
const linkageMigration = readFileSync("supabase/migrations/20260809121651_publish_nz_tier_a_city_linkage_v1.sql", "utf8")
const metricsMigration = readFileSync("supabase/migrations/20260809123214_publish_nz_tier_a_city_metrics_v1.sql", "utf8")

const published = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"]
const deferred = ["palmerston-north", "lincoln", "tauranga"]
const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Phase 8 keeps New Zealand publication bounded to the five approved Tier A cities", () => {
  assert.match(
    routes,
    /PUBLISHED_NZ_CITY_SLUGS = \["auckland", "christchurch", "hamilton", "wellington", "dunedin"\] as const/,
  )
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_NZ_CITY_SLUGS = \\[.*"${slug}"`))
  }
  assert.ok(profilePage.includes("if (!isPublishedNzCitySlug(normalized)) notFound()"))
})

test("Phase 8 preserves Stats NZ urban-area geography normalization and deferred-city boundaries", () => {
  assert.ok(foundationMigration.includes("stats_nz_urban_area"))
  assert.ok(foundationMigration.includes("Auckland urban area"))
  assert.ok(foundationMigration.includes("Christchurch urban area"))
  assert.ok(foundationMigration.includes("Hamilton urban area"))
  assert.ok(foundationMigration.includes("Wellington urban area"))
  assert.ok(foundationMigration.includes("Dunedin urban area"))
  assert.ok(foundationMigration.includes("expected 5 rows"))
  assert.ok(foundationMigration.includes("New Zealand Tier B geographies were unexpectedly normalized"))
  assert.ok(foundationMigration.includes("phase_3_explicit_location_evidence_required"))
})

test("Phase 8 preserves official provider-location evidence and programme verification rules", () => {
  assert.ok(linkageMigration.includes("NZ_MOE_PROVIDER_NUMBER"))
  assert.ok(linkageMigration.includes("'location_quality','verified_official'"))
  assert.ok(linkageMigration.includes("'programme_assignment_verified',false"))
  assert.ok(linkageMigration.includes("po.verification_status='verified'"))
  assert.ok(linkageMigration.includes("grant select on public.city_directory_nz_v1 to service_role"))
  assert.ok(linkageMigration.includes("grant select on public.city_institution_directory_nz_v1 to service_role"))
  assert.ok(linkageMigration.includes("grant select on public.city_programme_directory_nz_v1 to service_role"))
  assert.ok(linkageMigration.includes("NZ programme directory must remain empty"))
  assert.ok(profileServer.includes("Institution or campus presence is never used to infer programme delivery"))
  assert.doesNotMatch(profileServer, /\.from\("city_programme_directory_nz_v1"\)/)
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
  assert.ok(metricsMigration.includes('"hours_term_time":25'))
  assert.ok(metricsMigration.includes('"full_time_during_eligible_scheduled_breaks":true'))
  assert.ok(metricsMigration.includes('"effective_from":"2025-11-03"'))
  assert.ok(metricsMigration.includes('"context":"eligible_student_visa"'))
})

test("Phase 8 keeps profile and Compare on verified server-side read models", () => {
  assert.ok(profileServer.includes('.from("city_directory_nz_v1")'))
  assert.ok(profileServer.includes('.from("city_institution_directory_nz_v1")'))
  assert.ok(profileServer.includes('.from("report_metric_evidence_city")'))
  assert.ok(profileServer.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profileServer, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
  assert.ok(compareServer.includes('.from("city_directory_nz_v1")'))
  assert.ok(compareServer.includes('.from("report_metric_evidence_city")'))
  assert.ok(compareServer.includes('.gt("linked_campus_count", 0)'))
  assert.ok(compareServer.includes('.gt("linked_institution_count", 0)'))
  assert.doesNotMatch(compareServer, /linkedProgramCount > 0/)
})

test("Phase 8 preserves programme-pending disclosures and source methodology caveats", () => {
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
  assert.ok(compareMatrix.includes("Programme coverage therefore remains verification pending"))
  assert.ok(compareMatrix.includes("Stats NZ urban-area study scope"))
  assert.ok(compareMatrix.includes("Source-native fare products are preserved"))
  assert.ok(compareMatrix.includes("up to 25 hours per week during term from 3 November 2025"))
  assert.ok(compareMatrix.includes("individual eVisa conditions control"))
})

test("Phase 8 keeps New Zealand city publication canonical and Compare noindex", () => {
  assert.ok(profilePage.includes("robots: { index: true, follow: true }"))
  assert.ok(profilePage.includes("robots: { index: false, follow: false }"))
  assert.ok(profilePage.includes("alternates: { canonical: `/cities/nz/${normalized}` }"))
  assert.ok(sitemap.includes("PUBLISHED_NZ_CITY_SLUGS"))
  assert.ok(sitemap.includes("...PUBLISHED_NZ_CITY_SLUGS.map"))
  assert.ok(sitemap.includes("/cities/nz/${slug}"))
  assert.ok(comparePage.includes('if (countryCode === "NZ")'))
  assert.ok(comparePage.includes("getNzCityComparison"))
  assert.ok(comparePage.includes('robots: { index: false, follow: false }'))
  assert.ok(compareMatrix.includes('countryCode="NZ"'))
  assert.ok(compareServer.includes('bySlug.get("auckland")'))
  assert.ok(compareServer.includes('bySlug.get("christchurch")'))
})
