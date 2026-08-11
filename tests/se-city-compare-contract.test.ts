import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const loader = fs.readFileSync("src/lib/cities/se-city-comparison.server.ts", "utf8")
const matrix = fs.readFileSync("src/app/(workspace)/compare/sweden-cities-compare-matrix.tsx", "utf8")
const comparePage = fs.readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profilePage = fs.readFileSync("src/app/(workspace)/cities/se/[city]/page.tsx", "utf8")

test("Sweden Compare requires the exact Phase 4 readiness contract", () => {
  for (const key of ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]) {
    assert.ok(loader.includes(`"${key}"`), `missing ${key}`)
  }
  assert.match(loader, /linked_campus_count/)
  assert.match(loader, /linked_institution_count/)
  assert.match(loader, /PUBLISHED_SE_CITY_SLUGS/)
})

test("Sweden Compare defaults to Stockholm versus Gothenburg and prevents duplicate pairs", () => {
  assert.match(loader, /bySlug\.get\("stockholm"\)/)
  assert.match(loader, /bySlug\.get\("gothenburg"\)/)
  assert.match(loader, /rightSlug !== left\.slug/)
  assert.match(loader, /left\.slug === right\.slug/)
})

test("Sweden Compare preserves national and source-native metric semantics", () => {
  assert.match(matrix, /not city-specific and not ranked/)
  assert.match(matrix, /Source-native product and validity period/)
  assert.match(matrix, /National residence-permit rule/)
  assert.match(matrix, /not a complete municipal catalogue/)
  assert.match(matrix, /does not score a winner/)
})

test("Sweden routes through shared City Compare and profiles link back", () => {
  assert.match(comparePage, /countryCode === "SE"/)
  assert.match(comparePage, /getSeCityComparison/)
  assert.match(comparePage, /SwedenCitiesCompareMatrix/)
  assert.match(profilePage, /buildCityCompareCanonicalHref\(\{ country: "SE"/)
})
