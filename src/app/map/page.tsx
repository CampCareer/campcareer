import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import AustraliaMap from "./AustraliaMap"

// 다른 모든 페이지(/, /blog, /roi-explorer)와 동일하게 정적(ISR)으로 렌더한다.
// /map은 트래픽의 ~96%를 차지하는 front door라, 매 요청 동적 렌더링이 컴퓨트를
// 폭증시켰다. 데이터는 ~월 단위로만 바뀌므로 24h 리밸리데이트로 충분하다.
// ?state=NSW&tab=pay 딥링크는 서버 searchParams 대신 AustraliaMap이 마운트 후
// window.location.search에서 직접 읽는다(정적 렌더 유지 + 하이드레이션 불일치 없음).
export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "세계 취업 지도 — 호주 주별 부족 직종",
  description:
    "세계 지도에서 호주를 클릭하면 주별 부족 직종과 고소득 직업을 볼 수 있어요. 직종을 누르면 관련 코스·비자 정보로 이어집니다.",
  path: "/map",
})

export default async function MapPage() {
  const data = await getMapData()

  // 전체화면 지도(구글맵 스타일): 헤더·여백 없이 nav 아래를 꽉 채운다.
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <AustraliaMap data={data} />
    </div>
  )
}
