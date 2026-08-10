"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type FilterKey =
  | "country"
  | "q"
  | "level"
  | "field"
  | "city"
  | "state"
  | "province"
  | "career"
  | "institution"
  | "pgwp"
  | "duration"
  | "fee"
  | "source"
  | "sort"

export function useProgramNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.toString()

  return useCallback(
    (values: Partial<Record<FilterKey, string | null>>) => {
      const params = new URLSearchParams(currentQuery)

      for (const [key, value] of Object.entries(values)) {
        if (!value || value === "all" || (key === "sort" && value === "recommended")) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      if (!params.get("country")) params.set("country", "AU")
      params.delete("page")
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [currentQuery, pathname, router],
  )
}
