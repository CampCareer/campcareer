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
  if (!sc) return pageMetadata({ title: "Australia Employment", description: "", path: "/map" })
  const ko = STATE_NAMES_KO[sc]
  return pageMetadata({
    title: `호주 ${ko} 고용 현황 — 상위 직업군`,
    description: `${ko}의 추정 고용 인원 기준 상위 직업군입니다. JSA NERO 2026-05 데이터 기반.`,
    path: `/map/au/employment/${params.state}`,
  })
}

export default async function EmploymentStatePage(props: { params: Promise<{ state: string }> }) {
  const params = await props.params;
  const data = await getMapData()
  const sc = toStateCode(params.state)
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <CampCareerMaps data={data} initialState={sc ?? undefined} initialTab="employment" />
    </div>
  )
}
