import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path: string) => readFileSync(path, "utf8")
const foundation = read("supabase/migrations/20260809200247_se_program_staging_foundation.sql")
const canonical = read("supabase/migrations/20260809200916_se_program_canonicalization_publication.sql")
const security = read("supabase/migrations/20260809200927_se_program_publication_security_invoker.sql")
const server = read("src/lib/programs/se-programs.server.ts")
const seo = read("src/lib/programs/se-program-seo.ts")
const detail = read("src/app/(workspace)/programs/se/[program]/page.tsx")
const explorer = read("src/app/(workspace)/programs/se-programs-explorer.tsx")
const page = read("src/app/(workspace)/programs/page.tsx")
const header = read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap = read("src/app/sitemap.ts")

test("Sweden staging remains private and separates programme, career and international evidence", () => {
  for (const table of ["program_catalog_se_staging", "program_occupation_se_staging", "program_international_se_staging"]) {
    assert.match(foundation, new RegExp(`create table if not exists public\\.${table}`))
    assert.match(foundation, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(foundation, new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
  }
  assert.match(foundation, /eligible_schedule_unknown/)
  assert.match(foundation, /not_yet_open/)
  assert.match(foundation, /relation_type/)
})

test("Sweden canonical publication preserves source identity without inventing programme accreditation", () => {
  assert.match(canonical, /SE_OFFICIAL_PROGRAM_KEY/)
  assert.match(canonical, /SE_UNIVERSITYADMISSIONS/)
  assert.match(canonical, /program_explorer_se_v1/)
  assert.match(canonical, /program_detail_se_v1/)
  assert.doesNotMatch(canonical, /insert into catalog\.programme_accreditations/i)
  assert.match(canonical, /false as has_programme_accreditation_claim/)
})

test("Sweden publication views execute as invoker and remain service-role only", () => {
  assert.match(canonical, /security_invoker=true/)
  assert.match(security, /alter view public\.program_explorer_se_v1 set \(security_invoker=true\)/)
  assert.match(security, /alter view public\.program_detail_se_v1 set \(security_invoker=true\)/)
  assert.match(security, /revoke all on public\.program_explorer_se_v1 from public,anon,authenticated/)
  assert.match(security, /grant select on public\.program_explorer_se_v1 to service_role/)
})

test("Sweden server and UI separate programme existence from the application window", () => {
  assert.match(server, /program_explorer_se_v1/)
  assert.match(server, /program_detail_se_v1/)
  assert.match(server, /international_admission_status/)
  assert.match(explorer, /Autumn 2027 applications not yet open/)
  assert.match(explorer, /current window unknown/)
  assert.match(detail, /future Autumn 2027 international application pathway is source-backed/)
  assert.match(detail, /UKÄ institutional quality assurance and degree-awarding powers are not converted into programme-level accreditation claims/)
  assert.match(detail, /not claims of Swedish professional licensing, protected-title eligibility or guaranteed employment/)
})

test("Sweden remains published in the shared Programs route", () => {
  assert.match(header, /PUBLISHED_PROGRAM_COUNTRIES/)
  assert.match(header, /"SE"/)
  assert.match(page, /searchSePrograms/)
  assert.match(page, /SeProgramsExplorer/)
  assert.match(page, /filters\.country === "SE"/)
})

test("Sweden SEO indexes exactly 110 source-backed Autumn 2027 routes", () => {
  const matches = [...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map((match) => match[1])
  assert.equal(matches.length, 110)
  assert.equal(new Set(matches).size, 110)
  assert.ok(matches.includes("chalmers-university-of-technology-data-science-and-ai-master"))
  assert.ok(matches.includes("karolinska-institutet-global-health-master"))
  assert.ok(matches.includes("kth-royal-institute-of-technology-cybersecurity-master"))
  assert.ok(!matches.includes("lund-university-development-studies-master"))
  assert.ok(!matches.includes("uppsala-university-data-science-master"))
  assert.match(sitemap, /INDEXABLE_SE_PROGRAM_PATHS/)
})
