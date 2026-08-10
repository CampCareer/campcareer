import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260809120738_normalize_nz_tier_a_city_geographies_v1.sql"),
  "utf8",
)
const scopeDoc = readFileSync(join(process.cwd(), "docs/data-foundation/nz-city-scope-v1.md"), "utf8")

const approvedSlugs = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"] as const
const deferredSlugs = ["palmerston-north", "lincoln"] as const

test("New Zealand Phase 2 normalization is bounded to the approved five-city allowlist", () => {
  for (const slug of approvedSlugs) {
    assert.match(migration, new RegExp(`'${slug}'`))
    assert.ok(scopeDoc.includes("`" + slug + "`"))
  }

  assert.match(migration, /publication_tier', 'A'/)
  assert.match(migration, /normalized_count <> 5/)
  assert.match(migration, /study_destination_scope', 'stats_nz_urban_area'/)
})

test("New Zealand Tier B geographies remain outside Phase 2 normalization", () => {
  for (const slug of deferredSlugs) assert.match(migration, new RegExp(`'${slug}'`))
  assert.match(migration, /tier_b_touched <> 0/)
  assert.match(scopeDoc, /Palmerston North/)
  assert.match(scopeDoc, /Lincoln/)
})

test("New Zealand geography normalization preserves existing UUIDs and defers campus membership", () => {
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
  assert.match(migration, /campus_membership_contract'/)
  assert.match(migration, /phase_3_explicit_location_evidence_required/)
})

test("all five Tier A cities use Stats NZ urban-area geography for public scope and later population metrics", () => {
  assert.match(migration, /SSGA23 urban\/rural geography/)
  assert.match(migration, /population_geography_contract', 'stats_nz_urban_area'/)
  assert.match(migration, /Auckland urban area/)
  assert.match(migration, /Christchurch urban area/)
  assert.match(migration, /Hamilton urban area/)
  assert.match(migration, /Wellington urban area/)
  assert.match(migration, /Dunedin urban area/)
})

test("region mapping is explicit for the five launch cities", () => {
  assert.match(migration, /'Auckland', 'auckland', 'Auckland'/)
  assert.match(migration, /'Christchurch', 'christchurch', 'Canterbury'/)
  assert.match(migration, /'Hamilton', 'hamilton', 'Waikato'/)
  assert.match(migration, /'Wellington', 'wellington', 'Wellington'/)
  assert.match(migration, /'Dunedin', 'dunedin', 'Otago'/)
})

test("scope notes prevent nearby or provider-linked places from leaking into a city", () => {
  assert.match(migration, /Whangārei \/ Tai Tokerau/)
  assert.match(migration, /Lincoln remains a separate place/)
  assert.match(migration, /Tauranga is a separate study destination/)
  assert.match(migration, /not the full Wellington Region/)
  assert.match(migration, /Do not infer Queenstown, Southland/)
})

test("normalization registers deterministic canonical-name and slug aliases", () => {
  assert.match(migration, /'canonical_name'/)
  assert.match(migration, /'slug'/)
  assert.match(migration, /alias_count < 10/)
})