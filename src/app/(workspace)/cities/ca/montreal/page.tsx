import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Montreal, Canada",
  description:
    "Compare Montreal student living costs, STM student transport, international student work rules, canonical institutions and linked programmes.",
  alternates: { canonical: "/cities/ca/montreal" },
  robots: { index: true, follow: true },
}

export default async function MontrealCityPage() {
  const profile = await getCaCityProfile("montreal")
  if (!profile) notFound()
  return <CanadaCityDashboard profile={profile} />
}
