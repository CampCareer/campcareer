import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { EXPANSION_COUNTRIES, getExpansionCountry, PILOT_COUNTRY_SLUGS } from "@/data/expansion-countries"
import { PilotCountryPage, isPilotCountry } from "@/components/expansion/country-pilot-page"

type Props = { params: { country: string } }

export function generateStaticParams() {
  return EXPANSION_COUNTRIES.filter((country) => country.wave === "baseline" || PILOT_COUNTRY_SLUGS.includes(country.slug as typeof PILOT_COUNTRY_SLUGS[number])).map((country) => ({ country: country.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) return { title: "Country pilot not found" }
  const path = `/expansion/${country.slug}`
  return {
    title: `${country.nameEn} Study and Work Pilot | CampCareer`,
    description: `Validate career demand, income, foreign-worker pathways, and a South Korea return benchmark for ${country.nameEn}.`,
    alternates: { canonical: path, languages: { en: path, "ko-KR": `/ko/${country.slug}` } },
    robots: { index: false, follow: true },
  }
}

export default function EnglishPilotCountryPage({ params }: Props) {
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) notFound()
  return <PilotCountryPage country={country} locale="en" />
}
