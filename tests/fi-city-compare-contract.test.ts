import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const server = fs.readFileSync("src/lib/cities/fi-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/finland-cities-compare-matrix.tsx", "utf8")
const page = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profilePage = fs.readFileSync("src/app/(workspace)/cities/fi/[city]/page.tsx", "utf8")

const metrics = ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]

test("Finland Compare requires the full city readiness contract", () => {
  assert.match(server, /SUPPORTED_FI_CITY_SLUGS/)
  assert.match(server, /linked_campus_count/)
  assert.match(server, /linked_institution_count/)
  for (const metric of metrics) assert.ok(server.includes(`"${metric}"`), `missing ${metric}`)
  assert.match(server, /bySlug\.get\("helsinki"\)/)
  assert.match(server, /bySlug\.get\("espoo"\)/)
  assert.match(server, /rightSlug !== left\.slug/)
})

test("Finland Compare preserves national and source-native caveats", () => {
  assert.match(matrix, /not city rankings/)
  assert.match(matrix, /no synthetic monthly normalization/)
  assert.match(matrix, /verified-partial programmes/)
  assert.match(matrix, /full recognised HEI\/UAS universe/)
  assert.match(matrix, /does not score a winner/)
})

test("Finland is connected to the shared Compare surface and profiles", () => {
  assert.match(page, /getFiCityComparison/)
  assert.match(page, /FinlandCitiesCompareMatrix/)
  assert.match(page, /countryCode === "FI"/)
  assert.match(profilePage, /buildCityCompareCanonicalHref\(\{ country: "FI"/)
})
