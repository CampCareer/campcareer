import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { UnitedStatesCityDashboard } from "@/app/(workspace)/cities/united-states-city-dashboard"
import { getUsCityProfile } from "@/lib/cities/us-city-profile.server"
import { PUBLISHED_US_CITY_SLUGS, isPublishedUsCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_US_CITY_SLUGS)[number], string> = {
  "new-york": "New York",
  boston: "Boston",
  "los-angeles": "Los Angeles",
  chicago: "Chicago",
  seattle: "Seattle",
  "san-diego": "San Diego",
  philadelphia: "Philadelphia",
  tempe: "Tempe",
}

export function generateStaticParams() {
  return PUBLISHED_US_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedUsCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, United States`,
    description: `Compare ${name} student living costs, transport, F-1 work context, canonical institutions and current programme-data coverage.`,
    alternates: { canonical: `/cities/us/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function UnitedStatesCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedUsCitySlug(normalized)) notFound()

  const profile = await getUsCityProfile(normalized)
  if (!profile) notFound()

  return <UnitedStatesCityDashboard profile={profile} />
}
