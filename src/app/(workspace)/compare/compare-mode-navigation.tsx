"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CountryPill } from "@/components/workspace/country-pill"
import type { ComparisonPageType } from "@/lib/country-comparison"
import { COMPARE_MODE_NAV_ITEMS } from "@/lib/compare-navigation"

export { COMPARE_MODE_NAV_ITEMS }

type ComparePageHeaderProps = {
  activeType: ComparisonPageType
  countryCode?: string | null
}

export function ComparePageHeader({ activeType, countryCode }: ComparePageHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showCountry = activeType === "program" || activeType === "career"
  const resolvedCountry = countryCode?.toUpperCase() || "AU"

  function updateCountry(code: string | null) {
    if (!code) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("type", activeType === "career" ? "career" : "program")
    params.set("country", code)
    if (activeType === "program" && !params.get("field")) params.set("field", "nursing")
    if (activeType === "career" && !params.get("profile")) params.set("profile", "starting-from-scratch")
    router.replace(`/compare?${params.toString()}`, { scroll: false })
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
