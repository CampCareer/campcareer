import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CanadaCityDashboard } from "@/app/(workspace)/cities/canada-city-dashboard"
import { getCaCityProfile } from "@/lib/cities/ca-city-profile.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Study in Toronto, Canada",
  description:
    "Compare Toronto student living costs, TTC student transport, international student work rules, canonical institutions and linked programs.",
  alternates: { canonical: "/cities/ca/toronto" },
}

export default async function TorontoCityPage() {
  const profile = await getCaCityProfile("toronto")
  if (!profile) notFound()

  return <CanadaCityDashboard profile={profile} />
}
