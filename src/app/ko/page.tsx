import { RouteSearchLanding } from "@/components/routes/route-search-landing"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer — 해외 커리어 경로 검색",
  description: "시민권, 목적지, 직종을 기준으로 비자 조건, 준비, 구직 링크, 관련 교육, 지도를 한 경로로 확인하세요.",
  path: "/ko",
})

export default function KoreanLandingPage() {
  return <RouteSearchLanding locale="ko" />
}
