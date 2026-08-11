import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const loader = readFileSync("src/lib/cities/ch-city-comparison.server.ts", "utf8")
const matrix = readFileSync("src/app/(workspace)/compare/switzerland-cities-compare-matrix.tsx", "utf8")
const page = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const profilePage = readFileSync("src/app/(workspace)/cities/ch/[city]/page.tsx", "utf8")

const expectedSlugs = ["zurich", "lausanne", "basel", "lugano", "fribourg", "geneva"]
const expectedMetrics = ["city_population", "student_living_cost_monthly_range", "student_transport_reference", "student_work_hours_week", "employment_focus_sectors"]

test("Switzerland compare readiness requires the exact Phase 4 metric contract", () => {
  for (const key of expectedMetrics) assert.ok(loader.includes(`"${key}"`), `missing ${key}`)
  assert.match(loader, /SUPPORTED_CH_CITY_SLUGS/)
  assert.match(loader, /linked_campus_count/)
  assert.match(loader, /linked_institution_count/)
  assert.match(loader, /bySlug\.get\("zurich"\)/)
  assert.match(loader, /bySlug\.get\("lausanne"\)/)
})

test("Switzerland compare is wired into the shared city comparison surface", () => {
  assert.match(page, /getChCityComparison/)
  assert.match(page, /SwitzerlandCitiesCompareMatrix/)
  assert.match(page, /countryCode === "CH"/)
  assert.match(page, /country: "CH"/)
  assert.match(profilePage, /buildCityCompareCanonicalHref\(\{ country: "CH", left: profile\.slug \}\)/)
})

test("Switzerland compare preserves evidence caveats and does not score a winner", () => {
  for (const slug of expectedSlugs) assert.ok(loader.includes("SUPPORTED_CH_CITY_SLUGS") || loader.includes(slug))
  assert.match(matrix, /source-native/)
  assert.match(matrix, /does not score a winner/)
  assert.match(matrix, /EPFL/)
  assert.match(matrix, /Ecublens/)
  assert.doesNotMatch(matrix, /winnerScore|overallScore|bestCity/)
})
