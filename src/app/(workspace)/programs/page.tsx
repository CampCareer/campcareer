import type { Metadata } from "next"
import Link from "next/link"
import { permanentRedirect } from "next/navigation"
import { DatabaseZap, GraduationCap, MapPinned } from "lucide-react"
import { getLaunchCountry } from "@/data/launch-countries"
import { SITE_URL, programsCanonicalPath } from "@/lib/seo-routes.mjs"
import { ProgramCard } from "./program-card"
import { ProgramsHeader } from "./programs-header"
import { ProgramsSidebar } from "./programs-filters"
import { ProgramsSortControl } from "./programs-sort-control"
import { AeProgramsExplorer } from "./ae-programs-explorer"
import { KrProgramsExplorer } from "./kr-programs-explorer"
import { JpProgramsExplorer } from "./jp-programs-explorer"
import { NoProgramsExplorer } from "./no-programs-explorer"
import { FiProgramsExplorer } from "./fi-programs-explorer"
import { DkProgramsExplorer } from "./dk-programs-explorer"
import { SeProgramsExplorer } from "./se-programs-explorer"
import { ChProgramsExplorer } from "./ch-programs-explorer"
import { BeProgramsExplorer } from "./be-programs-explorer"
import { EsProgramsExplorer } from "./es-programs-explorer"
import { searchAuPrograms, type AuProgramSearchResult } from "@/lib/programs/au-programs.server"
import { searchAePrograms, type AeProgramSearchResult } from "@/lib/programs/ae-programs.server"
import { searchKrPrograms, type KrProgramSearchResult } from "@/lib/programs/kr-programs.server"
import { searchJpPrograms, type JpProgramSearchResult } from "@/lib/programs/jp-programs.server"
import { searchNoPrograms, type NoProgramSearchResult } from "@/lib/programs/no-programs.server"
import { searchFiPrograms, type FiProgramSearchResult } from "@/lib/programs/fi-programs.server"
import { searchDkPrograms, type DkProgramSearchResult } from "@/lib/programs/dk-programs.server"
import { searchSePrograms, type SeProgramSearchResult } from "@/lib/programs/se-programs.server"
import { searchChPrograms, type ChProgramSearchResult } from "@/lib/programs/ch-programs.server"
import { searchBePrograms, type BeProgramSearchResult } from "@/lib/programs/be-programs.server"
import { searchEsPrograms, type EsProgramSearchResult } from "@/lib/programs/es-programs.server"
import { buildProgramsUrl, hasProgramFilters, parseProgramSearchParams, type ProgramSearchFilters } from "@/lib/programs/program-search"

export const revalidate = 3600
const PUBLISHED = ["AU", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE", "ES"]
function firstValue(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value }
function queryWithoutCountry(params: Record<string, string | string[] | undefined>) { const next = new URLSearchParams(); for (const [key,value] of Object.entries(params)) { if(key==="country"||value===undefined) continue; if(typeof value==="string") next.set(key,value); else for(const item of value) next.append(key,item) } return next.toString() }
function normalizedFilters(params: Record<string, string | string[] | undefined>): ProgramSearchFilters { const parsed=parseProgramSearchParams(params); const country=getLaunchCountry(parsed.country); return {...parsed,country:country?.code??"AU"} }

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params=await searchParams; const filters=normalizedFilters(params); const country=getLaunchCountry(filters.country); const countryName=country?.name??"Australia"; const isPublishedBase=PUBLISHED.includes(filters.country)&&!hasProgramFilters(filters)
  const descriptions: Record<string,string> = {
    AU:"Search Australian university and vocational programs by verified city, study level, field, state, duration and tuition.",
    AE:"Explore source-verified UAE higher education, aviation, maritime and vocational programs with accreditation and international admission tracked separately.",
    KR:"Explore South Korea programs published from Study in Korea/NIIED and current university sources, with international eligibility kept separate from current application windows.",
    JP:"Explore source-verified Japan university and vocational programs for international students, with language requirements and current application windows tracked separately.",
    NO:"Explore Norway programs listed by HK-dir Study in Norway, with English-taught programme existence, applicant eligibility and current application windows tracked separately.",
    FI:"Explore Finland English-language university programs from current official university listings, with Studyinfo and institutional application windows tracked separately from programme existence.",
    DK:"Explore Denmark English-taught university programs from Study in Denmark and current university sources, with programme existence and current application windows tracked separately.",
    SE:"Explore source-verified Sweden English-taught university programs, with University Admissions application timing tracked separately from programme existence.",
    CH:"Explore source-verified Switzerland university programs from swissuniversities and current university sources, with programme existence and current international application windows tracked separately.",
    BE:"Explore source-verified Belgium university programmes, with English-accessible programme identity and applicant-specific international admission timing tracked separately.",
    ES:"Explore source-verified Spain official Master programmes from RUCT and current university sources, with programme identity, vacancies and current application windows tracked separately."
  }
  return { title: filters.country==="AU"?"Australian Programs":`${countryName} Programs`, description: descriptions[filters.country]??`Explore study programs in ${countryName}. Country data will be published after source review.`, alternates:{canonical:`${SITE_URL}${programsCanonicalPath(filters.country)}`}, robots:{index:isPublishedBase,follow:true} }
}
function Pagination({filters,page,pageCount}:{filters:ProgramSearchFilters;page:number;pageCount:number}){if(pageCount<=1)return null;return <nav aria-label="Program result pages" className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">{page>1?<Link href={buildProgramsUrl(filters,{page:page-1})} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48]">Previous</Link>:<span/>}<p className="text-[11.5px] font-medium text-[#8f8c85]">Page {page} of {pageCount}</p>{page<pageCount?<Link href={buildProgramsUrl(filters,{page:page+1})} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white">Next</Link>:<span/>}</nav>}
function EmptyResults({filters}:{filters:ProgramSearchFilters}){return <div className="mt-4 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-8 text-center"><span className="grid size-12 place-items-center rounded-2xl bg-[#edf5ea] text-[#3e7a2e]"><GraduationCap className="size-5"/></span><h2 className="mt-4 text-[17px] font-semibold text-[#1b1b1b]">No programs match these filters</h2><p className="mt-2 max-w-md text-[12.5px] leading-5 text-[#77746e]">Try broader filters.</p><Link href={buildProgramsUrl(filters,{q:"",level:"all",field:"all",city:"all",state:"all",duration:"all",fee:"all",source:"all",sort:"recommended",page:1})} className="mt-4 rounded-lg border border-[#cfd9ca] bg-white px-4 py-2 text-[12px] font-semibold text-[#3e7a2e]">Clear filters</Link></div>}
function CountryComingSoon({countryCode}:{countryCode:string}){const country=getLaunchCountry(countryCode);return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2563eb]"><MapPinned className="size-6"/></span><p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">{country?.name??countryCode}</p><h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Program data is being prepared</h2><p className="mt-3 max-w-lg text-[13px] leading-6 text-[#6f6d68]">Country catalogues open after program identities, official sources and current international-admission evidence pass review.</p><Link href="/programs" className="mt-5 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12.5px] font-semibold text-white">Browse Australia</Link></div>}

export default async function ProgramsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams; if(typeof params.country==="string"&&params.country.trim().toUpperCase()==="AU"){const query=queryWithoutCountry(params);permanentRedirect(query?`/programs?${query}`:"/programs")}
  const filters=normalizedFilters(params); const rawCountry=firstValue(params.country); const countryExplicit=Boolean(rawCountry&&getLaunchCountry(rawCountry)); let errorMessage:string|null=null
  let auResult:AuProgramSearchResult|null=null, aeResult:AeProgramSearchResult|null=null, krResult:KrProgramSearchResult|null=null, jpResult:JpProgramSearchResult|null=null, noResult:NoProgramSearchResult|null=null, fiResult:FiProgramSearchResult|null=null, dkResult:DkProgramSearchResult|null=null, seResult:SeProgramSearchResult|null=null, chResult:ChProgramSearchResult|null=null, beResult:BeProgramSearchResult|null=null, esResult:EsProgramSearchResult|null=null
  try {
    if(filters.country==="AU") auResult=await searchAuPrograms(filters); else if(filters.country==="AE") aeResult=await searchAePrograms(filters); else if(filters.country==="KR") krResult=await searchKrPrograms(filters); else if(filters.country==="JP") jpResult=await searchJpPrograms(filters); else if(filters.country==="NO") noResult=await searchNoPrograms(filters); else if(filters.country==="FI") fiResult=await searchFiPrograms(filters); else if(filters.country==="DK") dkResult=await searchDkPrograms(filters); else if(filters.country==="SE") seResult=await searchSePrograms(filters); else if(filters.country==="CH") chResult=await searchChPrograms(filters); else if(filters.country==="BE") beResult=await searchBePrograms(filters); else if(filters.country==="ES") esResult=await searchEsPrograms(filters)
  } catch(error) { console.error(`Unable to load ${filters.country} program catalogue`,error); errorMessage="Please try again shortly. No cached or substitute country data has been shown." }
  const published=PUBLISHED.includes(filters.country)
  return <><ProgramsHeader filters={filters} countryExplicit={countryExplicit}/>{!published?<div className="mt-7"><CountryComingSoon countryCode={filters.country}/></div>:errorMessage?<div className="mt-7 flex min-h-72 flex-col items-center justify-center rounded-xl border border-[#f0d8d2] bg-[#fff9f7] p-8 text-center"><DatabaseZap className="size-6 text-[#b65c45]"/><h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">Program data is temporarily unavailable</h2><p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">{errorMessage}</p></div>
  :filters.country==="ES"&&esResult?<EsProgramsExplorer filters={filters} result={esResult}/>
  :filters.country==="BE"&&beResult?<BeProgramsExplorer filters={filters} result={beResult}/>
  :filters.country==="CH"&&chResult?<ChProgramsExplorer filters={filters} result={chResult}/>
  :filters.country==="SE"&&seResult?<SeProgramsExplorer filters={filters} result={seResult}/>
  :filters.country==="DK"&&dkResult?<DkProgramsExplorer filters={filters} result={dkResult}/>
  :filters.country==="FI"&&fiResult?<FiProgramsExplorer filters={filters} result={fiResult}/>
  :filters.country==="NO"&&noResult?<NoProgramsExplorer filters={filters} result={noResult}/>
  :filters.country==="JP"&&jpResult?<JpProgramsExplorer filters={filters} result={jpResult}/>
  :filters.country==="KR"&&krResult?<KrProgramsExplorer filters={filters} result={krResult}/>
  :filters.country==="AE"&&aeResult?<AeProgramsExplorer filters={filters} result={aeResult}/>
  :filters.country==="AU"&&auResult?<div className="mt-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start"><ProgramsSidebar filters={filters}/><section className="min-w-0"><ProgramsSortControl filters={filters} total={auResult.total}/>{auResult.programs.length===0?<EmptyResults filters={filters}/>:<div className="mt-3 space-y-3">{auResult.programs.map(program=><ProgramCard key={program.id} program={program}/>)}</div>}<Pagination filters={filters} page={auResult.page} pageCount={auResult.pageCount}/><p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Catalogue records are limited to active Australian CRICOS courses. City filtering uses official CRICOS registered delivery locations; tuition, duration and provider-page verification are shown separately.</p></section></div>:null}</>
}
