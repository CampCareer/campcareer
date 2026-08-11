import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810134122_uk_technology_occupations.sql", import.meta.url),
  "utf8",
)

const technologyCareers = [
  ["software-developer", "2134", 37],
  ["data-analyst", "3544", 41],
  ["data-engineer", "2133", 35],
  ["cybersecurity-analyst", "2135", 38],
  ["network-administrator", "3131", 33],
  ["cloud-engineer", "2139", 37],
  ["database-administrator", "3133", 41],
  ["ict-support-technician", "3132", 34],
] as const

test("UK Technology cohort covers the canonical eight technology careers", () => {
  for (const [id, soc] of technologyCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "technology")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("UK Technology scoring separates targeted TSL access from standard Skilled Worker routes", () => {
  const expectedScoreFragments = [
    "'UK:software-developer','2026-08-10',null,28.05,54700,5,0,0,0,12,10,0,5,5,37",
    "'UK:data-analyst','2026-08-10',89000,17.90,34900,10,0,0,0,12,4,0,10,5,41",
    "'UK:data-engineer','2026-08-10',null,28.15,54900,5,0,0,0,10,10,0,5,5,35",
    "'UK:cybersecurity-analyst','2026-08-10',null,24.87,48500,5,0,0,0,13,10,0,5,5,38",
    "'UK:network-administrator','2026-08-10',null,18.05,35200,0,0,0,0,12,6,0,10,5,33",
    "'UK:cloud-engineer','2026-08-10',null,26.82,52300,5,0,0,0,12,10,0,5,5,37",
    "'UK:database-administrator','2026-08-10',46000,17.74,34600,10,0,0,0,12,4,0,10,5,41",
    "'UK:ict-support-technician','2026-08-10',null,17.13,33400,0,0,0,0,15,4,0,10,5,34",
  ]

  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  for (const soc of ["3544", "3131", "3132", "3133"]) {
    assert.ok(migration.includes(`SOC ${soc} remains on the current Temporary Shortage List`) || migration.includes(`SOC ${soc} is on the current Temporary Shortage List`))
  }

  for (const soc of ["2133", "2134", "2135", "2139"]) {
    assert.ok(migration.includes(`SOC ${soc} is RQF 6+ and eligible for the standard Skilled Worker route`))
  }

  assert.ok(migration.includes("career-opportunity-uk-v1"))
  assert.ok(migration.includes("does not publish an occupation-specific recommendation for 3131"))
  assert.ok(migration.includes("no occupation-specific final recommendation is published in the July 2026 MAC report"))
})

test("UK Technology preserves narrow SOC sub-unit scopes for overlapping careers", () => {
  assert.ok(migration.includes("'2133/03','Data engineers'"))
  assert.ok(migration.includes("'3131/02','Network and systems administrators'"))
  assert.ok(migration.includes("'2139/01','DevOps engineers — cloud-infrastructure scope'"))
  assert.ok(migration.includes("'3133/01','Database administrators'"))
  assert.ok(migration.includes("avoiding overlap with professional IT network SOC 2137"))
})

test("UK Technology publishes only reviewed canonical programme links", () => {
  const expectedPrograms = [
    ["UK:software-developer", "uk-program:7e7dadd5-1276-1c94-b15f-87a34a9d4669", "direct"],
    ["UK:software-developer", "uk-program:ea1cf170-e21a-d447-c259-295cd403c42e", "direct"],
    ["UK:data-analyst", "uk-program:9a394047-6595-e613-16d1-b000ef51b69e", "direct"],
    ["UK:data-analyst", "uk-program:3e9b3e10-9e9b-b5f1-88e3-580653c897fb", "direct"],
    ["UK:data-engineer", "uk-program:b44ad204-2620-1121-ca0a-61eb9b2f9767", "related"],
    ["UK:cybersecurity-analyst", "uk-program:54dc68b7-c18f-c42d-e343-1e2bfe0d853f", "direct"],
    ["UK:cybersecurity-analyst", "uk-program:24ece78f-f68e-66f4-f2ad-8e0d7c40fb30", "direct"],
    ["UK:network-administrator", "uk-program:d36c0912-f64d-fba2-d965-ac0a2607c83b", "direct"],
    ["UK:cloud-engineer", "uk-program:0abefb6e-bd26-be4f-462a-d9bbfe29b688", "direct"],
    ["UK:database-administrator", "uk-program:565132ac-b9c7-6c6f-0979-ff92b8029e20", "direct"],
    ["UK:ict-support-technician", "uk-program:258710e8-84d2-55ce-30c9-94c34f8db43c", "direct"],
  ] as const

  for (const [profile, program, relation] of expectedPrograms) {
    assert.ok(migration.includes(`'${profile}','${program}','${relation}'`))
  }

  assert.equal((migration.match(/uk-program:/g) ?? []).length, 11)
  assert.ok(!migration.includes("'closed'"))
})
