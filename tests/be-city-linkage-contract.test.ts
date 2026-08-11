import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const migration = readFileSync("supabase/migrations/20260810202226_publish_be_tier_a_city_linkage_v1.sql", "utf8")

test("Belgium Phase 3 uses explicit official teaching locations", () => {
  for (const marker of ["ULB Solbosch Campus", "VUB Main Campus Brussels", "UGent Campus UFO", "KU Leuven Group T Campus", "University of Antwerp Stadscampus", "UCLouvain Louvain-la-Neuve Campus", "ULiège Sart Tilman Campus"]) assert.ok(migration.includes(marker))
  assert.ok(migration.includes("verified_teaching_campus"))
  assert.ok(migration.includes("verified_official"))
  assert.ok(migration.includes("programme_assignment_verified',false"))
  assert.ok(migration.includes("campus_inventory_complete',false"))
})

test("Belgium city read models are server-role only and programme delivery is not inferred", () => {
  for (const view of ["city_institution_directory_be_v1", "city_programme_directory_be_v1", "city_directory_be_v1"]) {
    assert.ok(migration.includes(`view public.${view} with (security_invoker=true)`))
    assert.ok(migration.includes(`grant select on public.${view} to service_role`))
  }
  assert.ok(migration.includes("revoke all on public.city_institution_directory_be_v1 from public,anon,authenticated"))
  assert.ok(migration.includes("programme directory must remain empty until explicit campus assignment evidence exists"))
  assert.ok(migration.includes("initial_verified_university_set"))
})
