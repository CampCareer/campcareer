import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260812010700_sweden_construction_occupations.sql", import.meta.url),
  "utf8",
)

const careers = [
  ["carpenter", "7111"],
  ["electrician", "7411"],
  ["plumber", "7125"],
  ["wall-floor-tiler", "7112"],
  ["welder", "7212"],
  ["bricklayer", "7112"],
  ["hvac-technician", "7126"],
  ["construction-manager", "1362"],
] as const

test("Sweden construction cohort covers the canonical eight trades careers", () => {
  for (const [id, code] of careers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)?.countries.SE

    assert.ok(career, id)
    assert.equal(career.categoryId, "trades", id)
    assert.ok(editorial, id)
    assert.match(migration, new RegExp(`'SE:${id}'`), id)
    assert.match(migration, new RegExp(`'${code}'`), id)
  }
})

test("Sweden construction preserves the reviewed SSYK 2012 mappings", () => {
  assert.match(migration, /'SE:carpenter'[\s\S]*?'7111','SEK',false/)
  assert.match(migration, /'SE:electrician'[\s\S]*?'7411','SEK',false/)
  assert.match(migration, /'SE:plumber'[\s\S]*?'7125','SEK',false/)
  assert.match(migration, /'SE:wall-floor-tiler'[\s\S]*?'7112','SEK',false/)
  assert.match(migration, /'SE:welder'[\s\S]*?'7212','SEK',false/)
  assert.match(migration, /'SE:bricklayer'[\s\S]*?'7112','SEK',false/)
  assert.match(migration, /'SE:hvac-technician'[\s\S]*?'7126','SEK',false/)
  assert.match(migration, /'SE:construction-manager'[\s\S]*?'1362','SEK',false/)

  assert.match(getOccupationEditorial("wall-floor-tiler")?.countries.SE?.entryPathway ?? "", /Kakelsättare[\s\S]*Klinkerläggare[\s\S]*Plattsättare/)
  assert.match(getOccupationEditorial("construction-manager")?.countries.SE?.entryPathway ?? "", /Byggplatschef[\s\S]*Platschef[\s\S]*Produktionschef/)
})

test("Sweden construction models regulation as activity or company scope instead of universal personal licensing", () => {
  assert.match(getOccupationEditorial("electrician")?.countries.SE?.registration ?? "", /self-audit scheme/i)
  assert.match(getOccupationEditorial("electrician")?.countries.SE?.registration ?? "", /do not all need personal authorisation/i)
  assert.match(migration, /Elsäkerhetsverket — Working with electrical installations/)

  assert.match(getOccupationEditorial("plumber")?.countries.SE?.registration ?? "", /industry authorisation/i)
  assert.match(getOccupationEditorial("plumber")?.countries.SE?.registration ?? "", /state licence/i)
  assert.match(migration, /Säker Vatten — Branschregler 2026:1/)

  assert.match(getOccupationEditorial("hvac-technician")?.countries.SE?.registration ?? "", /person certification/i)
  assert.match(getOccupationEditorial("hvac-technician")?.countries.SE?.registration ?? "", /F-gas/i)
  assert.match(migration, /Naturvårdsverket — F-gas requirements/)
})

test("Sweden construction v1 does not fabricate market or occupation-specific visa evidence", () => {
  assert.match(migration, /career-opportunity-se-v1/g)
  assert.match(migration, /'provisional'/g)
  assert.match(migration, /No occupation-specific visa credit is assigned in this foundation phase/g)

  for (const score of [
    "0,0,0,0,15,0,0,0,5,20",
    "0,0,0,0,12,0,0,0,3,15",
    "0,0,0,0,12,0,0,0,4,16",
    "0,0,0,0,15,0,0,0,4,19",
    "0,0,0,0,12,0,0,0,2,14",
    "0,0,0,0,10,0,0,0,3,13",
  ]) {
    assert.match(migration, new RegExp(score), score)
  }
})

test("Sweden construction links current official classification and regulatory sources without assuming study staging tables", () => {
  assert.match(migration, /SCB SSYK 2012/)
  assert.match(migration, /Arbetsförmedlingen Platsbanken/)
  assert.doesNotMatch(migration, /program_occupation_se_staging/)
  assert.doesNotMatch(migration, /program_catalog_se_staging/)
})
