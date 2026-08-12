import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const server = fs.readFileSync("src/lib/cities/kr-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/south-korea-cities-compare-matrix.tsx", "utf8")
const page = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

const exactSlugs = ["seoul", "busan", "daejeon", "suwon", "yongin", "pohang"]

test("South Korea Compare readiness uses supported cohort, teaching locations and all five metrics", () => {
  assert.match(server, /SUPPORTED_KR_CITY_SLUGS/)
  assert.match(server, /linked_campus_count/)
  assert.match(server, /linked_institution_count/)
  for (const key of ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]) assert.ok(server.includes(`"${key}"`))
  assert.doesNotMatch(server, /linkedProgramCount > 0/)
})

test("South Korea Compare defaults to Seoul and Busan and prevents duplicate pairs", () => {
  assert.match(server, /bySlug\.get\("seoul"\)/)
  assert.match(server, /bySlug\.get\("busan"\)/)
  assert.match(server, /rightSlug !== left\.slug/)
  for (const slug of exactSlugs) assert.ok(fs.readFileSync("src/lib/cities/city-routes.ts", "utf8").includes(`"${slug}"`))
})

test("South Korea Compare preserves evidence-methodology guards", () => {
  assert.match(matrix, /city_specific=false and ranking_safe=false/)
  assert.match(matrix, /no synthetic monthly normalization/)
  assert.match(matrix, /not a shortage ranking or job guarantee/)
  assert.match(matrix, /does not score a winner/)
  assert.match(matrix, /no inherited Seoul leakage from Suwon or Yongin/)
})

test("Shared Compare route includes KR while remaining noindex", () => {
  assert.match(page, /countryCode === "KR"/)
  assert.match(page, /getKrCityComparison/)
  assert.match(page, /SouthKoreaCitiesCompareMatrix/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
})
