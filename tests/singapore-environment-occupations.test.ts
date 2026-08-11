import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811144338_singapore_environment_occupations.sql", import.meta.url),
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

test("Singapore environment cohort covers the canonical eight environment careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG
    assert.ok(career, id)
    assert.equal(career.categoryId, "environment", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore environment preserves direct and umbrella SSOC mappings", () => {
  const direct = new Map([
    ["environmental-scientist", "21332"],
    ["agronomist", "21329"],
    ["farm-manager", "13100"],
    ["food-technologist", "21454"],
    ["sustainability-specialist", "21339"],
    ["horticulturist", "21321"],
    ["animal-science-technician", "31423"],
  ])
  for (const [id, code] of direct) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?'${code}','SGD',false`), id)
  }
  assert.match(migration, /'SG:forestry-technician'[\s\S]*?null,'SGD',false/)
  assert.match(migration, /'SG:forestry-technician','31421'/)
  assert.match(migration, /'SG:forestry-technician','31419'/)
  assert.match(migration, /'SG:sustainability-specialist','24214'/)
})

test("Singapore environment keeps professional and technician scopes separate", () => {
  assert.match(getOccupationEditorial("agronomist")?.countries.SG?.entryPathway ?? "", /21329/i)
  assert.match(getOccupationEditorial("horticulturist")?.countries.SG?.entryPathway ?? "", /21321/i)
  assert.match(getOccupationEditorial("forestry-technician")?.countries.SG?.entryPathway ?? "", /31421/i)
  assert.match(getOccupationEditorial("animal-science-technician")?.countries.SG?.entryPathway ?? "", /31423/i)
  assert.match(getOccupationEditorial("animal-science-technician")?.countries.SG?.registration ?? "", /veterinary licensing.*veterinarians|veterinarians.*veterinary licence/i)
})

test("Singapore environment v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,10,0,0,0,5,15",
    "0,0,0,0,12,0,0,0,5,17",
    "0,0,0,0,15,0,0,0,5,20",
  ]) assert.match(migration, new RegExp(score), score)
})

test("Singapore environment reuses only approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
