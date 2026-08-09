import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
} from "../src/lib/institutions/institution-search"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const migration = read("supabase/migrations/20260809124500_ae_group1_university_fastpath.sql")
const server = read("src/lib/institutions/ae-institution-detail.server.ts")
const ui = read("src/app/(workspace)/institutions/authority-fastpath-institution-detail.tsx")
const seo = read("src/lib/institutions/institution-seo-ae.ts")
const sitemap = read("src/app/sitemap.ts")

test("UAE fastpath publishes the five CAA-active Group 1 launch institutions", () => {
  const cohortRows = migration.match(/\('[A-Z][A-Z ,'-]+','[^']+','[a-z0-9-]+','https:\/\//g) ?? []
  assert.equal(cohortRows.length, 5)
  assert.match(migration, /AE_CAA_ACTIVE_HEI_NAME/)
  assert.match(migration, /UAE_MOE_2024_RESEARCH_CLUSTER_GROUP1/)
  assert.match(migration, /Expected 5 AE identities/)
})

test("UAE publication keeps programme data pending and location precision conservative", () => {
  assert.match(migration, /program_count<>0/)
  assert.match(migration, /coordinate_precision','not_asserted'/)
  assert.match(migration, /campus_inventory_complete',false/)
  assert.match(server, /institution_detail_ae_v1/)
  assert.match(server, /institution_identity_ae_v1/)
  assert.match(ui, /Zero canonical program records do not mean this university offers no programs/)
})

test("UAE routes and sitemap publish exactly five canonical institution paths", () => {
  assert.equal(normalizeInstitutionCountrySegment("ae"), "AE")
  assert.equal(institutionCountryPath("AE"), "/institutions/ae")
  assert.equal(institutionDetailPath("AE", "Khalifa-University"), "/institutions/ae/khalifa-university")
  const routes = seo.match(/\["AE", "[a-z0-9-]+"\]/g) ?? []
  assert.equal(routes.length, 5)
  assert.match(sitemap, /institutions\/ae/)
  assert.match(sitemap, /INDEXABLE_AE_INSTITUTION_PATHS/)
})
