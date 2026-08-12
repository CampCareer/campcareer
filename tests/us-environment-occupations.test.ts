import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260812001000_us_environment_occupations.sql", import.meta.url),
  "utf8",
)

const environmentCareers = [
  ["environmental-scientist", "19-2041", 29],
  ["agronomist", "19-1013", 27],
  ["farm-manager", "11-9013", 27],
  ["forestry-technician", "19-4071", 21],
  ["food-technologist", "19-1012", 29],
  ["sustainability-specialist", "13-1199", 26],
  ["horticulturist", "19-1013", 27],
  ["animal-science-technician", "19-4012", 24],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','2026-08-12'`))
}

test("US Environment covers the canonical eight environment careers", () => {
  assert.equal(environmentCareers.length, 8)
  for (const [id, soc] of environmentCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "environment")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Environment preserves exact scopes and transparent proxies", () => {
  for (const marker of [
    "'US:environmental-scientist','US','environmental-scientist','Environmental Scientists and Specialists, Including Health','SOC','SOC 2018','19-2041'",
    "'US:agronomist','US','agronomist','Soil and Plant Scientists — agronomist scope','SOC','SOC 2018','19-1013'",
    "'US:farm-manager','US','farm-manager','Farmers, Ranchers, and Other Agricultural Managers — farm-manager scope','SOC','SOC 2018','11-9013'",
    "'US:forestry-technician','US','forestry-technician','Forest and Conservation Technicians — forestry-technician scope','SOC','SOC 2018','19-4071'",
    "'US:food-technologist','US','food-technologist','Food Scientists and Technologists — food-technologist scope','SOC','SOC 2018','19-1012'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("Sustainability Specialists — O*NET 13-1199.05; BLS parent 13-1199 proxy"))
  assert.ok(migration.includes("Soil and Plant Scientists — professional horticulture proxy"))
  assert.ok(migration.includes("Agricultural Technicians — animal-science technician proxy"))
  assert.ok(migration.includes("role is not promoted to Forester 19-1032"))
})

test("US Environment stores BLS 2024 employment, pay and 2024-2034 projections", () => {
  const expected = [
    ["environmental-scientist", 90300, 80060, "4.4 percent"],
    ["agronomist", 20700, 71410, "5.4 percent"],
    ["farm-manager", 836100, 87980, "1.3 percent employment decline"],
    ["forestry-technician", 33800, 54310, "3.2 percent decline"],
    ["food-technologist", 15200, 85310, "6.5 percent"],
    ["sustainability-specialist", 1205700, 81270, "3.0 percent"],
    ["horticulturist", 20700, 71410, "5.4 percent"],
    ["animal-science-technician", 18600, 46790, "4.3 percent"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-12',${employment},null,${salary}`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Environment locks US v1 scores without inventing shortage status", () => {
  const expectedRows: Record<string, RegExp> = {
    "environmental-scientist": /90300,null,80060,0,0,0,0,6,8,5,5,5,29/,
    agronomist: /20700,null,71410,0,0,0,0,6,6,5,5,5,27/,
    "farm-manager": /836100,null,87980,0,0,0,0,12,8,0,2,5,27/,
    "forestry-technician": /33800,null,54310,0,0,0,0,10,4,0,2,5,21/,
    "food-technologist": /15200,null,85310,0,0,0,0,6,8,5,5,5,29/,
    "sustainability-specialist": /1205700,null,81270,0,0,0,0,6,8,2,5,5,26/,
    horticulturist: /20700,null,71410,0,0,0,0,6,6,5,5,5,27/,
    "animal-science-technician": /18600,null,46790,0,0,0,0,10,2,5,2,5,24/,
  }

  for (const [id, , score] of environmentCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
  assert.ok(migration.includes("not a formal federal shortage designation"))
})

test("US Environment keeps licensing and immigration boundaries conditional", () => {
  assert.ok(migration.includes("No universal occupational licence applies to the generic profession"))
  assert.ok(migration.includes("Agronomist is not one universally licensed occupation"))
  assert.ok(migration.includes("No universal personal Farm Manager licence"))
  assert.ok(migration.includes("No universal federal technician licence"))
  assert.ok(migration.includes("No universal personal Food Technologist licence"))
  assert.ok(migration.includes("No universal statutory Sustainability Specialist licence"))
  assert.ok(migration.includes("generic H-1B specialty-occupation fit is weak"))

  const profileRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'USD',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
})

test("US Environment publishes official evidence and only reviewed Tier A programme relations", () => {
  const sourceRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'source'"))
  assert.equal(sourceRows.length, 24)

  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'2026-08-12')"))
    .filter((line) => line.includes("umn-") || line.includes("wisc-") || line.includes("cornell-"))
  assert.equal(programmeRows.length, 8)
  assert.ok(migration.includes("('US:agronomist','umn-bs-plant-science','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:food-technologist','cornell-bs-food-science','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:food-technologist','umn-bs-food-science','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:forestry-technician','umn-bs-forest-natural-resource-management','related','2026-08-12')"))
  assert.ok(!migration.includes("('US:sustainability-specialist','umn-"))
  assert.ok(!migration.includes("('US:animal-science-technician','umn-"))
})
