import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260813115529_saved_career_results.sql", "utf8")

test("saved career results are unique per user, country and canonical career", () => {
  assert.match(migration, /unique \(user_id, country_code, career_id\)/i)
  assert.match(migration, /country_code text not null/i)
  assert.match(migration, /career_id text not null/i)
})

test("saved career results are restricted to the authenticated owner", () => {
  assert.match(migration, /enable row level security/i)
  assert.match(migration, /for select to authenticated/i)
  assert.match(migration, /for insert to authenticated/i)
  assert.match(migration, /for update to authenticated/i)
  assert.match(migration, /for delete to authenticated/i)
  assert.match(migration, /auth\.uid\(\)[\s\S]*user_id/i)
  assert.match(migration, /revoke all privileges[\s\S]*from anon, authenticated/i)
})
