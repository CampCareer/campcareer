import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811112241_singapore_technology_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["software-developer", "25121"],
  ["data-analyst", "21231"],
  ["data-engineer", "25213"],
  ["cybersecurity-analyst", null],
  ["network-administrator", "25220"],
  ["cloud-engineer", "25231"],
  ["database-administrator", "25211"],
  ["ict-support-technician", "35123"],
] as const

test("Singapore technology cohort covers the canonical eight technology careers", () => {
  for (const [id, code] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "technology", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
    if (code) assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Singapore technology preserves direct SSOC codes and the cybersecurity umbrella", () => {
  for (const [id, code] of careers) {
    if (code) assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?'${code}','SGD',false`), id)
  }

  assert.match(migration, /'SG:cybersecurity-analyst'[\s\S]*?null,'SGD',false/)
  for (const code of ["25241", "25243", "25246", "25247", "25249"]) {
    assert.match(migration, new RegExp(`'SG:cybersecurity-analyst','${code}'`), code)
  }

  assert.match(getOccupationEditorial("data-analyst")?.countries.SG?.entryPathway ?? "", /21231/)
  assert.match(getOccupationEditorial("cloud-engineer")?.countries.SG?.entryPathway ?? "", /25231/)
  assert.match(getOccupationEditorial("cloud-engineer")?.countries.SG?.jobMarketNote ?? "", /25125 DevOps engineer/)
  assert.match(getOccupationEditorial("ict-support-technician")?.countries.SG?.entryPathway ?? "", /35123/)
})

test("Singapore technology does not invent universal ICT occupational licensing", () => {
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?'SGD',false`), id)
  }

  const cyber = getOccupationEditorial("cybersecurity-analyst")?.countries.SG
  assert.match(cyber?.registration ?? "", /no universal personal occupational licence/i)
  assert.match(cyber?.registration ?? "", /penetration testing.*managed security operations centre|managed security operations centre.*penetration testing/i)
  assert.match(migration, /CSA Cybersecurity Act and service-provider licensing/)
})

test("Singapore technology v1 keeps unsupported market and visa components at zero", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)

  for (const score of [
    "0,0,0,0,15,0,0,0,3,18",
    "0,0,0,0,10,0,0,0,5,15",
    "0,0,0,0,10,0,0,0,3,13",
    "0,0,0,0,12,0,0,0,3,15",
    "0,0,0,0,15,0,0,0,5,20",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore technology reuses only approved programme mappings with stable SG refs", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)

  const cyber = getOccupationEditorial("cybersecurity-analyst")?.countries.SG
  assert.match(cyber?.entryPathway ?? "", /Two approved Singapore Information Security programmes.*direct academic pathways/i)
  const software = getOccupationEditorial("software-developer")?.countries.SG
  assert.match(software?.entryPathway ?? "", /Fifteen approved Singapore programmes.*related study pathways/i)
})
