import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810132432_korea_engineering_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["civil-engineer", "1403", "토목공학 기술자"],
  ["mechanical-engineer", "1511", "기계공학 기술자 및 연구원"],
  ["electrical-engineer", "1531", "전기공학 기술자 및 연구원"],
  ["manufacturing-engineer", "1511", "제조 엔지니어 scope"],
  ["industrial-engineer", "1599", "산업공학 엔지니어 scope"],
  ["chemical-engineer", "1541", "화학공학 기술자 및 연구원"],
  ["environmental-engineer", "1555", "환경공학 기술자 및 연구원"],
  ["engineering-technician", "1599", "Engineering Technician umbrella"],
] as const

test("Korea engineering cohort covers the canonical eight engineering careers", () => {
  for (const [id, code, officialTitle] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "engineering", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
    assert.match(migration, new RegExp(officialTitle), id)
  }
})

test("Korea engineering keeps broader mappings explicit", () => {
  assert.match(getOccupationEditorial("manufacturing-engineer")?.countries.KR?.entryPathway ?? "", /does not publish a standalone Manufacturing Engineer/i)
  assert.match(getOccupationEditorial("industrial-engineer")?.countries.KR?.entryPathway ?? "", /does not provide a dedicated 산업공학 기술자/i)
  assert.match(getOccupationEditorial("engineering-technician")?.countries.KR?.entryPathway ?? "", /does not have one KECO 2025/i)
  assert.match(migration, /1513','기계 및 로봇공학 시험원/)
  assert.match(migration, /1534','전기 및 전자공학 시험원/)
  assert.match(migration, /1556','환경공학 시험원/)
})

test("Korea engineering v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,10,0,0,0,5,15/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /No occupation-specific visa credit is assigned/)
})

test("Korea engineering reuses only reviewed programme mappings", () => {
  assert.match(migration, /from public\.program_occupation_kr_v1/)
  assert.match(migration, /case when relation_type='direct' then 'direct' else 'related' end/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
