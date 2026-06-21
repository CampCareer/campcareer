import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import AustraliaMap from "./AustraliaMap"

export const revalidate = 3600

export const metadata = pageMetadata({
  title: "호주 주별 일자리 지도",
  description:
    "호주 지도에서 주를 선택하면 그 지역에서 가장 부족한 직종과 연봉이 높은 직종을 볼 수 있어요. 직종을 누르면 관련 코스·비자 정보로 이어집니다.",
  path: "/map",
})

export default async function MapPage() {
  const data = await getMapData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          호주 주별 일자리 지도
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
          주를 선택하면 그 지역에서 가장 부족한 직종과 연봉이 높은 직종을 보여줘요. 직종을 누르면 관련
          정보와 코스로 이어집니다.
        </p>
      </header>

      <AustraliaMap data={data} />
    </div>
  )
}
