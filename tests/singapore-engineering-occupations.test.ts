import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811114913_singapore_engineering_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "civil-engineer",
  "mechanical-engineer",
  "electrical-engineer",
  "manufacturing-engineer",
  "industrial-engineer",
  "chemical-engineer",
  "environmental-engineer",
  "engineering-technician",
] as const

test("Singapore engineering cohort covers the canonical eight engineering careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "engineering", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore engineering preserves direct SSOC anchors and explicit umbrellas", () => {
  for (const [id, code] of [
    ["civil-engineer", "21421"],
    ["mechanical-engineer", "21441"],
    ["electrical-engineer", "21511"],
    ["manufacturing-engineer", "21411"],
    ["chemical-engineer", "21451"],
    ["environmental-engineer", "21430"],
  ] as const) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?'${code}'`), `${id}:${code}`)
  }

  assert.match(migration, /'SG:industrial-engineer'[\s\S]*?null,'SGD',false/)
  for (const code of ["21411", "21412", "21414", "21415"]) {
    assert.match(migration, new RegExp(`'SG:industrial-engineer','${code}'`), code)
  }

  assert.match(migration, /'SG:engineering-technician'[\s\S]*?null,'SGD',false/)
  for (const code of ["31121", "31131", "31141", "31151", "31161", "31171"]) {
    assert.match(migration, new RegExp(`'SG:engineering-technician','${code}'`), code)
  }
})

test("Singapore chemical engineering keeps petroleum variants out of the primary general rollup", () => {
  assert.match(migration, /'SG:chemical-engineer'[\s\S]*?'21451','SGD',false/)
  assert.match(migration, /'SG:chemical-engineer','21451'[\s\S]*?true/)
  assert.match(migration, /'SG:chemical-engineer','21452'[\s\S]*?false/)
  assert.match(migration, /'SG:chemical-engineer','21453'[\s\S]*?false/)
})

test("Singapore engineering does not misstate PE registration as mandatory for every employee", () => {
  for (const id of careers) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?'SGD',false`), id)
  }

  for (const id of ["civil-engineer", "mechanical-engineer", "electrical-engineer", "chemical-engineer"] as const) {
    const registration = getOccupationEditorial(id)?.countries.SG?.registration ?? ""
    assert.match(registration, /Professional Engineer|PE |PE's|PE Act|registered PE/i, id)
    assert.match(registration, /direction|supervision|employee/i, id)
  }

  assert.match(getOccupationEditorial("industrial-engineer")?.countries.SG?.registration ?? "", /not a standalone prescribed/i)
  assert.match(getOccupationEditorial("environmental-engineer")?.countries.SG?.registration ?? "", /not itself one of.*prescribed/i)
})

test("Singapore engineering v1 leaves market and visa enrichment for the common later phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned\./g)
  for (const score of [
    "0,0,0,0,10,0,0,0,3,13",
    "0,0,0,0,10,0,0,0,5,15",
    "0,0,0,0,15,0,0,0,5,20",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore engineering reuses approved programme mappings with stable SG programme refs", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
