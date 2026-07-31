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
  return <OccupationExplorer initialQuery={q} initialOccupation={occupation} />
}
