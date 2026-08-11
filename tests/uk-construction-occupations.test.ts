import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810125750_uk_construction_occupations.sql", import.meta.url),
  "utf8",
)

const constructionCareers = [
  ["carpenter", "5316", 44],
  ["electrician", "5241", 48],
  ["plumber", "5315", 44],
  ["wall-floor-tiler", "5322", 44],
  ["welder", "5213", 54],
  ["bricklayer", "5313", 49],
  ["hvac-technician", "5225", 34],
  ["construction-manager", "2455", 25],
] as const

test("UK Construction cohort covers the canonical eight trades careers", () => {
  for (const [id, soc] of constructionCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "trades")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("UK Construction scoring keeps shortage evidence separate from current visa access", () => {
  const expectedScoreFragments = [
    "'UK:carpenter','2026-08-10',69000,17.13,33400,10,0,0,0,15,4,0,10,5,44",
    "'UK:electrician','2026-08-10',124000,19.90,38800,15,0,0,0,14,6,0,10,3,48",
    "'UK:plumber','2026-08-10',71000,19.54,38100,10,0,0,0,14,6,0,10,4,44",
    "'UK:wall-floor-tiler','2026-08-10',10000,17.13,33400,10,0,0,0,15,4,0,10,5,44",
    "'UK:welder','2026-08-10',46000,17.90,34900,20,0,0,0,15,4,0,10,5,54",
    "'UK:bricklayer','2026-08-10',11000,17.13,33400,15,0,0,0,15,4,0,10,5,49",
    "'UK:hvac-technician','2026-08-10',7000,21.08,41100,0,0,0,0,13,8,0,10,3,34",
    "'UK:construction-manager','2026-08-10',null,22.72,44300,0,0,0,0,6,10,0,5,4,25",
  ]

  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  assert.ok(migration.includes("career-opportunity-uk-v1"))
  assert.ok(migration.includes("SOC 5225 remains on the current Temporary Shortage List"))
  assert.ok(migration.includes("MAC finds no signs of historical shortage and recommends no future TSL access"))
  assert.ok(migration.includes("SOC 2455 is RQF 6+ and eligible under the standard Skilled Worker route"))
})

test("UK Construction visa routing distinguishes TSL, ISL and standard higher-skilled access", () => {
  for (const soc of ["5213", "5225", "5241", "5315", "5322"]) {
    assert.ok(migration.includes(`'${soc}'`))
  }
  assert.ok(migration.includes("UK:carpenter','source','Home Office — Immigration Salary List"))
  assert.ok(migration.includes("UK:bricklayer','source','Home Office — Immigration Salary List"))
  assert.ok(migration.includes("UK:construction-manager','source','Home Office — Appendix Skilled Occupations"))
  assert.ok(migration.includes("31 December 2026"))
})

test("UK Construction publishes official entry routes without fabricating university programme links", () => {
  for (const marker of [
    "Carpentry and Joinery apprenticeship",
    "Installation and Maintenance Electrician apprenticeship",
    "Plumbing and Domestic Heating Technician",
    "Wall and Floor Tiler apprenticeship",
    "Skills England — Welder",
    "Skills England — Bricklayer",
    "Refrigeration Air Conditioning and Heat Pump Engineering Technician",
    "Construction Site Management degree apprenticeship",
  ]) {
    assert.ok(migration.includes(marker))
  }

  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("uk-program:"))
})
