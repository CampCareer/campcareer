import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const compare = readFileSync("src/lib/cities/be-city-comparison.server.ts", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/belgium-cities-compare-matrix.tsx", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const cityPage = readFileSync("src/app/(workspace)/cities/be/[city]/page.tsx", "utf8")

const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Belgium City Compare requires all five verified metrics and positive linkage", () => {
  for (const key of requiredMetrics) assert.ok(compare.includes(`"${key}"`))
  assert.ok(compare.includes('.from("city_directory_be_v1")'))
  assert.ok(compare.includes('.from("report_metric_evidence_city")'))
  assert.ok(compare.includes('.eq("review_status", "verified")'))
  assert.ok(compare.includes('.gt("linked_campus_count", 0)'))
  assert.ok(compare.includes('.gt("linked_institution_count", 0)'))
  assert.doesNotMatch(compare, /linked_program_count/)
})

test("Belgium City Compare defaults to Brussels versus Ghent and prevents duplicates", () => {
  assert.ok(compare.includes('bySlug.get("brussels")'))
  assert.ok(compare.includes('bySlug.get("ghent")'))
  assert.ok(compare.includes("rightSlug !== left.slug"))
  assert.ok(compare.includes("left.slug === right.slug"))
})

test("Belgium comparison preserves heterogeneous geography and source-native metric semantics", () => {
  assert.ok(matrix.includes("Brussels-Capital Region"))
  assert.ok(matrix.includes("Louvain-la-Neuve"))
  assert.ok(matrix.includes("different baskets and assumptions"))
  assert.ok(matrix.includes("no artificial monthly normalization"))
  assert.ok(matrix.includes("not a synthetic cheapest-city ranking"))
  assert.ok(matrix.includes("not a shortage ranking, job guarantee or immigration signal"))
})

test("Belgium comparison excludes inferred programme delivery and exposes profile navigation", () => {
  assert.ok(matrix.includes("188 verified Belgium programme offering records"))
  assert.ok(matrix.includes("do not prove delivery at the Phase 3 teaching locations"))
  assert.ok(matrix.includes('/cities/be/${city.slug}'))
  assert.ok(cityPage.includes("buildCityCompareCanonicalHref"))
})

test("Shared compare surface routes country BE to the Belgium matrix and stays noindex", () => {
  assert.ok(comparePage.includes('getBeCityComparison'))
  assert.ok(comparePage.includes('countryCode === "BE"'))
  assert.ok(comparePage.includes("BelgiumCitiesCompareMatrix"))
  assert.ok(comparePage.includes('buildCityCompareCanonicalHref({ country: "BE" })'))
  assert.ok(comparePage.includes("robots: { index: false, follow: false }"))
})
