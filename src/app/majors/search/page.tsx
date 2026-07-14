import type { Metadata } from "next"
import { MajorSearchClient } from "@/components/discovery/discovery-search-clients"

export const metadata: Metadata = { title: "Regional Career Recommendations", robots: { index: false, follow: true } }
export default async function MajorSearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  return <MajorSearchClient initial={{ country: one("country"), state: one("state"), goal: one("goal"), budget: one("budget") }} />
}
