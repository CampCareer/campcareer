import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810140000_canada_environment_agriculture_occupations.sql", import.meta.url),
  "utf8",
)

const environmentAgricultureCareers = [
  ["environmental-scientist", "21110", 23],
  ["agronomist", "21112", 20],
  ["farm-manager", "80020", 20],
  ["forestry-technician", "22112", 19],
  ["food-technologist", "22100", 19],
  ["sustainability-specialist", "41400", 25],
  ["horticulturist", "22114", 24],
  ["animal-science-technician", "32104", 42],
] as const

test("Canada Environment and Agriculture cohort covers the canonical eight careers", () => {
  for (const [id, noc] of environmentAgricultureCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "environment")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Environment and Agriculture scoring keeps balance occupations unboosted and isolates the current animal-health category signal", () => {
  const expectedScoreFragments = [
    "'CA:environmental-scientist','2025-11-19',null,40.00,0,0,0,0,10,10,0,0,3,23",
    "'CA:agronomist','2025-11-19',null,40.00,0,0,0,0,8,10,0,0,2,20",
    "'CA:farm-manager','2025-11-19',122400,30.00,0,0,0,0,10,6,0,0,4,20",
    "'CA:forestry-technician','2025-11-19',6200,32.97,0,0,0,0,10,6,0,0,3,19",
    "'CA:food-technologist','2025-11-19',null,29.80,0,0,0,0,12,4,0,0,3,19",
    "'CA:sustainability-specialist','2025-11-19',null,43.27,0,0,0,0,10,10,0,0,5,25",
    "'CA:horticulturist','2025-11-19',null,30.00,0,0,0,0,14,6,0,0,4,24",
    "'CA:animal-science-technician','2025-11-19',25800,23.00,15,0,0,0,12,2,0,10,3,42",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  for (const noc of ["21110", "21112", "80020", "22112", "22100", "41400", "22114"]) {
    assert.ok(migration.includes(`'${noc}'`))
  }
  assert.ok(migration.includes("'CA:animal-science-technician','32104'"))
  assert.ok(migration.includes("'CA:animal-science-technician','32104','Animal health technologists and veterinary technicians',null,true"))
})

test("Canada Environment and Agriculture programme links keep qualification strength explicit", () => {
  for (const programRef of [
    "ca-program:5867",
    "ca-program:5492",
    "ca-program:5491",
    "ca-program:2795",
    "ca-program:98",
    "ca-program:206",
    "ca-program:2202",
    "ca-program:1798",
    "ca-program:2745",
  ]) {
    assert.ok(migration.includes(programRef))
  }
  for (const profile of ["environmental-scientist", "agronomist", "farm-manager", "sustainability-specialist"]) {
    assert.ok(migration.includes(`'CA:${profile}'`))
  }
  assert.ok(migration.includes("'CA:environmental-scientist','ca-program:5867','related'"))
  assert.ok(migration.includes("'CA:agronomist','ca-program:5492','related'"))
  assert.ok(migration.includes("'CA:farm-manager','ca-program:5491','related'"))
  assert.ok(migration.includes("'CA:sustainability-specialist','ca-program:206','related'"))
  assert.ok(migration.includes("'CA:forestry-technician','ca-program:2795','direct'"))
  assert.ok(migration.includes("'CA:food-technologist','ca-program:98','direct'"))
  assert.ok(migration.includes("'CA:horticulturist','ca-program:2202','direct'"))
})
