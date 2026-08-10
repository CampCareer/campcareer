import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810164152_uk_engineering_occupations.sql", import.meta.url),
  "utf8",
)

const engineeringCareers = [
  ["civil-engineer", "2121", 38],
  ["mechanical-engineer", "2122", 38],
  ["electrical-engineer", "2123", 43],
  ["manufacturing-engineer", "2125", 33],
  ["industrial-engineer", "2125", 33],
  ["chemical-engineer", "2125", 33],
  ["environmental-engineer", "2152", 24],
  ["engineering-technician", "3113", 48],
] as const

test("UK Engineering cohort covers the canonical eight engineering careers", () => {
  for (const [id, soc] of engineeringCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "engineering")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("UK Engineering opportunity scores preserve standard versus targeted visa access", () => {
  const expectedScoreFragments = [
    "'UK:civil-engineer','2026-08-10',null,25.85,50400,10,0,0,0,8,10,0,5,5,38",
    "'UK:mechanical-engineer','2026-08-10',null,24.00,46800,10,0,0,0,8,10,0,5,5,38",
    "'UK:electrical-engineer','2026-08-10',null,30.10,58700,15,0,0,0,8,10,0,5,5,43",
    "'UK:manufacturing-engineer','2026-08-10',null,23.08,45000,5,0,0,0,8,10,0,5,5,33",
    "'UK:industrial-engineer','2026-08-10',null,23.08,45000,5,0,0,0,8,10,0,5,5,33",
    "'UK:chemical-engineer','2026-08-10',null,23.08,45000,5,0,0,0,8,10,0,5,5,33",
    "'UK:environmental-engineer','2026-08-10',null,19.08,37200,0,0,0,0,8,6,0,5,5,24",
    "'UK:engineering-technician','2026-08-10',100000,21.79,42500,10,0,0,0,15,8,0,10,5,48",
  ]

  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))
  assert.ok(migration.includes("career-opportunity-uk-v1"))
  assert.ok(migration.includes("SOC 3113 is on the current Temporary Shortage List"))
  assert.ok(migration.includes("recommends 18-month TSL access"))
})

test("UK Engineering scopes overlapping SOC groups to distinct sub-units", () => {
  assert.ok(migration.includes("'UK:manufacturing-engineer','2125/99'"))
  assert.ok(migration.includes("'UK:industrial-engineer','2125/03'"))
  assert.ok(migration.includes("'UK:chemical-engineer','2125/01'"))
  assert.ok(migration.includes("'UK:environmental-engineer','2152/02'"))
  assert.ok(migration.includes("Environmental and geo-environmental engineers"))
  assert.ok(migration.includes("not Engineering professionals n.e.c."))
  assert.ok(!migration.includes("'UK:environmental-engineer','2129'"))
})

test("UK Engineering publishes verified programme pathways without fabricating technician programmes", () => {
  const programRefs = migration.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 17)

  for (const marker of [
    "uk-program:85d29a01-c9a1-9d2d-2d54-23089c6b4f36",
    "uk-program:9f500856-212f-26e5-7e36-9c5deeedf78d",
    "uk-program:4ba56864-f928-c029-c39d-54e39bb60547",
    "uk-program:614cf66c-1a6b-4642-b2c4-8336cf3daf41",
    "uk-program:7823d655-a620-df4d-319e-727e8f5b270d",
    "uk-program:052356c4-ed40-f04a-a636-ded8c42a7529",
  ]) {
    assert.ok(migration.includes(marker))
  }

  assert.ok(migration.includes("UK:engineering-technician','entry_program','Skills England — Engineering Technician"))
  assert.ok(!migration.includes("UK:engineering-technician','uk-program:"))
})
