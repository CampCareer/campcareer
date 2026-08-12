import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811211554_singapore_transport_occupations.sql", import.meta.url),
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

test("Singapore transport cohort covers the canonical eight transport careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "transport", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore transport preserves direct and umbrella SSOC mappings", () => {
  assert.match(migration, /'SG:truck-driver'[\s\S]*?null,'SGD',true/)
  for (const code of ["83321", "83322", "83323", "83324", "83329"]) assert.match(migration, new RegExp(`'SG:truck-driver','${code}'`), code)

  assert.match(migration, /'SG:logistics-coordinator'[\s\S]*?null,'SGD',false/)
  for (const code of ["33461", "43231", "43239"]) assert.match(migration, new RegExp(`'SG:logistics-coordinator','${code}'`), code)

  assert.match(migration, /'SG:aircraft-maintenance-technician'[\s\S]*?null,'SGD',true/)
  for (const code of ["31211", "72320"]) assert.match(migration, new RegExp(`'SG:aircraft-maintenance-technician','${code}'`), code)

  assert.match(migration, /'SG:commercial-pilot'[\s\S]*?null,'SGD',true/)
  for (const code of ["21721", "21722"]) assert.match(migration, new RegExp(`'SG:commercial-pilot','${code}'`), code)

  assert.match(migration, /'SG:marine-engineer'[\s\S]*?'31510','SGD',true/)
  assert.match(migration, /'SG:deck-officer'[\s\S]*?'31521','SGD',true/)
  assert.match(migration, /'SG:warehouse-manager'[\s\S]*?'13241','SGD',false/)
  assert.match(migration, /'SG:automotive-service-technician'[\s\S]*?'72310','SGD',false/)
})

test("Singapore transport keeps licensing boundaries explicit", () => {
  assert.match(getOccupationEditorial("truck-driver")?.countries.SG?.registration ?? "", /Traffic Police|driving-licence/i)
  assert.match(getOccupationEditorial("aircraft-maintenance-technician")?.countries.SG?.registration ?? "", /CAAS.*Aircraft Maintenance|Aircraft Maintenance.*CAAS/i)
  assert.match(getOccupationEditorial("commercial-pilot")?.countries.SG?.registration ?? "", /CAAS.*pilot licence|pilot licence.*CAAS/i)
  assert.match(getOccupationEditorial("marine-engineer")?.countries.SG?.registration ?? "", /MPA.*Certificate of Competency|Certificate of Competency.*MPA/i)
  assert.match(getOccupationEditorial("deck-officer")?.countries.SG?.registration ?? "", /MPA.*Certificate of Competency|Certificate of Competency.*MPA/i)

  assert.match(getOccupationEditorial("logistics-coordinator")?.countries.SG?.registration ?? "", /no universal statutory personal occupational licence/i)
  assert.match(getOccupationEditorial("warehouse-manager")?.countries.SG?.registration ?? "", /no universal personal occupational licence/i)
  assert.match(getOccupationEditorial("automotive-service-technician")?.countries.SG?.registration ?? "", /no universal statutory personal occupational licence/i)
})

test("Singapore maritime mapping keeps senior and harbour roles separate", () => {
  assert.match(migration, /'SG:marine-engineer','21711'[\s\S]*?false/)
  assert.match(migration, /'SG:deck-officer','21713'[\s\S]*?false/)
  assert.match(getOccupationEditorial("deck-officer")?.countries.SG?.entryPathway ?? "", /Harbour pilot 31522 remains a separate occupation/i)
})

test("Singapore transport v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,15,0,0,0,2,17",
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,12,0,0,0,1,13",
    "0,0,0,0,8,0,0,0,1,9",
    "0,0,0,0,10,0,0,0,1,11",
    "0,0,0,0,10,0,0,0,4,14",
  ]) assert.match(migration, new RegExp(score), score)
})

test("Singapore transport uses only approved programme mappings and preserves direct only from direct staging", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
