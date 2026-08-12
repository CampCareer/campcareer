import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const locationMigration = fs.readFileSync(
  "supabase/migrations/20260811125300_verify_no_tier_a_study_locations_v1.sql",
  "utf8",
)
const readModelMigration = fs.readFileSync(
  "supabase/migrations/20260811125400_publish_no_tier_a_city_read_models_v1.sql",
  "utf8",
)

test("Norway Phase 3 verifies six representative study locations without claiming complete campus inventory", () => {
  assert.match(locationMigration, /verified Tier A study locations expected 6/)
  assert.match(locationMigration, /programme_assignment_verified',true/)
  assert.match(locationMigration, /campus_inventory_complete',false/)
  assert.match(locationMigration, /no_city_linkage_v1/)
})

test("Norway Phase 3 requires exact Study in Norway programme provenance and source-city agreement", () => {
  assert.match(readModelMigration, /po\.source_system='NO_STUDYINNORWAY'/)
  assert.match(readModelMigration, /lower\(trim\(s\.city\)\)=lower\(trim\(g\.name\)\)/)
  assert.match(readModelMigration, /programme linkage expected 97 rows/)
  assert.match(readModelMigration, /city directory expected 5 rows/)
  assert.match(readModelMigration, /programme source-city mismatch detected/)
  assert.match(readModelMigration, /Excluded Norway city leaked into Tier A read model/)
})

test("Norway Phase 3 read models remain server-side service-role surfaces", () => {
  for (const view of [
    "city_institution_directory_no_v1",
    "city_programme_directory_no_v1",
    "city_directory_no_v1",
  ]) {
    assert.ok(readModelMigration.includes(`create or replace view public.${view} with (security_invoker=true)`))
    assert.ok(readModelMigration.includes(`grant select on public.${view} to service_role`))
  }
})
