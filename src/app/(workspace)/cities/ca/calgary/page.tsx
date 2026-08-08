import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Calgary, Canada",
  description:
    "Compare Calgary student living costs, U-Pass transport, international student work rules, canonical institutions and linked programmes.",
  alternates: { canonical: "/cities/ca/calgary" },
}

export default async function CalgaryCityPage() {
  const profile = await getCaCityProfile("calgary")
  if (!profile) notFound()
  return <CanadaCityDashboard profile={profile} />
}
