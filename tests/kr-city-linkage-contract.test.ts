import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811211057_publish_kr_tier_a_city_linkage_v1.sql",
  "utf8",
)

test("Korea city linkage uses verified teaching locations and strict source-city matching", () => {
  assert.match(migration, /kr_city_linkage_v1/)
  assert.match(migration, /verified_teaching_location_representative/)
  assert.match(migration, /programme_assignment_verified',true/)
  assert.ok(migration.includes("lower(trim(s.city))=lower(trim(g.name))"))
  assert.match(migration, /KR strict city programme linkage expected 182 rows/)
  assert.match(migration, /KR Tier A verified teaching locations expected 14 rows/)
})

test("Korea city linkage repairs Suwon and Yongin multi-campus inheritance", () => {
  assert.match(migration, /Natural Sciences Campus/)
  assert.match(migration, /Global Campus/)
  assert.match(migration, /KR Suwon SKKU repair expected 8 programmes/)
  assert.match(migration, /KR Yongin Kyung Hee repair expected 17 programmes/)
  assert.match(migration, /source-city mismatch detected/)
})

test("Korea city linkage keeps later candidates out and read models private", () => {
  assert.match(migration, /source_city in \('Cheonan','Goyang'\)/)
  assert.match(migration, /later-candidate programme leakage detected/)
  assert.match(migration, /with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.city_directory_kr_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_directory_kr_v1 to service_role/)
})
