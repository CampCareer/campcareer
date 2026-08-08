import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Waterloo, Canada",
  description:
    "Compare Waterloo student living costs, GRT UPass transport, international student work rules, canonical institutions and linked programmes.",
  alternates: { canonical: "/cities/ca/waterloo" },
  robots: { index: true, follow: true },
}

export default async function WaterlooCityPage() {
  const profile = await getCaCityProfile("waterloo")
  if (!profile) notFound()
  return <CanadaCityDashboard profile={profile} />
}
