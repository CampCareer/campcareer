import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SwitzerlandCityDashboard } from "@/app/(workspace)/cities/switzerland-city-dashboard"
import { getChCityProfile } from "@/lib/cities/ch-city-profile.server"
import { SUPPORTED_CH_CITY_SLUGS, isSupportedChCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof SUPPORTED_CH_CITY_SLUGS)[number], string> = {
  zurich: "Zurich",
  lausanne: "Lausanne",
  basel: "Basel",
  lugano: "Lugano",
  fribourg: "Fribourg",
  geneva: "Geneva",
}

export function generateStaticParams() {
  return SUPPORTED_CH_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedChCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Switzerland`,
    description: `Explore ${name} municipality population, source-aware student living and transport references, Swiss student-work context, verified university study locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/ch/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function SwitzerlandCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedChCitySlug(normalized)) notFound()

  const profile = await getChCityProfile(normalized)
  if (!profile) notFound()

  return <SwitzerlandCityDashboard profile={profile} />
}
