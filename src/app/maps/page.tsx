import { pageMetadata } from "@/lib/seo"
import { getInitialMapShellData } from "@/lib/map-data"
import { getLocale } from "@/lib/i18n/server"
import CampCareerMaps from "@/app/map/CampCareerMaps"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const locale = await getLocale()
  return pageMetadata({
    title: locale === "ko" ? "호주 기회 지도 | CampCareer" : "Australia opportunity map | CampCareer",
    description: locale === "ko"
      ? "공식 출처가 표시된 직업, 고용 및 지역 지표를 바탕으로 호주의 주·준주별 기회를 탐색하세요."
      : "Explore Australia by state using source-labelled occupation, employment, and regional signals.",
    path: "/maps",
  })
}

export default async function MapsPage() {
  const data = await getInitialMapShellData()
  return <div className="h-[calc(100dvh-3.5rem)] w-full sm:h-[calc(100dvh-4rem)]"><CampCareerMaps data={data} auOnly routeMode /></div>
}
