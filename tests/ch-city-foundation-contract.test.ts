import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260811153500_normalize_ch_tier_a_city_geographies_v1.sql", "utf8")
const expected = [
  ["zurich", "261", "ZH"],
  ["lausanne", "5586", "VD"],
  ["basel", "2701", "BS"],
  ["lugano", "5192", "TI"],
  ["fribourg", "2196", "FR"],
  ["geneva", "6621", "GE"],
] as const

test("Switzerland city foundation locks exactly six FSO/BFS municipalities", () => {
  assert.match(migration, /study_destination_scope','bfs_municipality'/)
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /normalization expected 6 rows/)
  assert.match(migration, /Unexpected Switzerland Tier A geography detected/)
  for (const [slug, municipalityCode, cantonCode] of expected) {
    assert.ok(migration.includes(`'${slug}'`))
    assert.ok(migration.includes(`'${municipalityCode}'`))
    assert.ok(migration.includes(`'${cantonCode}'`))
  }
})

test("Switzerland foundation preserves multilingual aliases and UUIDs", () => {
  assert.match(migration, /UUID preservation contract failed/)
  assert.match(migration, /'zurich','Zürich','official_name'/)
  assert.match(migration, /'geneva','Genève','official_name'/)
  assert.match(migration, /'fribourg','Freiburg','language_alias'/)
  for (const excluded of ["neuchatel", "bern", "st-gallen", "lucerne"]) {
    assert.doesNotMatch(migration, new RegExp(`\\('${excluded}'`))
  }
})
