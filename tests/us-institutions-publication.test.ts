import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
} from "../src/lib/institutions/institution-search"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const migration = read("supabase/migrations/20260809131500_us_ncses_top25_institution_publication.sql")
const server = read("src/lib/institutions/us-institution-detail.server.ts")
const ui = read("src/app/(workspace)/institutions/us-institution-detail.tsx")
const seo = read("src/lib/institutions/institution-seo-us.ts")
const sitemap = read("src/app/sitemap.ts")

test("US publication preserves IPEDS identity and selects exactly 25 NCSES launch institutions", () => {
  const cohortRows = migration.match(/\([0-9]+,'[0-9]{6}','[^']+','https:\/\//g) ?? []
  assert.equal(cohortRows.length, 25)
  assert.match(migration, /US_UNIT_ID/)
  assert.match(migration, /NCSES_FY2024_FEDERAL_SE_SUPPORT_TOP25/)
  assert.match(migration, /NCES\/IPEDS UNITID/)
  assert.match(migration, /Expected 25 US Tier A identities/)
})

test("US CIP outcome source is not fabricated into degree programs", () => {
  assert.match(migration, /CIP-field outcome data/)
  assert.match(migration, /program_count<>0/)
  assert.match(ui, /CIP outcome dataset is not treated as a degree catalogue/)
  assert.match(ui, /zero canonical program records do not mean this university offers no programs/)
})

test("US publication locations remain city-level and conservative", () => {
  assert.match(migration, /verified_ipeds_city/)
  assert.match(migration, /coordinate_precision','not_asserted'/)
  assert.match(migration, /campus_inventory_complete',false/)
  assert.match(server, /institution_detail_us_tier_a_v1/)
  assert.match(ui, /not a complete campus inventory/)
})

test("US routes publish exactly 25 Tier A institution paths", () => {
  assert.equal(normalizeInstitutionCountrySegment("us"), "US")
  assert.equal(institutionCountryPath("US"), "/institutions/us")
  assert.equal(institutionDetailPath("US", "Harvard-University"), "/institutions/us/harvard-university")
  const routes = seo.match(/\["US", "[a-z0-9-]+"\]/g) ?? []
  assert.equal(routes.length, 25)
  assert.match(sitemap, /institutions\/us/)
  assert.match(sitemap, /INDEXABLE_US_INSTITUTION_PATHS/)
})
