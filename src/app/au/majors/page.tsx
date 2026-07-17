import type { Metadata } from "next"
import { CountrySearchClient } from "@/components/discovery/discovery-search-clients"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Australia Major Finder — Salary, Shortage & PR Pathways",
  description: "Explore Australian study fields by career category, salary signals, skills shortages and migration pathways.",
  path: "/au/majors",
})

export default async function AustralianMajorsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const one = (key: string) => typeof query[key] === "string" ? query[key] : undefined
  return <CountrySearchClient basePath="/au/majors" initial={{ country: "AU", category: one("category"), major: one("major"), goal: one("goal") }} />
}
