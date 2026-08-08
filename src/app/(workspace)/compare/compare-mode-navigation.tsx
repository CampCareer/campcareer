"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CountryPill } from "@/components/workspace/country-pill"
import { COMPARE_MODE_NAV_ITEMS, type CompareModeType } from "@/lib/compare-navigation"
import {
  buildCareerCompareCanonicalHref,
  buildCityCompareCanonicalHref,
  buildProgramCompareCanonicalHref,
} from "@/lib/compare-routes"

export { COMPARE_MODE_NAV_ITEMS }

type ComparePageHeaderProps = {
  activeType: CompareModeType
  countryCode?: string | null
}

export function ComparePageHeader({ activeType, countryCode }: ComparePageHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showCountry = activeType === "program" || activeType === "career" || activeType === "city"
  const resolvedCountry = countryCode?.toUpperCase() || "AU"

  function updateCountry(code: string | null) {
    if (!code) return

    if (activeType === "city") {
      router.replace(buildCityCompareCanonicalHref({ country: code }), { scroll: false })
      return
    }

    if (activeType === "career") {
      router.replace(
        buildCareerCompareCanonicalHref({
          country: code,
          profile: searchParams.get("profile") ?? undefined,
          city: searchParams.get("city"),
          careers: (searchParams.get("careers") ?? "").split(",").filter(Boolean),
        }),
        { scroll: false },
      )
      return
    }

    router.replace(buildProgramCompareCanonicalHref(), { scroll: false })
  }

  return (
    <header className="mb-4 flex min-h-10 flex-wrap items-center gap-3">
      <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1b1b1b] sm:text-3xl">
        Compare
      </h1>
      {showCountry ? (
        <CountryPill value={resolvedCountry} allowAll={false} onChange={updateCountry} />
      ) : null}
    </header>
  )
}
