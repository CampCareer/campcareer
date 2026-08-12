import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811141107_singapore_education_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "early-childhood-teacher",
  "primary-school-teacher",
  "secondary-school-teacher",
  "special-education-teacher",
  "social-worker",
  "youth-worker",
  "community-worker",
  "counsellor",
] as const

test("Singapore education cohort covers the canonical eight education and social-service careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "education", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore education preserves direct and umbrella SSOC boundaries", () => {
  assert.match(migration, /'SG:early-childhood-teacher'[\s\S]*?'36100','SGD',true/)
  assert.match(migration, /'SG:primary-school-teacher'[\s\S]*?'23500','SGD',false/)
  assert.match(migration, /'SG:secondary-school-teacher'[\s\S]*?'23400','SGD',false/)
  assert.match(migration, /'SG:youth-worker'[\s\S]*?'26623','SGD',false/)

  for (const id of ["special-education-teacher", "social-worker", "community-worker", "counsellor"]) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?null,'SGD',false`), id)
  }

  for (const code of ["23621", "23622", "23629"]) assert.match(migration, new RegExp(`'SG:special-education-teacher','${code}'`), code)
  for (const code of ["26621", "26622", "26629"]) assert.match(migration, new RegExp(`'SG:social-worker','${code}'`), code)
  for (const code of ["26623", "34121"]) assert.match(migration, new RegExp(`'SG:youth-worker','${code}'`), code)
  for (const code of ["34122", "26629"]) assert.match(migration, new RegExp(`'SG:community-worker','${code}'`), code)
  for (const code of ["26631", "26632", "26633", "26634", "26639"]) assert.match(migration, new RegExp(`'SG:counsellor','${code}'`), code)
})

test("Singapore education keeps certification and professional accreditation boundaries conservative", () => {
  assert.match(getOccupationEditorial("early-childhood-teacher")?.countries.SG?.registration ?? "", /ECDA.*certification|certification.*ECDA/i)
  assert.match(getOccupationEditorial("primary-school-teacher")?.countries.SG?.registration ?? "", /not.*universal|does not operate.*universal/i)
  assert.match(getOccupationEditorial("social-worker")?.countries.SG?.registration ?? "", /not mandatory/i)
  assert.match(getOccupationEditorial("counsellor")?.countries.SG?.registration ?? "", /does not require.*licensed|not.*statutory/i)
  assert.match(migration, /SASW\/SWAAB Accreditation FAQ/)
  assert.match(migration, /NCSS Counselling Careers/)
})

test("Singapore education v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,12,0,0,0,1,13",
    "0,0,0,0,10,0,0,0,4,14",
    "0,0,0,0,12,0,0,0,5,17",
    "0,0,0,0,15,0,0,0,5,20",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore education reuses only approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
