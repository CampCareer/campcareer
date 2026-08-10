import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810123406_canada_transport_occupations.sql", import.meta.url),
  "utf8",
)

const transportCareers = [
  ["truck-driver", "73300", 36],
  ["logistics-coordinator", "13201", 24],
  ["aircraft-maintenance-technician", "72404", 48],
  ["commercial-pilot", "72600", 49],
  ["marine-engineer", "72603", 17],
  ["deck-officer", "72602", 21],
  ["warehouse-manager", "70012", 18],
  ["automotive-service-technician", "72410", 46],
] as const

test("Canada Transport cohort covers the canonical eight careers", () => {
  for (const [id, noc] of transportCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "transport")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Transport scoring separates shortage, wage, licensing and current visa evidence", () => {
  const expectedScoreFragments = [
    "'CA:truck-driver','2025-11-19',null,26.42,15,0,0,0,15,4,0,0,2,36",
    "'CA:logistics-coordinator','2025-11-19',null,29.49,0,0,0,0,15,4,0,0,5,24",
    "'CA:aircraft-maintenance-technician','2025-11-19',null,39.00,15,0,0,0,13,8,0,10,2,48",
    "'CA:commercial-pilot','2025-11-19',null,52.00,20,0,0,0,8,10,0,10,1,49",
    "'CA:marine-engineer','2025-11-19',null,37.00,0,0,0,0,8,8,0,0,1,17",
    "'CA:deck-officer','2025-11-19',null,41.36,0,0,0,0,10,10,0,0,1,21",
    "'CA:warehouse-manager','2025-11-19',null,45.20,0,0,0,0,3,10,0,0,5,18",
    "'CA:automotive-service-technician','2025-11-19',null,29.89,15,0,0,0,15,4,0,10,2,46",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("'CA:aircraft-maintenance-technician','72404','Aircraft mechanics and aircraft inspectors',null,true"))
  assert.ok(migration.includes("'CA:commercial-pilot','72600','Air pilots, flight engineers and flying instructors',null,true"))
  assert.ok(migration.includes("'CA:automotive-service-technician','72410','Automotive service technicians, truck and bus mechanics and mechanical repairers',null,true"))
  assert.ok(migration.includes("'CA:truck-driver','73300','Transport truck drivers',null,false"))
})

test("Canada Transport programme links publish only supportable international routes", () => {
  for (const programRef of [
    "ca-program:256",
    "ca-program:3525",
    "ca-program:2011",
    "ca-program:3429",
    "ca-program:2909",
    "ca-program:4092",
    "ca-program:3443",
  ]) {
    assert.ok(migration.includes(programRef))
  }

  assert.ok(migration.includes("'CA:logistics-coordinator','ca-program:256','related'"))
  assert.ok(migration.includes("'CA:aircraft-maintenance-technician','ca-program:2011','direct'"))
  assert.ok(migration.includes("'CA:commercial-pilot','ca-program:2909','direct'"))
  assert.ok(migration.includes("'CA:warehouse-manager','ca-program:3525','related'"))
  assert.ok(migration.includes("'CA:automotive-service-technician','ca-program:3443','direct'"))
  assert.ok(!migration.includes("'CA:truck-driver','ca-program:"))
  assert.ok(!migration.includes("'CA:marine-engineer','ca-program:"))
  assert.ok(!migration.includes("'CA:deck-officer','ca-program:"))
  assert.ok(!migration.includes("'common_pathway'"))
})
