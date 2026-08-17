"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { recordFifoEvent } from "@/lib/analytics"
import { withoutLocalePrefix } from "@/lib/i18n/config"

function surfaceForPath(pathname: string) {
  if (pathname === "/") return "landing" as const
  if (pathname === "/fifo") return "fifo_hub" as const
  if (pathname === "/fifo/report") return null
  if (pathname.startsWith("/fifo/")) return "fifo_path" as const
  return null
}

function pathSlug(pathname: string) {
  if (!pathname.startsWith("/fifo/") || pathname === "/fifo/report") return undefined
  return pathname.split("/").filter(Boolean)[1]
}

export function FifoFunnelAnalytics() {
  const rawPathname = usePathname() || "/"
  const pathname = withoutLocalePrefix(rawPathname)

  useEffect(() => {
    const surface = surfaceForPath(pathname)
    if (!surface) return

    if (surface === "landing") {
      recordFifoEvent("fifo_landing_view", { surface })
      return
    }
    if (surface === "fifo_hub") {
      recordFifoEvent("fifo_hub_view", { surface })
      return
    }

    recordFifoEvent("fifo_path_view", {
      surface,
      path_slug: pathSlug(pathname),
    })
  }, [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      const currentSurface = surfaceForPath(pathname)
      if (!currentSurface) return
      const destination = withoutLocalePrefix(url.pathname)

      if (destination === "/fifo/report" || url.hash === "#fifo-report") {
        recordFifoEvent("fifo_report_cta_clicked", {
          surface: currentSurface,
          path_slug: pathSlug(pathname),
          target: "fifo_report",
        })
        return
      }

      if (destination === "/fifo" && pathname !== "/fifo") {
        recordFifoEvent("fifo_hub_opened", {
          surface: currentSurface,
          target: "fifo_hub",
        })
        return
      }

      if (destination.startsWith("/fifo/") && destination !== pathname) {
        recordFifoEvent("fifo_path_opened", {
          surface: currentSurface,
          path_slug: pathSlug(destination),
          target: "fifo_path",
        })
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [pathname])

  return null
}
