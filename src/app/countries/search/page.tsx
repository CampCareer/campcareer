import type { Metadata } from "next"
import { CountrySearchClient } from "@/components/discovery/discovery-search-clients"

export const metadata: Metadata = { title: "Country Rankings", robots: { index: false, follow: true } }
export default async function CountrySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  return <CountrySearchClient initial={{ career: one("career"), budget: one("budget"), goal: one("goal"), currency: one("currency") }} />
}
