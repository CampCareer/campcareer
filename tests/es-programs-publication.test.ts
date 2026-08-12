import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read=(path:string)=>readFileSync(path,"utf8")
const foundation=read("supabase/migrations/20260810095950_es_program_staging_foundation.sql")
const canonical=read("supabase/migrations/20260810100542_es_program_canonicalization_publication.sql")
const security=read("supabase/migrations/20260810100556_es_program_publication_security_invoker.sql")
const server=read("src/lib/programs/es-programs.server.ts")
const seo=read("src/lib/programs/es-program-seo.ts")
const detail=read("src/app/(workspace)/programs/es/[program]/page.tsx")
const explorer=read("src/app/(workspace)/programs/es-programs-explorer.tsx")
const page=read("src/app/(workspace)/programs/page.tsx")
const header=read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap=read("src/app/sitemap.ts")

test("Spain staging remains private and separates programme, career and international evidence",()=>{
  for(const table of ["program_catalog_es_staging","program_occupation_es_staging","program_international_es_staging"]){
    assert.match(foundation,new RegExp(`create table if not exists public\\.${table}`))
    assert.match(foundation,new RegExp(`alter table public\\.${table} enable row level security`))
    assert.match(foundation,new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))
  }
  assert.match(foundation,/eligible_schedule_unknown/);assert.match(foundation,/restricted/);assert.match(foundation,/relation_type/)
})

test("Spain canonical publication preserves RUCT-linked identity without inventing accreditation",()=>{
  assert.match(canonical,/ES_RUCT_PROGRAM_KEY/);assert.match(canonical,/ES_RUCT_OFFICIAL/);assert.match(canonical,/program_explorer_es_v1/);assert.match(canonical,/program_detail_es_v1/)
  assert.doesNotMatch(canonical,/insert into catalog\.programme_accreditations/i);assert.match(canonical,/false as has_programme_accreditation_claim/)
})

test("Spain views are security invoker and service-role only",()=>{
  assert.match(canonical,/security_invoker=true/);assert.match(security,/alter view public\.program_explorer_es_v1 set \(security_invoker=true\)/);assert.match(security,/alter view public\.program_detail_es_v1 set \(security_invoker=true\)/);assert.match(security,/revoke all on public\.program_explorer_es_v1 from public,anon,authenticated/);assert.match(security,/grant select on public\.program_explorer_es_v1 to service_role/)
})

test("Spain UI separates official programme identity from vacancy-dependent admission",()=>{
  assert.match(server,/program_explorer_es_v1/);assert.match(server,/program_detail_es_v1/);assert.match(server,/international_admission_status/)
  assert.match(explorer,/Source-backed pre-enrolment open/);assert.match(explorer,/Vacancy-dependent \/ restricted route/);assert.match(explorer,/current window unknown/)
  assert.match(detail,/Programme existence does not prove a place is available/);assert.match(detail,/RUCT official-degree registration and Spanish quality-assurance processes are not converted/);assert.match(detail,/not claims of Spanish professional recognition/)
})

test("Spain remains published in the shared Programs route",()=>{
  assert.match(header,/PUBLISHED_PROGRAM_COUNTRIES/);assert.match(header,/"ES"/)
  assert.match(page,/searchEsPrograms/);assert.match(page,/EsProgramsExplorer/);assert.match(page,/filters\.country === "ES"/)
})

test("Spain SEO indexes exactly 116 source-backed admission routes",()=>{
  const matches=[...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map(match=>match[1]);assert.equal(matches.length,116);assert.equal(new Set(matches).size,116)
  assert.ok(matches.includes("universidad-de-castilla-la-mancha-inteligencia-artificial-y-big-data-master"))
  assert.ok(matches.includes("universitat-autonoma-de-barcelona-english-studies-linguistic-literary-and-sociocultural-perspectives-master"))
  assert.ok(matches.includes("universitat-de-barcelona-atomistic-and-multiscale-computational-modelling-in-physics-chemistry-and-biochemistry-master"))
  assert.ok(!matches.includes("universitat-politecnica-de-catalunya-artificial-intelligence-master"));assert.match(sitemap,/INDEXABLE_ES_PROGRAM_PATHS/)
})
