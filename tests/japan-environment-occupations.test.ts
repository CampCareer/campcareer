import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810222433_japan_environment_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "environmental-scientist",
  "agronomist",
  "farm-manager",
  "forestry-technician",
  "food-technologist",
  "sustainability-specialist",
  "horticulturist",
  "animal-science-technician",
] as const

test("Japan environment cohort covers the canonical eight environment careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP
    assert.ok(career, id)
    assert.equal(career.categoryId, "environment", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan environment preserves honest MHLW classification scopes", () => {
  assert.match(migration, /'JP:environmental-scientist'.*null,'JPY',false/s)
  assert.match(migration, /'JP:environmental-scientist','004-01'/)
  assert.match(migration, /'JP:environmental-scientist','011-99'/)
  assert.match(migration, /'JP:agronomist'.*'005-01','JPY',false/s)
  assert.match(migration, /'JP:farm-manager'.*null,'JPY',false/s)
  for (const code of ["064-01", "064-02", "064-03"]) assert.match(migration, new RegExp(`'JP:farm-manager','${code}'`))
  assert.match(migration, /'JP:forestry-technician'.*'005-01','JPY',false/s)
  assert.match(migration, /'JP:food-technologist'.*null,'JPY',false/s)
  assert.match(migration, /'JP:food-technologist','006-01'/)
  assert.match(migration, /'JP:food-technologist','007-01'/)
  assert.match(migration, /'JP:sustainability-specialist'.*null,'JPY',false/s)
  assert.match(migration, /'JP:horticulturist'.*null,'JPY',false/s)
  assert.match(migration, /'JP:horticulturist','064-02'/)
  assert.match(migration, /'JP:horticulturist','064-05'/)
  assert.match(migration, /'JP:animal-science-technician'.*'005-01','JPY',false/s)
})

test("Japan environment does not invent universal licences", () => {
  for (const id of careers) assert.match(migration, new RegExp(`'JP:${id}'.*'JPY',false`, "s"), id)
  assert.match(getOccupationEditorial("environmental-scientist")?.countries.JP?.registration ?? "", /no universal statutory licence/i)
  assert.match(getOccupationEditorial("animal-science-technician")?.countries.JP?.registration ?? "", /家畜人工授精/)
  assert.match(getOccupationEditorial("food-technologist")?.countries.JP?.registration ?? "", /no universal personal Food Technologist licence/i)
})

test("Japan environment v1 defers market and visa enrichment", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,12,0,0,0,5,17/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,12,0,0,0,4,16/)
})

test("Japan environment reuses reviewed programme mappings only", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
