import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260810133035_normalize_de_tier_a_city_geographies_v1.sql"),
  "utf8",
)
const scopeDoc = readFileSync(join(process.cwd(), "docs/data-foundation/de-city-scope-v1.md"), "utf8")

const approvedSlugs = [
  "berlin", "munich", "hamburg", "aachen", "bonn",
  "dresden", "heidelberg", "karlsruhe", "tuebingen",
] as const

test("Germany Phase 2 normalization is bounded to the approved nine-city cohort", () => {
  for (const slug of approvedSlugs) {
    assert.match(migration, new RegExp(`'${slug}'`))
    assert.ok(scopeDoc.includes("`" + slug + "`"))
  }
  assert.match(migration, /publication_tier','A'/)
  assert.match(migration, /study_destination_scope','destatis_gvisys_municipality'/)
})

test("Germany geography normalization preserves UUIDs and defers campus membership", () => {
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
  assert.match(migration, /campus_membership_contract/)
  assert.match(migration, /phase_3_explicit_location_evidence_required/)
})

test("Germany Tier A cities carry official municipality codes and Bundesland mappings", () => {
  for (const ags of [
    "11000000", "09162000", "02000000", "05334002", "05314000",
    "14612000", "08221000", "08212000", "08416041",
  ]) assert.match(migration, new RegExp(`'${ags}'`))
  for (const region of ["BE", "BY", "HH", "NW", "SN", "BW"])
    assert.match(migration, new RegExp(`'${region}'`))
})

test("Germany public scope uses official municipality geography", () => {
  assert.match(migration, /population_geography_contract','destatis_gvisys_municipality'/)
  assert.match(migration, /Destatis GV-ISys/)
  assert.match(migration, /official_municipality_code_ags/)
})

test("Germany normalization registers deterministic canonical-name and slug aliases", () => {
  assert.match(migration, /'canonical_name'/)
  assert.match(migration, /'slug'/)
  assert.match(migration, /insert into core\.geography_aliases/i)
})
