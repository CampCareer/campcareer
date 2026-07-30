import { RouteSearchLanding } from "@/components/routes/route-search-landing"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer — 검증된 해외 취업·학업 경로 검색",
  description: "목적지와 하고 싶은 일을 검색해 출처가 확인된 과정·구직·지역 정보를 찾으세요.",
  path: "/ko",
})

export default function KoreanLandingPage() {
  return <RouteSearchLanding locale="ko" />
}
