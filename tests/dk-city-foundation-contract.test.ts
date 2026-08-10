import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810200934_normalize_dk_tier_a_city_geographies_v1.sql", "utf8")
const tierA = ["copenhagen", "frederiksberg", "odense", "aarhus", "aalborg"]
const tierB = ["lyngby", "roskilde"]

test("Denmark Phase 2 normalizes exactly the five locked Tier A cities", () => {
  for (const slug of tierA) assert.ok(migration.includes(`'${slug}'`))
  assert.ok(migration.includes("publication_tier','A'"))
  assert.ok(migration.includes("study_destination_scope','dst_municipality'"))
  assert.ok(migration.includes("population_geography_contract','dst_municipality'"))
  assert.ok(migration.includes("phase_3_explicit_location_evidence_required"))
  assert.ok(migration.includes("normalized_count<>5"))
})

test("Denmark municipality codes and region mappings are explicit", () => {
  for (const token of ["'101'", "'147'", "'461'", "'751'", "'851'", "'084'", "'083'", "'082'", "'081'"]) {
    assert.ok(migration.includes(token))
  }
  assert.ok(migration.includes("Copenhagen Municipality"))
  assert.ok(migration.includes("Frederiksberg Municipality"))
  assert.ok(migration.includes("Do not silently expand to Greater Copenhagen"))
})

test("Denmark Phase 2 preserves Tier B and creates aliases without new city rows", () => {
  for (const slug of tierB) assert.ok(migration.includes(`'${slug}'`))
  assert.ok(migration.includes("Tier B geographies were unexpectedly normalized"))
  assert.doesNotMatch(migration, /insert into core\.geographies/i)
  assert.ok(migration.includes("insert into core.geography_aliases"))
  assert.ok(migration.includes("København"))
  assert.ok(migration.includes("Århus"))
  assert.ok(migration.includes("Ålborg"))
})