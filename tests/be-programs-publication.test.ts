import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path: string) => readFileSync(path, "utf8")
const foundation = read("supabase/migrations/20260809212302_be_program_staging_foundation.sql")
const canonical = read("supabase/migrations/20260809212932_be_program_canonicalization_publication.sql")
const security = read("supabase/migrations/20260809212947_be_program_publication_security_invoker.sql")
const server = read("src/lib/programs/be-programs.server.ts")
const seo = read("src/lib/programs/be-program-seo.ts")
const detail = read("src/app/(workspace)/programs/be/[program]/page.tsx")
const explorer = read("src/app/(workspace)/programs/be-programs-explorer.tsx")
const page = read("src/app/(workspace)/programs/page.tsx")
const header = read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap = read("src/app/sitemap.ts")

test("Belgium staging remains private and separates programme, career and international evidence", () => {
  for (const table of ["program_catalog_be_staging", "program_occupation_be_staging", "program_international_be_staging"]) {
    assert.match(foundation, new RegExp(`create table if not exists public\\.${table}`))
    assert.match(foundation, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(foundation, new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
  }
  assert.match(foundation, /eligible_schedule_unknown/)
  assert.match(foundation, /not_yet_open/)
  assert.match(foundation, /restricted/)
  assert.match(foundation, /relation_type/)
})

test("Belgium canonical publication preserves source identity without inventing accreditation claims", () => {
  assert.match(canonical, /BE_OFFICIAL_PROGRAM_KEY/)
  assert.match(canonical, /BE_OFFICIAL/)
  assert.match(canonical, /program_explorer_be_v1/)
  assert.match(canonical, /program_detail_be_v1/)
  assert.doesNotMatch(canonical, /insert into catalog\.programme_accreditations/i)
  assert.match(canonical, /false has_programme_accreditation_claim/)
  assert.match(canonical, /NVAO recognition/)
  assert.match(canonical, /decision-level matching/)
})

test("Belgium publication views execute as invoker and remain service-role only", () => {
  assert.match(canonical, /security_invoker=true/)
  assert.match(security, /alter view public\.program_explorer_be_v1 set \(security_invoker=true\)/)
  assert.match(security, /alter view public\.program_detail_be_v1 set \(security_invoker=true\)/)
  assert.match(security, /revoke all on public\.program_explorer_be_v1 from public,anon,authenticated/)
  assert.match(security, /grant select on public\.program_explorer_be_v1 to service_role/)
})

test("Belgium server and UI separate programme identity from applicant-specific admission", () => {
  assert.match(server, /program_explorer_be_v1/)
  assert.match(server, /program_detail_be_v1/)
  assert.match(server, /international_admission_status/)
  assert.match(explorer, /Applicant-specific international route/)
  assert.match(explorer, /Next verified cycle not yet open/)
  assert.match(explorer, /current window unknown/)
  assert.match(detail, /nationality, residence or visa category/)
  assert.match(detail, /NVAO recognition and French-Community quality assurance are real quality frameworks/)
  assert.match(detail, /not claims of Belgian professional recognition, protected-title eligibility, licensing or guaranteed employment/)
})

test("Belgium is published in the shared Programs route while Spain remains unpublished", () => {
  assert.match(header, /\["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE"\]/)
  assert.match(page, /searchBePrograms/)
  assert.match(page, /BeProgramsExplorer/)
  assert.match(page, /\["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE"\]/)
  assert.doesNotMatch(page, /searchEsPrograms/)
  assert.doesNotMatch(header, /"BE", "ES"/)
})

test("Belgium SEO indexes exactly 96 source-backed applicant routes", () => {
  const matches = [...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map((match) => match[1])
  assert.equal(matches.length, 96)
  assert.equal(new Set(matches).size, 96)
  assert.ok(matches.includes("universiteit-antwerpen-master-of-computer-science-master"))
  assert.ok(matches.includes("universite-catholique-de-louvain-master-in-data-science-engineering-master"))
  assert.ok(matches.includes("vrije-universiteit-brussel-master-of-science-in-business-engineering-master"))
  assert.ok(!matches.includes("ku-leuven-master-of-computer-science-master"))
  assert.ok(!matches.includes("universiteit-gent-master-of-science-in-computer-science-engineering-master"))
  assert.match(sitemap, /INDEXABLE_BE_PROGRAM_PATHS/)
})
