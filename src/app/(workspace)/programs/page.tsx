import type { Metadata } from "next"
import Link from "next/link"
import { permanentRedirect } from "next/navigation"
import { DatabaseZap, GraduationCap, MapPinned } from "lucide-react"
import { getLaunchCountry } from "@/data/launch-countries"
import { SITE_URL, programsCanonicalPath } from "@/lib/seo-routes.mjs"
import { ProgramCard } from "./program-card"
import { CaProgramCard } from "./ca-program-card"
import { ProgramsHeader } from "./programs-header"
import { ProgramsSidebar } from "./programs-filters"
import { CaProgramsSidebar } from "./ca-programs-filters"
import { ProgramsSortControl } from "./programs-sort-control"
import { UkProgramsExplorer } from "./uk-programs-explorer"
import { NzProgramsExplorer } from "./nz-programs-explorer"
import { NlProgramsExplorer } from "./nl-programs-explorer"
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
import { FrProgramsExplorer } from "./fr-programs-explorer"
import { DeProgramsExplorer } from "./de-programs-explorer"
import { SgProgramsExplorer } from "./sg-programs-explorer"
import { searchAuPrograms, type AuProgramSearchResult } from "@/lib/programs/au-programs.server"
import { searchCaPrograms, type CaProgramSearchResult } from "@/lib/programs/ca-programs.server"
import { searchUkPrograms, type UkProgramSearchResult } from "@/lib/programs/uk-programs.server"
import { searchNzPrograms, type NzProgramSearchResult } from "@/lib/programs/nz-programs.server"
import { searchNlPrograms, type NlProgramSearchResult } from "@/lib/programs/nl-programs.server"
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
import { searchFrPrograms, type FrProgramSearchResult } from "@/lib/programs/fr-programs.server"
import { searchDePrograms, type DeProgramSearchResult } from "@/lib/programs/de-programs.server"
import { searchSgPrograms, type SgProgramSearchResult } from "@/lib/programs/sg-programs.server"
import {
  buildProgramsUrl,
  hasProgramFilters,
  parseProgramSearchParams,
  type ProgramSearchFilters,
} from "@/lib/programs/program-search"

export const revalidate = 3600
const PUBLISHED_PROGRAM_COUNTRIES = [
  "AU", "CA", "UK", "NZ", "NL", "AE", "KR", "JP", "NO", "FI", "DK", "SE", "CH", "BE", "ES", "FR", "DE", "SG",
] as const

const PROGRAM_DESCRIPTIONS: Record<string, string> = {
  AU: "Search Australian university and vocational programs by verified city, study level, field, state, duration and tuition.",
  CA: "Explore Canadian programs reviewed against 80 target careers, current international admission evidence and PGWP status.",
  UK: "Explore source-verified UK programmes with international-student eligibility, Student sponsor evidence and current application timing tracked separately.",
  NZ: "Explore verified New Zealand programmes connected to CampCareer target occupations, with NZQCF, international-study, Code and application evidence tracked separately.",
  NL: "Explore source-verified Netherlands programmes with Dutch recognition, international-student eligibility, recognised sponsor evidence and current application timing tracked separately.",
  AE: "Explore source-verified UAE programs with accreditation and international admission tracked separately.",
  KR: "Explore South Korea programs published from Study in Korea/NIIED and current university sources, with international eligibility kept separate from current application windows.",
  JP: "Explore source-verified Japan university and vocational programs for international students, with language requirements and current application windows tracked separately.",
  NO: "Explore Norway programs listed by HK-dir Study in Norway, with English-taught programme existence, applicant eligibility and current application windows tracked separately.",
  FI: "Explore Finland English-language university programs from current official university listings, with Studyinfo and institutional application windows tracked separately from programme existence.",
  DK: "Explore Denmark English-taught university programs from Study in Denmark and current university sources, with programme existence and current application windows tracked separately.",
  SE: "Explore source-verified Sweden English-taught university programs, with University Admissions application timing tracked separately from programme existence.",
  CH: "Explore source-verified Switzerland university programs from swissuniversities and current university sources, with programme existence and current international application windows tracked separately.",
  BE: "Explore source-verified Belgium university programmes, with English-accessible programme identity and applicant-specific international admission timing tracked separately.",
  ES: "Explore source-verified Spain official Master programmes from RUCT and current university sources, with programme identity, vacancies and current application windows tracked separately.",
  FR: "Explore source-verified France university Master programmes from current official university catalogues, with Mon Master and Campus France applicant routes tracked separately from programme existence.",
  DE: "Explore source-verified Germany Master programmes from current university sources, with HRK Hochschulkompass and DAAD discovery context and applicant-specific admission timing tracked separately.",
  SG: "Explore source-verified Singapore undergraduate programmes from NUS, NTU, SMU, SIT, SUSS and SUTD, with full-time study mode, international admission timing and ICA Student's Pass context tracked separately.",
}

function queryWithoutCountry(params: Record<string, string | string[] | undefined>) {
  const next = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (key === "country" || value === undefined) continue
    if (typeof value === "string") next.set(key, value)
    else for (const item of value) next.append(key, item)
  }
  return next.toString()
}

function normalizedFilters(
  params: Record<string, string | string[] | undefined>,
): ProgramSearchFilters {
  const parsed = parseProgramSearchParams(params)
  const country = getLaunchCountry(parsed.country)
  return { ...parsed, country: country?.code ?? "AU" }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const filters = normalizedFilters(params)
  const country = getLaunchCountry(filters.country)
  const countryName = country?.name ?? "Australia"
  const isPublishedBase = PUBLISHED_PROGRAM_COUNTRIES.includes(
    filters.country as (typeof PUBLISHED_PROGRAM_COUNTRIES)[number],
  ) && !hasProgramFilters(filters)

  return {
    title:
      filters.country === "AU"
        ? "Australian Programs"
        : filters.country === "CA"
          ? "Canadian Programs"
          : filters.country === "AE"
            ? "UAE Programs"
            : filters.country === "NZ"
              ? "New Zealand Programs"
              : filters.country === "NL"
                ? "Netherlands Programs"
                : `${countryName} Programs`,
    description:
      PROGRAM_DESCRIPTIONS[filters.country] ??
      `Explore study programs in ${countryName}. Country data will be published after source review.`,
    alternates: {
      canonical: `${SITE_URL}${programsCanonicalPath(filters.country)}`,
    },
    robots: {
      index: isPublishedBase,
      follow: true,
    },
  }
}

function Pagination({
  filters,
  page,
  pageCount,
}: {
  filters: ProgramSearchFilters
  page: number
  pageCount: number
}) {
  if (pageCount <= 1) return null

  return (
    <nav
      aria-label="Program result pages"
      className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3"
    >
      {page > 1 ? (
        <Link
          href={buildProgramsUrl(filters, { page: page - 1 })}
          className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] transition hover:border-brand/40 hover:text-brand"
        >
          Previous
        </Link>
      ) : (
        <span />
      )}
      <p className="text-[11.5px] font-medium text-[#8f8c85]">Page {page} of {pageCount}</p>
      {page < pageCount ? (
        <Link
          href={buildProgramsUrl(filters, { page: page + 1 })}
          className="rounded-lg bg-brand px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]"
        >
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

function EmptyResults({ filters }: { filters: ProgramSearchFilters }) {
  return (
    <div className="mt-4 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-8 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-[hsl(var(--brand-tint))] text-brand">
        <GraduationCap className="size-5" />
      </span>
      <h2 className="mt-4 text-[17px] font-semibold text-[#1b1b1b]">No programs match these filters</h2>
      <p className="mt-2 max-w-md text-[12.5px] leading-5 text-[#77746e]">Try a broader search or remove one of the active filters.</p>
      <Link
        href={buildProgramsUrl(filters, {
          q: "",
          level: "all",
          field: "all",
          city: "all",
          state: "all",
          province: "all",
          career: "all",
          institution: "all",
          pgwp: "all",
          duration: "all",
          fee: "all",
          source: "all",
          sort: "recommended",
          page: 1,
        })}
        className="mt-4 rounded-lg border border-blue-200 bg-white px-4 py-2 text-[12px] font-semibold text-brand transition hover:bg-[hsl(var(--brand-tint))]"
      >
        Clear filters
      </Link>
    </div>
  )
}

function CountryComingSoon({ countryCode }: { countryCode: string }) {
  const country = getLaunchCountry(countryCode)
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-10 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#2563eb]">
        <MapPinned className="size-6" />
      </span>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">{country?.name ?? countryCode}</p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Program data is being prepared</h2>
      <p className="mt-3 max-w-lg text-[13px] leading-6 text-[#6f6d68]">Published catalogues are available after programme identities, official sources and international-admission evidence pass review.</p>
      <Link href="/programs" className="mt-5 rounded-lg bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white transition hover:bg-[hsl(var(--brand-press))]">Browse Australia</Link>
    </div>
  )
}

function ProgramLoadError({ countryName, message }: { countryName: string; message: string }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-[#f0d8d2] bg-[#fff9f7] p-8 text-center">
      <DatabaseZap className="size-6 text-[#b65c45]" />
      <h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">{countryName} program data is temporarily unavailable</h2>
      <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">{message}</p>
    </div>
  )
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  if (typeof params.country === "string" && params.country.trim().toUpperCase() === "AU") {
    const query = queryWithoutCountry(params)
    permanentRedirect(query ? `/programs?${query}` : "/programs")
  }

  const filters = normalizedFilters(params)

  let auResult: AuProgramSearchResult | null = null
  let caResult: CaProgramSearchResult | null = null
  let ukResult: UkProgramSearchResult | null = null
  let nzResult: NzProgramSearchResult | null = null
  let nlResult: NlProgramSearchResult | null = null
  let aeResult: AeProgramSearchResult | null = null
  let krResult: KrProgramSearchResult | null = null
  let jpResult: JpProgramSearchResult | null = null
  let noResult: NoProgramSearchResult | null = null
  let fiResult: FiProgramSearchResult | null = null
  let dkResult: DkProgramSearchResult | null = null
  let seResult: SeProgramSearchResult | null = null
  let chResult: ChProgramSearchResult | null = null
  let beResult: BeProgramSearchResult | null = null
  let esResult: EsProgramSearchResult | null = null
  let frResult: FrProgramSearchResult | null = null
  let deResult: DeProgramSearchResult | null = null
  let sgResult: SgProgramSearchResult | null = null
  let errorMessage: string | null = null

  try {
    if (filters.country === "AU") auResult = await searchAuPrograms(filters)
    if (filters.country === "CA") caResult = await searchCaPrograms(filters)
    if (filters.country === "UK") ukResult = await searchUkPrograms(filters)
    if (filters.country === "NZ") nzResult = await searchNzPrograms(filters)
    if (filters.country === "NL") nlResult = await searchNlPrograms(filters)
    if (filters.country === "AE") aeResult = await searchAePrograms(filters)
    if (filters.country === "KR") krResult = await searchKrPrograms(filters)
    if (filters.country === "JP") jpResult = await searchJpPrograms(filters)
    if (filters.country === "NO") noResult = await searchNoPrograms(filters)
    if (filters.country === "FI") fiResult = await searchFiPrograms(filters)
    if (filters.country === "DK") dkResult = await searchDkPrograms(filters)
    if (filters.country === "SE") seResult = await searchSePrograms(filters)
    if (filters.country === "CH") chResult = await searchChPrograms(filters)
    if (filters.country === "BE") beResult = await searchBePrograms(filters)
    if (filters.country === "ES") esResult = await searchEsPrograms(filters)
    if (filters.country === "FR") frResult = await searchFrPrograms(filters)
    if (filters.country === "DE") deResult = await searchDePrograms(filters)
    if (filters.country === "SG") sgResult = await searchSgPrograms(filters)
  } catch (error) {
    console.error(`Unable to load ${filters.country} program catalogue`, error)
    errorMessage = "Please try again shortly. No cached or substitute country data has been shown."
  }

  const countryIsPublished = PUBLISHED_PROGRAM_COUNTRIES.includes(filters.country as (typeof PUBLISHED_PROGRAM_COUNTRIES)[number])

  return (
    <>
      <ProgramsHeader filters={filters} />

      {!countryIsPublished ? (
        <div className="mt-7"><CountryComingSoon countryCode={filters.country} /></div>
      ) : errorMessage ? (
        <div className="mt-7">
          <ProgramLoadError countryName={getLaunchCountry(filters.country)?.name ?? filters.country} message={errorMessage} />
        </div>
      ) : filters.country === "SG" && sgResult ? (
        <SgProgramsExplorer filters={filters} result={sgResult} />
      ) : filters.country === "DE" && deResult ? (
        <DeProgramsExplorer filters={filters} result={deResult} />
      ) : filters.country === "FR" && frResult ? (
        <FrProgramsExplorer filters={filters} result={frResult} />
      ) : filters.country === "ES" && esResult ? (
        <EsProgramsExplorer filters={filters} result={esResult} />
      ) : filters.country === "BE" && beResult ? (
        <BeProgramsExplorer filters={filters} result={beResult} />
      ) : filters.country === "CH" && chResult ? (
        <ChProgramsExplorer filters={filters} result={chResult} />
      ) : filters.country === "SE" && seResult ? (
        <SeProgramsExplorer filters={filters} result={seResult} />
      ) : filters.country === "DK" && dkResult ? (
        <DkProgramsExplorer filters={filters} result={dkResult} />
      ) : filters.country === "FI" && fiResult ? (
        <FiProgramsExplorer filters={filters} result={fiResult} />
      ) : filters.country === "NO" && noResult ? (
        <NoProgramsExplorer filters={filters} result={noResult} />
      ) : filters.country === "JP" && jpResult ? (
        <JpProgramsExplorer filters={filters} result={jpResult} />
      ) : filters.country === "KR" && krResult ? (
        <KrProgramsExplorer filters={filters} result={krResult} />
      ) : filters.country === "AE" && aeResult ? (
        <AeProgramsExplorer filters={filters} result={aeResult} />
      ) : filters.country === "NZ" && nzResult ? (
        <NzProgramsExplorer filters={filters} result={nzResult} />
      ) : filters.country === "NL" && nlResult ? (
        <NlProgramsExplorer filters={filters} result={nlResult} />
      ) : filters.country === "UK" && ukResult ? (
        <UkProgramsExplorer filters={filters} result={ukResult} />
      ) : filters.country === "CA" && caResult ? (
        <div className="mt-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <CaProgramsSidebar filters={filters} />
          <section className="min-w-0">
            <ProgramsSortControl filters={filters} total={caResult.total} />
            {caResult.programs.length === 0 ? <EmptyResults filters={filters} /> : (
              <div className="mt-3 space-y-3">{caResult.programs.map((program) => <CaProgramCard key={program.id} program={program} />)}</div>
            )}
            <Pagination filters={filters} page={caResult.page} pageCount={caResult.pageCount} />
            <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Canada results include only programs connected to one of the 80 target careers with a completed publication review and sufficient international-admission evidence for public listing. Records without enough current evidence remain hidden. PGWP status is evaluated separately and stays not confirmed where provider or IRCC-aligned evidence is insufficient.</p>
          </section>
        </div>
      ) : filters.country === "AU" && auResult ? (
        <div className="mt-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <ProgramsSidebar filters={filters} />
          <section className="min-w-0">
            <ProgramsSortControl filters={filters} total={auResult.total} />
            {auResult.programs.length === 0 ? <EmptyResults filters={filters} /> : (
              <div className="mt-3 space-y-3">{auResult.programs.map((program) => <ProgramCard key={program.id} program={program} />)}</div>
            )}
            <Pagination filters={filters} page={auResult.page} pageCount={auResult.pageCount} />
            <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Catalogue records are limited to active Australian CRICOS courses. City filtering uses official CRICOS registered delivery locations; tuition, duration and provider-page verification are shown separately.</p>
          </section>
        </div>
      ) : null}
    </>
  )
}
