import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const migrationPath = "supabase/migrations/20260815222000_campus_value_pipeline_foundation.sql"

async function migrationSql() {
  return readFile(migrationPath, "utf8")
}

test("Campus pipeline converges legacy Career programme refs on canonical programme UUIDs", async () => {
  const sql = await migrationSql()
  assert.match(sql, /add column if not exists programme_id uuid/i)
  assert.match(sql, /references catalog\.programmes\(id\)/i)
  assert.match(sql, /country_occupation_program_links_canonical_uidx/i)
})

test("Campus read model is server-only and security-invoker", async () => {
  const sql = await migrationSql()
  assert.match(sql, /campus_programme_value_inputs_v1[\s\S]*security_invoker\s*=\s*true/i)
  assert.match(sql, /revoke all on public\.campus_programme_value_inputs_v1 from public, anon, authenticated/i)
  assert.match(sql, /grant select on public\.campus_programme_value_inputs_v1 to service_role/i)
  assert.doesNotMatch(sql, /grant\s+select[\s\S]*campus_programme_value_inputs_v1[\s\S]*to\s+(anon|authenticated)/i)
})

test("Campus read model admits only verified canonical evidence", async () => {
  const sql = await migrationSql()
  assert.match(sql, /o\.verification_status = 'verified'/i)
  assert.match(sql, /r\.review_status = 'verified'/i)
  assert.match(sql, /a\.review_status = 'verified'/i)
  assert.match(sql, /o\.review_status = 'verified'/i)
  assert.match(sql, /o\.institution_id is not null/i)
  assert.match(sql, /o\.field_code is not null/i)
  assert.match(sql, /o\.qualification_level_id is not null/i)
})

test("Campus methodology records the locked score weights and readiness gate", async () => {
  const sql = await migrationSql()
  assert.match(sql, /'earnings_weight', 0\.45/i)
  assert.match(sql, /'employment_weight', 0\.30/i)
  assert.match(sql, /'affordability_weight', 0\.25/i)
  assert.match(sql, /'minimum_complete_rows', 5/i)
  assert.match(sql, /'minimum_providers', 3/i)
  assert.match(sql, /'external_rankings_in_score', false/i)
})

test("new Campus model does not depend on the historical ROI explorer view", async () => {
  const sql = await migrationSql()
  assert.doesNotMatch(sql, /roi_explorer_au/i)
})
