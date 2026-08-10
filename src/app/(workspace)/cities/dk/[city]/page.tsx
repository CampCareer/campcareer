import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DenmarkCityDashboard } from "@/app/(workspace)/cities/denmark-city-dashboard"
import { getDkCityProfile } from "@/lib/cities/dk-city-profile.server"
import { PUBLISHED_DK_CITY_SLUGS, isPublishedDkCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_DK_CITY_SLUGS)[number], string> = {
  copenhagen: "Copenhagen",
  frederiksberg: "Frederiksberg",
  odense: "Odense",
  aarhus: "Aarhus",
  aalborg: "Aalborg",
}

export function generateStaticParams() {
  return PUBLISHED_DK_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedDkCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Denmark`,
    description: `Explore ${name} municipality population, student budget and transport references, student work context, verified university locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/dk/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function DenmarkCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedDkCitySlug(normalized)) notFound()

  const profile = await getDkCityProfile(normalized)
  if (!profile) notFound()

  return <DenmarkCityDashboard profile={profile} />
}
