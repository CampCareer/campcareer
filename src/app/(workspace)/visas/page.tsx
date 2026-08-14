import { loadVisaCatalog } from "@/lib/workspace/visa-catalog-loader"
import { VisasExplorer } from "./visas-explorer"

export const metadata = {
  title: "Visa and work-rights context",
  description: "Review visa and work-rights evidence as part of a career pathway. Visa does not change the public CampCareer Score.",
  robots: { index: false, follow: false } as const,
}

export default async function VisasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : ""
  const rawCountry = typeof sp.country === "string" ? sp.country.toUpperCase() : ""
  const country = rawCountry === "GB" ? "UK" : rawCountry
  const catalog = await loadVisaCatalog()

  return <VisasExplorer initialQuery={q} initialCountry={country} catalog={catalog} />
}
