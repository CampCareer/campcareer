import Link from "next/link"
import { AU_NURSING_PROGRAM_IDS } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes"
import { AU_NURSING_PROGRAM_COMPARE_REPOSITORY } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes-repository"
import { parseCareerComparisonState, type CareerComparisonState } from "@/lib/career-comparison"
import { parseCountryComparisonState, resolveComparisonPageType, type CountryComparisonState } from "@/lib/country-comparison"
import ProgramsCompareMatrix from "./programs-compare-matrix"
import CountriesCompareMatrix from "./countries-compare-matrix"
import CareersCompareMatrix from "./careers-compare-matrix"
import { CompareModeNavigation } from "./compare-mode-navigation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Compare pathways",
  description: "Compare reviewed programs, countries and careers with explicit context and source-aware missing values.",
  robots: { index: false, follow: false } as const,
}

type ComparePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toSearchParams(values: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value)
    else if (Array.isArray(value) && value[0]) params.set(key, value[0])
  }
  return params
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = toSearchParams(await searchParams)
  const pageType = resolveComparisonPageType(params.get("type"))

  if (pageType === "country") return <CountriesCompare comparison={parseCountryComparisonState(params)} />
  if (pageType === "career") return <CareersCompare comparison={parseCareerComparisonState(params)} />
  if (pageType === "unsupported") return <UnsupportedComparisonType />

  return <ProgramsCompare params={params} />
}

async function ProgramsCompare({ params }: { params: URLSearchParams }) {
  const country = params.get("country")?.toUpperCase() ?? "AU"
  const field = params.get("field") ?? "nursing"
  if (country !== "AU" || field !== "nursing") return <UnsupportedProgramContext />

  const programs = await AU_NURSING_PROGRAM_COMPARE_REPOSITORY.getProgramCompareItems(AU_NURSING_PROGRAM_IDS)
  return (
    <section className="mx-auto max-w-6xl pb-4" aria-label="Programs comparison">
      <CompareModeNavigation activeType="program" />
      <header className="border-b border-[#e7e6e3] pb-6 sm:pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Programs</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">Compare programs</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6f6d68]">Compare institution, qualification, duration, international tuition and source-backed availability.</p>
        <p className="mt-3 text-sm font-medium text-[#4a4842]">Australia · Nursing</p>
      </header>
      <ProgramsCompareMatrix availablePrograms={programs} />
    </section>
  )
}

function CountriesCompare({ comparison }: { comparison: CountryComparisonState }) {
  if (comparison.contextState === "unsupported") return <UnsupportedCountryComparison />
  return (
    <section className="mx-auto max-w-6xl pb-4" aria-label="Countries comparison">
      <CompareModeNavigation activeType="country" />
      <header className="border-b border-[#e7e6e3] pb-6 sm:pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Countries</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">Compare countries</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6f6d68]">Compare the pathway to become a Registered Nurse across selected countries and cities.</p>
        <p className="mt-3 text-sm font-medium text-[#4a4842]">International student · Starting without a nursing qualification</p>
      </header>
      <CountriesCompareMatrix initialLocations={comparison.locations} />
    </section>
  )
}

function CareersCompare({ comparison }: { comparison: CareerComparisonState }) {
  if (comparison.contextState === "unsupported") return <UnsupportedCareerComparison />
  return (
    <section className="mx-auto max-w-6xl pb-4" aria-label="Careers comparison">
      <CompareModeNavigation activeType="career" />
      <header className="border-b border-[#e7e6e3] pb-6 sm:pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Careers</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">Compare careers</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6f6d68]">Compare education routes, career outcomes and registration requirements in Australia.</p>
        <p className="mt-3 text-sm font-medium text-[#4a4842]">International student · Starting from scratch</p>
      </header>
      <CareersCompareMatrix />
    </section>
  )
}

function UnsupportedCountryComparison() {
  return <UnsupportedSurface type="Countries" href="/compare?type=country&goal=registered-nurse&profile=starting-from-scratch" label="Start a country comparison" />
}

function UnsupportedCareerComparison() {
  return <UnsupportedSurface type="Careers" href="/compare?type=career&country=AU&profile=starting-from-scratch" label="Start a careers comparison" />
}

function UnsupportedProgramContext() {
  return <UnsupportedSurface type="Programs" href="/compare?type=program&country=AU&field=nursing" label="Compare Australian Nursing programs" />
}

function UnsupportedComparisonType() {
  return <UnsupportedSurface type="Compare" href="/compare?type=program" label="Open Programs Compare" activeType="unsupported" />
}

function UnsupportedSurface({ type, href, label, activeType }: { type: "Programs" | "Countries" | "Careers" | "Compare"; href: string; label: string; activeType?: "program" | "country" | "career" | "unsupported" }) {
  const resolvedActiveType = activeType ?? ({ Programs: "program", Countries: "country", Careers: "career", Compare: "unsupported" } as const)[type]
  return (
    <section className="mx-auto max-w-6xl pb-4" aria-label={`${type} comparison unavailable`}>
      <CompareModeNavigation activeType={resolvedActiveType} />
      <header className="border-b border-[#e7e6e3] pb-6 sm:pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">{type}</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">Comparison not available</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6f6d68]">This comparison context is not supported yet.</p>
      </header>
      <Link href={href} className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">{label}</Link>
    </section>
  )
}
