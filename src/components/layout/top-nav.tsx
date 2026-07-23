"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect, useCallback } from "react"
import { LogoMark } from "@/components/logo-mark"
import { useLocale, useRouteLocale, useRouteTranslations, useSetLocale } from "@/lib/i18n/locale-provider"
import { LOCALE_META, PUBLISHED_LOCALE_OPTIONS, localeForUi, localeFromPathname, localizePath, withoutLocalePrefix, type LocaleOption } from "@/lib/i18n/config"
import { ToolNavActions } from "@/components/layout/tool-nav-actions"
import { cn } from "@/lib/utils"
import { Globe, Scale, ClipboardList, Check } from "lucide-react"

export function TopNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const routeLocale = useRouteLocale()
  const setLocale = useSetLocale()
  const t = useRouteTranslations()
  const router = useRouter()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const barePathname = withoutLocalePrefix(pathname)
  const hasUnifiedHero = barePathname === "/" || barePathname === "/countries/search" || barePathname === "/universities" || barePathname === "/universities/au" || barePathname === "/majors" || barePathname === "/study" || barePathname === "/au/study"
  const isToolSurface = barePathname === "/planner" || barePathname === "/myplan"
  const isCompare = barePathname === "/compare" || barePathname.startsWith("/compare/")
  const isLanding = barePathname === "/"
  const isAustraliaDiscovery = barePathname === "/au/study" || barePathname.startsWith("/au/study/") || barePathname === "/au/majors" || barePathname.startsWith("/au/majors/") || barePathname === "/universities/au" || barePathname.startsWith("/universities/au/")
  const hasBlueHero = isLanding || isAustraliaDiscovery

  const navItems: { href: string; label: string; icon: typeof Globe; accent?: "blue" | "sky" | "violet" }[] = [
    { href: "/", label: t.australia.journey.findPath, icon: Globe, accent: "blue" },
    { href: "/au/study", label: t.australia.journey.compareStudy, icon: Scale, accent: "sky" },
    { href: "/myplan", label: t.australia.journey.plan, icon: ClipboardList, accent: "violet" },
  ]

  const isActive = useCallback((href: string) => {
    return href === "/" ? barePathname === "/" || barePathname === "/au" : barePathname === href || barePathname.startsWith(`${href}/`)
  }, [barePathname])

  const activeNav = navItems.find((item) => isActive(item.href))
  const ActiveNavIcon = activeNav?.icon

  /* ── Globe language modal ── */
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!langOpen) return
    const onDown = (e: MouseEvent) => { if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLangOpen(false) }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey) }
  }, [langOpen])

  function switchLang(next: LocaleOption) {
    setLocale(localeForUi(next))
    router.replace(localizePath(pathname, next))
    setLangOpen(false)
  }

  /* ── Desktop nav links ── */
  const linkEls = navItems.map((item) => {
    const active = isActive(item.href)
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={localizePath(item.href, pathLocale)}
        className={cn(
          "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5",
          hasBlueHero
            ? active ? "bg-white/20 text-white" : "text-blue-100 hover:text-white hover:bg-white/10"
            : active
              ? item.accent === "sky" ? "bg-sky-50 text-sky-700" : item.accent === "violet" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        {item.label}
      </Link>
    )
  })

  return (
    <header className={cn(isCompare ? "" : "sticky top-0 z-40", isToolSurface ? "border-b border-slate-200 bg-white/95" : hasBlueHero ? "bg-blue-600" : hasUnifiedHero ? "bg-transparent" : "bg-[linear-gradient(180deg,#ffffff_0%,#f0f5ff_100%)]", "backdrop-blur-sm")}>
      <div className="max-w-7xl mx-auto px-4 max-[360px]:px-3 sm:px-6">
        <div className={cn("flex items-center gap-2", isToolSurface ? "h-14 justify-end" : "h-14 sm:h-20 max-[360px]:h-12")}>
          {/* Logo */}
          {!isToolSurface && <Link href={localizePath("/", pathLocale)} className="flex shrink-0 items-center gap-2 sm:gap-2.5 mr-auto max-[360px]:gap-1.5">
            <LogoMark size={30} />
            <span className={cn("font-semibold text-base sm:text-lg tracking-tight", hasBlueHero ? "text-white" : "text-slate-900")}>
              CampCareer
            </span>
          </Link>}

          {/* Mobile: keep the active product label compact beside the brand. */}
          {!isToolSurface && <div className="flex items-center gap-1 sm:hidden">
            {activeNav && ActiveNavIcon && <Link href={localizePath(activeNav.href, pathLocale)} className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition shrink-0", hasBlueHero ? "text-white bg-white/15" : "text-slate-700 bg-slate-100")}>
              <ActiveNavIcon className="size-3.5 shrink-0" strokeWidth={2.1} />
              <span className="max-[380px]:hidden">{activeNav.label}</span>
            </Link>}
          </div>}

          {/* Desktop: links centered */}
          {!isToolSurface && <nav className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {linkEls}
          </nav>}

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {!isToolSurface && <div className="relative" ref={langRef}>
              <button type="button" onClick={() => setLangOpen((o) => !o)} aria-label={pathLocale === "ko" ? "언어 선택" : "Choose a language"} className={cn("flex items-center justify-center rounded-lg p-2 transition", hasBlueHero ? "text-white hover:bg-white/10" : "text-slate-500 hover:bg-slate-100")}>
                <Globe className="w-5 h-5" />
              </button>
              {langOpen && <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{pathLocale === "ko" ? "언어 선택" : "Choose a language"}</p>
                {PUBLISHED_LOCALE_OPTIONS.map((opt) => (
                  <button key={opt} type="button" onClick={() => switchLang(opt)} className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-sm transition", opt === pathLocale ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-50")}>
                    <span className="text-lg">{opt === "ko" ? "🇰🇷" : "🇺🇸"}</span>
                    <span className="flex-1 text-left">{LOCALE_META[opt].label}</span>
                    {opt === pathLocale && <Check className="w-4 h-4 shrink-0 text-blue-600" />}
                  </button>
                ))}
              </div>}
            </div>}

            <ToolNavActions onLanding={hasBlueHero} hideLanguage />
          </div>
        </div>
      </div>
    </header>
  )
}
