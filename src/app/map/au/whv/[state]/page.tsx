import { getMapData } from "@/lib/map-data"
import { pageMetadata } from "@/lib/seo"
import CampCareerMaps from "../../../CampCareerMaps"
import { STATE_CODES, type StateCode } from "../../../states"

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

export const revalidate = 86400

function toStateCode(param: string): StateCode | null {
  const upper = param.toUpperCase() as StateCode
  return (STATE_CODES as readonly string[]).includes(upper) ? upper : null
}

export async function generateMetadata(props: { params: Promise<{ state: string }> }) {
  const params = await props.params;
  const sc = toStateCode(params.state)
  if (!sc) return pageMetadata({ title: "Australia WHV", description: "", path: "/map" })
  const ko = STATE_NAMES_KO[sc]
  return pageMetadata({
    title: `호주 워킹홀리데이 ${ko} — 세컨비자`,
    description: `${ko}에서 워킹홀리데이 세컨비자 조건과 스폰서 가능 직종을 확인하세요.`,
    path: `/map/au/whv/${params.state}`,
  })
}

export default async function WhvStatePage(props: { params: Promise<{ state: string }> }) {
  const params = await props.params;
  const data = await getMapData()
  const sc = toStateCode(params.state)
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <CampCareerMaps data={data} initialState={sc ?? undefined} initialTab="whv" />
    </div>
  )
}
