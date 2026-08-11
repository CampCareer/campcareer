import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811204829_singapore_design_occupations.sql", import.meta.url),
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

test("Singapore design cohort covers the canonical eight design careers", () => {
  for (const id of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SG

    assert.ok(career, id)
    assert.equal(career.categoryId, "design", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SG:${id}'`), id)
  }
})

test("Singapore design preserves direct and umbrella SSOC boundaries", () => {
  assert.match(migration, /'SG:graphic-designer'[\s\S]*?'21661','SGD',false/)
  assert.match(migration, /'SG:ux-designer'[\s\S]*?'25124','SGD',false/)
  assert.match(migration, /'SG:multimedia-designer'[\s\S]*?'21662','SGD',false/)
  assert.match(migration, /'SG:animator'[\s\S]*?'21662','SGD',false/)
  assert.match(migration, /'SG:interior-designer'[\s\S]*?'34321','SGD',false/)
  assert.match(migration, /'SG:architect'[\s\S]*?'21610','SGD',true/)

  assert.match(migration, /'SG:film-editor'[\s\S]*?null,'SGD',false/)
  assert.match(migration, /'SG:film-editor','21662'[\s\S]*?false,1/)
  assert.doesNotMatch(migration, /'SG:film-editor','26544'/)

  assert.match(migration, /'SG:web-designer'[\s\S]*?null,'SGD',false/)
  assert.match(migration, /'SG:web-designer','21661'/)
  assert.match(migration, /'SG:web-designer','25124'/)
  assert.doesNotMatch(migration, /'SG:web-designer','25122'/)
})

test("Singapore architect keeps the statutory BOA registration boundary", () => {
  const architectRegistration = getOccupationEditorial("architect")?.countries.SG?.registration ?? ""
  const interiorRegistration = getOccupationEditorial("interior-designer")?.countries.SG?.registration ?? ""

  assert.match(architectRegistration, /Board of Architects|registration.*required|Practising Certificate/i)
  assert.match(interiorRegistration, /not treated as requiring Board of Architects registration/i)
  assert.match(migration, /Board of Architects Singapore \(BOA\)/)
  assert.match(migration, /https:\/\/www\.boa\.gov\.sg\/register\/requirements\//)
})

test("Singapore film and web design editorial explains the conservative proxy boundaries", () => {
  assert.match(getOccupationEditorial("film-editor")?.countries.SG?.jobMarketNote ?? "", /26544[\s\S]*script|script[\s\S]*26544/i)
  assert.match(getOccupationEditorial("web-designer")?.countries.SG?.jobMarketNote ?? "", /25122[\s\S]*software|software[\s\S]*25122/i)
  assert.match(getOccupationEditorial("ux-designer")?.countries.SG?.headline ?? "", /25124/)
})

test("Singapore design v1 leaves market and visa enrichment for the later common phase", () => {
  assert.match(migration, /career-opportunity-sg-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned/g)
  for (const score of [
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,12,0,0,0,5,17",
    "0,0,0,0,8,0,0,0,1,9",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Singapore design reuses approved programme mappings without upgrading common pathways", () => {
  assert.match(migration, /from public\.program_occupation_sg_staging/)
  assert.match(migration, /join public\.program_catalog_sg_staging/)
  assert.match(migration, /o\.review_status='approved'/)
  assert.match(migration, /'sg-program:'\|\|c\.id::text/)
  assert.match(migration, /case when o\.relation_type='direct' then 'direct' else 'related' end/)
  for (const id of careers) assert.match(migration, new RegExp(`'${id}'`), id)
})
