import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810203607_japan_technology_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "software-developer",
  "data-analyst",
  "data-engineer",
  "cybersecurity-analyst",
  "network-administrator",
  "cloud-engineer",
  "database-administrator",
  "ict-support-technician",
] as const

test("Japan technology cohort covers the canonical eight technology careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "technology", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan technology preserves honest MHLW classification scopes", () => {
  assert.match(migration, /'JP:software-developer'[\s\S]*null,'JPY',false/)
  for (const code of ["009-01", "009-02", "009-03", "009-99"]) {
    assert.match(migration, new RegExp(`'JP:software-developer','${code}'`), code)
  }

  assert.match(migration, /'JP:data-analyst'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:data-analyst','011-99'[\s\S]*false/)
  assert.match(migration, /'JP:data-engineer'[\s\S]*'010-99','JPY',false/)

  assert.match(migration, /'JP:cybersecurity-analyst'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:cybersecurity-analyst','010-04'/)
  assert.match(migration, /'JP:cybersecurity-analyst','010-99'/)

  assert.match(migration, /'JP:network-administrator'[\s\S]*'010-04','JPY',false/)
  assert.match(migration, /'JP:cloud-engineer'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:cloud-engineer','010-02'/)
  assert.match(migration, /'JP:cloud-engineer','010-04'/)
  assert.match(migration, /'JP:database-administrator'[\s\S]*'010-04','JPY',false/)
  assert.match(migration, /'JP:ict-support-technician'[\s\S]*'010-05','JPY',false/)
})

test("Japan technology does not invent statutory licensing", () => {
  for (const id of careers) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',false`), id)
    assert.match(getOccupationEditorial(id)?.countries.JP?.registration ?? "", /no universal statutory occupational licence|no universal statutory licence/i, id)
  }
})

test("Japan technology v1 keeps unsupported market and visa components at zero", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,15,0,0,0,3,18/)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,10,0,0,0,3,13/)
  assert.match(migration, /0,0,0,0,12,0,0,0,3,15/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
})

test("Japan technology reuses only reviewed programme mappings with direct preserved", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})

test("Japan technology editorial explains umbrella boundaries", () => {
  assert.match(getOccupationEditorial("software-developer")?.countries.JP?.entryPathway ?? "", /009-01[\s\S]*009-02[\s\S]*009-03[\s\S]*009-99/)
  assert.match(getOccupationEditorial("data-analyst")?.countries.JP?.entryPathway ?? "", /does not publish a standalone Data Analyst code/i)
  assert.match(getOccupationEditorial("cybersecurity-analyst")?.countries.JP?.entryPathway ?? "", /010-04[\s\S]*010-99/)
  assert.match(getOccupationEditorial("cloud-engineer")?.countries.JP?.entryPathway ?? "", /010-02[\s\S]*010-04/)
})
