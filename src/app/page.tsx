import type { Metadata } from "next"
import { Suspense } from "react"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"
import { HomeHub } from "./(workspace)/home/home-hub"

export const metadata: Metadata = {
  title: { absolute: "CampCareer | 해외에서 일하는 경로를 찾다" },
  description: "직업과 목표 국가를 선택하면, 해외 취업 수요부터 비자·자격 조건과 실행 경로까지 확인할 수 있습니다.",
  alternates: { canonical: HOME_CANONICAL_PATH },
  robots: { index: true, follow: true },
}

export default function LandingPage() {
  return <Suspense fallback={<LandingFallback />}><HomeHub /></Suspense>
}

function LandingFallback() {
  return <main className="min-h-[calc(100vh-3.5rem)] bg-[#fbfbfa]" />
}
