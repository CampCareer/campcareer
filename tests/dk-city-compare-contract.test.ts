import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import assert from "node:assert/strict"

const root = process.cwd()
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8")

test("Denmark city compare keeps exact Tier A readiness and evidence semantics", () => {
  const routes = read("src/lib/cities/city-routes.ts")
  const server = read("src/lib/cities/dk-city-comparison.server.ts")
  const matrix = read("src/app/(workspace)/compare/denmark-cities-compare-matrix.tsx")
  const comparePage = read("src/app/(workspace)/compare/page.tsx")
  const dashboard = read("src/app/(workspace)/cities/denmark-city-dashboard.tsx")

  assert.match(routes, /PUBLISHED_DK_CITY_SLUGS = \["copenhagen", "frederiksberg", "odense", "aarhus", "aalborg"\]/)
  assert.match(server, /city_population/)
  assert.match(server, /student_living_cost_monthly_range/)
  assert.match(server, /student_transport_reference/)
  assert.match(server, /student_work_hours_week/)
  assert.match(server, /employment_focus_sectors/)
  assert.match(server, /linked_campus_count/)
  assert.match(server, /linked_institution_count/)
  assert.doesNotMatch(server, /linked_program_count.*gt/)
  assert.match(server, /copenhagen/)
  assert.match(server, /aarhus/)

  assert.match(comparePage, /countryCode === "DK"/)
  assert.match(comparePage, /getDkCityComparison/)
  assert.match(comparePage, /DenmarkCitiesCompareMatrix/)
  assert.match(comparePage, /robots: \{ index: false, follow: false \}/)

  assert.match(matrix, /Statistics Denmark municipality/)
  assert.match(matrix, /national baseline/)
  assert.match(matrix, /90 hours per month/)
  assert.match(matrix, /not converted to a weekly entitlement/)
  assert.match(matrix, /Verified-partial programmes/)
  assert.match(matrix, /professional higher-education providers remain a known expansion gap/)
  assert.match(matrix, /not shortage rankings or employment guarantees/)

  assert.match(dashboard, /buildCityCompareCanonicalHref/)
  assert.match(dashboard, /country: "DK"/)
  assert.match(dashboard, /Compare \{profile.name\}/)
})
