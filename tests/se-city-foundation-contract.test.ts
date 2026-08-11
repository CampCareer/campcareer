import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260810215750_normalize_se_tier_a_city_geographies_v1.sql",
  "utf8",
)

const expected = [
  ["stockholm", "0180", "01"],
  ["gothenburg", "1480", "14"],
  ["uppsala", "0380", "03"],
  ["lund", "1281", "12"],
  ["linkoping", "0580", "05"],
  ["umea", "2480", "24"],
] as const

test("Sweden city foundation locks exactly six SCB municipalities", () => {
  assert.match(migration, /study_destination_scope','scb_municipality'/)
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /unexpected_tier_a<>0/)
  for (const [slug, municipalityCode, countyCode] of expected) {
    assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
    assert.ok(migration.includes(`'${municipalityCode}'`), `missing SCB municipality ${municipalityCode}`)
    assert.ok(migration.includes(`'${countyCode}'`), `missing county ${countyCode}`)
  }
})

test("Sweden city foundation preserves canonical IDs and Göteborg alias", () => {
  assert.match(migration, /UUID preservation contract failed/)
  assert.match(migration, /'Göteborg','göteborg'/)
  assert.match(migration, /alias_count<13/)
})
