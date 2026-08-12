import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810170101_korea_environment_occupations.sql", import.meta.url),
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

test("Korea environment cohort covers the canonical eight environment careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "environment", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'`), id)
  }
})

test("Korea environment keeps broad KECO mappings explicit", () => {
  assert.match(migration, /environmental-scientist'[\s\S]*'1221'/)
  assert.match(migration, /agronomist'[\s\S]*'1221'/)
  assert.match(migration, /farm-manager'[\s\S]*'KECO','2025',null/)
  assert.match(migration, /forestry-technician'[\s\S]*'1223'/)
  assert.match(migration, /food-technologist'[\s\S]*'1571'/)
  assert.match(migration, /sustainability-specialist'[\s\S]*'1555'/)
  assert.match(migration, /horticulturist'[\s\S]*'9014'/)
  assert.match(migration, /animal-science-technician'[\s\S]*'1223'/)
  assert.match(getOccupationEditorial("farm-manager")?.countries.KR?.entryPathway ?? "", /does not publish one generic Farm Manager/i)
  assert.match(getOccupationEditorial("sustainability-specialist")?.countries.KR?.entryPathway ?? "", /no standalone Sustainability Specialist/i)
})

test("Korea environment preserves qualification boundaries", () => {
  for (const id of careers) {
    assert.match(migration, new RegExp(`'KR:${id}'.*false`, "s"), id)
  }
  assert.match(migration, /산림기술 진흥 및 관리에 관한 법률/)
  assert.match(getOccupationEditorial("forestry-technician")?.countries.KR?.registration ?? "", /산림기술자/)
  assert.match(getOccupationEditorial("animal-science-technician")?.countries.KR?.entryPathway ?? "", /Veterinary diagnosis and clinical animal care are excluded/i)
})

test("Korea environment v1 remains evidence-conservative and reuses reviewed programmes", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /from public\.program_occupation_kr_v1/)
  assert.match(migration, /case when m\.relation_type='direct' then 'direct' else 'related' end/)
  assert.match(migration, /Production-specific farmer codes are not aggregated/)
})
