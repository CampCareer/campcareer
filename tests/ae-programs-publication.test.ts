import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { INDEXABLE_AE_PROGRAM_SLUGS, aeProgramDetailPath, isIndexableAeProgramSlug } from "../src/lib/programs/ae-program-seo"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const staging = read("supabase/migrations/20260809104500_ae_program_staging_foundation.sql")
const publication = read("supabase/migrations/20260809110000_ae_program_canonicalization_publication.sql")
const server = read("src/lib/programs/ae-programs.server.ts")
const explorer = read("src/app/(workspace)/programs/ae-programs-explorer.tsx")
const detail = read("src/app/(workspace)/programs/ae/[program]/page.tsx")
const programsPage = read("src/app/(workspace)/programs/page.tsx")
const header = read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap = read("src/app/sitemap.ts")

test("UAE staging keeps accreditation separate from international admission", () => {
  assert.match(staging, /program_catalog_ae_staging/)
  assert.match(staging, /program_international_ae_staging/)
  assert.match(staging, /international_admission_status/)
  assert.match(staging, /never inferred solely from accreditation/)
  assert.match(publication, /case when x\.international_students_eligible is true then 'international'/)
})

test("UAE publication uses canonical read models and service-role security", () => {
  assert.match(publication, /program_explorer_ae_v1/)
  assert.match(publication, /program_detail_ae_v1/)
  assert.match(publication, /program_occupation_ae_v1/)
  assert.match(publication, /security_invoker=true/)
  assert.match(publication, /revoke all on public\.program_explorer_ae_v1 from public,anon,authenticated/)
  assert.match(server, /program_explorer_ae_v1/)
  assert.match(server, /program_detail_ae_v1/)
})

test("UAE pages never equate active accreditation with open applications", () => {
  assert.match(explorer, /active CAA record never implies applications are open/i)
  assert.match(detail, /Accreditation confirms the program record\. It does not establish that an international application window is currently open/)
  assert.match(detail, /International admission not yet verified/)
  assert.match(detail, /Current application cycle closed/)
  assert.match(detail, /International admission restricted/)
})

test("UAE explorer is published while unready countries remain coming soon", () => {
  assert.match(programsPage, /filters\.country === "AE"/)
  assert.match(programsPage, /searchAePrograms/)
  assert.match(header, /PUBLISHED_PROGRAM_COUNTRIES/)
  assert.match(header, /"AE"/)
  assert.match(explorer, /69 of the 80 CampCareer target careers/)
})

test("UAE SEO exposes exactly 37 Tier A program routes", () => {
  assert.equal(INDEXABLE_AE_PROGRAM_SLUGS.length, 37)
  assert.equal(new Set(INDEXABLE_AE_PROGRAM_SLUGS).size, 37)
  assert.equal(aeProgramDetailPath("efta-integrated-atpl"), "/programs/ae/efta-integrated-atpl")
  assert.equal(isIndexableAeProgramSlug("efta-integrated-atpl"), true)
  assert.equal(isIndexableAeProgramSlug("unknown-program"), false)
  assert.match(sitemap, /INDEXABLE_AE_PROGRAM_PATHS/)
})
