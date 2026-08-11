import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811125200_normalize_no_tier_a_city_geographies_v1.sql",
  "utf8",
)

const expected = [
  ["oslo", "0301", "03"],
  ["trondheim", "5001", "50"],
  ["stavanger", "1103", "11"],
  ["as", "3218", "32"],
  ["tromso", "5501", "55"],
] as const

test("Norway city foundation locks exactly five Statistics Norway municipalities", () => {
  assert.match(migration, /study_destination_scope','statistics_norway_municipality'/)
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /normalization expected 5 rows/)
  assert.match(migration, /unexpected_tier_a<>0/)
  for (const [slug, municipalityCode, regionCode] of expected) {
    assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
    assert.ok(migration.includes(`'${municipalityCode}'`), `missing municipality ${municipalityCode}`)
    assert.ok(migration.includes(`'${regionCode}'`), `missing county ${regionCode}`)
  }
})

test("Norway city foundation preserves canonical IDs and Unicode display names", () => {
  assert.match(migration, /UUID preservation contract failed/)
  assert.match(migration, /'Ås','as'/)
  assert.match(migration, /'Tromsø','tromso'/)
  assert.match(migration, /alias_count<10/)
  for (const excluded of ["bodo", "kongsberg", "kristiansand", "bergen", "elverum"]) {
    assert.doesNotMatch(migration, new RegExp(`\\('${excluded}'`))
  }
})
