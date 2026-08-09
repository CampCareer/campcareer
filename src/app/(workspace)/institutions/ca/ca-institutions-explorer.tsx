import Link from "next/link"
import {
  Building2,
  ChevronRight,
  DatabaseZap,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
} from "lucide-react"
import { InstitutionLogo } from "@/components/institution-logo"
import {
  buildInstitutionExplorerUrl,
  INSTITUTION_KIND_OPTIONS,
  institutionDetailPath,
  parseInstitutionSearchParams,
  type InstitutionSearchFilters,
} from "@/lib/institutions/institution-search"
import { searchCaInstitutions } from "@/lib/institutions/ca-institutions.server"
import type {
  InstitutionExplorerItem,
  InstitutionSearchResult,
} from "@/lib/institutions/institutions.server"

function verifiedKindLabel(kind: string | null) {
  switch (kind) {
    case "university": return "University"
    case "college": return "College"
    case "polytechnic": return "Polytechnic"
    case "tafe_vet": return "TAFE / VET"
    case "other": return "Other"
    default: return null
  }
}

function ownershipLabel(ownership: string | null) {
  switch (ownership) {
    case "public": return "Public"
    case "private": return "Private"
    case "private_nonprofit": return "Private nonprofit"
    case "private_forprofit": return "Private for-profit"
    default: return null
  }
}

function safeWebsiteUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

function citySummary(institution: InstitutionExplorerItem) {
  if (institution.cityNames.length === 0) {
    return institution.campusCount > 0 ? "Locations available" : "Location unavailable"
  }
  if (institution.cityNames.length <= 2) return institution.cityNames.join(", ")
  return `${institution.cityNames.slice(0, 2).join(", ")} +${institution.cityNames.length - 2}`
}

function programSummary(institution: InstitutionExplorerItem) {
  if (institution.programCount === 0) return "No published target programs"
  return `${institution.programCount.toLocaleString()} published ${institution.programCount === 1 ? "program" : "programs"}`
}

function InstitutionCard({ institution }: { institution: InstitutionExplorerItem }) {
  const kind = verifiedKindLabel(institution.institutionKind)
  const ownership = ownershipLabel(institution.ownershipType)
  const website = safeWebsiteUrl(institution.websiteUrl)
  const detailPath = institutionDetailPath("CA", institution.slug)

  return (
    <article className="rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#cfd9ca] hover:shadow-sm">
      <div className="flex items-start gap-4">
        <InstitutionLogo name={institution.name} logoUrl={institution.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={detailPath} className="group inline-flex min-w-0 items-center gap-1.5 text-[16px] font-semibold leading-6 tracking-[-0.01em] text-[#1b1b1b] transition hover:text-[#3e7a2e]">
              <span className="truncate">{institution.name}</span>
              <ChevronRight className="size-3.5 shrink-0 text-[#aaa7a0] transition group-hover:translate-x-0.5 group-hover:text-[#3e7a2e]" />
            </Link>
            {kind ? <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-semibold text-[#686660]">{kind}</span> : null}
            {ownership ? <span className="rounded-full border border-[#e7e6e3] px-2.5 py-1 text-[10.5px] font-medium text-[#8b8881]">{ownership}</span> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#6f6d68]">
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-[#9c9a94]" />{citySummary(institution)}</span>
            <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-3.5 text-[#9c9a94]" />{programSummary(institution)}</span>
            <span>{institution.campusCount.toLocaleString()} locations</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Link href={detailPath} className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">View institution</Link>
            {website ? <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]">Official website <ExternalLink className="size-3" /></a> : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function Pagination({ filters, result }: { filters: InstitutionSearchFilters; result: InstitutionSearchResult }) {
  if (result.pageCount <= 1) return null
  return (
    <nav aria-label="Canadian institution result pages" className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">
      {result.page > 1 ? <Link href={buildInstitutionExplorerUrl("CA", filters, { page: result.page - 1 })} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] transition hover:border-[#3e7a2e]/50 hover:text-[#3e7a2e]">Previous</Link> : <span />}
      <p className="text-[11.5px] font-medium text-[#8f8c85]">Page {result.page} of {result.pageCount}</p>
      {result.page < result.pageCount ? <Link href={buildInstitutionExplorerUrl("CA", filters, { page: result.page + 1 })} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#326625]">Next</Link> : <span />}
    </nav>
  )
}

export async function CaInstitutionsExplorer({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const filters = parseInstitutionSearchParams(searchParams)
  let result: InstitutionSearchResult | null = null
  let errorMessage: string | null = null

  try {
    result = await searchCaInstitutions(filters)
  } catch (error) {
    console.error("Unable to load Canadian institution explorer", error)
    errorMessage = "Please try again shortly. No substitute institution data has been shown."
  }

  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">Explore</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">Canada Institutions</h1>
        <Link href="/institutions" className="rounded-full border border-[#e0dfdb] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-[#686660] transition hover:border-[#3e7a2e]/40 hover:text-[#3e7a2e]">All countries</Link>
      </div>
      <p className="mt-2 max-w-2xl text-[12.5px] leading-5 text-[#77746e]">
        Search verified Canadian institution identities, DLI/location data and CampCareer programs published against the 80 target careers. Program counts use the reviewed Canada publication set, not each institution&apos;s full catalogue.
      </p>

      <form action="/institutions/ca" method="get" className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_210px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#a3a19b]" />
          <input type="search" name="q" defaultValue={filters.q} placeholder="Search institution name…" className="h-12 w-full rounded-xl border border-[#deddd8] bg-white pl-11 pr-4 text-[13.5px] text-[#1b1b1b] outline-none transition placeholder:text-[#aaa8a2] focus:border-[#3e7a2e] focus:ring-2 focus:ring-[#3e7a2e]/10" />
        </label>
        <select name="kind" defaultValue={filters.kind} aria-label="Verified institution type" className="h-12 rounded-xl border border-[#deddd8] bg-white px-3 text-[12.5px] font-medium text-[#4d4c48] outline-none focus:border-[#3e7a2e]">
          {INSTITUTION_KIND_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button type="submit" className="h-12 rounded-xl bg-[#3e7a2e] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#326625]">Search</button>
      </form>

      <section className="mt-6">
        {errorMessage ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-[#f0d8d2] bg-[#fff9f7] p-8 text-center">
            <DatabaseZap className="size-6 text-[#b65c45]" />
            <h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">Institution data is temporarily unavailable</h2>
            <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">{errorMessage}</p>
          </div>
        ) : result ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-[#77746e]">{result.total.toLocaleString()} institutions · sorted by published target programs</p>
              {filters.q || filters.kind !== "all" ? <Link href="/institutions/ca" className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">Clear filters</Link> : null}
            </div>
            {result.institutions.length === 0 ? (
              <div className="mt-3 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-8 text-center">
                <Building2 className="size-6 text-[#3e7a2e]" />
                <h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">No institutions match these filters</h2>
                <p className="mt-2 text-[12px] text-[#77746e]">Try a broader name search or clear the verified type filter.</p>
              </div>
            ) : <div className="mt-3 space-y-3">{result.institutions.map((institution) => <InstitutionCard key={institution.id} institution={institution} />)}</div>}
            <Pagination filters={filters} result={result} />
          </>
        ) : null}
      </section>

      <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">
        A zero published-program count means no program from that institution is currently in CampCareer&apos;s reviewed 80-career Canada set; it does not mean the institution offers no programs. DLI identity, location records and program-level PGWP evidence remain separate data layers.
      </p>
    </>
  )
}
