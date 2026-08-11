import type { Metadata } from "next"
import { Suspense } from "react"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"
import { HomeHub } from "./home/home-hub"

export const metadata: Metadata = {
  title: { absolute: "CampCareer | 해외 커리어 가능성 확인" },
  description: "원하는 나라와 직업을 선택하면, 해외 커리어가 현실적으로 가능한지와 다음 경로를 알려드립니다.",
  alternates: { canonical: HOME_CANONICAL_PATH },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeHubFallback />}>
      <HomeHub />
    </Suspense>
  )
}

function HomeHubFallback() {
  return <main className="min-h-[calc(100vh-3.5rem)] bg-[#fbfbfa]" />
}
