import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const CANADA_CITY_SLUGS = [
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "calgary",
  "waterloo",
  "edmonton",
] as const

test("seven Canada city profiles are published as workspace cities", () => {
  for (const slug of CANADA_CITY_SLUGS) {
    const page = readFileSync(`src/app/(workspace)/cities/ca/${slug}/page.tsx`, "utf8")
    assert.ok(page.includes(`getCaCityProfile("${slug}")`))
    assert.ok(page.includes(`canonical: "/cities/ca/${slug}"`))
  }

  const dashboard = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")
  const loader = readFileSync("src/lib/cities/ca-city-profile.server.ts", "utf8")
  assert.ok(dashboard.includes("h / week"))
  assert.ok(dashboard.includes("Canonical linked programmes"))
  assert.ok(loader.includes('metrics.get("student_transport_reference")'))
  assert.ok(loader.includes('metrics.get("student_work_hours_week")'))
})

test("Canada city normalization does not infer GTA programme membership", () => {
  const migration = readFileSync(
    "supabase/migrations/20260808100208_normalize_canada_city_slugs_v1.sql",
    "utf8",
  )
  const torontoMigration = readFileSync(
    "supabase/migrations/20260808100251_publish_toronto_city_mvp_v1.sql",
    "utf8",
  )

  assert.ok(migration.includes("study_destination_scope', 'named_city'"))
  assert.ok(migration.includes("Do not infer GTA/CMA membership"))
  assert.ok(torontoMigration.includes("Mississauga, Brampton and Oakville are not inferred"))
})

test("Canada dashboard and sitemap link all published comparison-ready cities", () => {
  const dashboard = readFileSync(
    "src/app/(workspace)/countries/canada-country-dashboard.tsx",
    "utf8",
  )
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

  for (const slug of CANADA_CITY_SLUGS) {
    assert.ok(sitemap.includes(`/cities/ca/${slug}`))
  }
  assert.ok(dashboard.includes('Toronto: "/cities/ca/toronto"'))
  assert.ok(dashboard.includes('Vancouver: "/cities/ca/vancouver"'))
  assert.ok(dashboard.includes('Montreal: "/cities/ca/montreal"'))
  assert.ok(dashboard.includes('Ottawa: "/cities/ca/ottawa"'))
  assert.ok(dashboard.includes('Calgary: "/cities/ca/calgary"'))
  assert.ok(dashboard.includes('Waterloo: "/cities/ca/waterloo"'))
  assert.ok(dashboard.includes('Edmonton: "/cities/ca/edmonton"'))
})

test("Canada City Compare is country-aware, canonical and data-driven", () => {
  const compareModePage = readFileSync("src/app/(workspace)/compare/[mode]/page.tsx", "utf8")
  const selector = readFileSync("src/app/(workspace)/compare/city-compare-selector.tsx", "utf8")
  const header = readFileSync("src/app/(workspace)/compare/compare-mode-navigation.tsx", "utf8")
  const loader = readFileSync("src/lib/cities/ca-city-comparison.server.ts", "utf8")
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")
  const routes = readFileSync("src/lib/compare-routes.ts", "utf8")

  assert.ok(compareModePage.includes('country === "CA"'))
  assert.ok(compareModePage.includes("getCaCityComparison"))
  assert.ok(selector.includes('countryCode = "AU"'))
  assert.ok(selector.includes("buildCityCompareCanonicalHref"))
  assert.ok(header.includes("buildCityCompareCanonicalHref({ country: code })"))
  assert.ok(routes.includes('compareModePath("cities")'))
  assert.ok(loader.includes('"student_transport_reference"'))
  assert.ok(loader.includes('from("city_programme_directory_ca_v1")'))
  assert.ok(matrix.includes('countryCode="CA"'))
  assert.ok(matrix.includes("Canonical linked programmes"))
})
