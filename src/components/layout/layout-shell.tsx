"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())
  const isLanding = pathname === "/"

  const isInteractiveMap = pathname === "/map" || pathname === "/maps" || pathname.startsWith("/map/au/employment/") || pathname.startsWith("/map/au/whv/")

  return (
    <div className={`flex min-h-screen flex-col ${isLanding ? "bg-slate-950" : ""}`}>
      {!isInteractiveMap && <TopNav />}
      <main className="flex-1">{children}</main>
      <SiteFooter className={isInteractiveMap ? "hidden" : undefined} />
    </div>
  )
}
