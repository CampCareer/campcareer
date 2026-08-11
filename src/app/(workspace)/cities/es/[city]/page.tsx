import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SpainCityDashboard } from "@/app/(workspace)/cities/spain-city-dashboard"
import { getEsCityProfile } from "@/lib/cities/es-city-profile.server"
import { SUPPORTED_ES_CITY_SLUGS, isSupportedEsCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return SUPPORTED_ES_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isSupportedEsCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const profile = await getEsCityProfile(normalized)
  if (!profile) return { robots: { index: false, follow: false } }

  return {
    title: `Study in ${profile.name}, Spain`,
    description: `Explore ${profile.name} municipality population, official student living-cost and transport references, national student-work context, verified teaching locations and conservative programme coverage.`,
    alternates: { canonical: `/cities/es/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function SpainCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isSupportedEsCitySlug(normalized)) notFound()

  const profile = await getEsCityProfile(normalized)
  if (!profile) notFound()

  return <SpainCityDashboard profile={profile} />
}
