import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811101503_japan_transport_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "truck-driver",
  "logistics-coordinator",
  "aircraft-maintenance-technician",
  "commercial-pilot",
  "marine-engineer",
  "deck-officer",
  "warehouse-manager",
  "automotive-service-technician",
] as const

test("Japan transport cohort covers the canonical eight transport careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "transport", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan transport preserves direct and umbrella MHLW classification boundaries", () => {
  assert.match(migration, /'JP:truck-driver'[\s\S]*?null,'JPY',true/)
  for (const code of ["083-01", "083-02", "083-03", "083-04", "083-99"]) {
    assert.match(migration, new RegExp(`'JP:truck-driver','${code}'`), code)
  }

  assert.match(migration, /'JP:logistics-coordinator'[\s\S]*?null,'JPY',false/)
  assert.match(migration, /'JP:logistics-coordinator','039-02'/)
  assert.match(migration, /'JP:logistics-coordinator','042-02'/)

  assert.match(migration, /'JP:aircraft-maintenance-technician'[\s\S]*?'075-04','JPY',true/)
  assert.match(migration, /'JP:commercial-pilot'[\s\S]*?'087-04','JPY',true/)
  assert.match(migration, /'JP:marine-engineer'[\s\S]*?'087-03','JPY',true/)
  assert.match(migration, /'JP:deck-officer'[\s\S]*?'087-02','JPY',true/)

  assert.match(migration, /'JP:warehouse-manager'[\s\S]*?null,'JPY',false/)
  for (const code of ["002-01", "039-02", "095-03"]) {
    assert.match(migration, new RegExp(`'JP:warehouse-manager','${code}'`), code)
  }

  assert.match(migration, /'JP:automotive-service-technician'[\s\S]*?'075-03','JPY',false/)
})

test("Japan transport separates mandatory licences from narrower professional qualifications", () => {
  for (const id of ["truck-driver", "aircraft-maintenance-technician", "commercial-pilot", "marine-engineer", "deck-officer"]) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*?'JPY',true`), id)
  }
  for (const id of ["logistics-coordinator", "warehouse-manager", "automotive-service-technician"]) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*?'JPY',false`), id)
  }

  assert.match(getOccupationEditorial("truck-driver")?.countries.JP?.registration ?? "", /licence.*vehicle|vehicle.*licence/i)
  assert.match(getOccupationEditorial("aircraft-maintenance-technician")?.countries.JP?.registration ?? "", /national.*航空整備士|航空整備士.*required/i)
  assert.match(getOccupationEditorial("commercial-pilot")?.countries.JP?.registration ?? "", /MLIT.*skill certificate/i)
  assert.match(getOccupationEditorial("marine-engineer")?.countries.JP?.registration ?? "", /海技士（機関）/)
  assert.match(getOccupationEditorial("deck-officer")?.countries.JP?.registration ?? "", /海技士（航海）/)
  assert.match(getOccupationEditorial("automotive-service-technician")?.countries.JP?.entryPathway ?? "", /employed.*before obtaining|before obtaining.*qualification/i)
})

test("Japan transport v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,15,0,0,0,2,17",
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,10,0,0,0,1,11",
    "0,0,0,0,8,0,0,0,1,9",
    "0,0,0,0,10,0,0,0,5,15",
    "0,0,0,0,12,0,0,0,4,16",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Japan transport reuses only approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /join public\.program_catalog_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
