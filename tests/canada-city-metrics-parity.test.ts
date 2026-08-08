import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const PUBLISHED_CANADA_CITIES = [
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "calgary",
  "waterloo",
  "edmonton",
] as const

test("Canada city profiles cover the same five decision concepts as the Australia city surface", () => {
  const canadaLoader = readFileSync("src/lib/cities/ca-city-profile.server.ts", "utf8")
  const australiaLoader = readFileSync("src/lib/cities/au-city-profile.server.ts", "utf8")

  assert.ok(canadaLoader.includes('metrics.get("city_population")'))
  assert.ok(australiaLoader.includes('metrics.get("city_population")'))

  assert.ok(canadaLoader.includes('metrics.get("student_living_cost_monthly_range")'))
  assert.ok(australiaLoader.includes('metrics.get("student_living_cost_monthly_range")'))

  assert.ok(canadaLoader.includes('metrics.get("student_transport_reference")'))
  assert.ok(
    australiaLoader.includes('metrics.get("student_transport_weekly_reference")') ||
      australiaLoader.includes('metrics.get("public_transport_flat_fare")') ||
      australiaLoader.includes('metrics.get("public_transport_weekly_cap")'),
  )

  assert.ok(canadaLoader.includes('metrics.get("student_work_hours_week")'))
  assert.ok(australiaLoader.includes('metrics.get("student_work_hours_fortnight")'))

  assert.ok(canadaLoader.includes('metrics.get("employment_focus_sectors")'))
  assert.ok(australiaLoader.includes('metrics.get("employment_focus_sectors")'))

  assert.ok(canadaLoader.includes('.eq("review_status", "verified")'))
  assert.ok(canadaLoader.includes("source_name,source_url,data_as_of,confidence,evidence_kind"))
})

test("Canada city dashboard exposes all five core decision signals", () => {
  const dashboard = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")

  assert.ok(dashboard.includes('label="Population"'))
  assert.ok(dashboard.includes('label="Student living"'))
  assert.ok(dashboard.includes('label="Student transport"'))
  assert.ok(dashboard.includes('label="Student work"'))
  assert.ok(dashboard.includes("Career environment"))
  assert.ok(dashboard.includes("profile.employmentSectors.map"))
  assert.ok(dashboard.includes("Sources and freshness"))
  assert.ok(dashboard.includes("source.dataAsOf"))
  assert.ok(dashboard.includes("source.confidence"))
})

test("Canada city comparison exposes all five core metrics for decision use", () => {
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(matrix.includes('label="Student living"'))
  assert.ok(matrix.includes('label="Student transport"'))
  assert.ok(matrix.includes('label="Student work rule"'))
  assert.ok(matrix.includes('label="City population"'))
  assert.ok(matrix.includes('label="Career context"'))
  assert.ok(matrix.includes("left.employmentSectors"))
  assert.ok(matrix.includes("right.employmentSectors"))
})

test("five-metric publication remains bounded to the seven approved Canada cities", () => {
  const loader = readFileSync("src/lib/cities/ca-city-comparison.server.ts", "utf8")

  assert.ok(loader.includes("PUBLISHED_CA_CITY_SLUGS"))
  for (const city of PUBLISHED_CANADA_CITIES) {
    assert.ok(loader.includes(`"${city}"`), `Published Canada city allowlist is missing ${city}`)
  }
})
