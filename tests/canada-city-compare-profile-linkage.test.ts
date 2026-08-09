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

test("all published Canada city pages render the shared city dashboard", () => {
  for (const slug of CANADA_CITY_SLUGS) {
    const page = readFileSync(`src/app/(workspace)/cities/ca/${slug}/page.tsx`, "utf8")
    assert.ok(page.includes(`getCaCityProfile("${slug}")`))
    assert.ok(page.includes("<CanadaCityDashboard profile={profile}"))
    assert.ok(page.includes(`canonical: "/cities/ca/${slug}"`))
  }
})

test("Canada city profiles enter root Compare through the canonical city route builder", () => {
  const dashboard = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")
  const routes = readFileSync("src/lib/compare-routes.ts", "utf8")

  assert.ok(dashboard.includes('import { buildCityCompareCanonicalHref } from "@/lib/compare-routes"'))
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "CA", left: profile.slug })'))
  assert.ok(dashboard.includes("href={compareHref}"))
  assert.ok(dashboard.includes("Compare {profile.name} with another city"))
  assert.ok(routes.includes('return `/compare?${params.toString()}`'))
  assert.ok(routes.includes('type: "city"'))
})

test("root Compare consumes requested Canada city slugs and renders Canada matrix", () => {
  const page = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

  assert.ok(page.includes('if (countryCode === "CA")'))
  assert.ok(page.includes('getCaCityComparison(params.get("left"), params.get("right"))'))
  assert.ok(page.includes("<CanadaCitiesCompareMatrix"))
  assert.ok(page.includes('countryCode={countryCode}'))
})

test("Canada Compare returns users to either selected city profile", () => {
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(matrix.includes('countryCode="CA"'))
  assert.ok(matrix.includes('href={`/cities/ca/${left.slug}`}'))
  assert.ok(matrix.includes('href={`/cities/ca/${right.slug}`}'))
  assert.ok(matrix.includes('href={`/cities/ca/${city.slug}`}'))
  assert.ok(matrix.includes("City profile <ArrowRight"))
})

test("Canada city profile entry gets a deterministic second city when right is omitted", () => {
  const comparison = readFileSync("src/lib/cities/ca-city-comparison.server.ts", "utf8")

  assert.ok(comparison.includes('left.slug === "toronto" ? bySlug.get("vancouver") : bySlug.get("toronto")'))
  assert.ok(comparison.includes("profiles.find((profile) => profile.slug !== left.slug)"))
})
