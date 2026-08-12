import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811103042_singapore_construction_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["carpenter", "71151"],
  ["electrician", "74110"],
  ["plumber", "71261"],
  ["wall-floor-tiler", "71220"],
  ["welder", "72120"],
  ["bricklayer", "71120"],
  ["hvac-technician", null],
  ["construction-manager", "13230"],
] as const

test("Singapore construction cohort covers the canonical eight trades careers", () => {
  for (const [id, code] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "trades", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
    if (code) assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Singapore construction preserves direct SSOC 2024 codes and the HVAC umbrella", () => {
  assert.match(migration, /'SG:carpenter'[\s\S]*?'71151','SGD',false/)
  assert.match(migration, /'SG:electrician'[\s\S]*?'74110','SGD',true/)
  assert.match(migration, /'SG:plumber'[\s\S]*?'71261','SGD',true/)
  assert.match(migration, /'SG:wall-floor-tiler'[\s\S]*?'71220','SGD',false/)
  assert.match(migration, /'SG:welder'[\s\S]*?'72120','SGD',false/)
  assert.match(migration, /'SG:bricklayer'[\s\S]*?'71120','SGD',false/)
  assert.match(migration, /'SG:construction-manager'[\s\S]*?'13230','SGD',false/)

  assert.match(migration, /'SG:hvac-technician'[\s\S]*?null,'SGD',false/)
  assert.match(migration, /'SG:hvac-technician','71271'/)
  assert.match(migration, /'SG:hvac-technician','71272'/)
  assert.match(getOccupationEditorial("hvac-technician")?.countries.SG?.entryPathway ?? "", /71271[\s\S]*71272/)
})

test("Singapore construction models personal licensing only where the broad occupation requires it", () => {
  assert.match(migration, /'SG:electrician'[\s\S]*?'SGD',true,'Energy Market Authority \(EMA\)'/)
  assert.match(getOccupationEditorial("electrician")?.countries.SG?.registration ?? "", /Licensed Electrical Worker/i)

  assert.match(migration, /'SG:plumber'[\s\S]*?'SGD',true,'PUB, Singapore''s National Water Agency'/)
  assert.match(getOccupationEditorial("plumber")?.countries.SG?.registration ?? "", /Licensed Plumbers/i)
  assert.match(getOccupationEditorial("plumber")?.countries.SG?.registration ?? "", /simple plumbing works/i)

  for (const id of ["carpenter", "wall-floor-tiler", "welder", "bricklayer", "hvac-technician", "construction-manager"]) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?'SGD',false`), id)
  }

  assert.match(getOccupationEditorial("construction-manager")?.countries.SG?.registration ?? "", /Builders Licensing Scheme/i)
  assert.match(getOccupationEditorial("construction-manager")?.countries.SG?.registration ?? "", /Approved Person.*Technical Controller/i)
})

test("Singapore construction v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned in this foundation phase/g)

  for (const score of [
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,12,0,0,0,1,13",
    "0,0,0,0,15,0,0,0,3,18",
    "0,0,0,0,12,0,0,0,4,16",
    "0,0,0,0,10,0,0,0,3,13",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore construction reuses only approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  assert.match(getOccupationEditorial("construction-manager")?.countries.SG?.jobMarketNote ?? "", /three reviewed Singapore programmes/i)
  assert.match(getOccupationEditorial("construction-manager")?.countries.SG?.jobMarketNote ?? "", /related academic pathways only/i)
})
