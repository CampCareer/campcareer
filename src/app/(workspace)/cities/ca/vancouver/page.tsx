import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Vancouver, Canada",
  description:
    "Compare Vancouver student living costs, U-Pass BC transport, international student work rules, canonical institutions and linked programmes.",
  alternates: { canonical: "/cities/ca/vancouver" },
}

export default async function VancouverCityPage() {
  const profile = await getCaCityProfile("vancouver")
  if (!profile) notFound()
  return <CanadaCityDashboard profile={profile} />
}
