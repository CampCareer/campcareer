import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readRepoFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

const identityMigration = readRepoFile(
  "supabase/migrations/20260808113500_ca_institution_identity_foundation.sql",
)
const locationMigration = readRepoFile(
  "supabase/migrations/20260808121000_ca_campus_location_quality.sql",
)
const explorerServer = readRepoFile("src/lib/institutions/institutions.server.ts")
const detailServer = readRepoFile("src/lib/institutions/institution-detail.server.ts")
const explorerUi = readRepoFile("src/app/(workspace)/institutions/institutions-explorer.tsx")
const canadianDetailUi = readRepoFile(
  "src/app/(workspace)/institutions/canadian-institution-detail.tsx",
)
const countryPage = readRepoFile("src/app/(workspace)/institutions/[country]/page.tsx")
const detailPage = readRepoFile(
  "src/app/(workspace)/institutions/[country]/[institution]/page.tsx",
)
const institutionSeo = readRepoFile("src/lib/institutions/institution-seo.ts")
const sitemap = readRepoFile("src/app/sitemap.ts")

test("Canadian publication cohort keeps 30 official DLI identities and 165 active programs", () => {
  const dliRows = identityMigration.match(/\('[^']+', 'O\d{11}'\)/g) ?? []

  assert.equal(dliRows.length, 60, "identity migration intentionally repeats the 30-row source block twice")
  assert.match(identityMigration, /Expected 30 CA_DLI identities/)
  assert.match(identityMigration, /Expected 165 active programmes/)
  assert.match(identityMigration, /institution_kind = 'university'/)
  assert.match(identityMigration, /ownership_type = 'public'/)
})

test("Canadian location publication uses exactly 60 IRCC-listed records and preserves all anchors", () => {
  assert.match(locationMigration, /verified_location_count <> 60 or verified_institution_count <> 30/)
  assert.match(locationMigration, /Expected all 165 active Canadian programme offerings to retain legacy anchors/)
  assert.match(locationMigration, /institution_location_ca_v1/)
  assert.match(locationMigration, /institution_explorer_ca_v1/)
  assert.match(locationMigration, /institution_detail_ca_v1/)
})

test("Canadian Detail exposes DLI identity and fails closed when official identity is missing", () => {
  assert.match(detailServer, /institution_identity_ca_v1/)
  assert.match(detailServer, /dli_number,dli_source_url/)
  assert.match(detailServer, /is missing its official DLI identity/)
  assert.match(canadianDetailUi, />DLI number</)
  assert.match(canadianDetailUi, /Open IRCC DLI source/)
  assert.match(canadianDetailUi, /does not mean every program is eligible for a post-graduation work permit/)
})

test("Canadian Explorer and Detail use location-safe user-facing wording", () => {
  assert.match(explorerUi, /countryCode !== "AU"/)
  assert.match(explorerUi, /"locations" : "campuses"/)
  assert.match(canadianDetailUi, />Location records</)
  assert.match(canadianDetailUi, />Study locations</)
  assert.match(canadianDetailUi, /multiple campuses or collaborative study sites exactly as IRCC groups them/)
  assert.match(countryPage, /countryCode === "AU" \? "campuses" : "locations"/)
  assert.match(detailPage, /countryCode === "AU" \? "campuses" : "locations"/)
})

test("Canadian canonical routing keeps lowercase redirects, robots and country-specific detail rendering", () => {
  assert.match(countryPage, /alternates: \{ canonical: `\/institutions\/\$\{countryCode\.toLowerCase\(\)\}` \}/)
  assert.match(countryPage, /robots: \{ index: true, follow: true \}/)
  assert.match(countryPage, /permanentRedirect\(`\/institutions\/\$\{countryCode\.toLowerCase\(\)\}`\)/)
  assert.match(detailPage, /permanentRedirect\(canonicalPath\)/)
  assert.match(detailPage, /countryCode === "CA"/)
  assert.match(detailPage, /CanadianInstitutionDetailView/)
})

test("all 30 Canadian institution detail routes remain in the canonical sitemap inventory", () => {
  const routes = institutionSeo.match(/\["CA", "[a-z0-9-]+"\]/g) ?? []

  assert.equal(routes.length, 30)
  assert.match(institutionSeo, /\["CA", "university-of-toronto"\]/)
  assert.match(institutionSeo, /\["CA", "university-of-british-columbia"\]/)
  assert.match(institutionSeo, /\["CA", "mcgill-university"\]/)
  assert.match(sitemap, /institutions\/ca/)
  assert.match(sitemap, /INDEXABLE_INSTITUTION_PATHS/)
})
