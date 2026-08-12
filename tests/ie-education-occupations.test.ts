import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811022546_ie_education_occupations.sql", import.meta.url),
  "utf8",
)
const sourceUrlFix = readFileSync(
  new URL("../supabase/migrations/20260811022640_ie_education_source_url_fix.sql", import.meta.url),
  "utf8",
)

const educationCareers = [
  ["early-childhood-teacher", "2315", 18],
  ["primary-school-teacher", "2315", 15],
  ["secondary-school-teacher", "2314", 27],
  ["special-education-teacher", "2316", 20],
  ["social-worker", "2442", 19],
  ["youth-worker", "3231", 17],
  ["community-worker", "3231", 17],
  ["counsellor", "3235", 13],
] as const

test("Ireland Education covers the canonical eight education careers", () => {
  for (const [id, soc] of educationCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "education")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Education preserves the intended SOC 2010 scopes", () => {
  for (const marker of [
    "'IE:early-childhood-teacher','IE','early-childhood-teacher','Primary and nursery education teaching professionals — nursery / early-childhood teacher scope','SOC','SOC 2010','2315'",
    "'IE:primary-school-teacher','IE','primary-school-teacher','Primary and nursery education teaching professionals — primary-school teacher scope','SOC','SOC 2010','2315'",
    "'IE:secondary-school-teacher','IE','secondary-school-teacher','Secondary education teaching professionals','SOC','SOC 2010','2314'",
    "'IE:special-education-teacher','IE','special-education-teacher','Special needs education teaching professionals','SOC','SOC 2010','2316'",
    "'IE:social-worker','IE','social-worker','Social workers','SOC','SOC 2010','2442'",
    "'IE:youth-worker','IE','youth-worker','Youth and community workers — youth-work scope','SOC','SOC 2010','3231'",
    "'IE:community-worker','IE','community-worker','Youth and community workers — community-work scope','SOC','SOC 2010','3231'",
    "'IE:counsellor','IE','counsellor','Counsellors','SOC','SOC 2010','3235'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("Child and early years officers (3233), nursery nurses/assistants (6121)"))
  assert.ok(migration.includes("Family Support Worker disability-services exceptions"))
})

test("Ireland Education keeps shortage scoring bounded to direct evidence", () => {
  for (const [id, , score] of educationCareers) {
    assert.ok(migration.includes(`'IE:${id}','2026-08-11'`))
    assert.ok(migration.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }

  const secondaryRow = migration.split("\n").find((line) => line.includes("('IE:secondary-school-teacher','2026-08-11'"))
  const specialRow = migration.split("\n").find((line) => line.includes("('IE:special-education-teacher','2026-08-11'"))
  assert.ok(secondaryRow)
  assert.ok(specialRow)
  assert.match(secondaryRow, /'2026-08-11',null,null,null,12,0,0,0,/)
  assert.match(specialRow, /'2026-08-11',null,null,null,5,0,0,0,/)

  for (const id of ["early-childhood-teacher", "primary-school-teacher", "social-worker", "youth-worker", "community-worker", "counsellor"]) {
    const row = migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
    assert.ok(row, `${id} metric row must exist`)
    assert.match(row, /'2026-08-11',null,null,null,0,0,0,0,/)
  }

  assert.ok(migration.includes("subject-specific secondary teachers as a shortage"))
  assert.ok(migration.includes("CSEP eligibility is kept in the visa component rather than double-counted as shortage"))
})

test("Ireland Education separates CSEP, GEP and ineligible permit scopes", () => {
  assert.ok(migration.includes("Social Worker SOC 2442 is explicitly on the current Critical Skills Occupations List"))
  assert.ok(migration.includes("SOC 3231 Youth and community workers is on the current Ineligible List"))
  assert.ok(migration.includes("SOC 3235 Counsellors is on the current Ineligible List"))
  assert.ok(migration.includes("SOC 2314 is not explicitly on the current CSEP or Ineligible lists; ordinary GEP access may apply"))
  assert.ok(migration.includes("early-years duties can instead fall under permit-ineligible SOC 3233 or 6121"))

  for (const id of ["youth-worker", "community-worker", "counsellor"]) {
    const row = migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
    assert.ok(row)
    assert.match(row, /,0,5,1[37],'career-opportunity-ie-v1'/)
  }
})

test("Ireland Education preserves current registration boundaries", () => {
  for (const id of ["primary-school-teacher", "secondary-school-teacher", "special-education-teacher", "social-worker"]) {
    const profileRow = migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
    assert.ok(profileRow)
    assert.ok(profileRow.includes("'EUR',true"), `${id} must be registration-required`)
  }

  for (const id of ["early-childhood-teacher", "youth-worker", "community-worker", "counsellor"]) {
    const profileRow = migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
    assert.ok(profileRow)
    assert.ok(profileRow.includes("'EUR',false"), `${id} must not be marked registration-required`)
  }

  assert.ok(migration.includes("the counsellor and psychotherapist registers are not yet open"))
  assert.ok(migration.includes("there is no separate statutory Special Education Teacher licence"))
})

test("Ireland Education exposes only verified official entry routes", () => {
  for (const marker of [
    "DCDE — recognition of an Early Years qualification",
    "Teaching Council — Primary teacher registration route",
    "Teaching Council — Post-primary teacher registration route",
    "Teaching Council — teacher registration framework",
    "CORU — Social Workers Registration Board approved qualification framework",
    "SOLAS — Youth Work traineeship",
    "SOLAS — Social and Community Care / Youth Work traineeship routes",
  ]) assert.ok(migration.includes(marker))

  assert.ok(!migration.includes("IE:counsellor','entry_program'"))
})

test("Ireland Education keeps programme publication gated and records the source URL correction", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
  assert.ok(sourceUrlFix.includes("IE:primary-school-teacher"))
  assert.ok(sourceUrlFix.includes("employment-permits/employment-permit-eligibility/classification-of-employments/"))
})
