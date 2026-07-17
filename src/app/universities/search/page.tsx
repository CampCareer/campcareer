import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import { UniversitySearchClient } from "@/components/discovery/discovery-search-clients"

export const metadata: Metadata = { title: "University Matches", robots: { index: false, follow: true } }
export default async function UniversitySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  if (one("country")?.toUpperCase() === "AU") permanentRedirect("/universities/au")
  return <UniversitySearchClient initial={{ country: one("country"), category: one("category"), city: one("city"), career: one("career"), budget: one("budget") }} />
}
