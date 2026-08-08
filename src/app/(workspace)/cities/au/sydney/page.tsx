import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CityDashboard } from "../../city-dashboard"
import { CityStudyFieldLinks } from "../city-study-field-links"
import { getAuCityProfile } from "@/lib/cities/au-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Sydney, Australia",
  description:
    "Sydney student living costs, transport, work rights, linked universities and city context from verified primary sources.",
  alternates: { canonical: "/cities/au/sydney" },
  robots: { index: true, follow: true },
}

export default async function SydneyCityPage() {
  const profile = await getAuCityProfile("sydney")
  if (!profile) notFound()

  return <><CityDashboard profile={profile} /><CityStudyFieldLinks citySlug="sydney" cityName="Sydney" /></>
}
