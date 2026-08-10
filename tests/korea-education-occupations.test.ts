import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810164118_korea_education_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["early-childhood-teacher", "2130", "유치원 교사"],
  ["primary-school-teacher", "2122", "초등학교 교사"],
  ["secondary-school-teacher", "2121", "중·고등학교 교사"],
  ["special-education-teacher", "2123", "특수교육 교사"],
  ["social-worker", "2311", "사회복지사"],
  ["youth-worker", "2313", "청소년 지도사"],
  ["community-worker", "2311", "community worker scope"],
  ["counsellor", "2312", "상담 전문가"],
] as const

test("Korea education cohort covers the canonical eight careers", () => {
  for (const [id, code, officialTitle] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "education", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
    assert.match(migration, new RegExp(officialTitle), id)
  }
})

test("Korea education keeps regulated and broad roles distinct", () => {
  for (const id of [
    "early-childhood-teacher",
    "primary-school-teacher",
    "secondary-school-teacher",
    "special-education-teacher",
    "social-worker",
    "youth-worker",
  ]) {
    assert.match(migration, new RegExp(`'KR:${id}'.*'KRW',true`, "s"), id)
  }

  assert.match(migration, /'KR:community-worker'.*'KRW',false/s)
  assert.match(migration, /'KR:counsellor'.*'KRW',false/s)
  assert.match(getOccupationEditorial("community-worker")?.countries.KR?.entryPathway ?? "", /does not publish a standalone Community Worker/i)
  assert.match(getOccupationEditorial("counsellor")?.countries.KR?.registration ?? "", /no single universal statutory licence/i)
})

test("Korea education teacher and welfare qualification guardrails are explicit", () => {
  assert.match(getOccupationEditorial("early-childhood-teacher")?.countries.KR?.entryPathway ?? "", /separate from childcare-centre/i)
  assert.match(getOccupationEditorial("primary-school-teacher")?.countries.KR?.registration ?? "", /appointment examination/i)
  assert.match(getOccupationEditorial("secondary-school-teacher")?.countries.KR?.registration ?? "", /general Bachelor degree.*not automatically equivalent/i)
  assert.match(getOccupationEditorial("special-education-teacher")?.countries.KR?.registration ?? "", /special-school teacher qualification/i)
  assert.match(getOccupationEditorial("social-worker")?.countries.KR?.registration ?? "", /statutory social-worker qualifications/i)
  assert.match(getOccupationEditorial("youth-worker")?.countries.KR?.registration ?? "", /청소년지도사 qualification/i)
})

test("Korea education v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,1,11/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /No occupation-specific visa credit is assigned/)
})

test("Korea education reuses only reviewed programme mappings", () => {
  assert.match(migration, /from public\.program_occupation_kr_v1/)
  assert.match(migration, /case when relation_type='direct' then 'direct' else 'related' end/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
