import type { Metadata } from "next"
import { Suspense } from "react"
import { RootOAuthCallbackFallback } from "@/components/auth/root-oauth-callback-fallback"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"
import { HomeHub } from "./(workspace)/home/home-hub"

export const metadata: Metadata = {
  title: { absolute: "CampCareer | Australia FIFO Jobs, Tickets & Entry Paths" },
  description: "Compare Australian FIFO entry paths, required tickets, training burden and verified pay research — built for people who want a practical route into higher-paying work.",
  alternates: { canonical: HOME_CANONICAL_PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CampCareer | Australia FIFO Jobs, Tickets & Entry Paths",
    description: "Find practical routes into Australian FIFO work without wasting years on the wrong training.",
  },
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
