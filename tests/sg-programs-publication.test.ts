import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read=(path:string)=>readFileSync(path,"utf8")
const foundation=read("supabase/migrations/20260810123204_sg_program_staging_foundation.sql")
const canonical=read("supabase/migrations/20260810130140_sg_program_canonicalization_publication.sql")
const security=read("supabase/migrations/20260810130212_sg_program_publication_security_invoker.sql")
const server=read("src/lib/programs/sg-programs.server.ts")
const seo=read("src/lib/programs/sg-program-seo.ts")
const detail=read("src/app/(workspace)/programs/sg/[program]/page.tsx")
const explorer=read("src/app/(workspace)/programs/sg-programs-explorer.tsx")
const page=read("src/app/(workspace)/programs/page.tsx")
const header=read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap=read("src/app/sitemap.ts")

test("Singapore staging remains private and preserves full-time programme semantics",()=>{for(const table of ["program_catalog_sg_staging","program_occupation_sg_staging","program_international_sg_staging"]){assert.match(foundation,new RegExp(`create table if not exists public\\.${table}`));assert.match(foundation,new RegExp(`alter table public\\.${table} enable row level security`));assert.match(foundation,new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))}assert.match(foundation,/study_mode/);assert.match(foundation,/full_time/);assert.match(foundation,/eligible_schedule_unknown/);assert.match(foundation,/restricted/)})

test("Singapore canonical publication uses official identifiers without inventing accreditation",()=>{assert.match(canonical,/SG_OFFICIAL_PROGRAM_KEY/);assert.match(canonical,/SG_OFFICIAL_UNIVERSITIES/);assert.match(canonical,/p\.source_name/);assert.match(canonical,/p\.source_program_key/);assert.match(canonical,/program_explorer_sg_v1/);assert.match(canonical,/program_detail_sg_v1/);assert.doesNotMatch(canonical,/insert into catalog\.programme_accreditations/i);assert.match(canonical,/false as has_programme_accreditation_claim/)})

test("Singapore views are security invoker and service-role only",()=>{assert.match(canonical,/security_invoker=true/);assert.match(security,/alter view public\.program_explorer_sg_v1 set \(security_invoker=true\)/);assert.match(security,/alter view public\.program_detail_sg_v1 set \(security_invoker=true\)/);assert.match(security,/revoke all on public\.program_explorer_sg_v1 from public,anon,authenticated/);assert.match(security,/grant select on public\.program_explorer_sg_v1 to service_role/)})

test("Singapore UI separates programme identity, admission timing, Student's Pass and regulated careers",()=>{assert.match(server,/program_explorer_sg_v1/);assert.match(server,/program_detail_sg_v1/);assert.match(server,/international_admission_status/);assert.match(explorer,/Verified application cycle closed/);assert.match(explorer,/Next verified cycle not yet open/);assert.match(explorer,/ICA Student&apos;s Pass context/);assert.match(detail,/ICA Student&apos;s Pass context applies to accepted full-time students/);assert.match(detail,/Regulated professions can require separate Singapore registration or licensing/);assert.match(detail,/not claims of professional registration/)})

test("Singapore is published in the shared Programs route",()=>{assert.match(header,/PUBLISHED_PROGRAM_COUNTRIES/);assert.match(header,/"SG"/);assert.match(page,/searchSgPrograms/);assert.match(page,/SgProgramsExplorer/);assert.match(page,/filters\.country === "SG"/);assert.match(sitemap,/INDEXABLE_SG_PROGRAM_PATHS/)})

test("Singapore SEO indexes exactly twelve source-backed non-closed SUSS routes",()=>{const matches=[...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map(match=>match[1]);assert.equal(matches.length,12);assert.equal(new Set(matches).size,12);assert.ok(matches.includes("singapore-university-of-social-sciences-bachelor-of-accountancy-bachelor"));assert.ok(matches.includes("singapore-university-of-social-sciences-bachelor-of-early-childhood-education-bachelor"));assert.ok(matches.includes("singapore-university-of-social-sciences-bachelor-of-social-work-bachelor"));assert.ok(matches.every(slug=>slug.startsWith("singapore-university-of-social-sciences-")))})
