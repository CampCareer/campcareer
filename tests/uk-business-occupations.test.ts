import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profileMigration = readFileSync(
  new URL("../supabase/migrations/20260810170407_uk_business_occupations.sql", import.meta.url),
  "utf8",
)
const linkMigration = readFileSync(
  new URL("../supabase/migrations/20260810171022_uk_business_links_and_programs.sql", import.meta.url),
  "utf8",
)
const migration = `${profileMigration}\n${linkMigration}`

const businessCareers = [
  ["accountant", "2421", 31],
  ["financial-analyst", "2422", 28],
  ["business-analyst", "2431", 32],
  ["supply-chain-analyst", "3551", 26],
  ["human-resources-specialist", "3571", 34],
  ["marketing-specialist", "3554", 34],
  ["auditor", "2421", 24],
  ["project-manager", "2440", 32],
] as const

test("UK Business cohort covers the canonical eight business careers", () => {
  for (const [id, soc] of businessCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "business")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("UK Business opportunity scores preserve salary, route and burden distinctions", () => {
  const expectedScoreFragments = [
    "'UK:accountant','2026-08-10',null,25.23,49200,0,0,0,0,12,10,0,5,4,31",
    "'UK:financial-analyst','2026-08-10',null,23.49,45800,0,0,0,0,8,10,0,5,5,28",
    "'UK:business-analyst','2026-08-10',null,25.74,50200,0,0,0,0,12,10,0,5,5,32",
    "'UK:supply-chain-analyst','2026-08-10',null,18.21,35500,0,0,0,0,12,6,0,3,5,26",
    "'UK:human-resources-specialist','2026-08-10',null,17.13,33400,0,0,0,0,15,4,0,10,5,34",
    "'UK:marketing-specialist','2026-08-10',180000,17.13,33400,0,0,0,0,15,4,0,10,5,34",
    "'UK:auditor','2026-08-10',null,25.23,49200,0,0,0,0,8,10,0,5,1,24",
    "'UK:project-manager','2026-08-10',null,28.97,56500,0,0,0,0,12,10,0,5,5,32",
  ]

  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))
  assert.ok(migration.includes("career-opportunity-uk-v1"))
})

test("UK Business scopes professional and associate roles without borrowing neighbouring visa treatment", () => {
  assert.ok(migration.includes("'UK:accountant','2421/02'"))
  assert.ok(migration.includes("'UK:financial-analyst','2422/03'"))
  assert.ok(migration.includes("'UK:business-analyst','2431/01'"))
  assert.ok(!migration.includes("'UK:business-analyst','3549/02'"))
  assert.ok(migration.includes("excludes TSL-listed 3549/02 Business systems analysts"))
  assert.ok(migration.includes("'UK:supply-chain-analyst','3551'"))
  assert.ok(migration.includes("'UK:human-resources-specialist','3571/02'"))
  assert.ok(migration.includes("'UK:marketing-specialist','3554/01'"))
  assert.ok(migration.includes("'UK:project-manager','2440'"))
})

test("UK Business keeps current TSL access separate from shortage evidence", () => {
  assert.ok(migration.includes("SOC 3571 / 3571/02 HR adviser-specialist scope"))
  assert.ok(migration.includes("Current Temporary Shortage List access"))
  assert.ok(migration.includes("MAC July 2026 recommends no future TSL access"))
  assert.ok(migration.includes("historical evidence points away from shortage"))
  assert.ok(migration.includes("SOC 3551 is not on current TSL"))
})

test("UK Auditor records statutory-audit regulation while other generic business roles remain unlicensed", () => {
  assert.ok(migration.includes("Financial Reporting Council / recognised supervisory bodies"))
  assert.ok(migration.includes("become-a-registered-auditor"))
  assert.ok(migration.includes("Statutory audit requires qualification, experience and recognised supervisory-body registration"))
})

test("UK Business publishes only the verified canonical programme links selected for this cohort", () => {
  const programRefs = migration.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 15)

  for (const marker of [
    "uk-program:4185972b-fe61-ea99-0bab-056da05d9e19",
    "uk-program:b3439615-4e49-5714-7b2b-7bd8ac662bc4",
    "uk-program:4ade9971-52f4-af52-718b-aa0d9ce785b5",
    "uk-program:28523c4e-d9d5-fc17-6285-31d09babbd46",
    "uk-program:f5701f63-9582-631e-27ce-5332b4eb20c1",
    "uk-program:f46f5099-e367-d3d6-3bee-05b478a1c1ac",
    "uk-program:7e7dadd5-1276-1c94-b15f-87a34a9d4669",
  ]) {
    assert.ok(migration.includes(marker))
  }
})
