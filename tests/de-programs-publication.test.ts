import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read=(path:string)=>readFileSync(path,"utf8")
const foundation=read("supabase/migrations/20260810110818_de_program_staging_foundation.sql")
const canonical=read("supabase/migrations/20260810111258_de_program_canonicalization_publication.sql")
const security=read("supabase/migrations/20260810111313_de_program_publication_security_invoker.sql")
const server=read("src/lib/programs/de-programs.server.ts")
const seo=read("src/lib/programs/de-program-seo.ts")
const detail=read("src/app/(workspace)/programs/de/[program]/page.tsx")
const explorer=read("src/app/(workspace)/programs/de-programs-explorer.tsx")
const page=read("src/app/(workspace)/programs/page.tsx")
const header=read("src/app/(workspace)/programs/programs-header.tsx")
const sitemap=read("src/app/sitemap.ts")

test("Germany staging remains private and separates programme, career and international evidence",()=>{for(const table of ["program_catalog_de_staging","program_occupation_de_staging","program_international_de_staging"]){assert.match(foundation,new RegExp(`create table if not exists public\\.${table}`));assert.match(foundation,new RegExp(`alter table public\\.${table} enable row level security`));assert.match(foundation,new RegExp(`revoke all on public\\.${table} from public,anon,authenticated`))}assert.match(foundation,/eligible_schedule_unknown/);assert.match(foundation,/restricted/);assert.match(foundation,/relation_type/)})

test("Germany canonical publication preserves official identity without inventing programme accreditation",()=>{assert.match(canonical,/DE_OFFICIAL_PROGRAM_KEY/);assert.match(canonical,/DE_HOCHSCHULKOMPASS/);assert.match(canonical,/program_explorer_de_v1/);assert.match(canonical,/program_detail_de_v1/);assert.doesNotMatch(canonical,/insert into catalog\.programme_accreditations/i);assert.match(canonical,/false as has_programme_accreditation_claim/)})

test("Germany views are security invoker and service-role only",()=>{assert.match(canonical,/security_invoker=true/);assert.match(security,/alter view public\.program_explorer_de_v1 set \(security_invoker=true\)/);assert.match(security,/alter view public\.program_detail_de_v1 set \(security_invoker=true\)/);assert.match(security,/revoke all on public\.program_explorer_de_v1 from public,anon,authenticated/);assert.match(security,/grant select on public\.program_explorer_de_v1 to service_role/)})

test("Germany UI separates programme existence from applicant-specific admission",()=>{assert.match(server,/program_explorer_de_v1/);assert.match(server,/program_detail_de_v1/);assert.match(server,/international_admission_status/);assert.match(explorer,/Verified application cycle closed/);assert.match(explorer,/Applicant \/ programme-specific route/);assert.match(explorer,/current window unknown/);assert.match(detail,/Programme existence does not mean applications are universally open/);assert.match(detail,/HRK Hochschulkompass inclusion and German quality-assurance status are not converted/);assert.match(detail,/not claims of German professional recognition/)})

test("Germany is published while Singapore remains unpublished",()=>{assert.match(header,/\["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE", "ES", "FR", "DE"\]/);assert.match(page,/searchDePrograms/);assert.match(page,/DeProgramsExplorer/);assert.match(page,/"DE"/);assert.doesNotMatch(page,/searchSgPrograms/);assert.doesNotMatch(header,/"DE", "SG"/)})

test("Germany SEO indexes exactly 62 non-closed source-verified routes",()=>{const matches=[...seo.matchAll(/^\s+"([^\"]+)",$/gm)].map(match=>match[1]);assert.equal(matches.length,62);assert.equal(new Set(matches).size,62);assert.ok(matches.includes("freie-universitaet-berlin-data-science-master"));assert.ok(matches.includes("karlsruhe-institute-of-technology-mechatronics-and-information-technology-master"));assert.ok(matches.includes("university-of-tuebingen-computational-neuroscience-master"));assert.ok(!matches.includes("karlsruhe-institute-of-technology-computer-science-master"));assert.ok(!matches.includes("technical-university-of-munich-geodesy-and-geoinformation-master"));assert.ok(!matches.includes("universitaet-hamburg-intelligent-adaptive-systems-master"));assert.match(sitemap,/INDEXABLE_DE_PROGRAM_PATHS/)})
