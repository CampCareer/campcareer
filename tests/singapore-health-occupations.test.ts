import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811105236_singapore_health_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "registered-nurse",
  "midwife",
  "care-worker",
  "physiotherapist",
  "medical-laboratory-technician",
  "radiographer",
  "pharmacist",
  "occupational-therapist",
] as const

test("Singapore health cohort covers the canonical eight health careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "health", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore health preserves exact SSOC mappings and honest umbrellas", () => {
  assert.match(migration, /'SG:registered-nurse'[\s\S]*?'22200','SGD',true/)
  assert.match(migration, /'SG:midwife'[\s\S]*?null,'SGD',true/)
  assert.match(migration, /'SG:midwife','22200'[\s\S]*?false/)

  assert.match(migration, /'SG:care-worker'[\s\S]*?null,'SGD',false/)
  for (const code of ["53201", "53202", "53209"]) {
    assert.match(migration, new RegExp(`'SG:care-worker','${code}'`), code)
  }

  assert.match(migration, /'SG:physiotherapist'[\s\S]*?'22640','SGD',true/)
  assert.match(migration, /'SG:medical-laboratory-technician'[\s\S]*?'32120','SGD',false/)
  assert.match(migration, /'SG:radiographer'[\s\S]*?'22693','SGD',true/)
  assert.match(migration, /'SG:pharmacist'[\s\S]*?'22621','SGD',true/)
  assert.match(migration, /'SG:occupational-therapist'[\s\S]*?'22680','SGD',true/)
})

test("Singapore health models statutory registration by profession", () => {
  for (const id of ["registered-nurse", "midwife"]) {
    assert.match(getOccupationEditorial(id)?.countries.SG?.registration ?? "", /Singapore Nursing Board|SNB/i, id)
  }
  for (const id of ["physiotherapist", "radiographer", "occupational-therapist"]) {
    assert.match(getOccupationEditorial(id)?.countries.SG?.registration ?? "", /Allied Health Professions Council|AHPC/i, id)
  }
  assert.match(getOccupationEditorial("pharmacist")?.countries.SG?.registration ?? "", /Singapore Pharmacy Council|SPC/i)
  assert.match(getOccupationEditorial("medical-laboratory-technician")?.countries.SG?.registration ?? "", /not among the healthcare professions currently regulated/i)
  assert.match(getOccupationEditorial("care-worker")?.countries.SG?.registration ?? "", /no single statutory professional registration scheme/i)
})

test("Singapore health keeps profession boundaries explicit", () => {
  assert.match(getOccupationEditorial("registered-nurse")?.countries.SG?.entryPathway ?? "", /excluding enrolled nurse|Registered Nurse scope/i)
  assert.match(getOccupationEditorial("midwife")?.countries.SG?.entryPathway ?? "", /no.*separate five-digit Midwife|primary code null/i)
  assert.match(getOccupationEditorial("medical-laboratory-technician")?.countries.SG?.entryPathway ?? "", /32120[\s\S]*21342/)
  assert.match(getOccupationEditorial("radiographer")?.countries.SG?.entryPathway ?? "", /22693[\s\S]*22694/)
  assert.match(getOccupationEditorial("pharmacist")?.countries.SG?.entryPathway ?? "", /22621[\s\S]*22629/)
})

test("Singapore health v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned in this foundation phase/g)

  for (const score of [
    "0,0,0,0,10,0,0,0,1,11",
    "0,0,0,0,8,0,0,0,1,9",
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,12,0,0,0,5,17",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore health programme links use collision-safe SG refs and conservative relations", () => {
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  assert.match(migration, /delete from public\.country_occupation_program_links where profile_key='SG:construction-manager'/)

  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
  assert.match(getOccupationEditorial("radiographer")?.countries.SG?.jobMarketNote ?? "", /common pathways[\s\S]*related/i)
})
