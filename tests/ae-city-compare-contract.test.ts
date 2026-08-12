import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const server = fs.readFileSync("src/lib/cities/ae-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/uae-cities-compare-matrix.tsx", "utf8")
const page = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

const metrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("UAE Compare requires five metrics plus verified City linkage", () => {
  assert.match(server, /SUPPORTED_AE_CITY_SLUGS/)
  assert.match(server, /linked_campus_count/)
  assert.match(server, /linked_institution_count/)
  for (const metric of metrics) assert.ok(server.includes(`"${metric}"`), `missing ${metric}`)
  assert.match(server, /bySlug\.get\("abu-dhabi"\)/)
  assert.match(server, /bySlug\.get\("dubai"\)/)
  assert.match(server, /rightSlug !== left\.slug/)
})

test("UAE Compare preserves source and geography boundaries without scoring a winner", () => {
  assert.match(matrix, /ranking_safe=false/)
  assert.match(matrix, /no cheapest-city inference/)
  assert.match(matrix, /no synthetic monthly normalization/)
  assert.match(matrix, /Emirate-wide population is never substituted/)
  assert.match(matrix, /no invented universal weekly-hour cap/)
  assert.match(matrix, /does not score a winner/)
})

test("UAE is connected to the shared noindex Compare surface", () => {
  assert.match(page, /getAeCityComparison/)
  assert.match(page, /UaeCitiesCompareMatrix/)
  assert.match(page, /countryCode === "AE"/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
})
