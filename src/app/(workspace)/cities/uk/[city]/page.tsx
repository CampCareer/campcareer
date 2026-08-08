import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { UnitedKingdomCityDashboard } from "@/app/(workspace)/cities/united-kingdom-city-dashboard"
import { getUkCityProfile } from "@/lib/cities/uk-city-profile.server"
import { PUBLISHED_UK_CITY_SLUGS, isPublishedUkCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_UK_CITY_SLUGS)[number], string> = {
  london: "London",
  manchester: "Manchester",
  birmingham: "Birmingham",
  edinburgh: "Edinburgh",
  glasgow: "Glasgow",
  cardiff: "Cardiff",
  belfast: "Belfast",
  oxford: "Oxford",
  cambridge: "Cambridge",
  bristol: "Bristol",
}

export function generateStaticParams() {
  return PUBLISHED_UK_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedUkCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, United Kingdom`,
    description: `Explore ${name} student living costs, transport, Student visa work context, verified institutions and current programme-delivery coverage.`,
    alternates: { canonical: `/cities/uk/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function UnitedKingdomCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedUkCitySlug(normalized)) notFound()

  const profile = await getUkCityProfile(normalized)
  if (!profile) notFound()

  return <UnitedKingdomCityDashboard profile={profile} />
}
