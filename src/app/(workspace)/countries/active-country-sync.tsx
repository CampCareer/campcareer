"use client"

import { useEffect } from "react"
import { useSelectedCountry } from "@/components/workspace/country-context"

export function ActiveCountrySync({
  code,
  name,
  currency,
}: {
  code: string
  name: string
  currency: string
}) {
  const { selectedCountry, setSelectedCountry } = useSelectedCountry()

  useEffect(() => {
    if (selectedCountry?.code !== code) {
      setSelectedCountry({ code, name, currency })
    }
  }, [code, currency, name, selectedCountry?.code, setSelectedCountry])

  return null
}
