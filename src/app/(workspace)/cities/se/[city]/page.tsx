import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SwedenCityDashboard } from "@/app/(workspace)/cities/sweden-city-dashboard"
import { getSeCityProfile } from "@/lib/cities/se-city-profile.server"
import { PUBLISHED_SE_CITY_SLUGS, isPublishedSeCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_SE_CITY_SLUGS)[number], string> = {
  stockholm: "Stockholm",
  gothenburg: "Gothenburg",
  uppsala: "Uppsala",
  lund: "Lund",
  linkoping: "Linköping",
  umea: "Umeå",
}

export function generateStaticParams() {
  return PUBLISHED_SE_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedSeCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Sweden`,
    description: `Explore ${name} municipality population, student budget and transport references, current student work context, verified university locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/se/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function SwedenCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedSeCitySlug(normalized)) notFound()
  const profile = await getSeCityProfile(normalized)
  if (!profile) notFound()
  return <SwedenCityDashboard profile={profile} />
}
