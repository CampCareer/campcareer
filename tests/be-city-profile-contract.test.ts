import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const routes = readFileSync("src/lib/cities/city-routes.ts", "utf8")
const profile = readFileSync("src/lib/cities/be-city-profile.server.ts", "utf8")
const page = readFileSync("src/app/(workspace)/cities/be/[city]/page.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/belgium-city-dashboard.tsx", "utf8")

const published = ["brussels", "ghent", "leuven", "antwerp", "louvain-la-neuve", "liege"]

test("Belgium city route allowlist remains exact", () => {
  assert.match(routes, /PUBLISHED_BE_CITY_SLUGS = \[/)
  for (const slug of published) assert.ok(routes.includes(`"${slug}"`))
  assert.ok(routes.includes("isPublishedBeCitySlug"))
  assert.ok(routes.includes("beCityPath"))
  assert.ok(routes.includes("/cities/be/${slug}"))
})

test("Belgium profile reads only verified city read models and metrics", () => {
  assert.ok(profile.includes('.from("city_directory_be_v1")'))
  assert.ok(profile.includes('.from("city_institution_directory_be_v1")'))
  assert.ok(profile.includes('.from("report_metric_evidence_city")'))
  assert.ok(profile.includes('.eq("review_status", "verified")'))
  assert.doesNotMatch(profile, /\.from\("city_programme_directory_be_v1"\)/)
  assert.doesNotMatch(profile, /\.from\("campuses"\)|\.from\("programmes"\)|\.from\("programme_offerings"\)/)
})

test("Belgium profile preserves special geography and programme coverage boundaries", () => {
  assert.ok(profile.includes("brussels_capital_region"))
  assert.ok(profile.includes("louvain_la_neuve_study_destination"))
  assert.ok(profile.includes("188 verified Belgium programme offering records"))
  assert.ok(profile.includes("never used to infer city programme availability"))
  assert.ok(dashboard.includes("Brussels-Capital Region"))
  assert.ok(dashboard.includes("Ottignies-Louvain-la-Neuve"))
  assert.ok(dashboard.includes("verification pending rather than “0 programmes”"))
})

test("Belgium profiles disclose source-native metrics and incomplete provider coverage", () => {
  assert.ok(profile.includes("hours_school_period"))
  assert.ok(profile.includes("school_holidays_unlimited_under_student_residence_work_rule"))
  assert.ok(profile.includes("source_native_period"))
  assert.ok(dashboard.includes("Source-native ticket period"))
  assert.ok(dashboard.includes("not a complete Belgian higher-education provider inventory"))
  assert.ok(dashboard.includes("not shortage rankings, job guarantees"))
})

test("Published Belgium profiles are indexable while unsupported slugs remain blocked", () => {
  assert.ok(page.includes("generateStaticParams"))
  assert.ok(page.includes("robots: { index: true, follow: true }"))
  assert.ok(page.includes("robots: { index: false, follow: false }"))
  assert.ok(page.includes("/cities/be/${normalized}"))
  assert.ok(page.includes("buildCityCompareCanonicalHref"))
  assert.ok(page.includes("Compare {profile.name}"))
})
