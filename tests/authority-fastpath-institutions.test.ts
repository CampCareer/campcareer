import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
} from "../src/lib/institutions/institution-search"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const migration = read("supabase/migrations/20260809121500_fi_no_jp_kr_institution_fastpath.sql")
const server = read("src/lib/institutions/authority-fastpath-institution-detail.server.ts")
const ui = read("src/app/(workspace)/institutions/authority-fastpath-institution-detail.tsx")
const seo = read("src/lib/institutions/institution-seo-authority-fastpath.ts")
const sitemap = read("src/app/sitemap.ts")

test("authority fastpath publishes 40 universities and keeps programme linkage pending", () => {
  const cohort = migration.match(/insert into tmp_authority_fastpath values\n([\s\S]*?);\n\ninsert into catalog\.institutions/)
  assert.ok(cohort)
  const cohortRows = cohort[1].match(/\('(FI|NO|JP|KR)','/g) ?? []
  assert.equal(cohortRows.length, 40)
  assert.match(migration, /Expected 40 authority fastpath explorer rows/)
  assert.match(migration, /program_count<>0/)
  assert.match(migration, /coordinate_precision','not_asserted'/)
  assert.match(migration, /campus_inventory_complete',false/)
})

test("current authority cohorts preserve important 2026 identity changes", () => {
  assert.match(migration, /Institute of Science Tokyo/)
  assert.doesNotMatch(migration, /Tokyo Institute of Technology/)
  assert.doesNotMatch(migration, /Tokyo Medical and Dental University/)
  assert.match(migration, /The University of Osaka/)
  assert.match(migration, /NOKUT_UNIVERSITIES/)
  assert.match(migration, /NIIED_STUDY_IN_KOREA_IEQAS/)
  assert.match(migration, /EDUFI_STUDY_IN_FINLAND/)
})

test("authority fastpath uses dedicated publication views and pending-copy UI", () => {
  assert.match(server, /institution_detail_authority_fastpath_v1/)
  assert.match(server, /institution_identity_authority_fastpath_v1/)
  assert.match(ui, /Zero canonical program records do not mean this university offers no programs/)
  assert.match(ui, /complete campus inventory/)
})

test("FI NO JP KR routes are normalized and 40 SEO paths are published", () => {
  for (const code of ["FI", "NO", "JP", "KR"] as const) {
    assert.equal(normalizeInstitutionCountrySegment(code.toLowerCase()), code)
    assert.equal(institutionCountryPath(code), `/institutions/${code.toLowerCase()}`)
  }
  assert.equal(institutionDetailPath("JP", "The-University-of-Osaka"), "/institutions/jp/the-university-of-osaka")
  const seoRoutes = seo.match(/\["(FI|NO|JP|KR)", "[a-z0-9-]+"\]/g) ?? []
  assert.equal(seoRoutes.length, 40)
  assert.match(sitemap, /institutions\/fi/)
  assert.match(sitemap, /institutions\/no/)
  assert.match(sitemap, /institutions\/jp/)
  assert.match(sitemap, /institutions\/kr/)
  assert.match(sitemap, /INDEXABLE_AUTHORITY_FASTPATH_INSTITUTION_PATHS/)
})
