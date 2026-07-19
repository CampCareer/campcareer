"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { LogoMark } from "@/components/logo-mark"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { useLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { UserIcon, Globe, Building2, Briefcase, LayoutGrid } from "lucide-react"
import type { User } from "@supabase/supabase-js"

// Numbeo-style horizontal category nav. Replaces the old sidebar — every core
// feature is one click from the top bar. Blog lives in the footer.
export function TopNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const pathLocale = localeFromPathname(pathname) ?? locale
  const barePathname = withoutLocalePrefix(pathname)
  const isLanding = barePathname === "/"
  const hasUnifiedHero = isLanding || barePathname === "/countries/search" || barePathname === "/universities" || barePathname === "/universities/au" || barePathname === "/majors" || barePathname === "/study" || barePathname === "/au/study" || barePathname === "/au/majors"
  // /map and /maps are full-screen map surfaces on mobile.
  const isMap = barePathname === "/map" || barePathname.startsWith("/map/") || barePathname === "/maps" || barePathname.startsWith("/maps/")
  const isToolSurface = isMap || barePathname === "/dashboard"
  const isCompare = barePathname === "/compare" || barePathname.startsWith("/compare/")
  const router = useRouter()
  const t = useTranslations()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [appsOpen, setAppsOpen] = useState(false)
  const appsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!appsOpen) return
    const closeApps = (event: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) setAppsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAppsOpen(false)
    }
    document.addEventListener("mousedown", closeApps)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeApps)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [appsOpen])

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

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

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <LanguageToggle className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
            <div className="relative" ref={appsRef}>
              <button
                type="button"
                aria-label={locale === "ko" ? "CampCareer 도구 열기" : "Open CampCareer tools"}
                aria-expanded={appsOpen}
                aria-haspopup="menu"
                onClick={() => setAppsOpen((open) => !open)}
                className={cn("grid size-9 place-items-center rounded-xl border transition", appsOpen ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm" : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900")}
              >
                <LayoutGrid className="size-[18px]" strokeWidth={2.1} />
              </button>
              {appsOpen && <div role="menu" aria-label={locale === "ko" ? "CampCareer 도구" : "CampCareer tools"} className="absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_55px_rgba(15,23,42,.18)]">
                <div className="flex items-center justify-between px-2 pb-2"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">CampCareer</p><span className="text-xs text-slate-400">{locale === "ko" ? "도구" : "Tools"}</span></div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={localizePath("/maps", pathLocale)} role="menuitem" onClick={() => setAppsOpen(false)} className="group rounded-2xl border border-transparent p-3 transition hover:border-blue-200 hover:bg-blue-50">
                    <span className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-2xl shadow-sm transition group-hover:-translate-y-0.5">🗺️</span>
                    <span className="mt-3 block text-sm font-semibold text-slate-900">Maps</span>
                  </Link>
                  <Link href={localizePath("/dashboard", pathLocale)} role="menuitem" onClick={() => setAppsOpen(false)} className="group rounded-2xl border border-transparent p-3 transition hover:border-violet-200 hover:bg-violet-50">
                    <span className="grid size-12 place-items-center rounded-2xl bg-violet-100 text-2xl shadow-sm transition group-hover:-translate-y-0.5">🧭</span>
                    <span className="mt-3 block text-sm font-semibold text-slate-900">Dashboard</span>
                  </Link>
                </div>
              </div>}
            </div>
            {user ? (
              <Link href={localizePath("/profile", pathLocale)}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(localizePath("/login", pathLocale))}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.common.signIn}
              </Button>
            )}
          </div>
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
