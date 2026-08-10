import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810201203_publish_dk_tier_a_city_linkage_v1.sql", "utf8")

test("Denmark Phase 3 publishes seven official Tier A university locations", () => {
  for (const token of ["Campus Aalborg", "Nordre Ringgade 1", "CBS Solbjerg Plads", "Rued Langgaards Vej 7", "Krystalgade 25", "Campusvej 55", "Campus Copenhagen"]) assert.ok(migration.includes(token))
  assert.ok(migration.includes("dk_city_linkage_v1"))
  assert.ok(migration.includes("verified_official"))
  assert.ok(migration.includes("programme_assignment_verified',true"))
  assert.ok(migration.includes("anchor_n<>7"))
})

test("programme delivery requires exact source city and verified campus linkage", () => {
  assert.ok(migration.includes("DK_STUDYINDENMARK"))
  assert.ok(migration.includes("po.verification_status='verified'"))
  assert.ok(migration.includes("p.verification_tier in ('A','B')"))
  assert.ok(migration.includes("lower(trim(p.city))=lower(trim(g.name))"))
  assert.ok(migration.includes("p.official_program_url is not null"))
  assert.ok(migration.includes("programme_n<>115"))
})

test("DK city read models use UFM identity and service-role-only security-invoker views", () => {
  for (const view of ["city_institution_directory_dk_v1", "city_programme_directory_dk_v1", "city_directory_dk_v1"]) {
    assert.ok(migration.includes(`view public.${view} with (security_invoker=true)`))
    assert.ok(migration.includes(`grant select on public.${view} to service_role`))
  }
  assert.ok(migration.includes("DK_UFM_UNIVERSITY_NAME"))
  assert.ok(migration.includes("university_core_professional_providers_pending"))
  assert.ok(migration.includes("verified_partial"))
})