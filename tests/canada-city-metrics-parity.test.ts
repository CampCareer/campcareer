import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const FIVE_CORE_METRICS = [
  "city_population",
  "student_living_cost_monthly_range",
  "student_transport_reference",
  "student_work_hours_week",
  "employment_focus_sectors",
] as const

const PUBLISHED_CANADA_CITIES = [
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "calgary",
  "waterloo",
  "edmonton",
] as const

test("Canada city profiles consume the same five decision metrics as the Australia city surface", () => {
  const canadaLoader = readFileSync("src/lib/cities/ca-city-profile.server.ts", "utf8")
  const australiaLoader = readFileSync("src/lib/cities/au-city-profile.server.ts", "utf8")

  for (const metric of FIVE_CORE_METRICS) {
    assert.ok(canadaLoader.includes(metric), `Canada loader is missing ${metric}`)
    assert.ok(australiaLoader.includes(metric), `Australia loader is missing ${metric}`)
  }

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
