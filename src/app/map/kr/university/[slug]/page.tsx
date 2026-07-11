import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { KR_UNIVERSITIES, getKoreaRegion } from "@/data/kr-map-data"
import UniversityStaticCard from "@/app/map/UniversityStaticCard"
import { pageMetadata } from "@/lib/seo"

export function generateStaticParams() { return KR_UNIVERSITIES.map((university) => ({ slug: university.slug })) }

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const university = KR_UNIVERSITIES.find((item) => item.slug === params.slug)
  if (!university) return { title: "University not found" }
  return { ...pageMetadata({ title: `${university.nameEn} - QS Rank, Tuition and Career Map | CampCareer`, description: `${university.nameKo}의 QS 2027 순위, 공식 사이트, 지역 직업 지도 정보를 확인하세요.`, path: `/map/kr/university/${university.slug}` }), robots: { index: false, follow: true } }
}

export default async function KoreaUniversityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const university = KR_UNIVERSITIES.find((item) => item.slug === params.slug)
  if (!university) notFound()
  const region = getKoreaRegion(university.regionCode)
  return <UniversityStaticCard d={{ name: university.nameEn, cityName: university.cityName, locationLabel: region?.nameKo ?? university.regionCode, countryCode: "KR", countryLabel: "South Korea", qsRank: university.qsRank2027, website: university.officialUrl, tuition: university.averageTuitionKrw, tuitionCurrency: "KRW " }} />
}
