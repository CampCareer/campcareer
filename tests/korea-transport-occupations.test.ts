import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810200219_korea_transport_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["truck-driver", "6223", "화물차 및 특수차 운전원"],
  ["logistics-coordinator", null, "cross-mode logistics umbrella"],
  ["aircraft-maintenance-technician", "8121", "항공기 정비원"],
  ["commercial-pilot", "6211", "commercial pilot scope"],
  ["marine-engineer", "6212", "marine-engineer scope"],
  ["deck-officer", "6212", "deck-officer scope"],
  ["warehouse-manager", "0152", "warehouse-operations scope"],
  ["automotive-service-technician", "8124", "자동차 정비원"],
] as const

test("Korea transport cohort covers the canonical eight transport careers", () => {
  for (const [id, code, title] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "transport", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'`), id)
    assert.match(migration, new RegExp(title), id)
    if (code) assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Korea transport keeps cross-mode logistics classification explicit", () => {
  const editorial = getOccupationEditorial("logistics-coordinator")?.countries.KR

  assert.match(editorial?.headline ?? "", /umbrella/i)
  assert.match(editorial?.entryPathway ?? "", /0282, 0283, 0284 and 0289/)
  assert.match(migration, /'KR:logistics-coordinator','KR','logistics-coordinator'[\s\S]*'2025',null,'KRW',false/)
  for (const code of ["0282", "0283", "0284", "0289"]) {
    assert.match(migration, new RegExp(`'KR:logistics-coordinator','${code}'.*false`, "s"), code)
  }
})

test("Korea transport preserves regulated qualification boundaries", () => {
  for (const id of [
    "truck-driver",
    "aircraft-maintenance-technician",
    "commercial-pilot",
    "marine-engineer",
    "deck-officer",
  ]) {
    assert.match(migration, new RegExp(`'KR:${id}'.*'KRW',true`, "s"), id)
  }

  assert.match(getOccupationEditorial("truck-driver")?.countries.KR?.registration ?? "", /화물운송 종사자격/)
  assert.match(getOccupationEditorial("aircraft-maintenance-technician")?.countries.KR?.registration ?? "", /항공정비사/)
  assert.match(getOccupationEditorial("commercial-pilot")?.countries.KR?.registration ?? "", /mandatory/i)
  assert.match(getOccupationEditorial("marine-engineer")?.countries.KR?.registration ?? "", /기관사 해기사 면허/)
  assert.match(getOccupationEditorial("deck-officer")?.countries.KR?.registration ?? "", /항해사 해기사 면허/)

  for (const id of ["logistics-coordinator", "warehouse-manager", "automotive-service-technician"]) {
    assert.match(migration, new RegExp(`'KR:${id}'.*'KRW',false`, "s"), id)
  }
})

test("Korea transport keeps overlapping KECO scopes from becoming exact market claims", () => {
  assert.match(getOccupationEditorial("marine-engineer")?.countries.KR?.jobMarketNote ?? "", /6212 combines/i)
  assert.match(getOccupationEditorial("deck-officer")?.countries.KR?.jobMarketNote ?? "", /broad 6212/i)
  assert.match(getOccupationEditorial("warehouse-manager")?.countries.KR?.jobMarketNote ?? "", /broader manager/i)
  assert.match(migration, /'KR:warehouse-manager','0152'/)
  assert.doesNotMatch(migration, /'KR:warehouse-manager','0284'/)
})

test("Korea transport v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,13,0,0,0,2,15/)
  assert.match(migration, /0,0,0,0,5,0,0,0,1,6/)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
})

test("Korea transport reuses only reviewed programme mappings", () => {
  assert.match(migration, /from public\.program_occupation_kr_v1/)
  assert.match(migration, /case when relation_type='direct' then 'direct' else 'related' end/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
