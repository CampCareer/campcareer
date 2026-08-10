import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FranceCityDashboard } from "@/app/(workspace)/cities/france-city-dashboard"
import { getFrCityProfile } from "@/lib/cities/fr-city-profile.server"
import { PUBLISHED_FR_CITY_SLUGS, isPublishedFrCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_FR_CITY_SLUGS)[number], string> = {
  paris: "Paris",
  "paris-saclay": "Paris-Saclay",
  bordeaux: "Bordeaux",
  strasbourg: "Strasbourg",
  grenoble: "Grenoble",
  "aix-marseille": "Aix-Marseille",
  nice: "Nice",
}

export function generateStaticParams() {
  return PUBLISHED_FR_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedFrCitySlug(normalized)) return { robots: { index: false, follow: false } }
  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, France`,
    description: `Explore ${name} student living costs, transport, France student-work context, verified university teaching locations and current programme-delivery coverage.`,
    alternates: { canonical: `/cities/fr/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function FranceCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedFrCitySlug(normalized)) notFound()
  const profile = await getFrCityProfile(normalized)
  if (!profile) notFound()
  return <FranceCityDashboard profile={profile} />
}
