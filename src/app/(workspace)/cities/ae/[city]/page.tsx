import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { UaeCityDashboard } from "@/app/(workspace)/cities/uae-city-dashboard"
import { getAeCityProfile } from "@/lib/cities/ae-city-profile.server"
import { PUBLISHED_AE_CITY_SLUGS, isPublishedAeCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return PUBLISHED_AE_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isPublishedAeCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const profile = await getAeCityProfile(normalized)
  if (!profile) return { robots: { index: false, follow: false } }

  return {
    title: `Study in ${profile.name}, United Arab Emirates`,
    description: `Explore ${profile.name} City-locality evidence, source-native student cost and transport references, UAE student work-permit context, verified study locations and conservative programme coverage.`,
    alternates: { canonical: `/cities/ae/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function UaeCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isPublishedAeCitySlug(normalized)) notFound()

  const profile = await getAeCityProfile(normalized)
  if (!profile) notFound()

  return <UaeCityDashboard profile={profile} />
}
