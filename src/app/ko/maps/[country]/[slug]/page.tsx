import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PILOT_OCCUPATIONS } from "@/data/pilot-occupations"
import { isPilotOccupationIndexable } from "@/lib/pilot-launch-gate"
import { PilotOccupationPage, pilotOccupationSlug } from "@/components/expansion/pilot-occupation-page"
import { getKoreaOccupation, isKoreaOccupationIndexable } from "@/data/kr-map-data"
import { getMapOccupations } from "@/lib/map-slugs"
import { getFranceDemandOccupation, isFranceDemandOccupationIndexable } from "@/data/fr-map-data"

type Props = { params: { country: string; slug: string } }

function findOccupation(params: Props["params"]) {
  return PILOT_OCCUPATIONS.find((occupation) =>
    occupation.country.toLowerCase() === params.country && pilotOccupationSlug(occupation) === params.slug && isPilotOccupationIndexable(occupation),
  ) ?? null
}

async function findKoreaOccupation(params: Props["params"]) {
  if (params.country !== "kr") return null
  const occupations = await getMapOccupations("kr")
  const mapOccupation = occupations.find((occupation) => occupation.slug === params.slug || occupation.code === params.slug)
  return mapOccupation ? getKoreaOccupation(mapOccupation.code) : null
}

async function findFranceOccupation(params: Props["params"]) {
  if (params.country !== "fr") return null
  const occupations = await getMapOccupations("fr")
  const mapOccupation = occupations.find((occupation) => occupation.slug === params.slug || occupation.code === params.slug)
  return mapOccupation ? getFranceDemandOccupation(mapOccupation.code) : null
}

export async function generateStaticParams() {
  const pilot = PILOT_OCCUPATIONS.filter(isPilotOccupationIndexable).map((occupation) => ({
    country: occupation.country.toLowerCase(),
    slug: pilotOccupationSlug(occupation),
  }))
  const korea = (await getMapOccupations("kr")).filter((occupation) => getKoreaOccupation(occupation.code) && isKoreaOccupationIndexable(getKoreaOccupation(occupation.code)!)).map((occupation) => ({ country: "kr", slug: occupation.slug }))
  const france = (await getMapOccupations("fr")).filter((occupation) => isFranceDemandOccupationIndexable(getFranceDemandOccupation(occupation.code)!)).map((occupation) => ({ country: "fr", slug: occupation.slug }))
  return [...pilot, ...korea, ...france]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const korea = await findKoreaOccupation(params)
  if (korea) {
    const path = `/ko/maps/kr/${params.slug}`
    return {
      title: `${korea.nameKo} 연봉·지역 수요·관련 학과 | CampCareer`,
      description: `${korea.nameKo}의 지역 수요, 임금, 관련 학과·핵심 역량과 공식 채용 검색 경로를 확인하세요.`,
      alternates: { canonical: path, languages: { "ko-KR": path, en: `/maps/kr/${params.slug}` } },
    }
  }
  const france = await findFranceOccupation(params)
  if (france) {
    const path = `/ko/maps/fr/${params.slug}`
    return { title: `${france.nameKo} 프랑스 채용 수요 | CampCareer`, description: `${france.nameKo}의 France Travail BMO 채용계획과 채용난이도를 확인하세요.`, alternates: { canonical: path, languages: { "ko-KR": path, en: `/maps/fr/${params.slug}` } } }
  }
  const occupation = findOccupation(params)
  if (!occupation) return { title: "직업 페이지를 찾을 수 없습니다" }
  const path = `/ko/maps/${params.country}/${params.slug}`
  return {
    title: `${occupation.nameKo ?? occupation.localName ?? occupation.sourceCode} 연봉·수요·취업 경로 | CampCareer`,
    description: `${occupation.nameKo ?? occupation.localName ?? occupation.sourceCode}의 연봉, 인력 부족, 외국인 취업 경로, 언어 장벽을 확인하세요.`,
    alternates: { canonical: path, languages: { "ko-KR": path, en: `/expansion/maps/${params.country}/${params.slug}` } },
  }
}

export default async function KoreanPilotOccupationPage({ params }: Props) {
  const korea = await findKoreaOccupation(params)
  if (korea) {
    if (!isKoreaOccupationIndexable(korea)) notFound()
    return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><h1 className="text-4xl font-semibold text-slate-950">{korea.nameKo}</h1><p className="mt-3 text-slate-600">{korea.nameEn} · KSCO {korea.kscoCode}</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-lg border border-slate-200 p-5"><p className="text-sm text-slate-500">지역 월 임금</p><p className="mt-2 text-2xl font-semibold">KRW {korea.monthlyWageKrw?.toLocaleString()}</p></div><div className="rounded-lg border border-slate-200 p-5"><p className="text-sm text-slate-500">수요 신호</p><p className="mt-2 text-2xl font-semibold">{korea.demandScore}/100</p></div></div></main>
  }
  const france = await findFranceOccupation(params)
  if (france) {
    if (!isFranceDemandOccupationIndexable(france)) notFound()
    return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><h1 className="text-4xl font-semibold text-slate-950">{france.nameKo}</h1><p className="mt-3 text-slate-600">{france.nameEn} · {france.localName}</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-lg border border-slate-200 p-5"><p className="text-sm text-slate-500">2026 채용계획</p><p className="mt-2 text-2xl font-semibold">{france.recruitmentProjects.toLocaleString()}</p></div><div className="rounded-lg border border-slate-200 p-5"><p className="text-sm text-slate-500">채용난이도</p><p className="mt-2 text-2xl font-semibold">{france.recruitmentDifficultyPct?.toFixed(1)}%</p></div></div><p className="mt-6 text-sm leading-6 text-slate-500">France Travail BMO의 고용주 채용 의향 지표이며 비자·체류 가능성이나 실제 채용 보장은 아닙니다.</p></main>
  }
  const occupation = findOccupation(params)
  if (!occupation) notFound()
  return <PilotOccupationPage occupation={occupation} locale="ko" />
}
