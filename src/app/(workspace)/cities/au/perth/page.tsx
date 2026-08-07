import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CityDashboard } from "../../city-dashboard"
import { getAuCityProfile } from "@/lib/cities/au-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Perth, Australia",
  description:
    "Perth student living costs, tertiary public transport fares, work rights, verified CRICOS delivery locations and city context from primary sources.",
  alternates: { canonical: "/cities/au/perth" },
  robots: { index: true, follow: true },
}

export default async function PerthCityPage() {
  const profile = await getAuCityProfile("perth")
  if (!profile) notFound()

  return <CityDashboard profile={profile} />
}
