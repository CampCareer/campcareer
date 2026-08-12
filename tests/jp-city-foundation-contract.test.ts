import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync("supabase/migrations/20260812002159_normalize_jp_tier_a_city_geographies_v1.sql", "utf8")
const scope = fs.readFileSync("docs/data-foundation/jp-city-scope-v1.md", "utf8")

const exactSlugs = ["tokyo", "kyoto", "nagoya", "sendai", "suita", "tsukuba", "fukuoka"]
const exactCodes = ["13100", "26100", "23100", "04100", "27205", "08220", "40130"]

test("Japan Phase 2 normalizes exactly the seven locked Tier A destinations", () => {
  for (const slug of exactSlugs) assert.ok(migration.includes(`'${slug}'`), `missing ${slug}`)
  for (const code of exactCodes) assert.ok(migration.includes(`'${code}'`), `missing code ${code}`)
  assert.match(migration, /publication_status','approved_not_indexed'/)
  assert.match(migration, /programme_coverage_status','verification_pending'/)
})

test("Japan geography contract preserves Tokyo, Suita and Kunitachi separation", () => {
  assert.match(migration, /tokyo_23_special_wards_aggregate/)
  assert.match(migration, /Kunitachi must remain outside JP Tier A v1/)
  assert.match(migration, /Osaka City, Toyonaka and Minoh remain distinct/)
  assert.match(scope, /Kunitachi remains separate from Tokyo/)
  assert.match(scope, /raw `Osaka` rows do not create Osaka City coverage/)
})
