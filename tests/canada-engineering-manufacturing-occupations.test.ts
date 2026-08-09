import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810110000_canada_engineering_manufacturing_occupations.sql", import.meta.url),
  "utf8",
)

const engineeringCareers = [
  ["civil-engineer", "21300", 49],
  ["mechanical-engineer", "21301", 49],
  ["electrical-engineer", "21310", 49],
  ["manufacturing-engineer", "21321", 44],
  ["industrial-engineer", "21321", 44],
  ["chemical-engineer", "21320", 24],
  ["environmental-engineer", "21300", 44],
  ["engineering-technician", "22300/22301/22302/22310", 36],
] as const

test("Canada Engineering and Manufacturing cohort covers the canonical eight careers", () => {
  for (const [id, noc] of engineeringCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "engineering")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Engineering and Manufacturing scoring keeps narrower and multi-NOC evidence conservative", () => {
  const expectedScoreFragments = [
    "'CA:civil-engineer','2025-11-19',null,48.56,15,0,0,0,12,10,0,10,2,49",
    "'CA:mechanical-engineer','2025-11-19',null,45.67,15,0,0,0,12,10,0,10,2,49",
    "'CA:electrical-engineer','2025-11-19',null,50.67,15,0,0,0,12,10,0,10,2,49",
    "'CA:manufacturing-engineer','2025-11-19',null,44.23,10,0,0,0,12,10,0,10,2,44",
    "'CA:industrial-engineer','2025-11-19',null,44.23,10,0,0,0,12,10,0,10,2,44",
    "'CA:chemical-engineer','2025-11-19',null,51.92,0,0,0,0,12,10,0,0,2,24",
    "'CA:environmental-engineer','2025-11-19',null,48.56,10,0,0,0,12,10,0,10,2,44",
    "'CA:engineering-technician','2025-11-19',null,null,10,0,0,0,15,0,0,7,4,36",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("'CA:chemical-engineer','21320','Chemical engineers',null,false"))
  assert.ok(migration.includes("'CA:engineering-technician','22302','Industrial engineering and manufacturing technologists and technicians',null,false"))
  for (const noc of ["21300", "21301", "21310", "21321", "22300", "22301", "22310"]) {
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Engineering and Manufacturing programme links use reviewed international routes", () => {
  for (const programRef of [
    "ca-program:193",
    "ca-program:5249",
    "ca-program:5247",
    "ca-program:5248",
    "ca-program:5243",
    "ca-program:173",
    "ca-program:69",
    "ca-program:70",
  ]) {
    assert.ok(migration.includes(programRef))
  }
  assert.ok(migration.includes("'CA:manufacturing-engineer','ca-program:5248','related'"))
  assert.ok(migration.includes("'CA:environmental-engineer','ca-program:173','related'"))
})
