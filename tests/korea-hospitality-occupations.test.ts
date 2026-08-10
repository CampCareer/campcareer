import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810174941_korea_hospitality_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["chef", "5311", "주방장 및 요리 연구가"],
  ["cook", null, "조리사 — cook umbrella"],
  ["hotel-manager", "0141", "hotel-management scope"],
  ["restaurant-manager", "0142", "음식 서비스 관련 관리자"],
  ["baker", "8711", "제과원 및 제빵사"],
  ["tourism-manager", "0141", "tourism-management scope"],
  ["event-planner", "0244", "행사·전시 및 회의 기획자"],
  ["hospitality-supervisor", null, "호스피탈리티 현장 감독"],
] as const

test("Korea hospitality cohort covers the canonical eight hospitality careers", () => {
  for (const [id, code, title] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "hospitality", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'`), id)
    assert.match(migration, new RegExp(title), id)
    if (code) assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Korea hospitality keeps umbrella classifications explicit", () => {
  const cook = getOccupationEditorial("cook")?.countries.KR
  const supervisor = getOccupationEditorial("hospitality-supervisor")?.countries.KR

  assert.match(cook?.entryPathway ?? "", /does not provide one generic KECO 2025/i)
  assert.match(supervisor?.entryPathway ?? "", /does not publish one KECO 2025/i)
  for (const code of ["5312", "5313", "5314", "5315", "5318", "5319"]) {
    assert.match(migration, new RegExp(`'KR:cook','${code}'`), code)
  }
  for (const code of ["0141", "0142", "5230", "5322"]) {
    assert.match(migration, new RegExp(`'KR:hospitality-supervisor','${code}'`), code)
  }
  assert.match(migration, /'KR:cook','KR','cook'.*null,'KRW',false/s)
  assert.match(migration, /'KR:hospitality-supervisor','KR','hospitality-supervisor'.*null,'KRW',false/s)
})

test("Korea hospitality distinguishes universal licensing from regulated food-service settings", () => {
  assert.match(getOccupationEditorial("chef")?.countries.KR?.registration ?? "", /no universal personal licence/i)
  assert.match(getOccupationEditorial("cook")?.countries.KR?.registration ?? "", /not universally licensed/i)
  assert.match(getOccupationEditorial("cook")?.countries.KR?.registration ?? "", /Food Sanitation Act/i)
  assert.match(migration, /Food Sanitation Act — cook licence context/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'KR:${id}'.*'KRW',false`, "s"), id)
  }
})

test("Korea hospitality v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
})

test("Korea hospitality reuses only reviewed programme mappings", () => {
  assert.match(migration, /from public\.program_occupation_kr_v1/)
  assert.match(migration, /case when relation_type='direct' then 'direct' else 'related' end/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
