"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { MobileBottomBar } from "./mobile-bottom-bar"
import { withoutLocalePrefix } from "@/lib/i18n/config"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())
  const hasUnifiedHero = pathname === "/au" || pathname === "/countries/search" || pathname === "/universities" || pathname === "/universities/au" || pathname === "/majors" || pathname === "/study" || pathname === "/au/study"
  const isLanding = pathname === "/"
  const isMyPlan = pathname === "/planner" || pathname === "/myplan"

  if (isMyPlan) return <>{children}</>

  if (
    pathname === "/login" ||
    pathname.startsWith("/degree-risk") ||
    pathname.startsWith("/roi-explorer/au/occupation")
  ) {
    return <>{children}</>
  }

  const isInteractiveMap = pathname === "/map" || pathname === "/maps" || pathname.startsWith("/map/au/employment/") || pathname.startsWith("/map/au/whv/")

  return (
    <div className={`flex min-h-screen flex-col ${isLanding ? "bg-[linear-gradient(180deg,#ffffff_0%,#e7f0ff_46%,#f0f5ff_100%)]" : hasUnifiedHero ? "bg-[linear-gradient(180deg,#ffffff_0%,#e7f0ff_46%,#f0f5ff_100%)]" : ""}`}>
      {!isInteractiveMap && <TopNav />}
      <main className={`flex-1 ${hasUnifiedHero ? "bg-transparent" : "bg-background"} pb-14 sm:pb-0`}>{children}</main>
      <SiteFooter className={isInteractiveMap ? "hidden" : undefined} />
      {!isInteractiveMap && <MobileBottomBar />}
    </div>
  )
}
