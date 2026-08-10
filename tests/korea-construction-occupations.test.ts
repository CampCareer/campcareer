import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810124618_korea_construction_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["carpenter", "7016", "건축 목공"],
  ["electrician", "8312", "내선 전기공"],
  ["plumber", "7031", "건설 배관공"],
  ["wall-floor-tiler", "7024", "바닥재 시공원"],
  ["welder", "8241", "용접원"],
  ["bricklayer", "7017", "조적공 및 석재 부설원"],
  ["hvac-technician", "8115", "냉동·냉장·공조기 설치 및 정비원"],
  ["construction-manager", "0161", "건설 및 광업 관련 관리자"],
] as const

test("Korea construction cohort covers the canonical eight trades careers", () => {
  for (const [id, code, officialTitle] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "trades", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
    assert.match(migration, new RegExp(officialTitle), id)
  }
})

test("Korea construction mappings preserve broader official-code caveats", () => {
  assert.match(getOccupationEditorial("wall-floor-tiler")?.countries.KR?.entryPathway ?? "", /broader than tile setting/i)
  assert.match(getOccupationEditorial("bricklayer")?.countries.KR?.entryPathway ?? "", /scope restricted/i)
  assert.match(getOccupationEditorial("construction-manager")?.countries.KR?.entryPathway ?? "", /construction management rather than mining/i)
})

test("Korea v1 scores stay provisional instead of fabricating market evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,5,0,0,0,2,7/)
  assert.match(migration, /No current comparable exact-code national wage series is scored in KR v1/)
  assert.match(migration, /No occupation-specific visa credit is assigned/)
})

test("Korea construction reuses only verified programme mappings as related study", () => {
  assert.match(migration, /studyinkorea:100472:bachelor:refrigeration-air-conditioning-engineering','related'/)
  assert.match(migration, /studyinkorea:100061:bachelor:architecture-engineering','related'/)
  assert.match(migration, /studyinkorea:100241:bachelor:civil-architectural-environmental-system-engineering','related'/)
  assert.doesNotMatch(migration, /studyinkorea:[^']+','direct'/)
})
