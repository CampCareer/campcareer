"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())
  const isLanding = pathname === "/"
  const hasUnifiedHero = isLanding || pathname === "/countries/search" || pathname === "/universities" || pathname === "/universities/au" || pathname === "/majors" || pathname === "/study" || pathname === "/au/study" || pathname === "/au/majors"

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

  // The interactive map owns its own Google Maps-style search bar and account
  // controls. SEO map articles keep the regular site navigation.
  const isInteractiveMap = pathname === "/map" || pathname === "/maps" || pathname.startsWith("/map/au/employment/") || pathname.startsWith("/map/au/whv/")

  return (
    <div className={`flex min-h-screen flex-col ${hasUnifiedHero ? "bg-[linear-gradient(180deg,#ffffff_0%,#e7f0ff_46%,#f0f5ff_100%)]" : ""}`}>
      {!isInteractiveMap && <TopNav />}
      <main className={`flex-1 ${hasUnifiedHero ? "bg-transparent" : "bg-background"}`}>{children}</main>
      <SiteFooter className={isInteractiveMap ? "hidden" : undefined} />
    </div>
  )
}
