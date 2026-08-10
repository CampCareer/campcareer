import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810210312_japan_business_occupations.sql", import.meta.url),
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

test("Japan business cohort covers the canonical eight business careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "business", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan business preserves direct codes and honest umbrellas", () => {
  assert.match(migration, /'JP:accountant'.*'038-03','JPY',false/s)
  assert.match(migration, /'JP:financial-analyst'.*'013-99','JPY',false/s)
  assert.match(migration, /'JP:human-resources-specialist'.*'033-02','JPY',false/s)
  assert.match(migration, /'JP:marketing-specialist'.*'033-03','JPY',false/s)

  for (const id of ["business-analyst", "supply-chain-analyst", "auditor", "project-manager"]) {
    assert.match(migration, new RegExp(`'JP:${id}'.*null,'JPY',false`, "s"), id)
  }

  assert.match(migration, /'JP:business-analyst','013-99'/)
  assert.match(migration, /'JP:business-analyst','033-03'/)
  assert.match(migration, /'JP:supply-chain-analyst','039-01'/)
  assert.match(migration, /'JP:supply-chain-analyst','039-02'/)
  assert.match(migration, /'JP:auditor','013-01'/)
  assert.match(migration, /'JP:auditor','033-01'/)
  assert.match(migration, /'JP:project-manager','010-03'/)
  assert.match(migration, /'JP:project-manager','035-99'/)
})

test("Japan auditor separates CPA external audit from internal audit", () => {
  const editorial = getOccupationEditorial("auditor")?.countries.JP
  assert.match(editorial?.registration ?? "", /公認会計士/i)
  assert.match(editorial?.registration ?? "", /Internal auditors/i)
  assert.match(migration, /FSA — CPA and audit system/)
  assert.match(migration, /CPAAOB — CPA registration requirements/)
  assert.match(migration, /'JP:auditor'.*'JPY',false/s)
})

test("Japan business v1 keeps unsupported market and visa components at zero", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,10,0,0,0,2,12/)
  assert.match(migration, /0,0,0,0,10,0,0,0,3,13/)
})

test("Japan business reuses only reviewed programme mappings with direct preserved", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})

test("Japan business editorial documents key classification boundaries", () => {
  assert.match(getOccupationEditorial("accountant")?.countries.JP?.registration ?? "", /038-03.*013-01/s)
  assert.match(getOccupationEditorial("business-analyst")?.countries.JP?.entryPathway ?? "", /013-99.*033-03/s)
  assert.match(getOccupationEditorial("supply-chain-analyst")?.countries.JP?.entryPathway ?? "", /033-03.*039-01.*039-02/s)
  assert.match(getOccupationEditorial("project-manager")?.countries.JP?.entryPathway ?? "", /010-03.*035-99/s)
})
