import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read=(path:string)=>readFileSync(path,"utf8")
const foundation=read("supabase/migrations/20260810102851_fr_program_staging_foundation.sql")
const canonical=read("supabase/migrations/20260810103450_fr_program_canonicalization_publication.sql")
const security=read("supabase/migrations/20260810103504_fr_program_publication_security_invoker.sql")
const server=read("src/lib/programs/fr-programs.server.ts")
const seo=read("src/lib/programs/fr-program-seo.ts")
const detail=read("src/app/(workspace)/programs/fr/[program]/page.tsx")
const explorer=read("src/app/(workspace)/programs/fr-programs-explorer.tsx")
const page=read("src/app/(workspace)/programs/page.tsx")
const header=read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap=read("src/app/sitemap.ts")

test("France staging remains private and separates programme, career and international evidence",()=>{for(const table of ["program_catalog_fr_staging","program_occupation_fr_staging","program_international_fr_staging"]){assert.match(foundation,new RegExp(`create table if not exists public\\.${table}`));assert.match(foundation,new RegExp(`alter table public\\.${table} enable row level security`));assert.match(foundation,new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))}assert.match(foundation,/eligible_schedule_unknown/);assert.match(foundation,/restricted/);assert.match(foundation,/relation_type/)})

test("France canonical publication preserves official identity without inventing programme accreditation",()=>{assert.match(canonical,/FR_OFFICIAL_PROGRAM_KEY/);assert.match(canonical,/FR_OFFICIAL/);assert.match(canonical,/program_explorer_fr_v1/);assert.match(canonical,/program_detail_fr_v1/);assert.doesNotMatch(canonical,/insert into catalog\.programme_accreditations/i);assert.match(canonical,/false as has_programme_accreditation_claim/)})

test("France views are security invoker and service-role only",()=>{assert.match(canonical,/security_invoker=true/);assert.match(security,/alter view public\.program_explorer_fr_v1 set \(security_invoker=true\)/);assert.match(security,/alter view public\.program_detail_fr_v1 set \(security_invoker=true\)/);assert.match(security,/revoke all on public\.program_explorer_fr_v1 from public,anon,authenticated/);assert.match(security,/grant select on public\.program_explorer_fr_v1 to service_role/)})

test("France UI separates programme existence from Mon Master and Campus France applicant routes",()=>{assert.match(server,/program_explorer_fr_v1/);assert.match(server,/program_detail_fr_v1/);assert.match(server,/international_admission_status/);assert.match(explorer,/Verified 2026 application cycle closed/);assert.match(explorer,/Applicant-specific application route/);assert.match(explorer,/current window unknown/);assert.match(detail,/Programme existence does not mean applications are universally open/);assert.match(detail,/French national degree and quality-assurance frameworks are not converted/);assert.match(detail,/not claims of French professional recognition/)})

test("France is published while Germany remains unpublished",()=>{assert.match(header,/\["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE", "ES", "FR"\]/);assert.match(page,/searchFrPrograms/);assert.match(page,/FrProgramsExplorer/);assert.match(page,/"FR"/);assert.doesNotMatch(page,/searchDePrograms/);assert.doesNotMatch(header,/"FR", "DE"/)})

test("France SEO indexes exactly 80 non-closed source-verified routes",()=>{const matches=[...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map(match=>match[1]);assert.equal(matches.length,80);assert.equal(new Set(matches).size,80);assert.ok(matches.includes("aix-marseille-universite-master-informatique-master"));assert.ok(matches.includes("universite-cote-dazur-msc-data-science-artificial-intelligence-master"));assert.ok(matches.includes("universite-grenoble-alpes-master-informatique-cybersecurity-master"));assert.ok(!matches.some(slug=>slug.startsWith("universite-psl-")));assert.match(sitemap,/INDEXABLE_FR_PROGRAM_PATHS/)})
