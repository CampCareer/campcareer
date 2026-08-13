import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260813222000_saved_career_results.sql", "utf8")
const actions = readFileSync("src/app/(workspace)/home/career-result-save-actions.ts", "utf8")
const home = readFileSync("src/app/(workspace)/home/member-home-hub.tsx", "utf8")
const result = readFileSync("src/app/(workspace)/home/career-market-results.tsx", "utf8")

test("saved career results are private, minimal and unique per member selection", () => {
  assert.match(migration, /create table public\.saved_career_results/)
  assert.match(migration, /unique \(user_id, country_code, occupation_id\)/)
  assert.match(migration, /alter table public\.saved_career_results enable row level security/)
  assert.match(migration, /users_manage_own_saved_career_results/)
  assert.doesNotMatch(migration, /notes|email|citizenship_country|degree_level/)
})

test("the result button saves an idempotent selection and Home can resume it", () => {
  assert.match(result, /<CareerResultSave/)
  assert.match(actions, /onConflict: "user_id,country_code,occupation_id"/)
  assert.match(home, /SAVED CAREER RESULTS/)
  assert.match(home, /params\.set\("personalised", "1"\)/)
})
