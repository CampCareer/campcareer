import type { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"
import { RootOAuthCallbackFallback } from "@/components/auth/root-oauth-callback-fallback"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"
import { HomeHub } from "./(workspace)/home/home-hub"

export async function generateMetadata(): Promise<Metadata> {
  const routeLocale = (await headers()).get("x-campcareer-locale")
  const korean = routeLocale === "ko"
  const canonical = korean ? "/ko" : HOME_CANONICAL_PATH
  const title = korean ? "CampCareer | 해외에서 일하는 경로를 찾다" : "CampCareer | Build your career abroad"
  const description = korean
    ? "직업과 목표 국가를 선택하면, 해외 취업 수요부터 비자·자격 조건과 실행 경로까지 확인할 수 있습니다."
    : "Choose an occupation and destination to review source-backed job demand, qualification conditions and practical routes for working abroad."

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: HOME_CANONICAL_PATH,
        ko: "/ko",
        "x-default": HOME_CANONICAL_PATH,
      },
    },
    openGraph: {
      type: "website",
      locale: korean ? "ko_KR" : "en_US",
      alternateLocale: korean ? "en_US" : "ko_KR",
      siteName: "CampCareer",
      title,
      description,
      images: [{ url: "/og-career-path.png", width: 1200, height: 630, alt: korean ? "CampCareer — 해외에서 일하는 경로" : "CampCareer — Build your career abroad" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-career-path.png"] },
    robots: { index: true, follow: true },
  }
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LandingFallback />}>
      <RootOAuthCallbackFallback />
      <HomeHub />
    </Suspense>
  )
}

function LandingFallback() {
  return <main className="min-h-[calc(100vh-3.5rem)] bg-[#fbfbfa]" />
}
