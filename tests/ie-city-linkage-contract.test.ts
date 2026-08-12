import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260809093421_publish_ie_tier_a_city_linkage_v1.sql"),
  "utf8",
)

const tierA = ["dublin", "cork", "galway", "limerick"] as const
const verifiedInstitutions = [
  "trinity-college-dublin",
  "university-college-dublin",
  "dublin-city-university",
  "technological-university-dublin",
  "rcsi-university-of-medicine-and-health-sciences",
  "university-college-cork",
  "university-of-galway",
  "university-of-limerick",
  "mary-immaculate-college",
] as const

test("IE Phase 3 linkage is bounded to the four-city Tier A set", () => {
  assert.match(migration, /city_directory_ie_v1/)
  assert.match(migration, /city_institution_directory_ie_v1/)
  assert.match(migration, /city_programme_directory_ie_v1/)
  assert.match(migration, /expected exactly 4 cities/)
  for (const slug of tierA) assert.match(migration, new RegExp(`'${slug}'`))
})

test("initial institution publication requires HEA authority and official location evidence", () => {
  assert.match(migration, /IE_HEA_RECOGNISED_ENTITY/)
  assert.match(migration, /https:\/\/hea\.ie\/higher-education-institutions\//)
  assert.match(migration, /location_quality','verified_official'/)
  assert.match(migration, /source_tier','institution_official'/)
  assert.match(migration, /expected exactly 9 city-campus rows/)
  for (const slug of verifiedInstitutions) assert.match(migration, new RegExp(`'${slug}'`))
})

test("programme delivery remains empty until offering-to-campus evidence is verified", () => {
  assert.match(migration, /programme_assignment_verified',false/)
  assert.match(migration, /po\.verification_status='verified'/)
  assert.match(migration, /c\.metadata->>'programme_assignment_verified'='true'/)
  assert.match(migration, /programme directory must remain empty/)
  assert.match(migration, /programme_coverage_status text not null default 'verification_pending'/)
})

test("read models are service-role only", () => {
  for (const table of [
    "city_directory_ie_v1",
    "city_institution_directory_ie_v1",
    "city_programme_directory_ie_v1",
  ]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(migration, new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
    assert.match(migration, new RegExp(`grant select on public\\.${table} to service_role`))
  }
})
