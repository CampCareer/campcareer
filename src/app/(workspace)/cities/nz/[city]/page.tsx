import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewZealandCityDashboard } from "@/app/(workspace)/cities/new-zealand-city-dashboard"
import { getNzCityProfile } from "@/lib/cities/nz-city-profile.server"
import { PUBLISHED_NZ_CITY_SLUGS, isPublishedNzCitySlug } from "@/lib/cities/city-routes"

export const dynamic = "force-dynamic"

const CITY_NAMES: Record<(typeof PUBLISHED_NZ_CITY_SLUGS)[number], string> = {
  auckland: "Auckland",
  christchurch: "Christchurch",
  hamilton: "Hamilton",
  wellington: "Wellington",
  dunedin: "Dunedin",
}

export function generateStaticParams() {
  return PUBLISHED_NZ_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedNzCitySlug(normalized)) {
    return { robots: { index: false, follow: false } }
  }

  const name = CITY_NAMES[normalized]
  return {
    title: `Study in ${name}, New Zealand`,
    description: `Explore ${name} student living costs, transport, student-visa work context, verified university locations and current programme-delivery coverage.`,
    alternates: { canonical: `/cities/nz/${normalized}` },
    robots: { index: false, follow: true },
  }
}

export default async function NewZealandCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const normalized = city.trim().toLowerCase()
  if (!isPublishedNzCitySlug(normalized)) notFound()

  const profile = await getNzCityProfile(normalized)
  if (!profile) notFound()

  return <NewZealandCityDashboard profile={profile} />
}
