import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811114226_normalize_es_tier_a_city_geographies_v1.sql",
  "utf8",
)

const expected = [
  ["madrid", "28079", "13"],
  ["barcelona", "08019", "09"],
  ["valencia", "46250", "10"],
  ["sevilla", "41091", "01"],
  ["granada", "18087", "01"],
  ["malaga", "29067", "01"],
  ["bilbao", "48020", "16"],
] as const

test("Spain city foundation locks exactly seven INE municipality destinations", () => {
  assert.match(migration, /study_destination_scope','ine_municipality'/)
  assert.match(migration, /population_geography_contract','ine_municipality'/)
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /publication_status','approved_not_indexed'/)
  assert.match(migration, /programme_coverage_status','verification_pending'/)
  assert.match(migration, /unexpected_tier_a<>0/)

  for (const [slug, municipalityCode, regionCode] of expected) {
    assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
    assert.ok(migration.includes(`'${municipalityCode}'`), `missing municipality ${municipalityCode}`)
    assert.ok(migration.includes(`'${regionCode}'`), `missing region ${regionCode}`)
  }
})

test("Spain city foundation preserves locality separation and Valencia official alias", () => {
  assert.match(migration, /'cerdanyola-del-valles','leioa','cadiz','ciudad-real'/)
  assert.match(migration, /locality\/later-candidate separation contract failed/)
  assert.match(migration, /'València','valència'/)
  assert.match(migration, /alias_count<15/)
})

test("Spain city foundation reuses existing public city rows before inserting new destinations", () => {
  assert.match(migration, /expected four reusable canonical city rows/)
  assert.match(migration, /slug in \('madrid','barcelona','sevilla','malaga'\)/)
  assert.match(migration, /new Tier A slug collision detected/)
  assert.match(migration, /\('Valencia','valencia'/)
  assert.match(migration, /\('Granada','granada'/)
  assert.match(migration, /\('Bilbao','bilbao'/)
})
