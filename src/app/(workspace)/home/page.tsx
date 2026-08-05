import { Suspense } from "react"
import { createClient } from "@/lib/supabase-server"
import { HomeDashboard } from "./home-dashboard"
import { HomeDashboardBackground } from "./home-dashboard-background"
import { getHomeMode, toDashboardPathways, type SavedPathwayRecord } from "./home-dashboard-config"
import { HomeHub } from "./home-hub"

export const metadata = {
  title: "Home",
  description: "Find and continue realistic cross-border study, work and visa pathways.",
  robots: { index: false, follow: false } as const,
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
