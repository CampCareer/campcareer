import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const geography = readFileSync("supabase/migrations/20260810202058_normalize_be_tier_a_city_geographies_v1.sql", "utf8")
const linkage = readFileSync("supabase/migrations/20260810202226_publish_be_tier_a_city_linkage_v1.sql", "utf8")
const metrics = readFileSync("supabase/migrations/20260810202906_publish_be_tier_a_city_metrics_v1.sql", "utf8")
const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/be-city-profile.server.ts", "utf8")
const compare = readFileSync("src/lib/cities/be-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const cityPage = readFileSync("src/app/(workspace)/cities/be/[city]/page.tsx", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

const published = ["brussels", "ghent", "leuven", "antwerp", "louvain-la-neuve", "liege"]

const metricKeys = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Belgium cross-phase scope remains exactly six Tier A destinations", () => {
  for (const slug of published) {
    assert.ok(routes.includes(`"${slug}"`))
    assert.ok(geography.includes(`'${slug}'`))
  }
  assert.ok(geography.includes("expected exactly 6 Tier A geographies"))
})

test("Belgium geography contracts preserve Brussels and Louvain-la-Neuve special boundaries", () => {
  assert.ok(geography.includes("brussels_capital_region"))
  assert.ok(geography.includes("statbel_brussels_capital_region"))
  assert.ok(geography.includes("louvain_la_neuve_study_destination"))
  assert.ok(geography.includes("statbel_ottignies_louvain_la_neuve_municipality"))
  assert.ok(geography.includes("'25121'"))
})

test("Belgium linkage is verified teaching-location only and programme delivery is not inferred", () => {
  assert.ok(linkage.includes("verified_teaching_campus"))
  assert.ok(linkage.includes("programme_assignment_verified',false"))
  assert.ok(linkage.includes("city_programme_directory_be_v1"))
  assert.ok(linkage.includes("must remain empty until explicit campus assignment evidence exists"))
  assert.ok(profile.includes("never used to infer city programme availability"))
})

test("Belgium read models are security invoker and service-role only", () => {
  for (const view of ["city_institution_directory_be_v1", "city_programme_directory_be_v1", "city_directory_be_v1"]) {
    assert.ok(linkage.includes(`view public.${view} with (security_invoker=true)`))
    assert.ok(linkage.includes(`grant select on public.${view} to service_role`))
  }
  assert.ok(linkage.includes("revoke all on public.city_directory_be_v1 from public,anon,authenticated"))
})

test("Belgium core metrics remain exactly five per published destination", () => {
  for (const key of metricKeys) assert.ok(metrics.includes(`'${key}'`))
  assert.ok(metrics.includes("expected 30 verified core metric rows"))
  assert.ok(metrics.includes("source_native_period',true"))
  assert.ok(metrics.includes("not_shortage_ranking',true"))
  assert.ok(metrics.includes("hours_school_period',20"))
})

test("Belgium profile, compare and publication surfaces preserve evidence gates", () => {
  assert.ok(compare.includes("REQUIRED_METRIC_KEYS"))
  assert.ok(compare.includes('.gt("linked_campus_count", 0)'))
  assert.ok(compare.includes('.gt("linked_institution_count", 0)'))
  assert.ok(comparePage.includes('countryCode === "BE"'))
  assert.ok(cityPage.includes("robots: { index: true, follow: true }"))
  assert.ok(cityPage.includes("robots: { index: false, follow: false }"))
  assert.ok(sitemap.includes("PUBLISHED_BE_CITY_SLUGS"))
  assert.ok(sitemap.includes('`${SITE_URL}/cities/be/${slug}`'))
})

test("Belgium City Compare remains excluded from SEO indexing", () => {
  assert.ok(comparePage.includes("robots: { index: false, follow: false }"))
})
