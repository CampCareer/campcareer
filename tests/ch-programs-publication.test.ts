import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path: string) => readFileSync(path, "utf8")
const foundation = read("supabase/migrations/20260809204016_ch_program_staging_foundation.sql")
const canonical = read("supabase/migrations/20260809204649_ch_program_canonicalization_publication.sql")
const security = read("supabase/migrations/20260809204655_ch_program_publication_security_invoker.sql")
const server = read("src/lib/programs/ch-programs.server.ts")
const seo = read("src/lib/programs/ch-program-seo.ts")
const detail = read("src/app/(workspace)/programs/ch/[program]/page.tsx")
const explorer = read("src/app/(workspace)/programs/ch-programs-explorer.tsx")
const page = read("src/app/(workspace)/programs/page.tsx")
const header = read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap = read("src/app/sitemap.ts")

test("Switzerland staging remains private and separates programme, career and international evidence", () => {
  for (const table of ["program_catalog_ch_staging", "program_occupation_ch_staging", "program_international_ch_staging"]) {
    assert.match(foundation, new RegExp(`create table if not exists public\\.${table}`))
    assert.match(foundation, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(foundation, new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
  }
  assert.match(foundation, /eligible_schedule_unknown/)
  assert.match(foundation, /not_yet_open/)
  assert.match(foundation, /relation_type/)
})

test("Switzerland canonical publication preserves source identity without inventing programme accreditation", () => {
  assert.match(canonical, /CH_OFFICIAL_PROGRAM_KEY/)
  assert.match(canonical, /CH_SWISSUNIVERSITIES/)
  assert.match(canonical, /program_explorer_ch_v1/)
  assert.match(canonical, /program_detail_ch_v1/)
  assert.doesNotMatch(canonical, /insert into catalog\.programme_accreditations/i)
  assert.match(canonical, /false as has_programme_accreditation_claim/)
})

test("Switzerland publication views execute as invoker and remain service-role only", () => {
  assert.match(canonical, /security_invoker=true/)
  assert.match(security, /alter view public\.program_explorer_ch_v1 set \(security_invoker=true\)/)
  assert.match(security, /alter view public\.program_detail_ch_v1 set \(security_invoker=true\)/)
  assert.match(security, /revoke all on public\.program_explorer_ch_v1 from public,anon,authenticated/)
  assert.match(security, /grant select on public\.program_explorer_ch_v1 to service_role/)
})

test("Switzerland server and UI separate programme existence from the application window", () => {
  assert.match(server, /program_explorer_ch_v1/)
  assert.match(server, /program_detail_ch_v1/)
  assert.match(server, /international_admission_status/)
  assert.match(explorer, /Next verified intake not yet open/)
  assert.match(explorer, /current window unknown/)
  assert.match(detail, /future international application pathway is source-backed/)
  assert.match(detail, /Swiss institutional accreditation and quality assurance are not converted into programme-level accreditation claims/)
  assert.match(detail, /not claims of Swiss professional authorisation, protected-title eligibility or guaranteed employment/)
})

test("Switzerland is published in the shared Programs route while Belgium remains unpublished", () => {
  assert.match(header, /\["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH"\]/)
  assert.match(page, /searchChPrograms/)
  assert.match(page, /ChProgramsExplorer/)
  assert.match(page, /\["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH"\]/)
  assert.doesNotMatch(page, /searchBePrograms/)
  assert.doesNotMatch(header, /"CH", "BE"/)
})

test("Switzerland SEO indexes exactly 38 source-backed future-application routes", () => {
  const matches = [...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map((match) => match[1])
  assert.equal(matches.length, 38)
  assert.equal(new Set(matches).size, 38)
  assert.ok(matches.includes("ecole-polytechnique-federale-de-lausanne-epfl-computer-science-master"))
  assert.ok(matches.includes("eidgenossische-technische-hochschule-zurich-eth-comparative-and-international-studies-master"))
  assert.ok(matches.includes("universitat-zurich-uzh-quantitative-finance-master"))
  assert.ok(!matches.includes("universitat-basel-data-science-master"))
  assert.ok(!matches.includes("eidgenossische-technische-hochschule-zurich-eth-computer-science-master"))
  assert.match(sitemap, /INDEXABLE_CH_PROGRAM_PATHS/)
})
