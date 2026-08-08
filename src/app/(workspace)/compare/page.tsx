import { permanentRedirect } from "next/navigation"
import {
  buildCareerCompareCanonicalHref,
  buildCityCompareCanonicalHref,
  buildCountryCompareCanonicalHref,
  buildProgramCompareCanonicalHref,
  canonicalCompareModeFromLegacyType,
} from "@/lib/compare-routes"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Compare pathways",
  description: "Compare reviewed programs, countries, cities and careers with explicit context and source-aware missing values.",
  robots: { index: false, follow: false } as const,
}

type ComparePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const values = await searchParams
  const rawType = first(values.type) ?? null
  const mode = canonicalCompareModeFromLegacyType(rawType)

  if (mode === "countries") {
    permanentRedirect(buildCountryCompareCanonicalHref({
      goal: first(values.goal),
      profile: first(values.profile),
      locations: first(values.locations),
    }))
  }

  if (mode === "cities") {
    permanentRedirect(buildCityCompareCanonicalHref({
      country: first(values.country),
      left: first(values.left),
      right: first(values.right),
    }))
  }

  if (mode === "careers") {
    permanentRedirect(buildCareerCompareCanonicalHref({
      country: first(values.country),
      profile: first(values.profile),
      city: first(values.city),
      careers: (first(values.careers) ?? "").split(",").filter(Boolean),
    }))
  }

  permanentRedirect(buildProgramCompareCanonicalHref((first(values.items) ?? "").split(",").filter(Boolean)))
}
