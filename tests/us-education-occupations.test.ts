import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260812000200_us_education_occupations.sql", import.meta.url),
  "utf8",
)

const educationCareers = [
  ["early-childhood-teacher", "25-2011", 22],
  ["primary-school-teacher", "25-2021", 19],
  ["secondary-school-teacher", "25-2031", 19],
  ["special-education-teacher", "25-2050", 19],
  ["social-worker", "21-1020", 25],
  ["youth-worker", "21-1093", 29],
  ["community-worker", "21-1093", 29],
  ["counsellor", "21-1018", 25],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.startsWith(`  ('US:${id}','2026-08-12'`))
}

test("US Education covers the canonical eight education careers", () => {
  assert.equal(educationCareers.length, 8)
  for (const [id, soc] of educationCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "education")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Education preserves exact scopes, aggregates and declared proxies", () => {
  for (const marker of [
    "'US:early-childhood-teacher','US','early-childhood-teacher','Preschool Teachers, Except Special Education','SOC','SOC 2018','25-2011'",
    "'US:primary-school-teacher','US','primary-school-teacher','Elementary School Teachers, Except Special Education','SOC','SOC 2018','25-2021'",
    "'US:secondary-school-teacher','US','secondary-school-teacher','Secondary School Teachers, Except Special and Career/Technical Education','SOC','SOC 2018','25-2031'",
    "'US:special-education-teacher','US','special-education-teacher','Special Education Teachers — BLS aggregate','SOC','SOC 2018','25-2050'",
    "'US:social-worker','US','social-worker','Social Workers — BLS aggregate','SOC','SOC 2018','21-1020'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("Social and Human Service Assistants — youth-support proxy"))
  assert.ok(migration.includes("Social and Human Service Assistants — community-support proxy"))
  assert.ok(migration.includes("Mental Health Counselors — counselling proxy") || migration.includes("Mental Health Counselors — counselling proxy".replace("Mental Health Counselors", "Substance Abuse, Behavioral Disorder, and Mental Health Counselors")))
  assert.ok(migration.includes("Community Worker is broader than Community Health Worker"))
})

test("US Education stores BLS 2024 employment, pay and 2024-2034 projections", () => {
  const expected = [
    ["early-childhood-teacher", 555100, 37120, "4 percent"],
    ["primary-school-teacher", 1422700, 62340, "2 percent decline"],
    ["secondary-school-teacher", 1094500, 64580, "2 percent decline"],
    ["special-education-teacher", 559500, 64270, "decline 1 percent"],
    ["social-worker", 810900, 61330, "6 percent"],
    ["youth-worker", 449600, 45120, "6 percent"],
    ["community-worker", 449600, 45120, "6 percent"],
    ["counsellor", 483500, 59190, "17 percent"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-12',${employment},null,${salary}`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Education locks US v1 scores without inventing shortage status", () => {
  const expectedRows: Record<string, RegExp> = {
    "early-childhood-teacher": /555100,null,37120,0,0,0,0,10,2,5,2,3,22/,
    "primary-school-teacher": /1422700,null,62340,0,0,0,0,6,6,0,5,2,19/,
    "secondary-school-teacher": /1094500,null,64580,0,0,0,0,6,6,0,5,2,19/,
    "special-education-teacher": /559500,null,64270,0,0,0,0,6,6,0,5,2,19/,
    "social-worker": /810900,null,61330,0,0,0,0,6,6,5,5,3,25/,
    "youth-worker": /449600,null,45120,0,0,0,0,15,2,5,2,5,29/,
    "community-worker": /449600,null,45120,0,0,0,0,15,2,5,2,5,29/,
    counsellor: /483500,null,59190,0,0,0,0,4,4,10,5,2,25/,
  }

  for (const [id, , score] of educationCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
  assert.ok(migration.includes("not a formal federal shortage designation"))
})

test("US Education keeps teaching, social-work and counselling licensing conditional by setting and state", () => {
  assert.ok(migration.includes("Public-school preschool teachers must be state-licensed"))
  assert.ok(migration.includes("All states require public-school elementary teachers to be licensed or certified"))
  assert.ok(migration.includes("All states require public-school special-education teachers to be licensed"))
  assert.ok(migration.includes("All states license clinical social workers"))
  assert.ok(migration.includes("Licensure varies by counseling specialty and state"))

  const profileRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'USD',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
})

test("US Education publishes official evidence and only reviewed Tier A programme relations", () => {
  const sourceRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'source'"))
  assert.equal(sourceRows.length, 24)

  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("uw-basw-social-welfare"))
  assert.equal(programmeRows.length, 3)
  assert.ok(migration.includes("('US:social-worker','uw-basw-social-welfare','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:youth-worker','uw-basw-social-welfare','related','2026-08-12')"))
  assert.ok(migration.includes("('US:community-worker','uw-basw-social-welfare','related','2026-08-12')"))
  assert.ok(!migration.includes("('US:counsellor','uw-basw-social-welfare'"))
})
