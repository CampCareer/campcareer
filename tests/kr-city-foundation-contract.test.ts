import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811210819_normalize_kr_tier_a_city_geographies_v1.sql",
  "utf8",
)

const expected = [
  ["seoul", "1100000000", "11"],
  ["busan", "2600000000", "26"],
  ["daejeon", "3000000000", "30"],
  ["suwon", "4111000000", "41"],
  ["yongin", "4146000000", "41"],
  ["pohang", "4711000000", "47"],
] as const

test("Korea city foundation locks exactly six MOIS administrative destinations", () => {
  assert.match(migration, /study_destination_scope','mois_administrative_city'/)
  assert.match(migration, /population_geography_contract','mois_resident_registration_admin_area'/)
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /publication_status','approved_not_indexed'/)
  assert.match(migration, /programme_coverage_status','verification_pending'/)
  assert.match(migration, /unexpected_tier_a<>0/)

  for (const [slug, adminCode, regionCode] of expected) {
    assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
    assert.ok(migration.includes(`'${adminCode}'`), `missing admin code ${adminCode}`)
    assert.ok(migration.includes(`'${regionCode}'`), `missing region ${regionCode}`)
  }
})

test("Korea city foundation preserves capital-region city separation", () => {
  assert.match(migration, /expected four reusable canonical city rows/)
  assert.match(migration, /slug in \('seoul','busan','daejeon','pohang'\)/)
  assert.match(migration, /new Tier A slug collision detected/)
  assert.match(migration, /\('Suwon','suwon'/)
  assert.match(migration, /\('Yongin','yongin'/)
  assert.match(migration, /'서울특별시'/)
  assert.match(migration, /'수원시'/)
  assert.match(migration, /'용인시'/)
  assert.match(migration, /alias_count<18/)
})
