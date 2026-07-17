import { fetchRoiData, normalizeRoiCountry, DEFAULT_STATE } from "@/lib/roi-query"
import { JsonLd, itemListLd } from "@/components/seo/json-ld"
import { RoiExplorerClient, type RoiFilters, type RoiRow } from "./RoiExplorerClient"
import { permanentRedirect } from "next/navigation"

// matview 데이터는 자주 안 바뀜 — 정적 파라미터 조합은 1시간 캐시
export const revalidate = 3600

const VALID_SORTS = ["roi_score", "net_salary", "payback_years", "avg_cao_points"]
const VALID_STAGES = ["early", "mid", "senior"] as const
const VALID_LIMITS = [20, 50, 100]

export default async function ROIExplorerPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const param = (key: string): string => {
    const v = searchParams[key]
    return typeof v === "string" ? v : ""
  }

  const country = normalizeRoiCountry(param("country") || null)
  // Australia has moved from the legacy global explorer into the university
  // product. Keep field/state intent, but make the readable AU route canonical.
  if (country === "au") {
    const target = new URLSearchParams()
    if (param("field")) target.set("field", param("field"))
    if (param("state") && param("state") !== "ALL_STATES") target.set("state", param("state"))
    permanentRedirect(`/universities/au${target.size ? `?${target.toString()}` : ""}`)
  }
  const state = param("state") || DEFAULT_STATE[country]
  const field = param("field")
  const sort = VALID_SORTS.includes(param("sort")) ? param("sort") : "roi_score"
  const rawLimit = parseInt(param("limit") || "50", 10)
  const limit = VALID_LIMITS.includes(rawLimit) ? rawLimit : 50
  const stageParam = param("career_stage")
  const careerStage: RoiFilters["careerStage"] =
    country === "us" && (VALID_STAGES as readonly string[]).includes(stageParam)
      ? (stageParam as RoiFilters["careerStage"])
      : "early"

  let initialData: RoiRow[] = []
  let initialCount = 0
  try {
    const result = await fetchRoiData({
      country,
      state,
      field: field || null,
      limit,
      sort,
      careerStage,
    })
    initialData = result.data as RoiRow[]
    initialCount = result.count
  } catch (err) {
    // 서버 페치 실패 시 빈 초기 상태로 렌더 — 클라이언트 필터 변경으로 재시도 가능
    console.error("[roi-explorer] server fetch failed:", err)
  }

  return (
    <>
      <JsonLd data={itemListLd(
        initialData.slice(0, 10).map((row) => ({
          name: row.college_name,
          path: `/roi-explorer/${country}/${row.college_id}`,
        }))
      )} />
      <RoiExplorerClient
        initialData={initialData}
        initialCount={initialCount}
        initialFilters={{ country, state, field, sort, limit, careerStage }}
      />
    </>
  )
}
