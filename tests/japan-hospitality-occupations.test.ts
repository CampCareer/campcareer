import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811022259_japan_hospitality_occupations.sql", import.meta.url),
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

test("Japan hospitality cohort covers the canonical eight hospitality careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "hospitality", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan hospitality preserves cooking and management classification boundaries", () => {
  assert.match(migration, /'JP:chef'[\s\S]*null,'JPY',false/)
  for (const code of ["055-01", "055-02", "055-03", "055-04"]) {
    assert.match(migration, new RegExp(`'JP:chef','${code}'`), code)
  }

  assert.match(migration, /'JP:cook'[\s\S]*null,'JPY',false/)
  for (const code of ["055-05", "055-06", "055-07", "055-99"]) {
    assert.match(migration, new RegExp(`'JP:cook','${code}'`), code)
  }

  assert.match(migration, /'JP:hotel-manager'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:hotel-manager','002-01'/)
  assert.match(migration, /'JP:hotel-manager','056-02'/)

  assert.match(migration, /'JP:restaurant-manager'[\s\S]*null,'JPY',false/)
  for (const code of ["002-01", "003-99", "056-01"]) {
    assert.match(migration, new RegExp(`'JP:restaurant-manager','${code}'`), code)
  }

  assert.match(migration, /'JP:baker'[\s\S]*'072-01','JPY',false/)
  assert.match(migration, /'JP:event-planner'[\s\S]*'033-03','JPY',false/)
  assert.match(migration, /'JP:tourism-manager'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:tourism-manager','033-03'/)
  assert.match(migration, /'JP:hospitality-supervisor'[\s\S]*null,'JPY',false/)
})

test("Japan hospitality does not convert optional or venue-specific credentials into universal licences", () => {
  for (const id of careers) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',false`), id)
  }

  assert.match(getOccupationEditorial("chef")?.countries.JP?.registration ?? "", /no universal statutory Chef licence/i)
  assert.match(getOccupationEditorial("cook")?.countries.JP?.registration ?? "", /no universal statutory Cook licence/i)
  assert.match(getOccupationEditorial("baker")?.countries.JP?.registration ?? "", /no universal statutory Baker licence/i)
  assert.match(getOccupationEditorial("hotel-manager")?.countries.JP?.registration ?? "", /no universal statutory Hotel Manager licence/i)
})

test("Japan hospitality v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,12,0,0,0,4,16/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,12,0,0,0,5,17/)
})

test("Japan hospitality reuses only approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
