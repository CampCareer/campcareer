import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810130000_canada_education_social_occupations.sql", import.meta.url),
  "utf8",
)

const educationSocialCareers = [
  ["early-childhood-teacher", "42202", 50],
  ["primary-school-teacher", "41221", 49],
  ["secondary-school-teacher", "41220", 49],
  ["special-education-teacher", "41220/41221", 36],
  ["social-worker", "41300", 52],
  ["youth-worker", "42201", 53],
  ["community-worker", "42201", 53],
  ["counsellor", "41301", 43],
] as const

test("Canada Education and Social cohort covers the canonical eight careers", () => {
  for (const [id, noc] of educationSocialCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "education")
    assert.ok(editorial?.countries.CA, `${id} must have Canada editorial content`)
    assert.ok(migration.includes(`'${id}'`))
    assert.ok(migration.includes(`'${noc}'`))
  }
})

test("Canada Education and Social scoring uses current shortage and category eligibility conservatively", () => {
  const expectedScoreFragments = [
    "'CA:early-childhood-teacher','2025-11-19',null,22.30,20,0,0,0,15,2,0,10,3,50",
    "'CA:primary-school-teacher','2025-11-19',null,43.27,15,0,0,0,12,10,0,10,2,49",
    "'CA:secondary-school-teacher','2025-11-19',null,45.67,15,0,0,0,12,10,0,10,2,49",
    "'CA:special-education-teacher','2025-11-19',null,null,15,0,0,0,10,0,0,10,1,36",
    "'CA:social-worker','2025-11-19',null,38.46,20,0,0,0,12,8,0,10,2,52",
    "'CA:youth-worker','2025-11-19',null,26.00,20,0,0,0,15,4,0,10,4,53",
    "'CA:community-worker','2025-11-19',null,26.00,20,0,0,0,15,4,0,10,4,53",
    "'CA:counsellor','2025-11-19',null,34.00,15,0,0,0,10,6,0,10,2,43",
  ]
  for (const fragment of expectedScoreFragments) assert.ok(migration.includes(fragment))

  for (const noc of ["42202", "41221", "41220", "41300", "42201", "41301"]) {
    assert.ok(migration.includes(`'${noc}'`))
  }
  assert.ok(migration.includes("'CA:special-education-teacher','41220'"))
  assert.ok(migration.includes("'CA:special-education-teacher','41221'"))
  assert.ok(!migration.includes("'CA:special-education-teacher','42203'"))
})

test("Canada Education and Social programme links distinguish direct qualification routes from related progression", () => {
  for (const programRef of [
    "ca-program:1178",
    "ca-program:1413",
    "ca-program:6581",
    "ca-program:6536",
    "ca-program:5925",
    "ca-program:4084",
    "ca-program:2080",
    "ca-program:2084",
    "ca-program:1293",
    "ca-program:1545",
    "ca-program:4397",
  ]) {
    assert.ok(migration.includes(programRef))
  }
  assert.ok(migration.includes("'CA:special-education-teacher','ca-program:5925','related'"))
  assert.ok(migration.includes("'CA:social-worker','ca-program:4084','related'"))
})
