import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810205050_japan_engineering_occupations.sql", import.meta.url),
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

test("Japan engineering cohort covers the canonical eight engineering careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP
    assert.ok(career, id)
    assert.equal(career.categoryId, "engineering", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan engineering preserves multi-code MHLW scopes instead of false rollups", () => {
  for (const id of careers) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*null,'JPY',false`), id)
  }

  for (const code of ["008-04", "008-05", "008-06"]) assert.match(migration, new RegExp(`'JP:civil-engineer','${code}'`))
  for (const code of ["006-03", "007-04"]) assert.match(migration, new RegExp(`'JP:mechanical-engineer','${code}'`))
  for (const code of ["006-02", "007-02", "007-03"]) assert.match(migration, new RegExp(`'JP:electrical-engineer','${code}'`))
  for (const code of ["006-07", "007-08"]) assert.match(migration, new RegExp(`'JP:chemical-engineer','${code}'`))
  for (const code of ["011-99", "008-04", "008-06"]) assert.match(migration, new RegExp(`'JP:environmental-engineer','${code}'`))
  for (const code of ["080-04", "080-05"]) assert.match(migration, new RegExp(`'JP:engineering-technician','${code}'`))
})

test("Japan manufacturing and industrial engineering remain reviewed umbrellas", () => {
  for (const code of ["007-01", "007-02", "007-04", "007-05", "007-06", "007-07", "007-08", "007-99"]) {
    assert.match(migration, new RegExp(`'JP:manufacturing-engineer','${code}'`), code)
  }
  for (const code of ["007-02", "007-04", "007-99"]) {
    assert.match(migration, new RegExp(`'JP:industrial-engineer','${code}'`), code)
  }
  assert.match(getOccupationEditorial("industrial-engineer")?.countries.JP?.entryPathway ?? "", /broader than one Japanese classification item/i)
})

test("Japan engineering does not invent universal occupational licensing", () => {
  for (const id of careers) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',false`), id)
  }
  assert.match(getOccupationEditorial("civil-engineer")?.countries.JP?.registration ?? "", /主任技術者|監理技術者/)
  assert.match(getOccupationEditorial("electrical-engineer")?.countries.JP?.registration ?? "", /電気主任技術者/)
  assert.match(getOccupationEditorial("environmental-engineer")?.countries.JP?.registration ?? "", /作業環境測定士/)
})

test("Japan engineering v1 keeps market and visa components intentionally unscored", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,12,0,0,0,3,15/g)
  assert.match(migration, /0,0,0,0,12,0,0,0,2,14/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /No occupation-specific visa credit is assigned in this foundation phase/g)
})

test("Japan engineering reuses approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
