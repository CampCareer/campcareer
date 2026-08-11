import Link from "next/link"
import { AU_NURSING_PROGRAM_IDS } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes"
import { AU_NURSING_PROGRAM_COMPARE_REPOSITORY } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes-repository"
import { parseCareerComparisonState, type CareerComparisonState } from "@/lib/career-comparison"
import { parseCountryComparisonState, type CountryComparisonState } from "@/lib/country-comparison"
import { getAuCityComparison } from "@/lib/cities/au-city-comparison.server"
import { getCaCityComparison } from "@/lib/cities/ca-city-comparison.server"
import { getDeCityComparison } from "@/lib/cities/de-city-comparison.server"
import { getNlCityComparison } from "@/lib/cities/nl-city-comparison.server"
import { getNzCityComparison } from "@/lib/cities/nz-city-comparison.server"
import { getUkCityComparison } from "@/lib/cities/uk-city-comparison.server"
import { getUsCityComparison } from "@/lib/cities/us-city-comparison.server"
import { resolveCompareModeType, type CompareModeType } from "@/lib/compare-navigation"
import {
  buildCareerCompareCanonicalHref,
  buildCityCompareCanonicalHref,
  buildCountryCompareCanonicalHref,
  buildProgramCompareCanonicalHref,
} from "@/lib/compare-routes"
import ProgramsCompareMatrix from "./programs-compare-matrix"
import CountriesCompareMatrix from "./countries-compare-matrix"
import CareersCompareMatrix from "./careers-compare-matrix"
import { CitiesCompareMatrix } from "./cities-compare-matrix"
import { CanadaCitiesCompareMatrix } from "./canada-cities-compare-matrix"
import { GermanyCitiesCompareMatrix } from "./germany-cities-compare-matrix"
import { NetherlandsCitiesCompareMatrix } from "./netherlands-cities-compare-matrix"
import { NewZealandCitiesCompareMatrix } from "./new-zealand-cities-compare-matrix"
import { UnitedKingdomCitiesCompareMatrix } from "./united-kingdom-cities-compare-matrix"
import { UnitedStatesCitiesCompareMatrix } from "./united-states-cities-compare-matrix"
import { ComparePageHeader } from "./compare-mode-navigation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Compare pathways",
  description:
    "Compare reviewed programs, countries, cities and careers with explicit context and source-aware missing values.",
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
  const pageType = resolveCompareModeType(params.get("type"))

  if (pageType === "country") return <CountriesCompare comparison={parseCountryComparisonState(params)} />
  if (pageType === "city") {
    const country = params.get("country")?.toUpperCase() ?? "AU"
    return <CitiesCompare countryCode={country} params={params} />
  }
  if (pageType === "career") {
    const country = params.get("country")?.toUpperCase() ?? "AU"
    return <CareersCompare comparison={parseCareerComparisonState(params)} countryCode={country} />
  }
  if (pageType === "unsupported") return <UnsupportedComparisonType />

  return <ProgramsCompare params={params} />
}

async function ProgramsCompare({ params }: { params: URLSearchParams }) {
  const country = params.get("country")?.toUpperCase() ?? "AU"
  const field = params.get("field") ?? "nursing"
  if (country !== "AU" || field !== "nursing") {
    return (
      <UnsupportedSurface
        type="Programs"
        href={buildProgramCompareCanonicalHref()}
        label="Compare Australian Nursing programs"
        activeType="program"
        countryCode={country}
      />
    )
  }

  const programs = await AU_NURSING_PROGRAM_COMPARE_REPOSITORY.getProgramCompareItems(AU_NURSING_PROGRAM_IDS)
  return (
    <section className="w-full pb-4" aria-label="Programs comparison">
      <ComparePageHeader activeType="program" countryCode={country} />
      <ProgramsCompareMatrix availablePrograms={programs} />
    </section>
  )
}

function CountriesCompare({ comparison }: { comparison: CountryComparisonState }) {
  if (comparison.contextState === "unsupported") return <UnsupportedCountryComparison />
  return (
    <section className="w-full pb-4" aria-label="Countries comparison">
      <ComparePageHeader activeType="country" />
      <CountriesCompareMatrix initialLocations={comparison.locations} />
    </section>
  )
}

async function CitiesCompare({ countryCode, params }: { countryCode: string; params: URLSearchParams }) {
  if (countryCode === "SG") return <SingaporeCityStateDecision />

  if (countryCode === "AU") {
    const comparison = await getAuCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "AU" })} label="Compare Australian cities" activeType="city" countryCode={countryCode} />
    }
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <CitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} sharedProgramCount={comparison.sharedProgramCount} />
      </section>
    )
  }

  if (countryCode === "CA") {
    const comparison = await getCaCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "CA" })} label="Compare Canadian cities" activeType="city" countryCode={countryCode} />
    }
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <CanadaCitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} sharedCareerCount={comparison.sharedCareerCount} />
      </section>
    )
  }

  if (countryCode === "DE") {
    const comparison = await getDeCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return (
        <UnsupportedSurface
          type="Cities"
          href={buildCityCompareCanonicalHref({ country: "DE" })}
          label="Compare German cities"
          activeType="city"
          countryCode={countryCode}
        />
      )
    }

    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <GermanyCitiesCompareMatrix
          left={comparison.left}
          right={comparison.right}
          options={comparison.options}
        />
      </section>
    )
  }

  if (countryCode === "NZ") {
    const comparison = await getNzCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "NZ" })} label="Compare New Zealand cities" activeType="city" countryCode={countryCode} />
    }
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <NewZealandCitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} />
      </section>
    )
  }

  if (countryCode === "NL") {
    const comparison = await getNlCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "NL" })} label="Compare Netherlands cities" activeType="city" countryCode={countryCode} />
    }
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <NetherlandsCitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} />
      </section>
    )
  }

  if (countryCode === "UK") {
    const comparison = await getUkCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "UK" })} label="Compare UK cities" activeType="city" countryCode={countryCode} />
    }
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <UnitedKingdomCitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} />
      </section>
    )
  }

  if (countryCode === "US") {
    const comparison = await getUsCityComparison(params.get("left"), params.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "US" })} label="Compare U.S. cities" activeType="city" countryCode={countryCode} />
    }
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={countryCode} />
        <UnitedStatesCitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} />
      </section>
    )
  }

  return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref({ country: "AU" })} label="Compare Australian cities" activeType="city" countryCode={countryCode} />
}

function SingaporeCityStateDecision() {
  return (
    <section className="w-full pb-4" aria-label="Singapore city-state comparison guidance">
      <ComparePageHeader activeType="city" countryCode="SG" />
      <div className="max-w-2xl rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Singapore city-state</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">There is no Singapore city shortlist to compare</h2>
        <p className="mt-2 text-sm leading-6 text-[#6f6d68]">CampCareer treats Singapore as one country-level study destination. Central, East, North, North-East, West and CBD remain living and commute contexts rather than separate canonical study cities.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/sg" className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">Open Singapore destination</Link>
          <Link href="/map?country=sg&area=central" className="inline-flex min-h-11 items-center rounded-xl border border-[#e7e6e3] px-4 text-sm font-semibold text-[#1b1b1b]">Compare living areas</Link>
          <Link href={buildCountryCompareCanonicalHref()} className="inline-flex min-h-11 items-center rounded-xl border border-[#e7e6e3] px-4 text-sm font-semibold text-[#1b1b1b]">Compare countries</Link>
        </div>
      </div>
    </section>
  )
}

function CareersCompare({ comparison, countryCode }: { comparison: CareerComparisonState; countryCode: string }) {
  if (comparison.contextState === "unsupported") {
    return <UnsupportedSurface type="Careers" href={buildCareerCompareCanonicalHref()} label="Compare Australian careers" activeType="career" countryCode={countryCode} />
  }
  return (
    <section className="w-full pb-4" aria-label="Careers comparison">
      <ComparePageHeader activeType="career" countryCode={countryCode} />
      <CareersCompareMatrix />
    </section>
  )
}

function UnsupportedCountryComparison() {
  return <UnsupportedSurface type="Countries" href={buildCountryCompareCanonicalHref()} label="Start a country comparison" activeType="country" />
}

function UnsupportedComparisonType() {
  return (
    <section className="w-full pb-4" aria-label="Compare unavailable">
      <div className="max-w-xl rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
        <h1 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Comparison not available</h1>
        <p className="mt-2 text-sm leading-6 text-[#6f6d68]">This comparison context is not supported yet.</p>
        <Link href={buildProgramCompareCanonicalHref()} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">Open Programs Compare</Link>
      </div>
    </section>
  )
}

function UnsupportedSurface({ type, href, label, activeType, countryCode }: {
  type: "Programs" | "Countries" | "Cities" | "Careers"
  href: string
  label: string
  activeType: CompareModeType
  countryCode?: string | null
}) {
  return (
    <section className="w-full pb-4" aria-label={`${type} comparison unavailable`}>
      <ComparePageHeader activeType={activeType} countryCode={countryCode} />
      <div className="max-w-xl rounded-2xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Comparison not available</h2>
        <p className="mt-2 text-sm leading-6 text-[#6f6d68]">This comparison context is not supported yet.</p>
        <Link href={href} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">{label}</Link>
      </div>
    </section>
  )
}
