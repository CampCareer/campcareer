import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JapanCityDashboard } from "@/app/(workspace)/cities/japan-city-dashboard"
import { getJpCityProfile } from "@/lib/cities/jp-city-profile.server"
import { SUPPORTED_JP_CITY_SLUGS, isSupportedJpCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return SUPPORTED_JP_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isSupportedJpCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const profile = await getJpCityProfile(normalized)
  if (!profile) return { robots: { index: false, follow: false } }

  return {
    title: `Study in ${profile.name}, Japan`,
    description: `Preview ${profile.name} population, national student living-cost and work context, local transport, verified teaching locations and conservative programme coverage.`,
    alternates: { canonical: `/cities/jp/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function JapanCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isSupportedJpCitySlug(normalized)) notFound()

  const profile = await getJpCityProfile(normalized)
  if (!profile) notFound()

  return <JapanCityDashboard profile={profile} />
}
