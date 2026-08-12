import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811210413_singapore_hospitality_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "chef",
  "cook",
  "hotel-manager",
  "restaurant-manager",
  "baker",
  "tourism-manager",
  "event-planner",
  "hospitality-supervisor",
] as const

test("Singapore hospitality cohort covers the canonical eight hospitality careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "hospitality", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore hospitality preserves direct and umbrella SSOC boundaries", () => {
  assert.match(migration, /'SG:chef'[\s\S]*?'34341','SGD',false/)
  assert.match(migration, /'SG:cook'[\s\S]*?'51201','SGD',false/)
  assert.match(migration, /'SG:hotel-manager'[\s\S]*?'14110','SGD',false/)
  assert.match(migration, /'SG:restaurant-manager'[\s\S]*?'14121','SGD',false/)
  assert.match(migration, /'SG:baker'[\s\S]*?'75121','SGD',false/)
  assert.match(migration, /'SG:event-planner'[\s\S]*?'33320','SGD',false/)
  assert.match(migration, /'SG:tourism-manager'[\s\S]*?null,'SGD',false/)
  assert.match(migration, /'SG:hospitality-supervisor'[\s\S]*?null,'SGD',false/)

  for (const code of ["14392", "14322"]) assert.match(migration, new RegExp(`'SG:tourism-manager','${code}'`), code)
  for (const code of ["34342", "51311", "51701", "51503"]) assert.match(migration, new RegExp(`'SG:hospitality-supervisor','${code}'`), code)
  assert.match(migration, /'SG:chef','34343'/)
  assert.match(migration, /'SG:cook','51202'/)
  assert.match(migration, /'SG:baker','75122'/)
  assert.match(migration, /'SG:event-planner','14391'/)
})

test("Singapore hospitality keeps food-safety compliance narrower than occupational licensing", () => {
  assert.match(getOccupationEditorial("chef")?.countries.SG?.registration ?? "", /no universal Chef occupational licence/i)
  assert.match(getOccupationEditorial("cook")?.countries.SG?.registration ?? "", /no universal Cook occupational licence/i)
  assert.match(getOccupationEditorial("baker")?.countries.SG?.registration ?? "", /no universal Baker occupational licence/i)
  assert.match(getOccupationEditorial("restaurant-manager")?.countries.SG?.registration ?? "", /Food Shop licences.*operator|operator.*Food Shop licences/i)
  assert.match(getOccupationEditorial("hospitality-supervisor")?.countries.SG?.registration ?? "", /Food Hygiene Officer/i)
  assert.match(migration, /SFA — Requirements for Food Handlers/)
  assert.match(migration, /SFA — Requirements for Food Hygiene Officers/)
})

test("Singapore tourism keeps business and guide licensing narrower than broad tourism management", () => {
  const registration = getOccupationEditorial("tourism-manager")?.countries.SG?.registration ?? ""
  assert.match(registration, /Travel Agent licensing/i)
  assert.match(registration, /Tourist Guide licensing/i)
  assert.match(registration, /not.*universal personal licence|Neither regime/i)
  assert.match(migration, /STB — Travel Agent Licence/)
  assert.match(migration, /STB — Tourist Guide Licence/)
})

test("Singapore hospitality v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,15,0,0,0,4,19",
    "0,0,0,0,10,0,0,0,3,13",
    "0,0,0,0,10,0,0,0,4,14",
    "0,0,0,0,15,0,0,0,5,20",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore hospitality reuses only approved programme mappings and does not promote common pathways to direct", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
