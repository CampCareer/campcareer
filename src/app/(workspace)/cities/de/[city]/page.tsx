import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { GermanyCityDashboard } from "@/app/(workspace)/cities/germany-city-dashboard"
import { getDeCityProfile } from "@/lib/cities/de-city-profile.server"
import { PUBLISHED_DE_CITY_SLUGS, isPublishedDeCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_DE_CITY_SLUGS)[number], string> = {
  berlin: "Berlin",
  munich: "Munich",
  hamburg: "Hamburg",
  aachen: "Aachen",
  bonn: "Bonn",
  dresden: "Dresden",
  heidelberg: "Heidelberg",
  karlsruhe: "Karlsruhe",
  tuebingen: "Tübingen",
}

export function generateStaticParams() {
  return PUBLISHED_DE_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedDeCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Germany`,
    description: `Explore ${name} student living costs, transport, international-student work context, verified university teaching locations and current programme-delivery coverage.`,
    alternates: { canonical: `/cities/de/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function GermanyCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedDeCitySlug(normalized)) notFound()

  const profile = await getDeCityProfile(normalized)
  if (!profile) notFound()

  return <GermanyCityDashboard profile={profile} />
}
