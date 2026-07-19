import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import CampCareerMaps from "../../../../CampCareerMaps"
import { STATE_CODES, type StateCode } from "../../../../states"
import { WHV_REGIONS } from "@/data/whv-regions"

const STATE_NAMES_KO: Record<StateCode, string> = {
  NSW: "뉴사우스웨일스",
  VIC: "빅토리아",
  QLD: "퀸즐랜드",
  SA: "사우스오스트레일리아",
  WA: "웨스턴오스트레일리아",
  TAS: "태즈메이니아",
  NT: "노던준주",
  ACT: "오스트레일리아수도준주",
}

const CATEGORY_LABEL: Record<string, string> = {
  eligible: "세컨비자 eligible",
  partial: "세컨비자 부분 eligible",
  none: "세컨비자 비적합",
}

export const revalidate = 86400

function toStateCode(param: string): StateCode | null {
  const upper = param.toUpperCase() as StateCode
  return (STATE_CODES as readonly string[]).includes(upper) ? upper : null
}

export async function generateMetadata(props: { params: Promise<{ state: string; sa4: string }> }) {
  const params = await props.params;
  const sc = toStateCode(params.state)
  if (!sc || !WHV_REGIONS[params.sa4]) {
    return pageMetadata({ title: "Australia WHV", description: "", path: "/map" })
  }
  const ko = STATE_NAMES_KO[sc]
  const region = WHV_REGIONS[params.sa4]
  const cat = CATEGORY_LABEL[region.category] ?? ""
  return pageMetadata({
    title: `${region.name} 세컨비자 조건 — 호주 워킹홀리데이 ${ko}`,
    description: `${region.name} 지역은 워킹홀리데이 ${cat} 지역입니다. 세컨비자 조건과 지정 직종을 확인하세요.`,
    path: `/map/au/whv/${params.state}/${params.sa4}`,
  })
}

export default async function WhvSA4Page(props: { params: Promise<{ state: string; sa4: string }> }) {
  const params = await props.params;
  const data = await getMapData()
  const sc = toStateCode(params.state)
  if (!sc || !WHV_REGIONS[params.sa4]) {
    return (
      <div className="h-[100dvh] w-full">
        <CampCareerMaps data={data} />
      </div>
    )
  }
  return (
    <div className="h-[100dvh] w-full">
      <CampCareerMaps data={data} initialState={sc} initialTab="whv" initialSA4={params.sa4} />
    </div>
  )
}
