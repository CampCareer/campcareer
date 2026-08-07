"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { WorkspaceSidebar } from "./workspace-sidebar"
import { WorkspaceTopbar } from "./workspace-topbar"
import { SiteFooter } from "@/components/layout/site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

type WorkspaceShellProps = {
  children: React.ReactNode
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = withoutLocalePrefix(usePathname())
  // Pages with their own full-bleed hero manage their own content container,
  // so they escape the standard padding to reach the sidebar and topbar.
  const hasFullBleedHero =
    pathname === "/home" || pathname === "/countries" || pathname.startsWith("/countries/")
  const isComparePage = pathname === "/compare"
  // Home owns both the authenticated dashboard and result experiences. Its
  // application-style surfaces should end at their content, not a marketing footer.
  const hideSiteFooter = pathname === "/home"

  return (
    <div className="flex min-h-screen bg-white">
      <WorkspaceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceTopbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main
          className={cn(
            "flex-1",
            !hasFullBleedHero && (isComparePage ? "px-4 py-4 sm:px-6 lg:px-8" : "px-4 py-8 sm:px-8 lg:px-10"),
          )}
        >
          <div
            className={cn(
              !hasFullBleedHero &&
                (isComparePage ? "mx-auto w-full max-w-[1440px]" : "mx-auto w-full max-w-6xl"),
            )}
          >
            {children}
          </div>
        </main>
        {!hideSiteFooter && <SiteFooter />}
      </div>
    </div>
  )
}
