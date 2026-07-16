"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { LogoMark } from "@/components/logo-mark"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { useLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { UserIcon, Globe, Building2, Briefcase } from "lucide-react"
import type { User } from "@supabase/supabase-js"

// Numbeo-style horizontal category nav. Replaces the old sidebar — every core
// feature is one click from the top bar. Blog lives in the footer.
export function TopNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const pathLocale = localeFromPathname(pathname) ?? locale
  const barePathname = withoutLocalePrefix(pathname)
  // /map and /maps are full-screen map surfaces on mobile.
  const isMap = barePathname === "/map" || barePathname.startsWith("/map/") || barePathname === "/maps" || barePathname.startsWith("/maps/")
  const isCompare = barePathname === "/compare" || barePathname.startsWith("/compare/")
  const router = useRouter()
  const t = useTranslations()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  const navItems: { href: string; label: string; icon?: typeof Globe; accent?: "blue" | "rose" | "amber" }[] = [
    { href: "/", label: locale === "ko" ? "국가" : "Countries", icon: Globe, accent: "blue" },
    { href: "/universities", label: locale === "ko" ? "대학" : "Universities", icon: Building2, accent: "rose" },
    { href: "/majors", label: locale === "ko" ? "전공·직업" : "Majors", icon: Briefcase, accent: "amber" },
    { href: "/maps", label: t.nav.map },
    { href: "/compare", label: t.nav.compare },
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
    <header className={cn(isCompare ? "" : "sticky top-0 z-40", "bg-[linear-gradient(180deg,#ffffff_0%,#f0f5ff_100%)] backdrop-blur-sm")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center gap-4">
          <Link href={localizePath("/", pathLocale)} className="flex items-center gap-2.5 shrink-0 mr-auto">
            <LogoMark size={36} />
            <span className="font-semibold text-slate-900 text-lg tracking-tight">
              CampCareer
            </span>
          </Link>

          {/* Desktop: links centered */}
          <nav className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {linkEls}
          </nav>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <LanguageToggle className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
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
        {!isMap && (
          <nav className="sm:hidden flex items-center justify-center gap-1 overflow-x-auto no-scrollbar pb-2">
            {linkEls}
          </nav>
        )}
      </div>
    </header>
  )
}
