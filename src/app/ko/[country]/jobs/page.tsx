import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { EXPANSION_COUNTRIES, getExpansionCountry, PILOT_COUNTRY_SLUGS } from "@/data/expansion-countries"
import { PilotJobsPage } from "@/components/expansion/pilot-jobs-page"
import { isPilotCountry } from "@/components/expansion/country-pilot-page"

type Props = { params: Promise<{ country: string }> }

export function generateStaticParams() {
  return EXPANSION_COUNTRIES.filter((country) => country.wave === "baseline" || PILOT_COUNTRY_SLUGS.includes(country.slug as typeof PILOT_COUNTRY_SLUGS[number])).map((country) => ({ country: country.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) return { title: "직업 페이지를 찾을 수 없습니다" }
  const path = `/ko/${country.slug}/jobs`
  return {
    title: `${country.nameKo} 부족직종·고ROI 직업 | CampCareer`,
    description: `${country.nameKo}의 부족직종, 고소득 직종, 외국인 취업 가능 직업을 공식 데이터로 검증합니다.`,
    alternates: { canonical: path, languages: { "ko-KR": path, en: `/expansion/${country.slug}/jobs` } },
    robots: { index: false, follow: true },
  }
}

export default async function KoreanPilotJobsPage(props: Props) {
  const params = await props.params;
  const country = getExpansionCountry(params.country)
  if (!country || !isPilotCountry(country)) notFound()
  return <PilotJobsPage country={country} locale="ko" />
}
