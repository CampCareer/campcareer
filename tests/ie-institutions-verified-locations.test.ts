import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readRepoFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

const migration = readRepoFile(
  "supabase/migrations/20260808142000_ie_verified_campus_locations.sql",
)

test("Ireland verified location cohort contains 69 official rows", () => {
  const match = migration.match(
    /with location_rows\([\s\S]*?\) as \(\nvalues\n([\s\S]*?)\n\),\nresolved as \(/,
  )

  assert.ok(match, "expected official Ireland location values block")
  const rows = match[1]
    .split("\n")
    .filter((line) => line.trim().startsWith("('"))

  assert.equal(rows.length, 69)
  assert.match(migration, /verified_location_count<>69 or verified_institution_count<>23/)
})

test("Ireland verified locations cover the HEA 17 and QQI private HEI 6 cohorts", () => {
  assert.match(migration, /institution_identity_ie_v1/)
  assert.match(migration, /hea_verified_count<>17/)
  assert.match(migration, /institution_identity_ie_qqi_private_v1/)
  assert.match(migration, /qqi_private_verified_count<>6/)
})

test("Ireland location publication prefers verified official rows and falls back only when needed", () => {
  assert.match(migration, /location_quality','verified_official'/)
  assert.match(migration, /display_policy','preferred'/)
  assert.match(migration, /not exists \([\s\S]*?from verified v[\s\S]*?v\.institution_id=c\.institution_id/)
  assert.match(migration, /displayed_institution_count<>183/)
})

test("verified display locations never replace programme-offering anchors", () => {
  assert.match(migration, /active_offering_count<>2876/)
  assert.match(migration, /legacy_anchor_offering_count<>2876/)
  assert.match(migration, /verified_offering_anchor_count<>0/)
})

test("representative multi-campus institutions are source-backed", () => {
  assert.match(migration, /'atlantic-technological-university', 'sligo'/)
  assert.match(migration, /'dublin-city-university', 'glasnevin'/)
  assert.match(migration, /'south-east-technological-university', 'waterford-cork-road'/)
  assert.match(migration, /'technological-university-of-the-shannon', 'athlone'/)
  assert.match(migration, /'griffith-college', 'dublin'/)
  assert.match(migration, /'national-college-of-ireland', 'spencer-dock'/)
  assert.match(migration, /c\.source_url is null or c\.source_url !~ '\^https:\/\/'/)
})

test("Open Training College uses its current official website", () => {
  assert.match(migration, /website_url='https:\/\/opentrainingcollege\.com\/'/)
})
