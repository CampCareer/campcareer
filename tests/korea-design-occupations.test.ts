import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810172339_korea_design_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["graphic-designer", "4154"],
  ["ux-designer", "4154"],
  ["multimedia-designer", "4155"],
  ["animator", "4143"],
  ["interior-designer", "4153"],
  ["film-editor", "4166"],
  ["architect", "1401"],
  ["web-designer", "4155"],
] as const

test("Korea design cohort covers the canonical eight design careers", () => {
  for (const [id, code] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.KR

    assert.ok(career, id)
    assert.equal(career.categoryId, "design", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'KR:${id}'.*'${code}'`, "s"), id)
  }
})

test("Korea design preserves shared-code scope boundaries", () => {
  assert.match(getOccupationEditorial("ux-designer")?.countries.KR?.entryPathway ?? "", /restricted to UX\/UI/i)
  assert.match(getOccupationEditorial("web-designer")?.countries.KR?.entryPathway ?? "", /restricted to the web-design subset/i)
  assert.match(getOccupationEditorial("animator")?.countries.KR?.entryPathway ?? "", /4143/)
  assert.match(getOccupationEditorial("film-editor")?.countries.KR?.entryPathway ?? "", /4166/)
  assert.match(migration, /'KR:graphic-designer'.*'4154'/s)
  assert.match(migration, /'KR:ux-designer'.*'4154'/s)
  assert.match(migration, /'KR:multimedia-designer'.*'4155'/s)
  assert.match(migration, /'KR:web-designer'.*'4155'/s)
})

test("Korea architect keeps the regulated professional scope explicit", () => {
  assert.match(migration, /'KR:architect'.*'1401'.*true/s)
  assert.match(migration, /건축사등록원/)
  assert.match(getOccupationEditorial("architect")?.countries.KR?.registration ?? "", /Registration is mandatory/i)
  assert.match(getOccupationEditorial("architect")?.countries.KR?.entryPathway ?? "", /five-year architecture education/i)
})

test("Korea design v1 does not fabricate market or visa evidence", () => {
  assert.match(migration, /career-opportunity-kr-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,8,0,0,0,1,9/)
  assert.match(migration, /No occupation-specific visa credit is assigned/)
})

test("Korea design reuses only reviewed programme mappings", () => {
  assert.match(migration, /from public\.program_occupation_kr_v1/)
  assert.match(migration, /case when relation_type='direct' then 'direct' else 'related' end/)
  for (const [id] of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})
