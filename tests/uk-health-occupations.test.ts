import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810131953_uk_health_occupations.sql", import.meta.url),
  "utf8",
)

const healthCareers = [
  ["registered-nurse", "2232-2237", 41],
  ["midwife", "2231", 30],
  ["care-worker", "6135", 43],
  ["physiotherapist", "2221", 25],
  ["medical-laboratory-technician", "3111", 28],
  ["radiographer", "2254", 44],
  ["pharmacist", "2251", 37],
  ["occupational-therapist", "2222", 40],
] as const

test("UK Health cohort covers the canonical eight health careers", () => {
  for (const [id, soc] of healthCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "health")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("UK Health scoring separates workforce shortage, visa access and regulation burden", () => {
  const expectedScoreFragments = [
    "'UK:registered-nurse','2026-08-10',null,null,null,20,0,0,0,10,0,0,10,1,41",
    "'UK:midwife','2026-08-10',null,null,39327,5,0,0,0,8,6,0,10,1,30",
    "'UK:care-worker','2026-08-10',null,null,21487,20,0,0,0,15,0,0,3,5,43",
    "'UK:physiotherapist','2026-08-10',null,null,37917,0,0,0,0,8,6,0,10,1,25",
    "'UK:medical-laboratory-technician','2026-08-10',77000,null,26861,0,0,0,0,12,2,0,10,4,28",
    "'UK:radiographer','2026-08-10',null,null,44324,15,0,0,0,8,10,0,10,1,44",
    "'UK:pharmacist','2026-08-10',null,null,47508,10,0,0,0,6,10,0,10,1,37",
    "'UK:occupational-therapist','2026-08-10',null,null,37201,15,0,0,0,8,6,0,10,1,40",
  ]

  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("career-opportunity-uk-v1"))
  assert.ok(migration.includes("From 22 July 2025 new overseas Health and Care Worker applications for care workers closed"))
  assert.ok(migration.includes("limited historical and future shortage evidence and recommends no future TSL access"))
  assert.ok(migration.includes("no defensible weighted roll-up is currently stored"))
})

test("UK Registered Nurse roll-up excludes midwifery and preserves six nursing SOC groups", () => {
  for (const soc of ["2232", "2233", "2234", "2235", "2236", "2237"]) {
    assert.ok(migration.includes(`'UK:registered-nurse','${soc}'`))
  }
  assert.ok(migration.includes("SOC 2231 Midwifery nurses is excluded"))
  assert.ok(migration.includes("'UK:midwife','2231'"))
})

test("UK Health publishes only reviewed non-closed canonical programme pathways", () => {
  const selectedProgramRefs = [
    "uk-program:98e7f5bd-a54d-17e9-d36c-ae9b3f2675e2",
    "uk-program:8084d43b-ddf8-aef9-e6a2-c445e151de03",
    "uk-program:17124f58-e031-0480-c4ff-be715ec3639d",
    "uk-program:23bba4d5-57a4-18a7-03c4-dcde575ec946",
    "uk-program:d0a7ec34-6f0f-676b-7170-5975fa07fedc",
    "uk-program:ff8e4adc-68eb-448d-6651-90047693a1ec",
    "uk-program:3135336a-5311-90ae-8ce3-bea7385a2b3a",
    "uk-program:68433072-5fac-1d60-2450-73d114d8e4e5",
  ]
  for (const programRef of selectedProgramRefs) assert.ok(migration.includes(programRef))

  assert.ok(!migration.includes("uk-program:77da77c9-e5b4-3e81-b112-30456f3ba9e1"))
  assert.ok(!migration.includes("uk-program:62401a95-6860-3ee4-7b09-c314e224a17e"))
  assert.ok(!migration.includes("uk-program:849c9560-7d01-2d42-d96f-fab998741356"))
})

test("UK Health entry and regulatory evidence is explicit for regulated careers", () => {
  for (const marker of [
    "Skills England — Registered Nurse degree apprenticeship",
    "Skills England — Midwife integrated degree apprenticeship",
    "Skills England — Adult Care Worker apprenticeship",
    "Skills England — Physiotherapist apprenticeship",
    "Skills England — Laboratory Technician apprenticeship",
    "Skills England — Diagnostic Radiographer apprenticeship",
    "GPhC — Courses and qualifications for pharmacists",
    "Skills England — Occupational Therapist apprenticeship",
  ]) {
    assert.ok(migration.includes(marker))
  }

  assert.ok(migration.includes("Nursing and Midwifery Council"))
  assert.ok(migration.includes("Health and Care Professions Council"))
  assert.ok(migration.includes("General Pharmaceutical Council (Great Britain) / Pharmaceutical Society of Northern Ireland"))
})
