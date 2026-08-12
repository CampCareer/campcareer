import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811135233_singapore_business_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "accountant",
  "financial-analyst",
  "business-analyst",
  "supply-chain-analyst",
  "human-resources-specialist",
  "marketing-specialist",
  "auditor",
  "project-manager",
] as const

test("Singapore business cohort covers the canonical eight business careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "business", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore business preserves direct and umbrella SSOC boundaries", () => {
  assert.match(migration, /'SG:accountant'[\s\S]*?'24111','SGD',false/)
  assert.match(migration, /'SG:financial-analyst'[\s\S]*?'24131','SGD',false/)
  assert.match(migration, /'SG:business-analyst'[\s\S]*?'24212','SGD',false/)
  assert.match(migration, /'SG:auditor'[\s\S]*?'24112','SGD',false/)

  for (const id of ["supply-chain-analyst", "human-resources-specialist", "marketing-specialist", "project-manager"]) {
    assert.match(migration, new RegExp(`'SG:${id}'[\\s\\S]*?null,'SGD',false`), id)
  }

  for (const code of ["24212", "33461"]) assert.match(migration, new RegExp(`'SG:supply-chain-analyst','${code}'`), code)
  for (const code of ["24231", "24233"]) assert.match(migration, new RegExp(`'SG:human-resources-specialist','${code}'`), code)
  for (const code of ["24312", "24313", "24314"]) assert.match(migration, new RegExp(`'SG:marketing-specialist','${code}'`), code)
  assert.match(migration, /'SG:project-manager','24213'/)
})

test("Singapore business keeps public-accountancy registration narrower than broad accountant and auditor roles", () => {
  assert.match(getOccupationEditorial("accountant")?.countries.SG?.registration ?? "", /general accounting.*does not require|does not require.*Public Accountant/i)
  assert.match(getOccupationEditorial("auditor")?.countries.SG?.registration ?? "", /Public Accountant.*auditing|auditing.*Public Accountant/i)
  assert.match(getOccupationEditorial("auditor")?.countries.SG?.registration ?? "", /Internal auditor|Internal auditor/i)
  assert.match(migration, /ACRA — Public Accountant requirements/)
  assert.match(migration, /ACRA — Audit regulation in Singapore/)
})

test("Singapore business v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,10,0,0,0,4,14",
    "0,0,0,0,10,0,0,0,5,15",
    "0,0,0,0,10,0,0,0,3,13",
    "0,0,0,0,8,0,0,0,5,13",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore business reuses only approved programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
