"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { CountriesExplorer } from "./countries-explorer"

export function CountriesRouteShell({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const { selectedCountry, hydrated } = useSelectedCountry()

  useEffect(() => {
    if (hydrated && selectedCountry?.code === "AU") {
      router.replace("/countries/au")
    }
  }, [hydrated, router, selectedCountry?.code])

  return <CountriesExplorer initialQuery={initialQuery} />
}
