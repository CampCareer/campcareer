import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811234300_us_engineering_occupations.sql", import.meta.url),
  "utf8",
)

const engineeringCareers = [
  ["civil-engineer", "17-2051", 28],
  ["mechanical-engineer", "17-2141", 33],
  ["electrical-engineer", "17-2071", 33],
  ["manufacturing-engineer", "17-2112", 35],
  ["industrial-engineer", "17-2112", 35],
  ["chemical-engineer", "17-2041", 27],
  ["environmental-engineer", "17-2081", 30],
  ["engineering-technician", "17-3029", 27],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','2026-08-12'`))
}

test("US Engineering covers the canonical eight engineering careers", () => {
  assert.equal(engineeringCareers.length, 8)
  for (const [id, soc] of engineeringCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "engineering")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Engineering preserves exact SOC scopes and declared proxies", () => {
  for (const marker of [
    "'US:civil-engineer','US','civil-engineer','Civil Engineers','SOC','SOC 2018','17-2051'",
    "'US:mechanical-engineer','US','mechanical-engineer','Mechanical Engineers','SOC','SOC 2018','17-2141'",
    "'US:electrical-engineer','US','electrical-engineer','Electrical Engineers','SOC','SOC 2018','17-2071'",
    "'US:industrial-engineer','US','industrial-engineer','Industrial Engineers','SOC','SOC 2018','17-2112'",
    "'US:chemical-engineer','US','chemical-engineer','Chemical Engineers','SOC','SOC 2018','17-2041'",
    "'US:environmental-engineer','US','environmental-engineer','Environmental Engineers','SOC','SOC 2018','17-2081'",
    "'US:engineering-technician','US','engineering-technician','Engineering Technologists and Technicians, Except Drafters, All Other — broad proxy','SOC','SOC 2018','17-3029'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("O*NET 17-2112.03 Manufacturing Engineers is the exact detailed occupation"))
  assert.ok(migration.includes("BLS publishes national wage/projection data at parent SOC 17-2112"))
  assert.ok(migration.includes("17-3029 Engineering Technologists and Technicians, Except Drafters, All Other is used as a broad national proxy"))
})

test("US Engineering stores BLS 2024 employment, pay and 2024-2034 projections", () => {
  const expected = [
    ["civil-engineer", 368900, 99590, "5 percent"],
    ["mechanical-engineer", 293100, 102320, "9 percent"],
    ["electrical-engineer", 192000, 111910, "7 percent"],
    ["manufacturing-engineer", 351100, 101140, "11 percent"],
    ["industrial-engineer", 351100, 101140, "11 percent"],
    ["chemical-engineer", 21600, 121860, "3 percent"],
    ["environmental-engineer", 39400, 104170, "4 percent"],
    ["engineering-technician", 67300, 77390, "1.5 percent"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-12',${employment},null,${salary}`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Engineering locks US v1 scores without inventing shortage status", () => {
  const expectedRows: Record<string, RegExp> = {
    "civil-engineer": /368900,null,99590,0,0,0,0,6,8,5,5,4,28/,
    "mechanical-engineer": /293100,null,102320,0,0,0,0,6,10,8,5,4,33/,
    "electrical-engineer": /192000,null,111910,0,0,0,0,6,10,8,5,4,33/,
    "manufacturing-engineer": /351100,null,101140,0,0,0,0,6,10,10,5,4,35/,
    "industrial-engineer": /351100,null,101140,0,0,0,0,6,10,10,5,4,35/,
    "chemical-engineer": /21600,null,121860,0,0,0,0,6,10,2,5,4,27/,
    "environmental-engineer": /39400,null,104170,0,0,0,0,6,10,5,5,4,30/,
    "engineering-technician": /67300,null,77390,0,0,0,0,10,8,2,2,5,27/,
  }

  for (const [id, , score] of engineeringCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
  assert.ok(migration.includes("not a formal federal shortage designation"))
})

test("US Engineering keeps PE and H-1B boundaries conditional", () => {
  assert.ok(migration.includes("Licensure is not required for entry-level civil engineers"))
  assert.ok(migration.includes("all states and DC require licensure for engineers selling services to the public"))
  assert.ok(migration.includes("specific position requires a bachelor degree or equivalent in the specific specialty"))
  assert.ok(migration.includes("broad proxy normally has associate-degree entry and generally does not fit the degree-specific H-1B model"))

  const profileRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'USD',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
})

test("US Engineering publishes only reviewed Tier A programme relations", () => {
  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'2026-08-12')"))
    .filter((line) => line.includes("umich-") || line.includes("utaustin-") || line.includes("uw-") || line.includes("wisc-") || line.includes("psu-"))
  assert.equal(programmeRows.length, 8)
  assert.ok(migration.includes("('US:civil-engineer','umich-bse-civil-engineering','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:industrial-engineer','umich-bse-industrial-operations-engineering','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:manufacturing-engineer','psu-bs-mechanical-engineering','related','2026-08-12')"))
  assert.ok(!migration.includes("('US:electrical-engineer','psu-"))
})
