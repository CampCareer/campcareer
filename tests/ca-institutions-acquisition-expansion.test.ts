import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  "supabase/migrations/20260808173500_ca_institution_acquisition_expansion.sql",
  "utf8",
)

test("Canada acquisition expands the canonical cohort without fuzzy program joins", () => {
  assert.ok(migration.includes("Expected 62 active Canadian institutions after acquisition"))
  assert.ok(migration.includes("Expected 49 deterministic Canada program-catalog institution identities"))
  assert.ok(migration.includes("CA_PROGRAM_CATALOG_ID"))
  assert.ok(migration.includes("('universite-laval','universit-laval')"))
  assert.ok(migration.includes("It is not a regulatory identifier"))
})

test("Canada acquisition keeps official DLI identity separate from internal staging identity", () => {
  assert.ok(migration.includes("'CA_DLI'"))
  assert.ok(migration.includes("Expected 61 Canadian DLI identities after acquisition"))
  assert.ok(migration.includes("Nunavut Arctic College must not receive a fabricated CA_DLI identity"))
  assert.ok(migration.includes("institution_program_catalog_identity_ca_v1"))
  assert.ok(migration.includes("security_invoker=true"))
  assert.ok(migration.includes("revoke all on public.institution_program_catalog_identity_ca_v1 from public,anon,authenticated"))
  assert.ok(migration.includes("grant select on public.institution_program_catalog_identity_ca_v1 to service_role"))
})

test("Canada acquisition classifies only the source-backed 32 new public institutions", () => {
  assert.ok(migration.includes("Expected 32 newly acquired Canadian institutions"))
  assert.ok(migration.includes("Expected all 32 acquired Canadian institutions to be source-backed public institutions"))
  assert.ok(migration.includes("Expected HTTPS official websites for all 32 acquired Canadian institutions"))
  assert.ok(migration.includes("'George Brown Polytechnic','polytechnic','public'"))
  assert.ok(migration.includes("'Seneca Polytechnic','polytechnic','public'"))
  assert.ok(migration.includes("'Humber Polytechnic','polytechnic','public'"))
  assert.ok(migration.includes("'Yukon University','university','public'"))
})
