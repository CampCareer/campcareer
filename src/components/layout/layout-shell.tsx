"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "./top-nav"
import { SiteFooter } from "./site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"
import { isWorkspaceRoute } from "@/lib/workspace/navigation"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = withoutLocalePrefix(usePathname())
  const isLanding = pathname === "/"
  const isWorkspace = isWorkspaceRoute(pathname)

  // /maps is the public route-map explainer and should keep ordinary product
  // navigation. The legacy /map canvas remains an isolated interactive tool.
  const isInteractiveMap = pathname === "/map" || pathname.startsWith("/map/")

  // Workspace routes have their own layout (sidebar, topbar, mobile nav).
  // Bypass the standard shell to avoid duplicate navigation chrome.
  if (isWorkspace) {
    return <>{children}</>
  }

  return (
    <div className={`flex min-h-screen flex-col ${isLanding ? "bg-slate-950" : ""}`}>
      {!isInteractiveMap && <TopNav />}
      <main className="flex-1">{children}</main>
      <SiteFooter className={isInteractiveMap ? "hidden" : undefined} />
    </div>
  )
}
