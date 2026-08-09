import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260808184326_publish_us_tier_a_city_linkage_v1.sql",
  "utf8",
)

test("US Tier A city linkage is bounded to the approved eight-city contract", () => {
  assert.ok(migration.includes("public.city_directory_us_v1"))
  assert.ok(migration.includes("public.city_institution_directory_us_v1"))
  assert.ok(migration.includes("public.city_programme_directory_us_v1"))
  assert.ok(migration.includes("coalesce(g.metadata->>'publication_tier','')='A'"))
  assert.ok(migration.includes("US Tier A city linkage contract expected 8 cities"))
})

test("US institution linkage requires canonical campus geography and institution identity", () => {
  assert.ok(migration.includes("on c.geography_id=g.id"))
  assert.ok(migration.includes("ii.identifier_system='US_UNIT_ID'"))
  assert.ok(migration.includes("institution_slug"))
  assert.ok(migration.includes("'catalog.campuses.geography_id'"))
})

test("US programme linkage requires explicit campus offering evidence", () => {
  assert.ok(migration.includes("join catalog.programme_offerings po on po.campus_id=c.id"))
  assert.ok(migration.includes("'catalog.programme_offerings.campus_id'"))
  assert.match(migration, /Do not infer programme delivery from institution presence alone/)
  assert.doesNotMatch(migration, /join catalog\.programmes p on p\.institution_id=i\.id/)
})
