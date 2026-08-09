import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260809092442_normalize_ie_tier_a_city_slugs_v1.sql"),
  "utf8",
)
const scopeDoc = readFileSync(join(process.cwd(), "docs/data-foundation/ie-city-scope-v1.md"), "utf8")

const approvedCodes = ["dublin-ie", "cork-ie", "galway-ie", "limerick-ie"] as const
const approvedSlugs = ["dublin", "cork", "galway", "limerick"] as const
const deferredCodes = [
  "maynooth-ie",
  "waterford-ie",
  "athlone-ie",
  "sligo-ie",
  "dundalk-ie",
  "letterkenny-ie",
] as const

test("Ireland Phase 2 normalization is bounded to the approved four-city allowlist", () => {
  for (const code of approvedCodes) assert.match(migration, new RegExp(`'${code}'`))
  for (const slug of approvedSlugs) assert.ok(scopeDoc.includes("`" + slug + "`"))

  assert.match(migration, /publication_tier', 'A'/)
  assert.match(migration, /normalized_count <> 4/)
  assert.match(scopeDoc, /Approved Tier A count: `4`/)
})

test("Ireland Tier B expansion cities are guarded from Phase 2 normalization", () => {
  for (const code of deferredCodes) assert.match(migration, new RegExp(`'${code}'`))
  assert.match(migration, /tier_b_touched <> 0/)
  assert.match(scopeDoc, /Maynooth, Waterford, Athlone, Sligo, Dundalk, Letterkenny/)
})

test("Ireland city normalization preserves UUIDs and defers campus membership", () => {
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
  assert.match(migration, /campus_membership_contract'/)
  assert.match(migration, /phase_3_explicit_location_evidence_required/)
  assert.match(scopeDoc, /must not mark any legacy campus or programme offering as verified/)
})

test("Dublin uses the explicit four-local-authority study-market contract", () => {
  assert.match(migration, /dublin_four_local_authorities/)
  assert.match(migration, /Dublin City, Fingal, Dún Laoghaire-Rathdown and South Dublin/)
  assert.match(scopeDoc, /Dublin City \+ Fingal \+ Dún Laoghaire-Rathdown \+ South Dublin/)
})

test("Cork Galway and Limerick keep explicit non-county scopes", () => {
  assert.match(migration, /'cork_city'/)
  assert.match(migration, /'galway_city'/)
  assert.match(migration, /'limerick_urban'/)
  assert.match(migration, /Do not infer County Cork/)
  assert.match(migration, /Do not infer all County Limerick/)
})

test("normalization registers canonical source legacy slug and locality aliases", () => {
  assert.match(migration, /'canonical_name'/)
  assert.match(migration, /'source'/)
  assert.match(migration, /'legacy'/)
  assert.match(migration, /'slug'/)
  assert.match(migration, /'locality'/)
  assert.match(migration, /Dublin City/)
  assert.match(migration, /Cork City/)
  assert.match(migration, /Galway City/)
  assert.match(migration, /Limerick City/)
})
