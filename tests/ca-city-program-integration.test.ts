import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada city profiles attach the public program publication summary", () => {
  const server = readFileSync("src/lib/cities/ca-city-profile.server.ts", "utf8")
  const dashboard = readFileSync("src/app/(workspace)/cities/canada-city-dashboard.tsx", "utf8")

  assert.ok(server.includes("getCaPublishedCityProgramSummary"))
  assert.ok(server.includes("publishedPrograms"))
  assert.ok(dashboard.includes("Published target-career programs"))
  assert.ok(dashboard.includes("profile.publishedPrograms"))
  assert.ok(dashboard.includes("/programs?country=CA&city="))
  assert.ok(!dashboard.includes("Canonical linked programmes"))
})

test("Canada city comparison uses published program totals and shared target careers", () => {
  const server = readFileSync("src/lib/cities/ca-city-comparison.server.ts", "utf8")
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")
  const page = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

  assert.ok(server.includes("getCaPublishedCityPairSummary"))
  assert.ok(server.includes("sharedCareerCount"))
  assert.ok(!server.includes("city_programme_directory_ca_v1"))
  assert.ok(matrix.includes("publishedPrograms?.totalPrograms"))
  assert.ok(matrix.includes("Published target programs"))
  assert.ok(matrix.includes("Target careers in both"))
  assert.ok(matrix.includes("sharedCareerCount"))
  assert.ok(page.includes("sharedCareerCount={comparison.sharedCareerCount}"))
})
