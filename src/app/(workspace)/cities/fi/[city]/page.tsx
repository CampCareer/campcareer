import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FinlandCityDashboard } from "@/app/(workspace)/cities/finland-city-dashboard"
import { getFiCityProfile } from "@/lib/cities/fi-city-profile.server"
import { SUPPORTED_FI_CITY_SLUGS, isSupportedFiCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof SUPPORTED_FI_CITY_SLUGS)[number], string> = {
  helsinki: "Helsinki",
  espoo: "Espoo",
  tampere: "Tampere",
  turku: "Turku",
  oulu: "Oulu",
  jyvaskyla: "Jyväskylä",
  lappeenranta: "Lappeenranta",
  joensuu: "Joensuu",
}

export function generateStaticParams() {
  return SUPPORTED_FI_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedFiCitySlug(normalized)) return { robots: { index: false, follow: false } }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, Finland`,
    description: `Explore ${name} municipality population, student-budget and transport references, national student-work context, verified university-core study locations and verified-partial programme coverage.`,
    alternates: { canonical: `/cities/fi/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function FinlandCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isSupportedFiCitySlug(normalized)) notFound()
  const profile = await getFiCityProfile(normalized)
  if (!profile) notFound()

  return <FinlandCityDashboard profile={profile} />
}
