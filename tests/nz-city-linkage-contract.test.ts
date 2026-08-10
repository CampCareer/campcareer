import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260809121651_publish_nz_tier_a_city_linkage_v1.sql"),
  "utf8",
)
const scope = readFileSync(join(process.cwd(), "docs/data-foundation/nz-city-scope-v1.md"), "utf8")

const tierA = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"] as const
const tierB = ["palmerston-north", "lincoln", "tauranga"] as const

test("NZ Phase 3 is bounded to the five approved Tier A cities", () => {
  for (const slug of tierA) assert.match(migration, new RegExp(`'${slug}'`))
  for (const slug of tierB) assert.match(scope, new RegExp("`" + slug + "`"))
  assert.match(migration, /publication_tier'='A'/)
  assert.match(migration, /city directory expected 5/)
})

test("NZ city linkage requires official teaching-campus evidence", () => {
  assert.match(migration, /verified_teaching_campus/)
  assert.match(migration, /verified_official/)
  assert.match(migration, /institution_official/)
  assert.match(migration, /NZ_MOE_PROVIDER_NUMBER/)
  assert.match(migration, /institution directory expected 10/)
  assert.match(migration, /coordinate_precision','not_asserted'/)
})

test("NZ representative campus set includes the intended multi-city university links", () => {
  for (const provider of [
    "university-of-auckland",
    "auckland-university-of-technology",
    "massey-university",
    "university-of-canterbury",
    "university-of-waikato",
    "victoria-university-of-wellington",
    "university-of-otago",
  ]) assert.match(migration, new RegExp(`'${provider}'`))

  assert.match(migration, /University of Otago, Christchurch/)
  assert.match(migration, /University of Otago, Wellington/)
  assert.match(migration, /Wellington Pukeahu Campus/)
})

test("NZ city read models are service-role-only security-invoker views", () => {
  for (const view of [
    "city_directory_nz_v1",
    "city_institution_directory_nz_v1",
    "city_programme_directory_nz_v1",
  ]) assert.match(migration, new RegExp(view))

  assert.match(migration, /security_invoker=true/g)
  assert.match(migration, /revoke all on public\.city_directory_nz_v1 from public,anon,authenticated/)
  assert.match(migration, /grant select on public\.city_directory_nz_v1 to service_role/)
})

test("NZ programme coverage remains pending without explicit programme-to-campus evidence", () => {
  assert.match(migration, /programme_assignment_verified'='true'/)
  assert.match(migration, /po\.verification_status='verified'/)
  assert.match(migration, /verified_programme_offerings\.campus_id/)
  assert.match(migration, /NZ programme directory must remain empty/)
  assert.doesNotMatch(migration, /insert into catalog\.programmes/i)
})
