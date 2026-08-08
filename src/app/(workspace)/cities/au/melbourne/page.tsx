import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CityDashboard } from "../../city-dashboard"
import { CityStudyFieldLinks } from "../city-study-field-links"
import { getAuCityProfile } from "@/lib/cities/au-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Melbourne, Australia",
  description:
    "Melbourne student living costs, transport, work rights, verified CRICOS delivery locations and city context from primary sources.",
  alternates: { canonical: "/cities/au/melbourne" },
  robots: { index: true, follow: true },
}

export default async function MelbourneCityPage() {
  const profile = await getAuCityProfile("melbourne")
  if (!profile) notFound()

  return <><CityDashboard profile={profile} /><CityStudyFieldLinks citySlug="melbourne" cityName="Melbourne" /></>
}
