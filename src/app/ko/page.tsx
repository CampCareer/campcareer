import { HomeFinder } from "@/components/home/home-finder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = {
  ...pageMetadata({
    title: "과정부터 취업까지, 유학의 결과 비교",
    description: "대학 전공부터 기술 자격까지 검색하고 국가별 총비용·취업 전망·졸업 후 경로를 검증된 자료로 비교하세요.",
    path: "/ko",
  }),
  alternates: {
    canonical: "/ko",
    languages: { "ko-KR": "/ko", en: "/", "x-default": "/" },
  },
}

export default function KoreanLandingPage() {
  return <HomeFinder locale="ko-KR" />
}
