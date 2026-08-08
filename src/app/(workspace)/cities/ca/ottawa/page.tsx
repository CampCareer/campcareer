import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Ottawa, Canada",
  description:
    "Compare Ottawa student living costs, U-Pass transport, international student work rules, canonical institutions and linked programmes.",
  alternates: { canonical: "/cities/ca/ottawa" },
}

export default async function OttawaCityPage() {
  const profile = await getCaCityProfile("ottawa")
  if (!profile) notFound()
  return <CanadaCityDashboard profile={profile} />
}
