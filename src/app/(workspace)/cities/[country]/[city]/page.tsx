import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { auCityPath } from "@/lib/cities/city-routes"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default async function CityFallbackPage({
  params,
}: {
  params: Promise<{ country: string; city: string }>
}) {
  const { country, city } = await params
  if (country.trim().toUpperCase() !== "AU") notFound()
  const path = auCityPath(city)
  if (!path) notFound()
  permanentRedirect(path)
}
