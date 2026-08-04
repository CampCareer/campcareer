import { getAustraliaCountryMetrics } from "@/lib/workspace/australia-country-metrics"
import { OccupationExplorer } from "./occupation-explorer"

export const metadata = {
  title: "Occupation",
  description: "Search the CampCareer occupation catalogue by field and keyword.",
  robots: { index: false, follow: false } as const,
}

export default async function OccupationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [sp, australiaCountryMetrics] = await Promise.all([
    searchParams,
    getAustraliaCountryMetrics(),
  ])
  const q = typeof sp.q === "string" ? sp.q : ""
  const occupation = typeof sp.occupation === "string" ? sp.occupation : ""
  return (
    <OccupationExplorer
      initialQuery={q}
      initialOccupation={occupation}
      australiaCountryMetrics={australiaCountryMetrics}
    />
  )
}
