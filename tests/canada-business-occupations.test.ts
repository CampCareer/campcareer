import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810120000_canada_business_occupations.sql", import.meta.url),
  "utf8",
)

const businessCareers = [
  ["accountant", "11100", 24],
  ["financial-analyst", "11101", 22],
  ["business-analyst", "11201", 25],
  ["supply-chain-analyst", "11201", 25],
  ["human-resources-specialist", "11200", 25],
  ["marketing-specialist", "11202", 25],
  ["auditor", "11100", 20],
  ["project-manager", "11201/13100", 13],
] as const

test("Canada Business cohort covers the canonical eight careers", () => {
  for (const [id, noc] of businessCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "business")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Business scoring keeps balance, visa and multi-NOC evidence conservative", () => {
  const expectedScoreFragments = [
    "'CA:accountant','2025-11-19',null,40.36,0,0,0,0,10,10,0,0,4,24",
    "'CA:financial-analyst','2025-11-19',77000,43.27,0,0,0,0,8,10,0,0,4,22",
    "'CA:business-analyst','2025-11-19',null,44.10,0,0,0,0,10,10,0,0,5,25",
    "'CA:supply-chain-analyst','2025-11-19',null,44.10,0,0,0,0,10,10,0,0,5,25",
    "'CA:human-resources-specialist','2025-11-19',126700,40.87,0,0,0,0,10,10,0,0,5,25",
    "'CA:marketing-specialist','2025-11-19',null,35.58,0,0,0,0,12,8,0,0,5,25",
    "'CA:auditor','2025-11-19',null,40.36,0,0,0,0,6,10,0,0,4,20",
    "'CA:project-manager','2025-11-19',null,null,0,0,0,0,8,0,0,0,5,13",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  for (const noc of ["11100", "11101", "11200", "11201", "11202", "13100"]) {
    assert.ok(migration.includes(`'${noc}'`))
  }
  assert.ok(!migration.includes("null,true,true"), "Business cohort should not claim occupation-category visa eligibility")
})

test("Canada Business programme links use reviewed publication-safe relations", () => {
  const expectedLinks = [
    "'CA:accountant','ca-program:18','direct'",
    "'CA:financial-analyst','ca-program:287','related'",
    "'CA:business-analyst','ca-program:127','direct'",
    "'CA:supply-chain-analyst','ca-program:256','related'",
    "'CA:human-resources-specialist','ca-program:243','direct'",
    "'CA:marketing-specialist','ca-program:306','direct'",
    "'CA:auditor','ca-program:1324','direct'",
    "'CA:project-manager','ca-program:234','related'",
  ]
  for (const fragment of expectedLinks) assert.ok(migration.includes(fragment))
  assert.ok(!migration.includes("'common_pathway'"))
})
