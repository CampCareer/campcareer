import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync(
  new URL("../supabase/migrations/20260808162500_ie_education_organization_relationships.sql", import.meta.url),
  "utf8",
)

test("Ireland models ETBs outside the learner-facing Institution table", () => {
  assert.match(migration, /create table if not exists catalog\.education_organizations/)
  assert.match(migration, /create table if not exists catalog\.institution_organization_relationships/)
  assert.match(migration, /education_training_board/)
  assert.match(migration, /operated_by/)
})

test("Ireland ETB v1 covers the three official operators and eight FET centres", () => {
  assert.match(migration, /Cavan and Monaghan Education and Training Board/)
  assert.match(migration, /Cork Education and Training Board/)
  assert.match(migration, /Louth and Meath Education and Training Board/)
  assert.match(migration, /org_count<>3/)
  assert.match(migration, /relationship_count<>8 or centre_count<>8/)
})

test("Ireland ETB relations preserve centre-level programme ownership", () => {
  assert.match(migration, /active_program_count<>2876/)
  assert.doesNotMatch(migration, /update\s+catalog\.programmes/i)
  assert.doesNotMatch(migration, /set\s+institution_id/i)
})

test("Ireland operator view is security-invoker and service-role only", () => {
  assert.match(migration, /institution_operator_ie_v1/)
  assert.match(migration, /with \(security_invoker=true\)/)
  assert.match(migration, /revoke all on public\.institution_operator_ie_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.institution_operator_ie_v1 to service_role/)
  assert.match(migration, /has_table_privilege\('anon'/)
  assert.match(migration, /has_table_privilege\('service_role'/)
})
