import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811204900_us_health_occupations.sql", import.meta.url),
  "utf8",
)

const healthCareers = [
  ["registered-nurse", "29-1141", 52],
  ["midwife", "29-1161", 30],
  ["care-worker", "31-1120", 33],
  ["physiotherapist", "29-1123", 53],
  ["medical-laboratory-technician", "29-2010", 24],
  ["radiographer", "29-2034", 30],
  ["pharmacist", "29-1051", 23],
  ["occupational-therapist", "29-1122", 28],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','2026-08-11'`))
}

test("US Health covers the canonical eight health careers", () => {
  assert.equal(healthCareers.length, 8)
  for (const [id, soc] of healthCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "health")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Health preserves exact SOC scopes and deliberate combined-series boundaries", () => {
  for (const marker of [
    "'US:registered-nurse','US','registered-nurse','Registered Nurses','SOC','SOC 2018','29-1141'",
    "'US:midwife','US','midwife','Nurse Midwives','SOC','SOC 2018','29-1161'",
    "'US:care-worker','US','care-worker','Home Health and Personal Care Aides','SOC','SOC 2018','31-1120'",
    "'US:physiotherapist','US','physiotherapist','Physical Therapists','SOC','SOC 2018','29-1123'",
    "'US:medical-laboratory-technician','US','medical-laboratory-technician','Clinical Laboratory Technologists and Technicians — technician scope','SOC','SOC 2018','29-2010'",
    "'US:radiographer','US','radiographer','Radiologic Technologists and Technicians','SOC','SOC 2018','29-2034'",
    "'US:pharmacist','US','pharmacist','Pharmacists','SOC','SOC 2018','29-1051'",
    "'US:occupational-therapist','US','occupational-therapist','Occupational Therapists','SOC','SOC 2018','29-1122'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("technician side of the BLS SOC 2018 29-2010 combined"))
  assert.ok(migration.includes("MRI Technologists 29-2035 are excluded"))
})

test("US Health uses Schedule A only for professional nurses and physical therapists", () => {
  assert.ok(migration.includes("'US:registered-nurse','2026-08-11',3391000,null,93600,20,0,0,0,8,8,5,10,1,52"))
  assert.ok(migration.includes("'US:physiotherapist','2026-08-11',267200,null,101020,20,0,0,0,2,10,10,10,1,53"))

  for (const id of ["midwife","care-worker","medical-laboratory-technician","radiographer","pharmacist","occupational-therapist"]) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, /,\d+,null,\d+,0,0,0,0,/)
  }

  assert.ok(migration.includes("20 CFR 656.5 Schedule A Group I expressly covers professional nurses"))
  assert.ok(migration.includes("20 CFR 656.5 Schedule A Group I expressly covers physical therapists"))
  assert.ok(migration.includes("No separate automatic Schedule A treatment is asserted for the nurse-midwife title here"))
})

test("US Health stores current BLS pay, employment and 2024-2034 growth inputs", () => {
  const expected = [
    ["registered-nurse", 3391000, 93600, "5 percent"],
    ["midwife", 8600, 128790, "11 percent"],
    ["care-worker", 4347700, 34900, "17 percent"],
    ["physiotherapist", 267200, 101020, "11 percent"],
    ["medical-laboratory-technician", 351200, 61890, "2 percent"],
    ["radiographer", 228000, 77660, "4 percent"],
    ["pharmacist", 335100, 137480, "5 percent"],
    ["occupational-therapist", 160000, 98340, "14 percent"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-11',${employment},null,${salary}`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Health locks US v1 component scores", () => {
  const expectedRows: Record<string, RegExp> = {
    "registered-nurse": /3391000,null,93600,20,0,0,0,8,8,5,10,1,52/,
    midwife: /8600,null,128790,0,0,0,0,4,10,10,5,1,30/,
    "care-worker": /4347700,null,34900,0,0,0,0,15,2,10,2,4,33/,
    physiotherapist: /267200,null,101020,20,0,0,0,2,10,10,10,1,53/,
    "medical-laboratory-technician": /351200,null,61890,0,0,0,0,8,6,2,5,3,24/,
    radiographer: /228000,null,77660,0,0,0,0,10,8,5,5,2,30/,
    pharmacist: /335100,null,137480,0,0,0,0,2,10,5,5,1,23/,
    "occupational-therapist": /160000,null,98340,0,0,0,0,4,8,10,5,1,28/,
  }

  for (const [id, , score] of healthCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
})

test("US Health models state licensing without inventing one federal register", () => {
  for (const id of ["registered-nurse","midwife","physiotherapist","pharmacist","occupational-therapist"]) {
    const row = migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','US'`))
    assert.ok(row)
    assert.ok(row.includes("'USD',true"), `${id} must retain a universal state-licensure requirement`)
  }

  for (const id of ["care-worker","medical-laboratory-technician","radiographer"]) {
    const row = migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','US'`))
    assert.ok(row)
    assert.ok(row.includes("'USD',false"), `${id} must not be marked as universally licensed nationwide`)
  }

  assert.ok(migration.includes("Some states require laboratory technologists and technicians to be licensed"))
  assert.ok(migration.includes("most states require radiologic technologists to be licensed or certified"))
})

test("US Health publishes only the reviewed Tier A programme relation", () => {
  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'direct','2026-08-11'"))
  assert.equal(programmeRows.length, 1)
  assert.ok(migration.includes("('US:registered-nurse','umich-bsn','direct','2026-08-11')"))
})
