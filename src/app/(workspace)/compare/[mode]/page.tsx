import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { AU_NURSING_PROGRAM_IDS } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes"
import { AU_NURSING_PROGRAM_COMPARE_REPOSITORY } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes-repository"
import { parseCareerComparisonState } from "@/lib/career-comparison"
import {
  parseCountryComparisonState,
  serializeCountryLocations,
  type ComparisonPageType,
} from "@/lib/country-comparison"
import { getAuCityComparison } from "@/lib/cities/au-city-comparison.server"
import {
  buildCareerCompareCanonicalHref,
  buildCityCompareCanonicalHref,
  buildCountryCompareCanonicalHref,
  buildProgramCompareCanonicalHref,
  PROGRAM_COMPARE_COUNTRY,
  PROGRAM_COMPARE_FIELD,
  type CanonicalCompareMode,
} from "@/lib/compare-routes"
import ProgramsCompareMatrix from "../programs-compare-matrix"
import CountriesCompareMatrix from "../countries-compare-matrix"
import CareersCompareMatrix from "../careers-compare-matrix"
import { CitiesCompareMatrix } from "../cities-compare-matrix"
import { ComparePageHeader } from "../compare-mode-navigation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Compare pathways",
  description: "Compare reviewed programs, countries, cities and careers with explicit context and source-aware missing values.",
  robots: { index: false, follow: false } as const,
}

type CompareModePageProps = {
  params: Promise<{ mode: string }>
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

function normalizeProgramIds(raw: string | null) {
  const allowed = new Set<string>(AU_NURSING_PROGRAM_IDS)
  const ids: string[] = []
  for (const value of (raw ?? "").split(",")) {
    const id = value.trim()
    if (!id || !allowed.has(id) || ids.includes(id)) continue
    ids.push(id)
    if (ids.length >= 3) break
  }
  return ids
}

function isCanonicalQuery(current: URLSearchParams, href: string) {
  const expected = new URL(href, "https://campcareer.local").searchParams
  return current.toString() === expected.toString()
}

export default async function CompareModePage({ params, searchParams }: CompareModePageProps) {
  const { mode: rawMode } = await params
  const mode = rawMode.toLowerCase() as CanonicalCompareMode
  if (!(["programs", "countries", "cities", "careers"] as const).includes(mode)) notFound()

  const sp = toSearchParams(await searchParams)

  if (mode === "programs") {
    const country = sp.get("country")?.toUpperCase() ?? PROGRAM_COMPARE_COUNTRY
    const field = sp.get("field")?.toLowerCase() ?? PROGRAM_COMPARE_FIELD
    if (country !== PROGRAM_COMPARE_COUNTRY || field !== PROGRAM_COMPARE_FIELD) {
      return <UnsupportedSurface type="Programs" href={buildProgramCompareCanonicalHref()} label="Compare Australian Nursing programs" activeType="program" countryCode={country} />
    }

    const href = buildProgramCompareCanonicalHref(normalizeProgramIds(sp.get("items")))
    if (rawMode !== mode || !isCanonicalQuery(sp, href)) permanentRedirect(href)
    const programs = await AU_NURSING_PROGRAM_COMPARE_REPOSITORY.getProgramCompareItems(AU_NURSING_PROGRAM_IDS)
    return <section className="w-full pb-4" aria-label="Programs comparison"><ComparePageHeader activeType="program" countryCode={country} /><ProgramsCompareMatrix availablePrograms={programs} /></section>
  }

  if (mode === "countries") {
    const comparison = parseCountryComparisonState(sp)
    if (comparison.contextState === "unsupported") {
      return <UnsupportedSurface type="Countries" href={buildCountryCompareCanonicalHref()} label="Start a country comparison" activeType="country" />
    }
    const href = buildCountryCompareCanonicalHref({ goal: comparison.goal!, profile: comparison.profile!, locations: serializeCountryLocations(comparison.locations) })
    if (rawMode !== mode || !isCanonicalQuery(sp, href)) permanentRedirect(href)
    return <section className="w-full pb-4" aria-label="Countries comparison"><ComparePageHeader activeType="country" /><CountriesCompareMatrix initialLocations={comparison.locations} /></section>
  }

  if (mode === "cities") {
    const country = sp.get("country")?.toUpperCase() ?? "AU"
    if (country !== "AU") {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref()} label="Compare Australian cities" activeType="city" countryCode={country} />
    }
    const comparison = await getAuCityComparison(sp.get("left"), sp.get("right"))
    if (!comparison) {
      return <UnsupportedSurface type="Cities" href={buildCityCompareCanonicalHref()} label="Compare Australian cities" activeType="city" countryCode={country} />
    }
    const href = buildCityCompareCanonicalHref({ country, left: comparison.left.slug, right: comparison.right.slug })
    if (rawMode !== mode || !isCanonicalQuery(sp, href)) permanentRedirect(href)
    return (
      <section className="w-full pb-4" aria-label="Cities comparison">
        <ComparePageHeader activeType="city" countryCode={country} />
        <CitiesCompareMatrix left={comparison.left} right={comparison.right} options={comparison.options} sharedProgramCount={comparison.sharedProgramCount} />
      </section>
    )
  }

  const comparison = parseCareerComparisonState(sp)
  const country = sp.get("country")?.toUpperCase() ?? "AU"
  if (comparison.contextState === "unsupported") {
    return <UnsupportedSurface type="Careers" href={buildCareerCompareCanonicalHref()} label="Compare Australian careers" activeType="career" countryCode={country} />
  }
  const href = buildCareerCompareCanonicalHref({ country: comparison.countryCode!, profile: comparison.profile!, city: comparison.citySlug, careers: comparison.careerIds })
  if (rawMode !== mode || !isCanonicalQuery(sp, href)) permanentRedirect(href)
  return <section className="w-full pb-4" aria-label="Careers comparison"><ComparePageHeader activeType="career" countryCode={country} /><CareersCompareMatrix /></section>
}

function UnsupportedSurface({ type, href, label, activeType, countryCode }: {
  type: "Programs" | "Countries" | "Cities" | "Careers"
  href: string
  label: string
  activeType: Exclude<ComparisonPageType, "unsupported"> | "city"
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
