"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())
  const isLanding = pathname === "/"

  // /maps is the public route-map explainer and should keep ordinary product
  // navigation. The legacy /map canvas remains an isolated interactive tool.
  const isInteractiveMap = pathname === "/map" || pathname.startsWith("/map/")

  return (
    <div className={`flex min-h-screen flex-col ${isLanding ? "bg-slate-950" : ""}`}>
      {!isInteractiveMap && <TopNav />}
      <main className="flex-1">{children}</main>
      <SiteFooter className={isInteractiveMap ? "hidden" : undefined} />
    </div>
  )
}
