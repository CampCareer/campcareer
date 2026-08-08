import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { auCityPath } from "@/lib/cities/city-routes"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default async function AuCityFallbackPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const path = auCityPath(city)
  if (!path) notFound()
  permanentRedirect(path)
}
