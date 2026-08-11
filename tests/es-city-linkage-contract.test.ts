import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260811140230_publish_es_tier_a_city_linkage_v1.sql",
  "utf8",
)

test("Spain city linkage expands providers and locks official teaching-location representatives", () => {
  assert.match(migration, /Universitat de València/)
  assert.match(migration, /Universitat Politècnica de València/)
  assert.match(migration, /Universidad de Granada/)
  assert.match(migration, /UNIVERSITY_OFFICIAL_TEACHING_LOCATION/)
  assert.match(migration, /verified_official_institution_city/)
  assert.match(migration, /ES provider expansion expected 13 active institutions/)
  assert.match(migration, /ES Tier A verified teaching locations expected 10 rows/)
})

test("Spain city linkage allows only exact source-city programme evidence", () => {
  assert.match(migration, /lower\(trim\(s\.city\)\)=lower\(trim\(g\.name\)\)/)
  assert.match(migration, /ES strict city programme linkage expected 97 rows/)
  assert.match(migration, /ES programme source-city mismatch detected/)
  assert.match(migration, /ES locality-to-destination programme leakage detected/)
  assert.ok(migration.includes("city_slug='bilbao' and institution_name='Euskal Herriko Unibertsitatea (EHU)'"))
  assert.ok(migration.includes("city_slug='barcelona' and institution_name='Universitat Autònoma de Barcelona'"))
})

test("Spain Phase 3 read models stay private and security-invoker", () => {
  assert.match(migration, /city_institution_directory_es_v1 with \(security_invoker=true\)/)
  assert.match(migration, /city_programme_directory_es_v1 with \(security_invoker=true\)/)
  assert.match(migration, /city_directory_es_v1 with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.city_directory_es_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_directory_es_v1 to service_role/)
})
