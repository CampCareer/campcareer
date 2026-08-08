import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const CANADA_CITY_SLUGS = ["toronto", "vancouver", "montreal", "ottawa", "calgary"] as const

test("five Canada city profiles are published as workspace cities", () => {
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

test("Canada dashboard and sitemap link all published launch cities", () => {
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
})

test("Canada City Compare is country-aware and data-driven", () => {
  const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
  const selector = readFileSync("src/app/(workspace)/compare/city-compare-selector.tsx", "utf8")
  const loader = readFileSync("src/lib/cities/ca-city-comparison.server.ts", "utf8")
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(comparePage.includes('countryCode === "CA"'))
  assert.ok(comparePage.includes("getCaCityComparison"))
  assert.ok(selector.includes('countryCode = "AU"'))
  assert.ok(selector.includes('params.set("country", countryCode.toUpperCase())'))
  assert.ok(loader.includes('"student_transport_reference"'))
  assert.ok(loader.includes('from("city_programme_directory_ca_v1")'))
  assert.ok(matrix.includes('countryCode="CA"'))
  assert.ok(matrix.includes("Canonical linked programmes"))
})
