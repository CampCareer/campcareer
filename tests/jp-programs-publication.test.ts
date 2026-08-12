import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path: string) => readFileSync(path, "utf8")

const foundation = read("supabase/migrations/20260809114939_jp_program_staging_foundation.sql")
const canonical = read("supabase/migrations/20260809125027_jp_program_canonicalization_publication_v2.sql")
const security = read("supabase/migrations/20260809130055_jp_program_publication_security_invoker.sql")
const server = read("src/lib/programs/jp-programs.server.ts")
const seo = read("src/lib/programs/jp-program-seo.ts")
const detail = read("src/app/(workspace)/programs/jp/[program]/page.tsx")
const explorer = read("src/app/(workspace)/programs/jp-programs-explorer.tsx")
const page = read("src/app/(workspace)/programs/page.tsx")
const header = read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap = read("src/app/sitemap.ts")

test("Japan staging stays private and records programme, career and international evidence separately", () => {
  for (const table of ["program_catalog_jp_staging", "program_occupation_jp_staging", "program_international_jp_staging"]) {
    assert.match(foundation, new RegExp(`create table if not exists public\\.${table}`))
    assert.match(foundation, new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(foundation, new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
  }
  assert.match(foundation, /international_admission_status/)
  assert.match(foundation, /eligible_schedule_unknown/)
  assert.match(foundation, /relation_type/)
})

test("Japan canonical publication uses source identity and does not invent programme accreditation", () => {
  assert.match(canonical, /JP_PROGRAM_SOURCE_KEY/)
  assert.match(canonical, /JP_PROGRAM_SOURCE/)
  assert.match(canonical, /program_explorer_jp_v1/)
  assert.match(canonical, /program_detail_jp_v1/)
  assert.doesNotMatch(canonical, /insert into catalog\.programme_accreditations/i)
  assert.match(canonical, /false as has_programme_accreditation_claim/)
  assert.match(canonical, /case x\.international_admission_status when 'open' then 'open' when 'closed' then 'closed'/)
})

test("Japan publication views execute as invoker and remain service-role only", () => {
  assert.match(canonical, /security_invoker=true/)
  assert.match(security, /alter view public\.program_explorer_jp_v1 set \(security_invoker=true\)/)
  assert.match(security, /alter view public\.program_detail_jp_v1 set \(security_invoker=true\)/)
  assert.match(security, /revoke all on public\.program_explorer_jp_v1 from public,anon,authenticated/)
  assert.match(security, /grant select on public\.program_explorer_jp_v1 to service_role/)
})

test("Japan server and UI use dedicated read models and separate programme existence from admission state", () => {
  assert.match(server, /program_explorer_jp_v1/)
  assert.match(server, /program_detail_jp_v1/)
  assert.match(server, /international_admission_status/)
  assert.match(explorer, /International pathway verified · current window unknown/)
  assert.match(detail, /JASSO \/ Study in Japan/)
  assert.match(detail, /does not label that listing as programme-level accreditation/)
  assert.match(detail, /Verified application cycle closed/)
})

test("Japan remains published in the shared Programs route and country picker", () => {
  assert.match(header, /PUBLISHED_PROGRAM_COUNTRIES/)
  assert.match(header, /"JP"/)
  assert.match(page, /searchJpPrograms/)
  assert.match(page, /JpProgramsExplorer/)
  assert.match(page, /filters\.country === "JP"/)
})

test("Japan SEO indexes 127 non-closed programme routes and excludes known final-intake programmes", () => {
  const matches = [...seo.matchAll(/^"([^\"]+)",$/gm)].map((match) => match[1])
  assert.equal(matches.length, 127)
  assert.equal(new Set(matches).size, 127)
  assert.ok(matches.includes("institute-of-science-tokyo-computer-science-international-graduate-program-c"))
  assert.ok(matches.includes("japan-aviation-academy-hokkaido-aircraft-maintenance-department"))
  assert.ok(!matches.includes("the-university-of-tokyo-international-program-on-japan-in-east-asia"))
  assert.ok(!matches.includes("tohoku-university-advanced-molecular-chemistry-course"))
  assert.match(sitemap, /INDEXABLE_JP_PROGRAM_PATHS/)
})
