import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import { STATE_CODES, type StateCode } from "./states"
import AustraliaMap from "./AustraliaMap"

export const metadata = pageMetadata({
  title: "호주 주별 일자리 지도",
  description:
    "호주 지도에서 주를 선택하면 그 지역에서 가장 부족한 직종과 연봉이 높은 직종을 볼 수 있어요. 직종을 누르면 관련 코스·비자 정보로 이어집니다.",
  path: "/map",
})

// 홈 셀렉터에서 ?state=NSW&tab=pay 로 딥링크되어 들어옴 → 초기 선택값으로 사용.
export default async function MapPage({
  searchParams,
}: {
  searchParams: { state?: string; tab?: string }
}) {
  const data = await getMapData()

  const rawState = searchParams.state?.toUpperCase()
  const initialState = (STATE_CODES as string[]).includes(rawState ?? "")
    ? (rawState as StateCode)
    : null
  const initialTab = searchParams.tab === "pay" ? "pay" : "shortage"

  // 전체화면 지도(구글맵 스타일): 헤더·여백 없이 nav 아래를 꽉 채운다.
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <AustraliaMap data={data} initialState={initialState} initialTab={initialTab} />
    </div>
  )
}
