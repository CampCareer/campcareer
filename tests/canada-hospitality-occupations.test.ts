import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810103553_canada_hospitality_occupations.sql", import.meta.url),
  "utf8",
)

const hospitalityCareers = [
  ["chef", "62200", 13],
  ["cook", "63200", 36],
  ["hotel-manager", "60031", 20],
  ["restaurant-manager", "60030", 16],
  ["baker", "63202", 20],
  ["tourism-manager", "60040", 21],
  ["event-planner", "12103", 18],
  ["hospitality-supervisor", "62020", 22],
] as const

test("Canada Hospitality cohort covers the canonical eight careers", () => {
  for (const [id, noc] of hospitalityCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "hospitality")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Hospitality scoring isolates Cook shortage and gives no current occupation-category visa credit", () => {
  const expectedScoreFragments = [
    "'CA:chef','2025-11-19',null,23.00,0,0,0,0,8,2,0,0,3,13",
    "'CA:cook','2025-11-19',null,18.00,15,0,0,0,15,2,0,0,4,36",
    "'CA:hotel-manager','2025-11-19',null,38.00,0,0,0,0,8,8,0,0,4,20",
    "'CA:restaurant-manager','2025-11-19',null,26.00,0,0,0,0,8,4,0,0,4,16",
    "'CA:baker','2025-11-19',null,17.50,0,0,0,0,14,2,0,0,4,20",
    "'CA:tourism-manager','2025-11-19',null,34.00,0,0,0,0,10,6,0,0,5,21",
    "'CA:event-planner','2025-11-19',null,28.37,0,0,0,0,10,4,0,0,4,18",
    "'CA:hospitality-supervisor','2025-11-19',null,19.00,0,0,0,0,15,2,0,0,5,22",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("'CA:cook','63200','Cooks',null,false"))
  for (const profile of hospitalityCareers.map(([id]) => id)) {
    assert.ok(migration.includes(`'CA:${profile}'`))
  }
  assert.ok(migration.includes("Government tourism-development managers in NOC 40011 are excluded"))
})

test("Canada Hospitality programme links preserve direct versus related pathway strength", () => {
  for (const programRef of [
    "ca-program:2565",
    "ca-program:1403",
    "ca-program:3471",
    "ca-program:3225",
    "ca-program:2960",
    "ca-program:2288",
    "ca-program:1347",
    "ca-program:1974",
    "ca-program:246",
    "ca-program:2567",
    "ca-program:2138",
  ]) {
    assert.ok(migration.includes(programRef))
  }

  assert.ok(migration.includes("'CA:chef','ca-program:2565','direct'"))
  assert.ok(migration.includes("'CA:cook','ca-program:3471','direct'"))
  assert.ok(migration.includes("'CA:hotel-manager','ca-program:3225','direct'"))
  assert.ok(migration.includes("'CA:restaurant-manager','ca-program:2288','related'"))
  assert.ok(migration.includes("'CA:tourism-manager','ca-program:246','related'"))
  assert.ok(migration.includes("'CA:event-planner','ca-program:2567','direct'"))
  assert.ok(migration.includes("'CA:hospitality-supervisor','ca-program:3225','direct'"))
  assert.ok(!migration.includes("'common_pathway'"))
})
