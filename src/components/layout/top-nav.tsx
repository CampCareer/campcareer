"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { LogoMark } from "@/components/logo-mark"
import { useRouteLocale, useSetLocale } from "@/lib/i18n/locale-provider"
import { LOCALE_META, PUBLISHED_LOCALE_OPTIONS, localeForUi, localeFromPathname, localizePath, withoutLocalePrefix, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { Globe, Check, MapPinned, Search } from "lucide-react"
import { SearchModal } from "@/components/search/search-modal"

export function TopNav() {
  const pathname = usePathname()
  const routeLocale = useRouteLocale()
  const setLocale = useSetLocale()
  const router = useRouter()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const barePathname = withoutLocalePrefix(pathname)

  const isLanding = barePathname === "/"
  const isTransparent = isLanding

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

  const textColor = isTransparent ? "text-white" : "text-slate-900"
  const mutedColor = isTransparent ? "text-blue-100" : "text-slate-500"
  const hoverBg = isTransparent ? "hover:bg-white/10" : "hover:bg-slate-100"

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-sm",
          isTransparent ? "bg-slate-950" : "border-b border-slate-100 bg-white"
      )}>
        <div className="max-w-7xl mx-auto px-4 max-[360px]:px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 max-[360px]:h-12">
            {/* Logo */}
            <Link href={localizePath("/", pathLocale)} className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <LogoMark size={30} />
              <span className={cn("font-semibold text-base sm:text-lg tracking-tight", textColor)}>
                CampCareer
              </span>
            </Link>

            {/* Right side: Search + Language + Auth */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={pathLocale === "ko" ? "검색" : "Search"}
                className={cn("flex items-center justify-center rounded-lg p-2 transition", textColor, hoverBg)}
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href={localizePath("/maps", pathLocale)} className={cn("hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition sm:flex", mutedColor, hoverBg)}>
                <MapPinned className="size-4" />
                {pathLocale === "ko" ? "지도" : "Map"}
              </Link>

              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  aria-label={pathLocale === "ko" ? "언어 선택" : "Choose a language"}
                  className={cn("flex items-center justify-center rounded-lg p-2 transition", mutedColor, hoverBg)}
                >
                  <Globe className="w-5 h-5" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {pathLocale === "ko" ? "언어 선택" : "Choose a language"}
                    </p>
                    {PUBLISHED_LOCALE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => switchLang(opt)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition",
                          opt === pathLocale ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"
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

              <Link href={localizePath("/", pathLocale)} className={cn("rounded-lg px-3 py-2 text-sm font-semibold transition", isTransparent ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-blue-600 text-white hover:bg-blue-700")}>
                {pathLocale === "ko" ? "경로 검색" : "Search routes"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} locale={pathLocale} />
    </>
  )
}
