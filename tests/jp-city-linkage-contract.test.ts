import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync("supabase/migrations/20260812002442_publish_jp_tier_a_city_linkage_v1.sql", "utf8")
const doc = fs.readFileSync("docs/data-foundation/jp-city-institution-programme-linkage-v1.md", "utf8")

test("Japan Phase 3 keeps city programme linkage explicit and conservative", () => {
  assert.match(migration, /explicit_allowlist_only/)
  assert.match(migration, /JP conservative city programme linkage expected 54/)
  assert.match(migration, /Tokyo multi-campus programmes must remain pending/)
  assert.match(migration, /Raw Osaka programmes must not auto-link to Suita/)
  assert.match(migration, /source_city in \('Aichi','Tochigi','Gunma','Osaka'\)/)
})

test("Japan Phase 3 private read models remain service-role only", () => {
  for (const view of ["city_directory_jp_v1", "city_institution_directory_jp_v1", "city_programme_directory_jp_v1"]) {
    assert.ok(migration.includes(`public.${view}`), `missing ${view}`)
  }
  assert.match(migration, /security_invoker=true/)
  assert.match(migration, /revoke all on public\.city_directory_jp_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_directory_jp_v1 to service_role/)
})

test("Japan linkage documentation distinguishes pending verification from absence", () => {
  assert.match(doc, /Strict linked total: `54`/)
  assert.match(doc, /A zero value does not mean the city has no programmes/)
  assert.match(doc, /source-city mismatch `0`/)
})
