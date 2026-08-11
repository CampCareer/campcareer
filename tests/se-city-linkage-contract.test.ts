import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const migration = fs.readFileSync(
  "supabase/migrations/20260810220002_publish_se_tier_a_city_linkage_v1.sql",
  "utf8",
)

test("Sweden linkage requires explicit source-city and institution match", () => {
  assert.match(migration, /SE_UNIVERSITYADMISSIONS/)
  assert.match(migration, /lower\(trim\(s\.city\)\)=lower\(trim\(g\.name\)\)/)
  assert.match(migration, /SE_UKA_UNIVERSITY_NAME/)
  assert.match(migration, /programme_assignment_verified',true/)
  assert.match(migration, /programme_location_evidence/)
})

test("Sweden city read models are service-role only", () => {
  for (const view of [
    "city_institution_directory_se_v1",
    "city_programme_directory_se_v1",
    "city_directory_se_v1",
  ]) {
    assert.ok(migration.includes(`with (security_invoker=true)`))
    assert.ok(migration.includes(`revoke all on public.${view} from public,anon,authenticated`))
    assert.ok(migration.includes(`grant select on public.${view} to service_role`))
  }
  assert.match(migration, /anchor_n<>10/)
  assert.match(migration, /programme_n<>271/)
  assert.match(migration, /city_n<>6/)
})
