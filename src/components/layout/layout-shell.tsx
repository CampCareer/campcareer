"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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

  // /map is a full-screen tool on mobile — hide the footer there (the legal/blog
  // links stay reachable from every other page, incl. /map on desktop).
  const isMap = pathname === "/map" || pathname.startsWith("/map/")

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1 bg-background">{children}</main>
      <SiteFooter className={isMap ? "hidden sm:block" : undefined} />
    </div>
  )
}
