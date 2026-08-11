import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NetherlandsCityDashboard } from "@/app/(workspace)/cities/netherlands-city-dashboard"
import { getNlCityProfile } from "@/lib/cities/nl-city-profile.server"
import { PUBLISHED_NL_CITY_SLUGS, isPublishedNlCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_NL_CITY_SLUGS)[number], string> = {
  amsterdam: "Amsterdam",
  maastricht: "Maastricht",
  rotterdam: "Rotterdam",
  groningen: "Groningen",
  eindhoven: "Eindhoven",
}

export function generateStaticParams() {
  return PUBLISHED_NL_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedNlCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Netherlands`,
    description: `Explore ${name} student living costs, transport, student work context, verified university locations and current programme-delivery coverage.`,
    alternates: { canonical: `/cities/nl/${normalized}` },
    robots: { index: true, follow: true },
  }
}

export default async function NetherlandsCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedNlCitySlug(normalized)) notFound()

  const profile = await getNlCityProfile(normalized)
  if (!profile) notFound()

  return <NetherlandsCityDashboard profile={profile} />
}
