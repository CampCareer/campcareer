import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const comparison = readFileSync("src/lib/cities/uk-city-comparison.server.ts", "utf8")
const comparePage = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
const compareMatrix = readFileSync("src/app/(workspace)/compare/united-kingdom-cities-compare-matrix.tsx", "utf8")
const dashboard = readFileSync("src/app/(workspace)/cities/united-kingdom-city-dashboard.tsx", "utf8")

const requiredMetrics = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
]

test("UK Compare readiness requires five verified city metrics and verified institution linkage", () => {
  for (const key of requiredMetrics) assert.ok(comparison.includes(`"${key}"`))
  assert.ok(comparison.includes("profile.linkedCampusCount > 0"))
  assert.ok(comparison.includes("profile.linkedInstitutionCount > 0"))
  assert.ok(comparison.includes('review_status", "verified"'))
  assert.doesNotMatch(comparison, /profile\.linkedProgramCount > 0/)
})

test("UK city comparison is wired into the root Compare surface", () => {
  assert.ok(comparePage.includes('getUkCityComparison'))
  assert.ok(comparePage.includes('if (countryCode === "UK")'))
  assert.ok(comparePage.includes("UnitedKingdomCitiesCompareMatrix"))
  assert.ok(compareMatrix.includes('countryCode="UK"'))
  assert.ok(compareMatrix.includes('href={`/cities/uk/${city.slug}`}'))
})

test("UK profiles link back to country-aware city Compare", () => {
  assert.ok(dashboard.includes('buildCityCompareCanonicalHref({ country: "UK", left: profile.slug })'))
  assert.ok(dashboard.includes("Compare {profile.name}"))
  assert.ok(dashboard.includes("profile.linkedCampusCount > 0"))
  assert.ok(dashboard.includes("profile.linkedInstitutionCount > 0"))
  assert.doesNotMatch(dashboard, /profile\.linkedProgramCount > 0/)
})

test("London and named-city scope differences remain explicit in Compare", () => {
  assert.ok(compareMatrix.includes("Greater London"))
  assert.ok(compareMatrix.includes("named-city/local-authority boundaries"))
  assert.ok(compareMatrix.includes("Study-destination scope"))
  assert.ok(compareMatrix.includes("Population follows each approved city scope"))
})

test("programme verification gap never appears as a zero-programme comparison", () => {
  assert.ok(compareMatrix.includes("Verified UK programme delivery is still pending"))
  assert.ok(compareMatrix.includes("not presented as “0 programmes”"))
  assert.ok(compareMatrix.includes("does not block city comparison"))
  assert.doesNotMatch(compareMatrix, /linkedProgramCount\.toLocaleString/)
})

test("Student visa work copy preserves the qualification conditions", () => {
  assert.ok(compareMatrix.includes("qualifying full-time degree-level study"))
  assert.ok(compareMatrix.includes("compliant higher education provider"))
  assert.ok(compareMatrix.includes("Other categories can differ or have no work permission"))
})

test("UK comparison defaults to London and Manchester when no pair is requested", () => {
  assert.ok(comparison.includes('bySlug.get("london")'))
  assert.ok(comparison.includes('bySlug.get("manchester")'))
  assert.ok(comparison.includes("PUBLISHED_UK_CITY_SLUGS"))
})
