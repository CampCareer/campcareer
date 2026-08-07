import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
  return {
    title: `${launchCountry?.name ?? countryCode} Institutions`,
    description: `Explore verified institutions in ${launchCountry?.name ?? countryCode} with connected programs, campuses and normalized cities.`,
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

  return (
    <InstitutionsExplorer
      countryCode={countryCode}
      searchParams={await searchParams}
    />
  )
}
