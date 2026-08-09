import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  institutionCountryPath,
  institutionDetailPath,
  normalizeInstitutionCountrySegment,
} from "../src/lib/institutions/institution-search"
import { INDEXABLE_EU_FASTPATH_INSTITUTION_ROUTES } from "../src/lib/institutions/institution-seo-eu-fastpath"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const migration = read("supabase/migrations/20260809114500_be_ch_se_dk_institution_fastpath.sql")
const adapter = read("src/lib/institutions/eu-fastpath-institution-detail.server.ts")
const detailUi = read("src/app/(workspace)/institutions/eu-fastpath-institution-detail.tsx")
const explorer = read("src/app/(workspace)/institutions/institutions-explorer.tsx")
const sitemap = read("src/app/sitemap.ts")

test("BE CH SE DK fast-path authority identities and publication models are source-backed", () => {
  for (const system of [
    "BE_OFFICIAL_UNIVERSITY_NAME",
    "CH_ACCREDITED_UNIVERSITY_NAME",
    "SE_UKA_UNIVERSITY_NAME",
    "DK_UFM_UNIVERSITY_NAME",
  ]) assert.match(migration, new RegExp(system))
  assert.match(migration, /institution_identity_eu_fastpath_v1/)
  assert.match(migration, /institution_location_eu_fastpath_v1/)
  assert.match(migration, /institution_explorer_eu_fastpath_v1/)
  assert.match(migration, /institution_detail_eu_fastpath_v1/)
  assert.match(migration, /'coordinate_precision','not_asserted'/)
  assert.match(migration, /'campus_inventory_complete',false/)
  assert.match(migration, /program_count<>0/)
})

test("BE CH SE DK routes publish the expected 38 institution cohort", () => {
  const counts = new Map<string, number>()
  for (const [country] of INDEXABLE_EU_FASTPATH_INSTITUTION_ROUTES) {
    counts.set(country, (counts.get(country) ?? 0) + 1)
  }
  assert.deepEqual(Object.fromEntries(counts), { BE: 8, CH: 12, SE: 10, DK: 8 })
  assert.equal(INDEXABLE_EU_FASTPATH_INSTITUTION_ROUTES.length, 38)
  for (const code of ["BE", "CH", "SE", "DK"] as const) {
    assert.equal(normalizeInstitutionCountrySegment(code.toLowerCase()), code)
    assert.equal(institutionCountryPath(code), `/institutions/${code.toLowerCase()}`)
  }
  assert.equal(institutionDetailPath("BE", "KU-Leuven"), "/institutions/be/ku-leuven")
  assert.equal(institutionDetailPath("CH", "Universitat-Zurich-UZH"), "/institutions/ch/universitat-zurich-uzh")
  assert.equal(institutionDetailPath("SE", "Uppsala-University"), "/institutions/se/uppsala-university")
  assert.equal(institutionDetailPath("DK", "Aarhus-Universitet"), "/institutions/dk/aarhus-universitet")
})

test("fast-path detail and explorer keep programme zero semantics explicitly pending", () => {
  assert.match(adapter, /institution_detail_eu_fastpath_v1/)
  assert.match(adapter, /institution_identity_eu_fastpath_v1/)
  assert.match(detailUi, /Zero canonical program records do not mean this university offers no programs/)
  assert.match(detailUi, /not a claim of a complete campus inventory/)
  for (const code of ["BE", "CH", "SE", "DK"]) assert.match(explorer, new RegExp(`countryCode === "${code}"`))
})

test("sitemap includes four country explorers and shared 38-detail allowlist", () => {
  assert.match(sitemap, /INDEXABLE_EU_FASTPATH_INSTITUTION_PATHS/)
  for (const code of ["be", "ch", "se", "dk"]) assert.match(sitemap, new RegExp(`institutions/${code}`))
})
