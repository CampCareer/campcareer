import type { Metadata } from "next"
import Link from "next/link"
import { DatabaseZap, GraduationCap, MapPinned } from "lucide-react"
import { getLaunchCountry } from "@/data/launch-countries"
import { ProgramCard } from "./program-card"
import { ProgramsHeader } from "./programs-header"
import { ProgramsSidebar } from "./programs-filters"
import { ProgramsSortControl } from "./programs-sort-control"
import { searchAuPrograms, type AuProgramSearchResult } from "@/lib/programs/au-programs.server"
import {
  buildProgramsUrl,
  hasProgramFilters,
  parseProgramSearchParams,
  type ProgramSearchFilters,
} from "@/lib/programs/program-search"

const BASE_URL = "https://www.campcareer.com"

export const revalidate = 3600

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
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
  const isAustraliaBase = filters.country === "AU" && !hasProgramFilters(filters)
  const countryName = country?.name ?? "Australia"

  return {
    title: filters.country === "AU" ? "Australian Programs" : `${countryName} Programs`,
    description:
      filters.country === "AU"
        ? "Search Australian university and vocational programs by study level, field, state, duration and tuition."
        : `Explore study programs in ${countryName}. Country data will be published after source review.`,
    alternates: {
      canonical: `${BASE_URL}/programs?country=${filters.country}`,
    },
    robots: {
      index: isAustraliaBase,
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
          className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] transition hover:border-[#3e7a2e]/50 hover:text-[#3e7a2e]"
        >
          Previous
        </Link>
      ) : (
        <span />
      )}
      <p className="text-[11.5px] font-medium text-[#8f8c85]">
        Page {page} of {pageCount}
      </p>
      {page < pageCount ? (
        <Link
          href={buildProgramsUrl(filters, { page: page + 1 })}
          className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#326625]"
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
      <span className="grid size-12 place-items-center rounded-2xl bg-[#edf5ea] text-[#3e7a2e]">
        <GraduationCap className="size-5" />
      </span>
      <h2 className="mt-4 text-[17px] font-semibold text-[#1b1b1b]">No programs match these filters</h2>
      <p className="mt-2 max-w-md text-[12.5px] leading-5 text-[#77746e]">
        Try a broader study level, field, state, duration or tuition range.
      </p>
      <Link
        href={buildProgramsUrl(filters, {
          q: "",
          level: "all",
          field: "all",
          state: "all",
          duration: "all",
          fee: "all",
          source: "all",
          sort: "recommended",
          page: 1,
        })}
        className="mt-4 rounded-lg border border-[#cfd9ca] bg-white px-4 py-2 text-[12px] font-semibold text-[#3e7a2e] transition hover:bg-[#edf5ea]"
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
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">
        {country?.name ?? countryCode}
      </p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
        Program data is being prepared
      </h2>
      <p className="mt-3 max-w-lg text-[13px] leading-6 text-[#6f6d68]">
        Australia is the first complete program catalogue. Other countries will open after their
        institutions, course identifiers, fees and official source links pass the same review.
      </p>
      <Link
        href="/programs?country=AU"
        className="mt-5 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12.5px] font-semibold text-white transition hover:bg-[#326625]"
      >
        Browse Australia
      </Link>
    </div>
  )
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const filters = normalizedFilters(params)
  const rawCountry = firstValue(params.country)
  const countryExplicit = Boolean(rawCountry && getLaunchCountry(rawCountry))

  let result: AuProgramSearchResult | null = null
  let errorMessage: string | null = null

  if (filters.country === "AU") {
    try {
      result = await searchAuPrograms(filters)
    } catch (error) {
      console.error("Unable to load Australian program catalogue", error)
      errorMessage = "Please try again shortly. No cached or substitute country data has been shown."
    }
  }

  return (
    <>
      <ProgramsHeader filters={filters} countryExplicit={countryExplicit} />

      {filters.country !== "AU" ? (
        <div className="mt-7">
          <CountryComingSoon countryCode={filters.country} />
        </div>
      ) : (
        <div className="mt-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <ProgramsSidebar filters={filters} />

          <section className="min-w-0">
            {errorMessage ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-[#f0d8d2] bg-[#fff9f7] p-8 text-center">
              <DatabaseZap className="size-6 text-[#b65c45]" />
              <h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">
                Australian program data is temporarily unavailable
              </h2>
              <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">{errorMessage}</p>
              </div>
            ) : result ? (
            <>
              <ProgramsSortControl filters={filters} total={result.total} />

              {result.programs.length === 0 ? (
                <EmptyResults filters={filters} />
              ) : (
                <div className="mt-3 space-y-3">
                  {result.programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              )}

              <Pagination
                filters={filters}
                page={result.page}
                pageCount={result.pageCount}
              />

              <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">
                Catalogue records are limited to active Australian CRICOS courses. Tuition and
                duration values are shown when present in the current source record; official page
                verification is displayed separately.
              </p>
              </>
            ) : null}
          </section>
        </div>
      )}
    </>
  )
}
