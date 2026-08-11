import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810215246_japan_education_occupations.sql", import.meta.url),
  "utf8",
)
const specialSupportCorrection = readFileSync(
  new URL("../supabase/migrations/20260810215617_japan_education_special_support_licence_correction.sql", import.meta.url),
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

test("Japan education cohort covers the canonical eight education careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "education", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan education preserves school-type and welfare classification boundaries", () => {
  assert.match(migration, /'JP:early-childhood-teacher'[\s\S]*'029-02','JPY',true/)
  assert.match(migration, /'JP:primary-school-teacher'[\s\S]*'031-01','JPY',true/)
  assert.match(migration, /'JP:secondary-school-teacher'[\s\S]*null,'JPY',true/)
  for (const code of ["031-02", "031-04", "031-05"]) {
    assert.match(migration, new RegExp(`'JP:secondary-school-teacher','${code}'`), code)
  }
  assert.match(migration, /'JP:special-education-teacher'[\s\S]*'031-06','JPY',true/)

  assert.match(migration, /'JP:social-worker'[\s\S]*null,'JPY',true/)
  for (const code of ["049-02", "049-03", "049-04", "049-05", "049-99"]) {
    assert.match(migration, new RegExp(`'JP:social-worker','${code}'`), code)
  }

  assert.match(migration, /'JP:youth-worker'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:youth-worker','030-02'/)
  assert.match(migration, /'JP:youth-worker','049-05'/)
  assert.match(migration, /'JP:community-worker'[\s\S]*'049-99','JPY',false/)
  assert.match(migration, /'JP:counsellor'[\s\S]*'019-03','JPY',false/)
})

test("Japan education models licensing without overclaiming broad support roles", () => {
  for (const id of ["early-childhood-teacher", "primary-school-teacher", "secondary-school-teacher", "special-education-teacher", "social-worker"]) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',true`), id)
  }
  for (const id of ["youth-worker", "community-worker", "counsellor"]) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',false`), id)
  }

  assert.match(getOccupationEditorial("early-childhood-teacher")?.countries.JP?.jobMarketNote ?? "", /保育士/)
  assert.match(getOccupationEditorial("secondary-school-teacher")?.countries.JP?.registration ?? "", /school-type and subject teacher licence/i)
  assert.match(getOccupationEditorial("special-education-teacher")?.countries.JP?.registration ?? "", /Supplementary Provision 16[\s\S]*transitional exception/)
  assert.match(specialSupportCorrection, /foundational kindergarten, elementary, middle or high-school teacher licence is required/i)
  assert.match(specialSupportCorrection, /does not describe the specialist licence itself as universally mandatory/i)
  assert.match(getOccupationEditorial("social-worker")?.countries.JP?.registration ?? "", /protected national title/i)
  assert.match(getOccupationEditorial("youth-worker")?.countries.JP?.registration ?? "", /no single universal Youth Worker licence/i)
  assert.match(getOccupationEditorial("counsellor")?.countries.JP?.registration ?? "", /not one universally licensed occupation/i)
})

test("Japan education v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,1,11/)
  assert.match(migration, /0,0,0,0,8,0,0,0,1,9/)
  assert.match(migration, /0,0,0,0,10,0,0,0,3,13/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,12,0,0,0,4,16/)
})

test("Japan education reuses only reviewed programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
