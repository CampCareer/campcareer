import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readRepoFile = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const migration = readRepoFile("supabase/migrations/20260808165000_ie_institution_publication_read_models.sql")
const search = readRepoFile("src/lib/institutions/institution-search.ts")
const explorerServer = readRepoFile("src/lib/institutions/institutions.server.ts")
const detailServer = readRepoFile("src/lib/institutions/institution-detail.server.ts")
const detailPage = readRepoFile("src/app/(workspace)/institutions/[country]/[institution]/page.tsx")
const ieDetail = readRepoFile("src/app/(workspace)/institutions/irish-institution-detail.tsx")
const seo = readRepoFile("src/lib/institutions/institution-seo.ts")

test("Ireland publication gate exposes only source-backed identity systems", () => {
  assert.match(migration, /institution_publication_ie_v1/)
  assert.match(migration, /IE_HEA_LISTED_HEI_NAME/)
  assert.match(migration, /IE_QQI_REVIEWED_PRIVATE_HEI_NAME/)
  assert.match(migration, /IE_QQI_PRIVATE_HEI_NAME/)
  assert.match(migration, /IE_QQI_CENTRE_NAME/)
  assert.match(migration, /IE_QQI_PROVIDER_NAME/)
  assert.match(migration, /IE_OFFICIAL_PROVIDER_NAME/)
  assert.match(migration, /publication_count<>42/)
  assert.match(migration, /publication_program_count<>2509/)
})

test("Ireland uses dedicated Explorer and Detail read models", () => {
  assert.match(explorerServer, /countryCode === "IE"/)
  assert.match(explorerServer, /institution_explorer_ie_v1/)
  assert.match(detailServer, /countryCode === "IE"/)
  assert.match(detailServer, /institution_detail_ie_v1/)
  assert.match(migration, /institution_explorer_ie_v1/)
  assert.match(migration, /institution_detail_ie_v1/)
})

test("Ireland detail renders identity provenance, operator and location language", () => {
  assert.match(detailPage, /IrishInstitutionDetailView/)
  assert.match(ieDetail, /Verified identity/)
  assert.match(ieDetail, /Operated by/)
  assert.match(ieDetail, /Locations/)
  assert.match(ieDetail, /Program detail page not yet published/)
})

test("Ireland Institution routing and SEO inventory contain the 42-profile cohort", () => {
  assert.match(search, /\["AU", "CA", "IE"\]/)
  const ieRoutes = [...seo.matchAll(/\["IE", "([a-z0-9-]+)"\]/g)].map((match) => match[1])
  assert.equal(ieRoutes.length, 42)
  assert.equal(new Set(ieRoutes).size, 42)
  assert.ok(ieRoutes.includes("atlantic-technological-university"))
  assert.ok(ieRoutes.includes("griffith-college"))
  assert.ok(ieRoutes.includes("cavan-institute"))
  assert.ok(ieRoutes.includes("iob"))
})

test("Ireland publication read models stay service-role only", () => {
  for (const view of ["institution_publication_ie_v1", "institution_explorer_ie_v1", "institution_detail_ie_v1"]) {
    assert.match(migration, new RegExp(`revoke all on public\\.${view} from public,anon,authenticated`))
    assert.match(migration, new RegExp(`grant select on public\\.${view} to service_role`))
  }
})
