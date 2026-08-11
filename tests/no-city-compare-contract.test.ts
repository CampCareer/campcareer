import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const server = fs.readFileSync("src/lib/cities/no-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/norway-cities-compare-matrix.tsx", "utf8")
const page = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profilePage = fs.readFileSync("src/app/(workspace)/cities/no/[city]/page.tsx", "utf8")

const metrics = ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]

test("Norway Compare requires the full city readiness contract", () => {
  assert.match(server, /SUPPORTED_NO_CITY_SLUGS/)
  assert.match(server, /linked_campus_count/)
  assert.match(server, /linked_institution_count/)
  for (const metric of metrics) assert.ok(server.includes(`"${metric}"`), `missing ${metric}`)
  assert.match(server, /bySlug\.get\("oslo"\)/)
  assert.match(server, /bySlug\.get\("trondheim"\)/)
  assert.match(server, /rightSlug !== left\.slug/)
})

test("Norway Compare preserves national and source-native caveats", () => {
  assert.match(matrix, /not city rankings/)
  assert.match(matrix, /no synthetic normalization/)
  assert.match(matrix, /verified-partial programme/)
  assert.match(matrix, /complete approved HEI universe/)
  assert.match(matrix, /does not score a winner/)
})

test("Norway is connected to the shared Compare surface and profiles", () => {
  assert.match(page, /getNoCityComparison/)
  assert.match(page, /NorwayCitiesCompareMatrix/)
  assert.match(page, /countryCode === "NO"/)
  assert.match(profilePage, /buildCityCompareCanonicalHref\(\{ country: "NO"/)
})
