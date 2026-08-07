import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CityDashboard } from "../../city-dashboard"
import { getAuCityProfile } from "@/lib/cities/au-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Brisbane, Australia",
  description:
    "Brisbane student living costs, 50 cent public transport, work rights, verified CRICOS delivery locations and city context from primary sources.",
  alternates: { canonical: "/cities/au/brisbane" },
  robots: { index: true, follow: true },
}

export default async function BrisbaneCityPage() {
  const profile = await getAuCityProfile("brisbane")
  if (!profile) notFound()

  return <CityDashboard profile={profile} />
}
