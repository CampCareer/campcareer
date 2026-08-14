"use client"

import { usePathname } from "next/navigation"
import { WorkspaceTopbar } from "./workspace-topbar"
import { SiteFooter } from "@/components/layout/site-footer"
import { withoutLocalePrefix } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

type WorkspaceShellProps = {
  children: React.ReactNode
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const pathname = withoutLocalePrefix(usePathname())

  // Career is the focused public product surface. The outer layout supplies
  // the standard CampCareer navigation so no workspace chrome is rendered.
  if (pathname === "/career") return <>{children}</>

  const isCityProfile = pathname.startsWith("/cities/") && !pathname.endsWith("/compare")
  const hasFullBleedHero =
    pathname === "/" ||
    pathname === "/countries" ||
    pathname.startsWith("/countries/") ||
    isCityProfile
  const isComparePage = pathname === "/compare"
  const hideSiteFooter = pathname === "/"

  // Wave 1 product-surface cleanup intentionally removes the legacy workspace
  // sidebar. Contextual routes remain available by direct/contextual links,
  // but they no longer present themselves as equal top-level products.
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <WorkspaceTopbar />
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
  )
}
