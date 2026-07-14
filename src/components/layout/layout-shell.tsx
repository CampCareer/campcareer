"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())

  // Focused funnels render full-screen with no shared top nav: the degree-risk
  // quiz, the login screen, and the AU occupation detail page (which renders its
  // own TopNav). Everything else (home, ROI Explorer, Compare, Explore, blog,
  // static pages) gets the shared top nav + footer.
  if (
    pathname === "/login" ||
    pathname.startsWith("/degree-risk") ||
    pathname.startsWith("/roi-explorer/au/occupation")
  ) {
    return <>{children}</>
  }

  // /map and /maps are full-screen tools on mobile — hide the footer there.
  const isMap = pathname === "/map" || pathname.startsWith("/map/") || pathname === "/maps" || pathname.startsWith("/maps/")

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1 bg-background">{children}</main>
      <SiteFooter className={isMap ? "hidden sm:block" : undefined} />
    </div>
  )
}
