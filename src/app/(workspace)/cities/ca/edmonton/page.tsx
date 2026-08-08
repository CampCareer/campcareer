import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Edmonton, Canada",
  description:
    "Compare Edmonton student living costs, U-Pass transport, international student work rules, canonical institutions and linked programmes.",
  alternates: { canonical: "/cities/ca/edmonton" },
  robots: { index: true, follow: true },
}

export default async function EdmontonCityPage() {
  const profile = await getCaCityProfile("edmonton")
  if (!profile) notFound()
  return <CanadaCityDashboard profile={profile} />
}
