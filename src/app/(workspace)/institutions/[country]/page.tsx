import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { getLaunchCountry } from "@/data/launch-countries"
import {
  INSTITUTION_MVP_COUNTRIES,
  normalizeInstitutionCountrySegment,
} from "@/lib/institutions/institution-search"
import { InstitutionsExplorer } from "../institutions-explorer"

export const revalidate = 3600

export function generateStaticParams() {
  return INSTITUTION_MVP_COUNTRIES.map((country) => ({ country: country.toLowerCase() }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>
}): Promise<Metadata> {
  const { country } = await params
  const countryCode = normalizeInstitutionCountrySegment(country)
  if (!countryCode) return { robots: { index: false, follow: true } }

  const launchCountry = getLaunchCountry(countryCode)
  const locationLabel = countryCode === "AU" ? "campuses" : "locations"
  return {
    title: `${launchCountry?.name ?? countryCode} Institutions`,
    description: `Explore verified institutions in ${launchCountry?.name ?? countryCode} with connected programs, ${locationLabel} and normalized location data.`,
    alternates: { canonical: `/institutions/${countryCode.toLowerCase()}` },
    robots: { index: true, follow: true },
  }
}

export default async function InstitutionCountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { country } = await params
  const countryCode = normalizeInstitutionCountrySegment(country)
  if (!countryCode) notFound()
  if (country !== countryCode.toLowerCase()) permanentRedirect(`/institutions/${countryCode.toLowerCase()}`)

  return (
    <InstitutionsExplorer
      countryCode={countryCode}
      searchParams={await searchParams}
    />
  )
}
