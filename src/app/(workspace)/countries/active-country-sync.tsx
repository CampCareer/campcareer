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
  const { setSelectedCountry } = useSelectedCountry()

  useEffect(() => {
    setSelectedCountry({ code, name, currency })
    return () => setSelectedCountry(null)
  }, [code, currency, name])

  return null
}
