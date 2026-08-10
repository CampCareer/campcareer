import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BelgiumCityDashboard } from "@/app/(workspace)/cities/belgium-city-dashboard"
import { getBeCityProfile } from "@/lib/cities/be-city-profile.server"
import { PUBLISHED_BE_CITY_SLUGS, isPublishedBeCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_BE_CITY_SLUGS)[number], string> = {
  brussels: "Brussels",
  ghent: "Ghent",
  leuven: "Leuven",
  antwerp: "Antwerp",
  "louvain-la-neuve": "Louvain-la-Neuve",
  liege: "Liège",
}

export function generateStaticParams() {
  return PUBLISHED_BE_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedBeCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Belgium`,
    description: `Explore ${name} population scope, student living costs, transport, international-student work context, verified university teaching locations and programme-delivery coverage.`,
    alternates: { canonical: `/cities/be/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function BelgiumCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedBeCitySlug(normalized)) notFound()
  const profile = await getBeCityProfile(normalized)
  if (!profile) notFound()
  return <BelgiumCityDashboard profile={profile} />
}
