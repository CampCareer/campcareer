"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoMark } from "@/components/logo-mark"
import { useLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { ToolNavActions } from "@/components/layout/tool-nav-actions"
import { cn } from "@/lib/utils"
import { Globe, Building2, Briefcase } from "lucide-react"

// Numbeo-style horizontal category nav. Replaces the old sidebar — every core
// feature is one click from the top bar. Blog lives in the footer.
export function TopNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const pathLocale = localeFromPathname(pathname) ?? locale
  const barePathname = withoutLocalePrefix(pathname)
  const isLanding = barePathname === "/"
  const hasUnifiedHero = isLanding || barePathname === "/countries/search" || barePathname === "/universities" || barePathname === "/universities/au" || barePathname === "/majors" || barePathname === "/study" || barePathname === "/au/study" || barePathname === "/au/majors"
  const isToolSurface = barePathname === "/planner"
  const isCompare = barePathname === "/compare" || barePathname.startsWith("/compare/")
  const navItems: { href: string; label: string; icon?: typeof Globe; accent?: "blue" | "rose" | "amber" }[] = [
    { href: "/", label: locale === "ko" ? "국가" : "Countries", icon: Globe, accent: "blue" },
    { href: "/majors", label: locale === "ko" ? "전공" : "Majors", icon: Briefcase, accent: "amber" },
    { href: "/study", label: locale === "ko" ? "학업" : "Study", icon: Building2, accent: "rose" },
  ]

  const linkEls = navItems.map((item) => {
    const active =
      item.href === "/"
        ? barePathname === "/" || barePathname === "/countries" || barePathname.startsWith("/countries/")
        : barePathname === item.href || barePathname.startsWith(`${item.href}/`)
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={localizePath(item.href, pathLocale)}
        prefetch={item.href === "/maps" ? false : undefined}
        className={cn(
          "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5",
          active
            ? item.accent === "rose" ? "bg-rose-50 text-rose-700" : item.accent === "amber" ? "bg-amber-100 text-amber-900" : "bg-blue-50 text-blue-700"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        {item.label}
      </Link>
    )
  })

  return (
    <header className={cn(isCompare ? "" : "sticky top-0 z-40", isToolSurface ? "border-b border-slate-200 bg-white/95" : hasUnifiedHero ? "bg-transparent" : "bg-[linear-gradient(180deg,#ffffff_0%,#f0f5ff_100%)]", "backdrop-blur-sm")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={cn("flex items-center", isToolSurface ? "h-14 justify-end" : "h-20 gap-4")}>
          {!isToolSurface && <Link href={localizePath("/", pathLocale)} className="flex items-center gap-2.5 shrink-0 mr-auto">
            <LogoMark size={36} />
            <span className="font-semibold text-slate-900 text-lg tracking-tight">
              CampCareer
            </span>
          </Link>}

          {/* Desktop: links centered */}
          {!isToolSurface && <nav className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {linkEls}
          </nav>}

          <ToolNavActions className="ml-auto" />
        </div>

        {/* Mobile: links on a full-width second row, scrolls cleanly. Hidden on
            /map so the map can use the full mobile screen (home is one tap on the logo). */}
        {!isToolSurface && (
          <nav className="sm:hidden flex items-center justify-center gap-1 overflow-x-auto no-scrollbar pb-2">
            {linkEls}
          </nav>
        )}
      </div>
    </header>
  )
}
