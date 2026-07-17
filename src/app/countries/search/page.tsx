import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import { CountrySearchClient } from "@/components/discovery/discovery-search-clients"

export const metadata: Metadata = { title: "Country Rankings", robots: { index: false, follow: true } }
export default async function CountrySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  if (one("country")?.toUpperCase() === "AU") {
    const params = new URLSearchParams()
    for (const key of ["category", "major", "goal"]) {
      const value = one(key)
      if (value) params.set(key, value)
    }
    permanentRedirect(`/au/majors${params.size ? `?${params}` : ""}`)
  }
  return <CountrySearchClient initial={{ country: one("country"), category: one("category"), major: one("major"), goal: one("goal") }} />
}
