import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811020917_japan_design_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  "graphic-designer",
  "ux-designer",
  "multimedia-designer",
  "animator",
  "interior-designer",
  "film-editor",
  "architect",
  "web-designer",
] as const

test("Japan design cohort covers the canonical eight design careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.JP

    assert.ok(career, id)
    assert.equal(career.categoryId, "design", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'JP:${id}'`), id)
  }
})

test("Japan design preserves direct and umbrella MHLW classification boundaries", () => {
  assert.match(migration, /'JP:graphic-designer'[\s\S]*'017-02','JPY',false/)
  assert.match(migration, /'JP:ux-designer'[\s\S]*'009-99','JPY',false/)
  assert.match(migration, /'JP:multimedia-designer'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:multimedia-designer','017-99'/)
  assert.match(migration, /'JP:multimedia-designer','020-99'/)
  assert.match(migration, /'JP:animator'[\s\S]*null,'JPY',false/)
  assert.match(migration, /'JP:animator','080-03'/)
  assert.match(migration, /'JP:animator','017-99'/)
  assert.match(migration, /'JP:interior-designer'[\s\S]*'017-99','JPY',false/)
  assert.match(migration, /'JP:film-editor'[\s\S]*'020-99','JPY',false/)
  assert.match(migration, /'JP:architect'[\s\S]*'008-01','JPY',true/)
  assert.match(migration, /'JP:web-designer'[\s\S]*'017-01','JPY',false/)
})

test("Japan design models architect licensing without overclaiming other creative roles", () => {
  for (const id of ["graphic-designer", "ux-designer", "multimedia-designer", "animator", "interior-designer", "film-editor", "web-designer"]) {
    assert.match(migration, new RegExp(`'JP:${id}'[\\s\\S]*'JPY',false`), id)
  }
  assert.match(migration, /'JP:architect'[\s\S]*'JPY',true/)
  assert.match(getOccupationEditorial("architect")?.countries.JP?.registration ?? "", /一級建築士[\s\S]*national examination[\s\S]*licence/)
  assert.match(getOccupationEditorial("interior-designer")?.countries.JP?.registration ?? "", /architectural design[\s\S]*建築士/)
})

test("Japan design v1 keeps market and visa enrichment deferred", () => {
  assert.match(migration, /career-opportunity-jp-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  assert.match(migration, /0,0,0,0,15,0,0,0,5,20/)
  assert.match(migration, /0,0,0,0,12,0,0,0,5,17/)
  assert.match(migration, /0,0,0,0,8,0,0,0,1,9/)
})

test("Japan design reuses only reviewed programme mappings and preserves direct only", () => {
  assert.match(migration, /from public\.program_occupation_jp_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) {
    assert.match(migration, new RegExp(`'${id}'`), id)
  }
})

test("Japan design editorial explains important classification separations", () => {
  assert.match(getOccupationEditorial("ux-designer")?.countries.JP?.entryPathway ?? "", /009-99/)
  assert.match(getOccupationEditorial("animator")?.countries.JP?.entryPathway ?? "", /080-03[\s\S]*017-99/)
  assert.match(getOccupationEditorial("web-designer")?.countries.JP?.entryPathway ?? "", /009-03/)
  assert.match(getOccupationEditorial("film-editor")?.countries.JP?.entryPathway ?? "", /020-99/)
})
