import type { Metadata } from "next"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase-server"
import { HOME_CANONICAL_PATH } from "@/lib/seo-routes.mjs"
import { HomeDashboard } from "./home/home-dashboard"
import { HomeDashboardBackground } from "./home/home-dashboard-background"
import { getHomeMode, toDashboardPathways, type SavedPathwayRecord } from "./home/home-dashboard-config"
import { HomeHub } from "./home/home-hub"

export const metadata: Metadata = {
  title: { absolute: "CampCareer | Source-backed work and study routes" },
  description: "Search verified work and study routes by passport, destination, and field — with source dates and direct links.",
  alternates: { canonical: HOME_CANONICAL_PATH },
  robots: { index: true, follow: true },
}

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toSearchParams(params: Record<string, string | string[] | undefined>) {
  const normalized = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") normalized.set(key, value)
  }
  return normalized
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = toSearchParams(await searchParams)

  if (getHomeMode(params, false) === "result") {
    return <Suspense fallback={null}><HomeHub /></Suspense>
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  const isAuthenticated = Boolean(user && !userError)
  const mode = getHomeMode(params, isAuthenticated)

  if (mode === "explore") {
    return <Suspense fallback={null}><HomeHub showDashboardBackLink={isAuthenticated} /></Suspense>
  }

  const { data, error } = await supabase
    .from("saved_pathways")
    .select("id, origin_country_code, country_code, field_slug, status_slug, updated_at")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(6)

  const pathways = toDashboardPathways((data as SavedPathwayRecord[] | null) ?? [])

  return (
    <HomeDashboardBackground countryCode={pathways[0]?.values.country}>
      <HomeDashboard pathways={pathways} loadError={Boolean(error)} />
    </HomeDashboardBackground>
  )
}
