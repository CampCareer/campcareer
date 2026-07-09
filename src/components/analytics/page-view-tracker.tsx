"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "@/lib/analytics"

function seoPageType(pathname: string): string | null {
  if (pathname.startsWith("/maps/")) return "occupation_map"
  if (pathname.startsWith("/countries/")) return "country_roi"
  if (/^\/(au|us|ca|uk|ie|de|nl|be)(\/jobs)?$/.test(pathname)) return "country_hub"
  if (pathname.startsWith("/blog/")) return "editorial"
  return null
}

export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const pageType = seoPageType(pathname)
    if (pageType) track("seo_landing_view", { page_type: pageType })
  }, [pathname])

  return null
}
