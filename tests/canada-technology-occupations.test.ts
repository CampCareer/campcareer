import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810100000_canada_technology_occupations.sql", import.meta.url),
  "utf8",
)

const technologyCareers = [
  ["software-developer", "21232", 28],
  ["data-analyst", "21223", 25],
  ["data-engineer", "21211", 23],
  ["cybersecurity-analyst", "21220", 53],
  ["network-administrator", "22220", 27],
  ["cloud-engineer", "21231", 24],
  ["database-administrator", "21223", 25],
  ["ict-support-technician", "22221", 26],
] as const

test("Canada Technology cohort covers the canonical eight careers", () => {
  for (const [id, noc] of technologyCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "technology")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Technology cohort keeps current shortage and STEM visa scoring conservative", () => {
  const expectedScoreFragments = [
    "'CA:software-developer','2025-11-19',155700,48.08,0,0,0,0,13,10,0,0,5,28",
    "'CA:data-analyst','2025-11-19',null,40.87,0,0,0,0,10,10,0,0,5,25",
    "'CA:data-engineer','2025-11-19',null,46.15,0,0,0,0,8,10,0,0,5,23",
    "'CA:cybersecurity-analyst','2025-11-19',31800,49.52,15,0,0,0,13,10,0,10,5,53",
    "'CA:network-administrator','2025-11-19',null,36.00,0,0,0,0,15,8,0,0,4,27",
    "'CA:cloud-engineer','2025-11-19',null,56.49,0,0,0,0,10,10,0,0,4,24",
    "'CA:database-administrator','2025-11-19',null,40.87,0,0,0,0,10,10,0,0,5,25",
    "'CA:ict-support-technician','2025-11-19',119200,31.47,0,0,0,0,15,6,0,0,5,26",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("'CA:cybersecurity-analyst','21220','Cybersecurity specialists',null,true"))
  for (const id of [
    "software-developer",
    "data-analyst",
    "data-engineer",
    "network-administrator",
    "cloud-engineer",
    "database-administrator",
    "ict-support-technician",
  ]) {
    assert.match(migration, new RegExp(`'CA:${id}'[^\\n]+null,false,true`))
  }
})

test("Canada Technology programme links use reviewed current routes without forcing a closed DBA direct programme", () => {
  for (const programRef of [
    "ca-program:31",
    "ca-program:1392",
    "ca-program:147",
    "ca-program:1330",
    "ca-program:3438",
    "ca-program:1172",
    "ca-program:2024",
    "ca-program:150",
    "ca-program:2022",
    "ca-program:1163",
    "ca-program:2275",
    "ca-program:124",
    "ca-program:1395",
    "ca-program:2227",
  ]) {
    assert.ok(migration.includes(programRef))
  }
  assert.ok(migration.includes("'CA:database-administrator','ca-program:124','related'"))
})
