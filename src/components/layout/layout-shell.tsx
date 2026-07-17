"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())
  const isLanding = pathname === "/"

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
    <div className={`flex min-h-screen flex-col ${isLanding ? "bg-[linear-gradient(180deg,#ffffff_0%,#e7f0ff_46%,#f0f5ff_100%)]" : ""}`}>
      <TopNav />
      <main className={`flex-1 ${isLanding ? "bg-transparent" : "bg-background"}`}>{children}</main>
      <SiteFooter className={isMap ? "hidden sm:block" : undefined} />
    </div>
  )
}
