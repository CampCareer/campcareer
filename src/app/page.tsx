import { HomeFinder } from "@/components/home/home-finder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer — 어디서 일할 수 있는지부터",
  description:
    "국가와 지역(호주 주·준주)을 고르면 그 지역에서 사람이 부족한 직업과 연봉이 높은 직업을 보여줍니다. 직업을 누르면 관련 코스와 비자 정보로 이어집니다. OSCA 부족직종 목록과 ABS 소득 데이터 기반.",
  path: "/",
})

export default function LandingPage() {
  return <HomeFinder />
}
