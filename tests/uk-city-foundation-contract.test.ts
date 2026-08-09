import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260808205309_normalize_uk_tier_a_city_slugs_v1.sql"),
  "utf8",
)
const scopeDoc = readFileSync(join(process.cwd(), "docs/data-foundation/uk-city-scope-v1.md"), "utf8")

const approvedCodes = [
  "london-uk",
  "manchester-uk",
  "birmingham-uk",
  "edinburgh-uk",
  "glasgow-uk",
  "cardiff-uk",
  "belfast-uk",
  "oxford-uk",
  "cambridge-uk",
  "bristol-uk",
] as const

const approvedSlugs = [
  "london",
  "manchester",
  "birmingham",
  "edinburgh",
  "glasgow",
  "cardiff",
  "belfast",
  "oxford",
  "cambridge",
  "bristol",
] as const

test("UK Phase 2 normalization is bounded to the approved ten-city allowlist", () => {
  for (const code of approvedCodes) assert.match(migration, new RegExp(`'${code}'`))
  for (const slug of approvedSlugs) assert.ok(scopeDoc.includes("`" + slug + "`"))

  assert.match(migration, /publication_tier', 'A'/)
  assert.match(migration, /normalized_count <> 10/)
  assert.match(scopeDoc, /exactly 10 UK geographies have `publication_tier = A`/)
  assert.doesNotMatch(migration, /'leeds-uk'/)
  assert.doesNotMatch(migration, /'nottingham-uk'/)
})

test("UK city scope preserves UUIDs and gates campus membership until Phase 3", () => {
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
  assert.match(migration, /campus_membership_contract'/)
  assert.match(migration, /phase_3_explicit_location_evidence_required/)
  assert.match(scopeDoc, /No campus, institution, programme or programme-offering membership was changed/)
})

test("London uses Greater London while Manchester excludes Salford inference", () => {
  assert.match(migration, /'london-uk', 'london', 'England', 'greater_london'/)
  assert.match(migration, /Greater London administrative area/)
  assert.match(migration, /'manchester-uk', 'manchester', 'England', 'named_city'/)
  assert.match(migration, /Do not infer Greater Manchester membership or include Salford/)
  assert.match(scopeDoc, /`London` means the Greater London study destination/)
  assert.match(scopeDoc, /`Manchester` means the City of Manchester/)
})

test("four UK education nations are explicit in the normalization contract", () => {
  assert.match(migration, /'England'/)
  assert.match(migration, /'Scotland'/)
  assert.match(migration, /'Wales'/)
  assert.match(migration, /'Northern Ireland'/)
  assert.match(migration, /'education_nation'/)
})

test("normalization registers canonical, source, legacy slug and public slug aliases", () => {
  assert.match(migration, /'canonical_name'/)
  assert.match(migration, /'source'/)
  assert.match(migration, /'public\.cities_uk'/)
  assert.match(migration, /g\.slug/)
  assert.match(migration, /'core\.geographies'/)
})
