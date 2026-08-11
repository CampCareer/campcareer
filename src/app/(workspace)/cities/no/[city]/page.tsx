import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NorwayCityDashboard } from "@/app/(workspace)/cities/norway-city-dashboard"
import { getNoCityProfile } from "@/lib/cities/no-city-profile.server"
import { SUPPORTED_NO_CITY_SLUGS, isSupportedNoCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof SUPPORTED_NO_CITY_SLUGS)[number], string> = {
  oslo: "Oslo",
  trondheim: "Trondheim",
  stavanger: "Stavanger",
  as: "Ås",
  tromso: "Tromsø",
}

export function generateStaticParams() {
  return SUPPORTED_NO_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedNoCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Norway`,
    description: `Explore ${name} municipality population, student living-cost and transport references, national study-permit work context, verified university study locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/no/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function NorwayCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedNoCitySlug(normalized)) notFound()

  const profile = await getNoCityProfile(normalized)
  if (!profile) notFound()

  return <NorwayCityDashboard profile={profile} />
}
