import type { Metadata } from "next"
import { Suspense } from "react"
import { RootOAuthCallbackFallback } from "@/components/auth/root-oauth-callback-fallback"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"
import { HomeHub } from "./(workspace)/home/home-hub"

export const metadata: Metadata = {
  title: { absolute: "CampCareer | Career Scores, Evidence and Entry Paths" },
  description: "Compare careers by country with a 100-point CampCareer Score for Demand, Pay and Entry, then inspect the evidence, study routes, programs and jobs behind the verdict.",
  alternates: { canonical: HOME_CANONICAL_PATH },
  robots: { index: true, follow: true },
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
  return <main className="min-h-[calc(100vh-4rem)] bg-white" />
}
