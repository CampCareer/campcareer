import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810202058_normalize_be_tier_a_city_geographies_v1.sql", "utf8")

const tierA = ["brussels", "ghent", "leuven", "antwerp", "louvain-la-neuve", "liege"]

test("Belgium Phase 2 normalizes exactly the six Tier A destinations", () => {
  for (const slug of tierA) assert.ok(migration.includes(`'${slug}'`))
  assert.ok(migration.includes("publication_tier','A'"))
  assert.ok(migration.includes("Statbel REFNIS 2025"))
  assert.ok(migration.includes("canonical_name"))
  assert.ok(migration.includes("'slug'"))
})

test("Belgium preserves special Brussels and Louvain-la-Neuve geography semantics", () => {
  assert.ok(migration.includes("brussels_capital_region"))
  assert.ok(migration.includes("statbel_brussels_capital_region"))
  assert.ok(migration.includes("louvain_la_neuve_study_destination"))
  assert.ok(migration.includes("statbel_ottignies_louvain_la_neuve_municipality"))
  assert.ok(migration.includes("'25121'"))
  assert.ok(migration.includes("public_destination_not_municipality"))
})
