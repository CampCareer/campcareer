import { Suspense } from "react"
import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import CompareHubClient from "./CompareHubClient"

export async function generateMetadata() {
  const t = await getTranslations()
  return pageMetadata({
    title: t.compare.hub.title,
    description: t.compare.hub.subtitle,
    path: "/compare",
  })
}

export default function ComparePage() {
  // ComparisonPlannerClient reads query parameters on the client. Keep that
  // client-only bailout behind Suspense so `/compare` can be prerendered.
  return <Suspense fallback={<main className="min-h-screen bg-background" />}><CompareHubClient /></Suspense>
}
