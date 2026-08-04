"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { CountriesExplorer } from "./countries-explorer"

const COUNTRY_PICKER_FLAG = "campcareer:open-country-picker"

export function CountriesRouteShell({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const { selectedCountry, hydrated } = useSelectedCountry()

  useEffect(() => {
    if (!hydrated) return

    if (window.sessionStorage.getItem(COUNTRY_PICKER_FLAG) === "1") {
      window.sessionStorage.removeItem(COUNTRY_PICKER_FLAG)
      return
    }

    if (selectedCountry?.code === "AU") {
      router.replace("/countries/au")
    }
  }, [hydrated, router, selectedCountry?.code])

  return <CountriesExplorer initialQuery={initialQuery} />
}
