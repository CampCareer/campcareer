import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260810131602_normalize_nl_tier_a_city_geographies_v1.sql"),
  "utf8",
)
const scopeDoc = readFileSync(join(process.cwd(), "docs/data-foundation/nl-city-scope-v1.md"), "utf8")

const approvedSlugs = ["amsterdam", "maastricht", "rotterdam", "groningen", "eindhoven"] as const
const deferredCities = ["Delft", "Utrecht", "Enschede", "Tilburg", "Leiden", "Nijmegen", "Wageningen"] as const

test("Netherlands Phase 2 normalization is bounded to the approved five-city allowlist", () => {
  for (const slug of approvedSlugs) {
    assert.match(migration, new RegExp(`'${slug}'`))
    assert.ok(scopeDoc.includes("`" + slug + "`"))
  }

  assert.match(migration, /publication_tier', 'A'/)
  assert.match(migration, /normalized_count <> 5/)
  assert.match(migration, /study_destination_scope', 'cbs_municipality'/)
})

test("Netherlands Tier B geographies remain outside Phase 2 normalization", () => {
  for (const city of deferredCities) assert.match(migration, new RegExp(`'${city}'`))
  assert.match(migration, /tier_b_touched <> 0/)
})

test("Netherlands geography normalization preserves existing UUIDs and defers campus membership", () => {
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
  assert.match(migration, /campus_membership_contract'/)
  assert.match(migration, /phase_3_explicit_location_evidence_required/)
})

test("all five Tier A cities use CBS municipality geography for public scope and population metrics", () => {
  assert.match(migration, /CBS municipal division 2026/)
  assert.match(migration, /population_geography_contract', 'cbs_municipality'/)
  assert.match(migration, /student_demand_geography_contract', 'nuffic_municipality'/)
  assert.match(migration, /'GM0363'/)
  assert.match(migration, /'GM0935'/)
  assert.match(migration, /'GM0599'/)
  assert.match(migration, /'GM0014'/)
  assert.match(migration, /'GM0772'/)
})

test("province mapping is explicit for the five launch cities", () => {
  assert.match(migration, /'Amsterdam', 'amsterdam', 'NH', 'Noord-Holland'/)
  assert.match(migration, /'Maastricht', 'maastricht', 'LI', 'Limburg'/)
  assert.match(migration, /'Rotterdam', 'rotterdam', 'ZH', 'Zuid-Holland'/)
  assert.match(migration, /'Groningen', 'groningen', 'GR', 'Groningen'/)
  assert.match(migration, /'Eindhoven', 'eindhoven', 'NB', 'Noord-Brabant'/)
})

test("scope notes prevent metro, province, or nearby municipalities from leaking into a city", () => {
  assert.match(migration, /Amstelveen, Diemen/)
  assert.match(migration, /Limburg province statistics/)
  assert.match(migration, /Rijnmond or the wider Rotterdam-The Hague metropolitan area/)
  assert.match(migration, /Province of Groningen statistics/)
  assert.match(migration, /broader Brainport region/)
})

test("normalization registers deterministic canonical-name and slug aliases", () => {
  assert.match(migration, /'canonical_name'/)
  assert.match(migration, /'slug'/)
  assert.match(migration, /alias_count < 10/)
})