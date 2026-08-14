import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound, permanentRedirect } from "next/navigation"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getCareerRoute } from "@/lib/workspace/occupation-routes"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Career | CampCareer",
  robots: { index: false, follow: true },
}

type OccupationDetailPageProps = {
  params: Promise<{ slug: string; occupation: string }>
}

async function getRouteLocale(): Promise<Locale> {
  const routeLocale = (await headers()).get("x-campcareer-route-locale")
  return routeLocale === "ko" ? "ko" : "en"
}

export default async function LegacyOccupationDetailPage({ params }: OccupationDetailPageProps) {
  const { slug, occupation } = await params
  const route = getCareerRoute(slug, occupation)
  if (!route) notFound()

  const locale = await getRouteLocale()
  permanentRedirect(localizePath(route.path, locale))
}
