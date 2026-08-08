import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260808210529_publish_uk_tier_a_city_linkage_v1.sql"),
  "utf8",
)
const linkageDoc = readFileSync(join(process.cwd(), "docs/data-foundation/uk-city-linkage-v1.md"), "utf8")

const tierASlugs = [
  "london",
  "manchester",
  "birmingham",
  "edinburgh",
  "glasgow",
  "cardiff",
  "belfast",
  "oxford",
  "cambridge",
  "bristol",
] as const

test("UK Phase 3 publishes exactly the ten approved Tier A cities", () => {
  assert.match(migration, /city_directory_uk_v1/)
  assert.match(migration, /publication_tier'='A'/)
  assert.match(migration, /count\(\*\) from public\.city_directory_uk_v1\) <> 10/)
  assert.match(linkageDoc, /10 Tier A cities/)
  for (const slug of tierASlugs) {
    assert.match(linkageDoc, new RegExp(`\\b${slug}\\b`, "i"))
  }
})

test("UK institution linkage requires canonical identity and official location evidence", () => {
  assert.match(migration, /city_institution_directory_uk_v1/)
  assert.match(migration, /identifier_system='UK_UKPRN'/)
  assert.match(migration, /identifier_value ~ '\^\[0-9\]\{8\}\$'/)
  assert.match(migration, /location_quality'='verified_official'/)
  assert.match(migration, /c\.source_url is not null/)
  assert.match(migration, /i\.slug is not null/)
  assert.match(migration, /i\.website_url is not null/)
  assert.doesNotMatch(migration, /location_quality'='legacy_city'.*insert into public\.city_institution_directory_uk_v1/s)
})

test("London follows Greater London scope while Manchester never absorbs Salford", () => {
  assert.match(migration, /t\.slug='london' and c\.region='London'/)
  assert.match(migration, /verified_official_location_within_greater_london/)
  assert.match(migration, /c\.slug='manchester' and d\.institution_slug='university-of-salford'/)
  assert.match(migration, /Manchester city scope must not absorb University of Salford/)
  assert.match(linkageDoc, /Brunel University of London's verified Uxbridge location/)
  assert.match(linkageDoc, /University of Salford.*Salford/s)
})

test("programme linkage is explicit and never inferred from institution presence", () => {
  assert.match(migration, /city_programme_directory_uk_v1/)
  assert.match(migration, /join catalog\.programme_offerings po\s+on po\.campus_id=c\.id/)
  assert.match(migration, /po\.verification_status='verified'/)
  assert.match(migration, /po\.source_url is not null/)
  assert.match(migration, /programme_assignment_verified'='true'/)
  assert.match(migration, /verified_programme_offerings\.campus_id/)
  assert.match(linkageDoc, /0 verified city-programme links/)
})

test("Phase 3 read models stay service-role only", () => {
  for (const table of [
    "city_directory_uk_v1",
    "city_institution_directory_uk_v1",
    "city_programme_directory_uk_v1",
  ]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(migration, new RegExp(`revoke all on public\\.${table} from public, anon, authenticated`))
    assert.match(migration, new RegExp(`grant select on public\\.${table} to service_role`))
  }
})
