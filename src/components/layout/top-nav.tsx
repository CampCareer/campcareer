"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect, useCallback } from "react"
import { LogoMark } from "@/components/logo-mark"
import { useLocale, useRouteLocale, useRouteTranslations, useSetLocale } from "@/lib/i18n/locale-provider"
import { LOCALE_META, PUBLISHED_LOCALE_OPTIONS, localeForUi, localeFromPathname, localizePath, withoutLocalePrefix, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { Globe, Check, Search, LogIn, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import { SearchModal } from "@/components/search/search-modal"

export function TopNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const routeLocale = useRouteLocale()
  const setLocale = useSetLocale()
  const t = useRouteTranslations()
  const router = useRouter()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const barePathname = withoutLocalePrefix(pathname)

  const isLanding = barePathname === "/"
  const isToolSurface = barePathname === "/planner" || barePathname === "/planner"
  const isBluePages = isLanding || barePathname === "/au/majors" || barePathname.startsWith("/au/majors/") || barePathname === "/au/study" || barePathname.startsWith("/au/study/")
  const isTransparent = isBluePages

  /* ── Auth ── */
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

  /* ── Search modal ── */
  const [searchOpen, setSearchOpen] = useState(false)

  const textColor = isTransparent && !isToolSurface ? "text-white" : "text-slate-900"
  const mutedColor = isTransparent && !isToolSurface ? "text-blue-100" : "text-slate-500"
  const hoverBg = isTransparent && !isToolSurface ? "hover:bg-white/10" : "hover:bg-slate-100"

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-sm",
        isToolSurface
          ? "border-b border-slate-200 bg-white/95"
          : isTransparent
            ? "bg-blue-600"
            : "bg-white border-b border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto px-4 max-[360px]:px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 max-[360px]:h-12">
            {/* Logo */}
            {!isToolSurface && (
              <Link href={localizePath("/", pathLocale)} className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                <LogoMark size={30} />
                <span className={cn("font-semibold text-base sm:text-lg tracking-tight", textColor)}>
                  CampCareer
                </span>
              </Link>
            )}

            {/* Spacer for tool surface */}
            {isToolSurface && <div />}

            {/* Right side: Search + Language + Auth */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={isKo(t, pathLocale) ? "검색" : "Search"}
                className={cn("flex items-center justify-center rounded-lg p-2 transition", textColor, hoverBg)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language */}
              {!isToolSurface && (
                <div className="relative" ref={langRef}>
                  <button
                    type="button"
                    onClick={() => setLangOpen((o) => !o)}
                    aria-label={isKo(t, pathLocale) ? "언어 선택" : "Choose a language"}
                    className={cn("flex items-center justify-center rounded-lg p-2 transition", mutedColor, hoverBg)}
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  {langOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        {isKo(t, pathLocale) ? "언어 선택" : "Choose a language"}
                      </p>
                      {PUBLISHED_LOCALE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => switchLang(opt)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition",
                            opt === pathLocale ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <span className="text-lg">{opt === "ko" ? "🇰🇷" : "🇺🇸"}</span>
                          <span className="flex-1 text-left">{LOCALE_META[opt].label}</span>
                          {opt === pathLocale && <Check className="w-4 h-4 shrink-0 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Login / Avatar */}
              {user ? (
                <Link
                  href={localizePath("/profile", pathLocale)}
                  aria-label={isKo(t, pathLocale) ? "프로필 열기" : "Open profile"}
                  className="flex items-center"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isTransparent && !isToolSurface ? "bg-white/20" : "bg-blue-100")}>
                      <UserIcon className={cn("w-4 h-4", isTransparent && !isToolSurface ? "text-white" : "text-blue-600")} />
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(localizePath("/login", pathLocale))}
                  className={cn("hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition", mutedColor, hoverBg)}
                >
                  <LogIn className="w-4 h-4" />
                  {isKo(t, pathLocale) ? "로그인" : "Log in"}
                </button>
              )}

              {/* Get Started */}
              <Button
                size="sm"
                onClick={() => router.push(user ? localizePath("/planner", pathLocale) : localizePath("/login", pathLocale))}
                className={cn(
                  "rounded-lg text-sm font-semibold px-4 py-2 h-auto",
                  isTransparent && !isToolSurface
                    ? "bg-white text-blue-700 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {isKo(t, pathLocale) ? "시작하기" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} locale={pathLocale} />
    </>
  )
}

function isKo(t: ReturnType<typeof useRouteTranslations>, pathLocale: string) {
  return pathLocale === "ko"
}
