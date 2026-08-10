import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810130041_korea_health_occupations.sql", import.meta.url),
  "utf8",
)

const healthCareers = [
  ["registered-nurse", "3040"],
  ["midwife", "3040"],
  ["care-worker", "5501"],
  ["physiotherapist", "3065"],
  ["medical-laboratory-technician", "3061"],
  ["radiographer", "3062"],
  ["pharmacist", "3031"],
  ["occupational-therapist", "3065"],
] as const

test("Korea Health cohort covers the canonical eight careers", () => {
  for (const [id, code] of healthCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR
    assert.ok(career, id)
    assert.equal(career.categoryId, "health", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
  }
})

test("Korea Health preserves licensed entry requirements", () => {
  for (const [id] of healthCareers) {
    assert.match(migration, new RegExp(`'KR:${id}'.*'KRW',true`, "s"), `${id} must require registration`)
  }
  assert.match(getOccupationEditorial("registered-nurse")?.countries.KR?.registration ?? "", /licence is mandatory/i)
  assert.match(getOccupationEditorial("midwife")?.countries.KR?.entryPathway ?? "", /existing nursing licence/i)
  assert.match(getOccupationEditorial("care-worker")?.countries.KR?.registration ?? "", /qualification certificate/i)
  assert.match(getOccupationEditorial("pharmacist")?.countries.KR?.registration ?? "", /title is protected/i)
})

test("Korea Health keeps shared KECO groups scoped to the canonical profession", () => {
  assert.match(getOccupationEditorial("midwife")?.countries.KR?.entryPathway ?? "", /broader 3040/i)
  assert.match(getOccupationEditorial("physiotherapist")?.countries.KR?.entryPathway ?? "", /3065.*restricted.*물리치료사/i)
  assert.match(getOccupationEditorial("occupational-therapist")?.countries.KR?.entryPathway ?? "", /3065.*restricted.*작업치료사/i)
  assert.match(migration, /'KR:pharmacist'.*'3031'/s)
  assert.doesNotMatch(migration, /'KR:pharmacist'.*'3030'/s)
})

test("Korea Health v1 does not fabricate labour-market or visa scoring", () => {
  for (const fragment of [
    "'KR:registered-nurse','2026-08-10',0,0,0,0,13,0,0,0,2,15",
    "'KR:midwife','2026-08-10',0,0,0,0,3,0,0,0,1,4",
    "'KR:care-worker','2026-08-10',0,0,0,0,15,0,0,0,4,19",
    "'KR:physiotherapist','2026-08-10',0,0,0,0,12,0,0,0,2,14",
    "'KR:pharmacist','2026-08-10',0,0,0,0,8,0,0,0,1,9",
  ]) assert.ok(migration.includes(fragment))

  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
})

test("Korea Health reuses reviewed programme mappings without promoting related study", () => {
  assert.match(migration, /studyinkorea:100070:bachelor:nursing','direct'/)
  assert.match(migration, /studyinkorea:100115:bachelor:physical-therapy','direct'/)
  assert.match(migration, /studyinkorea:100115:bachelor:clinical-laboratory-science','direct'/)
  assert.match(migration, /studyinkorea:100140:bachelor:radiological-science','direct'/)
  assert.match(migration, /studyinkorea:100190:bachelor:pharmacy-six-year','direct'/)
  assert.match(migration, /studyinkorea:100140:bachelor:occupational-therapy','direct'/)
  assert.match(migration, /studyinkorea:100215:bachelor:social-welfare','related'/)
  assert.doesNotMatch(migration, /'KR:midwife','studyinkorea:/)
})
