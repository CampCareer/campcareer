import { permanentRedirect } from "next/navigation"
import { getIndexableOccupationRoute } from "@/lib/workspace/occupation-routes"
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
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : ""
  const occupation = typeof sp.occupation === "string" ? sp.occupation : ""
  const country = typeof sp.country === "string" ? sp.country : ""
  const canonicalRoute = country && occupation
    ? getIndexableOccupationRoute(country, occupation)
    : null

  if (canonicalRoute) permanentRedirect(canonicalRoute.path)

  return (
    <OccupationExplorer
      initialQuery={q}
      initialOccupation={occupation}
      initialCountry={country.toUpperCase() === "GB" ? "UK" : country.toUpperCase()}
    />
  )
}
