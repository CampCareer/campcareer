import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { KoreaCityDashboard } from "@/app/(workspace)/cities/korea-city-dashboard"
import { getKrCityProfile } from "@/lib/cities/kr-city-profile.server"
import { SUPPORTED_KR_CITY_SLUGS, isSupportedKrCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return SUPPORTED_KR_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isSupportedKrCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const profile = await getKrCityProfile(normalized)
  if (!profile) return { robots: { index: false, follow: false } }

  return {
    title: `Study in ${profile.name}, South Korea`,
    description: `Explore ${profile.name} administrative-city population, official national living-cost planning context, source-native transport reference, student-work context, verified teaching locations and conservative programme coverage.`,
    alternates: { canonical: `/cities/kr/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function KoreaCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()

  if (!isSupportedKrCitySlug(normalized)) notFound()

  const profile = await getKrCityProfile(normalized)
  if (!profile) notFound()

  return <KoreaCityDashboard profile={profile} />
}
