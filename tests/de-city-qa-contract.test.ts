import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const geographyMigration = readFileSync("supabase/migrations/20260810133035_normalize_de_tier_a_city_geographies_v1.sql", "utf8")
const linkageMigration = readFileSync("supabase/migrations/20260810163850_publish_de_tier_a_city_linkage_v1.sql", "utf8")
const metricsMigration = readFileSync("supabase/migrations/20260810170732_publish_de_tier_a_city_metrics_v1.sql", "utf8")
const profile = readFileSync("src/lib/cities/de-city-profile.server.ts", "utf8")
const profilePage = readFileSync("src/app/(workspace)/cities/de/[city]/page.tsx", "utf8")
const comparison = readFileSync("src/lib/cities/de-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/germany-cities-compare-matrix.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

const published = ["berlin", "munich", "hamburg", "aachen", "bonn", "dresden", "heidelberg", "karlsruhe", "tuebingen"]
const deferred = ["frankfurt", "cologne", "leipzig", "muenster", "stuttgart", "freiburg"]
const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Germany rollout keeps the exact nine-city publication boundary", () => {
  assert.ok(routes.includes("PUBLISHED_DE_CITY_SLUGS"))
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  for (const slug of deferred) {
    assert.doesNotMatch(routes, new RegExp(`PUBLISHED_DE_CITY_SLUGS = \\[.*"${slug}"`))
    assert.doesNotMatch(sitemap, new RegExp(`/cities/de/${slug}`))
  }
})

test("Phase 2 keeps municipality and AGS identity without inserting replacement geographies", () => {
  assert.ok(geographyMigration.includes("destatis_gvisys_municipality"))
  assert.ok(geographyMigration.includes("official_municipality_code_ags"))
  assert.ok(geographyMigration.includes("canonical_name"))
  assert.ok(geographyMigration.includes("slug"))
  assert.doesNotMatch(geographyMigration, /insert into core\.geographies/i)
})

test("Phase 3 linkage requires verified official teaching campuses and server-only views", () => {
  assert.ok(linkageMigration.includes("verified_teaching_campus"))
  assert.ok(linkageMigration.includes("verified_official_teaching_campus"))
  assert.ok(linkageMigration.includes("security_invoker"))
  assert.ok(linkageMigration.includes("city_directory_de_v1"))
  assert.ok(linkageMigration.includes("city_institution_directory_de_v1"))
  assert.ok(linkageMigration.includes("city_programme_directory_de_v1"))
  assert.ok(linkageMigration.includes("verification_pending"))
})

test("Phase 4 publishes exactly the five shared source-backed metric contracts", () => {
  for (const key of metricKeys) assert.ok(metricsMigration.includes(`'${key}'`))
  assert.ok(metricsMigration.includes("destatis_gvisys_municipality"))
  assert.ok(metricsMigration.includes("source_native_period"))
  assert.ok(metricsMigration.includes("full_days_per_year"))
  assert.ok(metricsMigration.includes("half_days_per_year"))
  assert.ok(metricsMigration.includes("not_shortage_ranking"))
  assert.ok(metricsMigration.includes("not_job_guarantee"))
})

test("Phase 5 profile reads only verified read models and preserves programme pending", () => {
  assert.ok(profile.includes('.from("city_directory_de_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_de_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("city_programme_directory_de_v1"\)/)
  assert.ok(profile.includes("programme delivery verification pending"))
  assert.ok(profile.includes("Institution or teaching-location presence is never used to infer programme delivery"))
})

test("Phase 6 Compare gates on metrics, teaching locations and institutions, not programmes", () => {
  for (const key of metricKeys) assert.ok(comparison.includes(`"${key}"`))
  assert.ok(comparison.includes('.gt("linked_campus_count", 0)'))
  assert.ok(comparison.includes('.gt("linked_institution_count", 0)'))
  assert.doesNotMatch(comparison, /linked_program_count|programme_coverage_status/)
  assert.ok(comparison.includes('bySlug.get("berlin")'))
  assert.ok(comparison.includes('bySlug.get("munich")'))
  assert.ok(comparePage.includes('countryCode === "DE"'))
  assert.ok(matrix.includes("does not infer programme delivery"))
})

test("Phase 7 publishes only approved profiles and keeps Compare non-indexable", () => {
  assert.ok(profilePage.includes("robots: { index: true, follow: true }"))
  assert.ok(profilePage.includes("robots: { index: false, follow: false }"))
  assert.ok(profilePage.includes("alternates: { canonical: `/cities/de/${normalized}` }"))
  assert.ok(sitemap.includes("PUBLISHED_DE_CITY_SLUGS"))
  assert.ok(sitemap.includes('`${SITE_URL}/cities/de/${slug}`'))
  assert.ok(comparePage.includes("robots: { index: false, follow: false }"))
})

test("final Germany city surfaces preserve municipality, transport and federal work disclosures", () => {
  assert.ok(matrix.includes("official Destatis / GV-ISys municipality boundary"))
  assert.ok(matrix.includes("Source-native ticket products and periods are preserved"))
  assert.ok(matrix.includes("140"))
  assert.ok(matrix.includes("280"))
  assert.ok(matrix.includes("national, not a city differentiator"))
})
