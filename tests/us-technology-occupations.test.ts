import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811211000_us_technology_occupations.sql", import.meta.url),
  "utf8",
)

const technologyCareers = [
  ["software-developer", "15-1252", 36],
  ["data-analyst", "15-2051", 36],
  ["data-engineer", "15-1243", 33],
  ["cybersecurity-analyst", "15-1212", 35],
  ["network-administrator", "15-1244", 24],
  ["cloud-engineer", "15-1241", 34],
  ["database-administrator", "15-1242", 26],
  ["ict-support-technician", "15-1232", 25],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','2026-08-11'`))
}

test("US Technology covers the canonical eight technology careers", () => {
  assert.equal(technologyCareers.length, 8)
  for (const [id, soc] of technologyCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "technology")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Technology preserves exact SOC mappings and explicit proxy boundaries", () => {
  for (const marker of [
    "'US:software-developer','US','software-developer','Software Developers','SOC','SOC 2018','15-1252'",
    "'US:cybersecurity-analyst','US','cybersecurity-analyst','Information Security Analysts','SOC','SOC 2018','15-1212'",
    "'US:network-administrator','US','network-administrator','Network and Computer Systems Administrators','SOC','SOC 2018','15-1244'",
    "'US:database-administrator','US','database-administrator','Database Administrators','SOC','SOC 2018','15-1242'",
    "'US:ict-support-technician','US','ict-support-technician','Computer User Support Specialists','SOC','SOC 2018','15-1232'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("Data Scientists — data-analytics proxy"))
  assert.ok(migration.includes("Database Architects — data-engineering / architecture proxy"))
  assert.ok(migration.includes("Computer Network Architects — cloud-infrastructure proxy"))
  assert.ok(migration.includes("metrics are not an exact census of every Data Analyst title"))
})

test("US Technology does not invent a national technology shortage list", () => {
  for (const [id] of technologyCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, /,0,0,0,0,/)
  }
  assert.ok(migration.includes("No federal technology shortage list is used for this cohort"))
  assert.ok(migration.includes("not converted into a formal shortage designation"))
})

test("US Technology stores BLS 2024 employment, pay and 2024-2034 projections", () => {
  const expected = [
    ["software-developer", 1693800, 133080, "15.8 percent"],
    ["data-analyst", 245900, 112590, "33.5 percent"],
    ["data-engineer", 66900, 135980, "8.7 percent"],
    ["cybersecurity-analyst", 182800, 124910, "28.5 percent"],
    ["network-administrator", 331500, 96800, "4.2 percent decline"],
    ["cloud-engineer", 179200, 130390, "11.9 percent"],
    ["database-administrator", 78000, 104620, "0.7 percent decline"],
    ["ict-support-technician", 729500, 60340, "3.7 percent decline"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-11',${employment},null,${salary}`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Technology locks US v1 component scores", () => {
  const expectedRows: Record<string, RegExp> = {
    "software-developer": /1693800,null,133080,0,0,0,0,6,10,10,5,5,36/,
    "data-analyst": /245900,null,112590,0,0,0,0,6,10,10,5,5,36/,
    "data-engineer": /66900,null,135980,0,0,0,0,5,10,8,5,5,33/,
    "cybersecurity-analyst": /182800,null,124910,0,0,0,0,5,10,10,5,5,35/,
    "network-administrator": /331500,null,96800,0,0,0,0,6,8,0,5,5,24/,
    "cloud-engineer": /179200,null,130390,0,0,0,0,4,10,10,5,5,34/,
    "database-administrator": /78000,null,104620,0,0,0,0,6,10,0,5,5,26/,
    "ict-support-technician": /729500,null,60340,0,0,0,0,12,6,0,2,5,25/,
  }

  for (const [id, , score] of technologyCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
})

test("US Technology keeps H-1B conditional and support-tech visa credit limited", () => {
  for (const id of ["software-developer","data-analyst","data-engineer","cybersecurity-analyst","network-administrator","cloud-engineer","database-administrator"]) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, /,5,5,\d+,'career-opportunity-us-v1'/)
  }
  assert.ok(migration.includes("'US:ict-support-technician','2026-08-11',729500,null,60340,0,0,0,0,12,6,0,2,5,25"))
  assert.ok(migration.includes("specific role is a specialty occupation"))
  assert.ok(migration.includes("generally does not fit a degree-specific H-1B model"))
})

test("US Technology has no universal statutory registration claims", () => {
  const profileRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'USD',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
})

test("US Technology publishes only reviewed Tier A programme relations", () => {
  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'2026-08-11')"))
    .filter((line) => line.includes("nyu-bs-") || line.includes("uw-bs-") || line.includes("wisc-") || line.includes("psu-bs-"))
  assert.equal(programmeRows.length, 12)
  assert.ok(migration.includes("('US:software-developer','nyu-bs-computer-science','direct','2026-08-11')"))
  assert.ok(migration.includes("('US:data-analyst','wisc-bs-data-science','direct','2026-08-11')"))
  assert.ok(migration.includes("('US:cybersecurity-analyst','psu-bs-cybersecurity-analytics-operations','direct','2026-08-11')"))
  assert.ok(!migration.includes("('US:ict-support-technician','nyu-bs-"))
})
