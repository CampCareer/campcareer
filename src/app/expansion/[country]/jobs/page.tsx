import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { EXPANSION_COUNTRIES, getExpansionCountry, PILOT_COUNTRY_SLUGS } from "@/data/expansion-countries"
import { PilotJobsPage } from "@/components/expansion/pilot-jobs-page"
import { isPilotCountry } from "@/components/expansion/country-pilot-page"

type Props = { params: { country: string } }

export function generateStaticParams() {
  return EXPANSION_COUNTRIES.filter((country) => country.wave === "baseline" || PILOT_COUNTRY_SLUGS.includes(country.slug as typeof PILOT_COUNTRY_SLUGS[number])).map((country) => ({ country: country.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) return { title: "Occupation pilot not found" }
  const path = `/expansion/${country.slug}/jobs`
  return {
    title: `${country.nameEn} shortage and high-ROI occupations | CampCareer`,
    description: `Validate shortage, high-income, and foreign-worker accessible occupations in ${country.nameEn}.`,
    alternates: { canonical: path, languages: { en: path, "ko-KR": `/ko/${country.slug}/jobs` } },
    robots: { index: false, follow: true },
  }
}

export default function EnglishPilotJobsPage({ params }: Props) {
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) notFound()
  return <PilotJobsPage country={country} locale="en" />
}
