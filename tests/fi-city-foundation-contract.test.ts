import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811022937_normalize_fi_tier_a_city_geographies_v1.sql",
  "utf8",
)

const expected = [
  ["helsinki", "091", "01"],
  ["espoo", "049", "01"],
  ["tampere", "837", "06"],
  ["turku", "853", "02"],
  ["oulu", "564", "17"],
  ["jyvaskyla", "179", "13"],
  ["lappeenranta", "405", "09"],
  ["joensuu", "167", "12"],
] as const

test("Finland city foundation locks exactly eight Statistics Finland municipalities", () => {
  assert.match(migration, /study_destination_scope','statistics_finland_municipality'/)
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /unexpected_tier_a<>0/)
  for (const [slug, municipalityCode, regionCode] of expected) {
    assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
    assert.ok(migration.includes(`'${municipalityCode}'`), `missing municipality ${municipalityCode}`)
    assert.ok(migration.includes(`'${regionCode}'`), `missing region ${regionCode}`)
  }
})

test("Finland city foundation preserves canonical IDs and bilingual aliases", () => {
  assert.match(migration, /UUID preservation contract failed/)
  assert.match(migration, /'helsinki','Helsingfors'/)
  assert.match(migration, /'espoo','Esbo'/)
  assert.match(migration, /'turku','Åbo'/)
  assert.match(migration, /alias_count<19/)
})
