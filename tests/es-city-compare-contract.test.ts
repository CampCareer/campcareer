import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const server = fs.readFileSync("src/lib/cities/es-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/spain-cities-compare-matrix.tsx", "utf8")
const page = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

const metrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("Spain Compare requires five metrics plus verified city linkage", () => {
  assert.match(server, /SUPPORTED_ES_CITY_SLUGS/)
  assert.match(server, /linked_campus_count/)
  assert.match(server, /linked_institution_count/)
  for (const metric of metrics) assert.ok(server.includes(`"${metric}"`), `missing ${metric}`)
  assert.match(server, /bySlug\.get\("madrid"\)/)
  assert.match(server, /bySlug\.get\("barcelona"\)/)
  assert.match(server, /rightSlug !== left\.slug/)
})

test("Spain Compare preserves evidence boundaries and does not score a winner", () => {
  assert.match(matrix, /ranking_safe=false/)
  assert.match(matrix, /no cheapest-city inference/)
  assert.match(matrix, /no synthetic monthly normalization/)
  assert.match(matrix, /Verification pending/)
  assert.match(matrix, /zero means verification pending, never no programmes/)
  assert.match(matrix, /does not score a winner/)
})

test("Spain is connected to the shared noindex Compare surface", () => {
  assert.match(page, /getEsCityComparison/)
  assert.match(page, /SpainCitiesCompareMatrix/)
  assert.match(page, /countryCode === "ES"/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
})
