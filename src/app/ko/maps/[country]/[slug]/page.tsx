import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PILOT_OCCUPATIONS } from "@/data/pilot-occupations"
import { isPilotOccupationIndexable } from "@/lib/pilot-launch-gate"
import { PilotOccupationPage, pilotOccupationSlug } from "@/components/expansion/pilot-occupation-page"

type Props = { params: { country: string; slug: string } }

function findOccupation(params: Props["params"]) {
  return PILOT_OCCUPATIONS.find((occupation) =>
    occupation.country.toLowerCase() === params.country && pilotOccupationSlug(occupation) === params.slug && isPilotOccupationIndexable(occupation),
  ) ?? null
}

export function generateStaticParams() {
  return PILOT_OCCUPATIONS.filter(isPilotOccupationIndexable).map((occupation) => ({
    country: occupation.country.toLowerCase(),
    slug: pilotOccupationSlug(occupation),
  }))
}

export function generateMetadata({ params }: Props): Metadata {
  const occupation = findOccupation(params)
  if (!occupation) return { title: "직업 페이지를 찾을 수 없습니다" }
  const path = `/ko/maps/${params.country}/${params.slug}`
  return {
    title: `${occupation.nameKo ?? occupation.localName ?? occupation.sourceCode} 연봉·수요·취업 경로 | CampCareer`,
    description: `${occupation.nameKo ?? occupation.localName ?? occupation.sourceCode}의 연봉, 인력 부족, 외국인 취업 경로, 언어 장벽을 확인하세요.`,
    alternates: { canonical: path, languages: { "ko-KR": path, en: `/expansion/maps/${params.country}/${params.slug}` } },
  }
}

export default function KoreanPilotOccupationPage({ params }: Props) {
  const occupation = findOccupation(params)
  if (!occupation) notFound()
  return <PilotOccupationPage occupation={occupation} locale="ko" />
}
