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
  if (!country || !isPilotCountry(country)) return { title: "페이지를 찾을 수 없습니다" }
  const path = `/ko/${country.slug}`
  return {
    title: `${country.nameKo} 유학·취업 경로 | CampCareer`,
    description: `${country.nameKo}의 직업 수요, 연봉, 외국인 취업 경로와 한국 귀국 대비를 검증합니다.`,
    alternates: { canonical: path, languages: { "ko-KR": path, en: `/expansion/${country.slug}` } },
    robots: { index: false, follow: true },
  }
}

export default function KoreanPilotCountryPage({ params }: Props) {
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) notFound()
  return <PilotCountryPage country={country} locale="ko" />
}
