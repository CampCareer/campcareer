"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

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
  const locale = useRouteLocale()
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

      const country = params.get("country")?.toUpperCase()
      if (!country || country === "AU") params.delete("country")
      else params.set("country", country)

      params.delete("page")
      const query = params.toString()
      const nextPath = localizePath(pathname, locale)
      router.replace(query ? `${nextPath}?${query}` : nextPath, { scroll: false })
    },
    [currentQuery, locale, pathname, router],
  )
}
