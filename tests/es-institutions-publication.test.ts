import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
} from "../src/lib/institutions/institution-search"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const identity = read("supabase/migrations/20260809093000_es_major_public_university_identity_foundation.sql")
const locations = read("supabase/migrations/20260809093500_es_major_public_university_location_quality.sql")
const publication = read("supabase/migrations/20260809094000_es_publication_read_models.sql")
const detailAdapter = read("src/lib/institutions/spain-institution-detail.server.ts")
const detailUi = read("src/app/(workspace)/institutions/spain-institution-detail.tsx")
const seo = read("src/lib/institutions/institution-seo-es.ts")
const sitemap = read("src/app/sitemap.ts")

test("ES Tier A publishes ten source-backed public universities without inventing a numeric RUCT ID", () => {
  const canonicalRows = identity.match(/\('(?:[^']|'')+', '[a-z0-9-]+', '(?:[^']|'')+', 'https:\/\/[^']+', 'https:\/\/[^']+'\)/g) ?? []
  assert.equal(canonicalRows.length, 10)
  assert.match(identity, /ES_OFFICIAL_UNIVERSITY_NAME/)
  assert.match(identity, /do not invent a numeric RUCT identifier/i)
  assert.match(identity, /ownership_type is distinct from 'public'/)
  assert.match(identity, /Euskal Herriko Unibertsitatea \(EHU\)/)
})

test("ES location layer publishes ten administrative locations without inferred campus precision", () => {
  assert.match(locations, /primary_administrative_location/)
  assert.match(locations, /UNIVERSITY_OFFICIAL_CONTACT/)
  assert.match(locations, /'coordinate_precision','not_asserted'/)
  assert.match(locations, /'campus_inventory_complete',false/)
  assert.match(locations, /Expected 10 ES Tier A locations/)
})

test("ES programme linkage remains explicitly pending while publication read models are live", () => {
  assert.match(publication, /institution_explorer_es_v1/)
  assert.match(publication, /institution_detail_es_v1/)
  assert.match(publication, /program_count<>0/)
  assert.match(detailAdapter, /institution_identity_es_v1/)
  assert.match(detailAdapter, /source-backed official identity/)
  assert.match(detailUi, /CampCareer has not published the Spain program catalogue yet/)
  assert.match(detailUi, /numeric RUCT institution code is not shown unless separately verified/)
})

test("ES routes and SEO publish exactly ten canonical Tier A institution paths", () => {
  assert.equal(normalizeInstitutionCountrySegment("es"), "ES")
  assert.equal(institutionCountryPath("ES"), "/institutions/es")
  assert.equal(
    institutionDetailPath("ES", "Universidad-Complutense-de-Madrid"),
    "/institutions/es/universidad-complutense-de-madrid",
  )

  const seoRoutes = seo.match(/\["ES", "[a-z0-9-]+"\]/g) ?? []
  assert.equal(seoRoutes.length, 10)
  assert.match(seo, /euskal-herriko-unibertsitatea/)
  assert.match(seo, /universitat-politecnica-de-catalunya/)
  assert.match(sitemap, /institutions\/es/)
  assert.match(sitemap, /INDEXABLE_ES_INSTITUTION_PATHS/)
})
