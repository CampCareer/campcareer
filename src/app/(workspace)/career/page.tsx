import type { Metadata } from "next"
import { headers } from "next/headers"
import { permanentRedirect, redirect } from "next/navigation"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getCareerRoute } from "@/lib/workspace/occupation-routes"
import { getOverviewSearchQuery } from "../home/home-overview-config"

export const metadata: Metadata = {
  title: "Career | CampCareer",
  description: "CampCareer canonical Career Pages use stable country and career identifiers.",
  robots: { index: false, follow: true },
}

type LegacyCareerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getRouteLocale(): Promise<Locale> {
  const routeLocale = (await headers()).get("x-campcareer-route-locale")
  return routeLocale === "ko" ? "ko" : "en"
}

export default async function LegacyCareerPage({ searchParams }: LegacyCareerPageProps) {
  const raw = await searchParams
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item))
    else if (value != null) params.set(key, value)
  }

  const locale = await getRouteLocale()
  const query = getOverviewSearchQuery(params)
  if (!query) redirect(localizePath("/", locale))

  const route = getCareerRoute(query.country, query.occupation)
  if (!route) redirect(localizePath("/", locale))

  params.delete("country")
  params.delete("occupation")
  const destination = localizePath(route.path, locale)
  const remainingQuery = params.toString()

  permanentRedirect(remainingQuery ? `${destination}?${remainingQuery}` : destination)
}
