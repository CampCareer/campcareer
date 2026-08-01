"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useRouteLocale, useSetLocale } from "@/lib/i18n/locale-provider"
import { LOCALE_META, PUBLISHED_LOCALE_OPTIONS, localeForUi, localeFromPathname, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { getLocaleNavigationPath } from "@/lib/i18n/legacy-locale-home"
import { cn } from "@/lib/utils"
import { Globe, Check, MapPinned, UserRound } from "lucide-react"

export function TopNav() {
  const pathname = usePathname()
  const routeLocale = useRouteLocale()
  const setLocale = useSetLocale()
  const router = useRouter()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const isTransparent = false

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
    const target = getLocaleNavigationPath(pathname, next)
    const qs = window.location.search
    router.replace(qs ? `${target}${qs}` : target)
    setLangOpen(false)
  }

  const textColor = isTransparent ? "text-white" : "text-slate-900"
  const mutedColor = isTransparent ? "text-slate-200" : "text-slate-500"
  const hoverBg = isTransparent ? "hover:bg-white/10" : "hover:bg-slate-100"

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 h-16 border-b border-[#e7e7e3] bg-[#f7f7f6]",
        isTransparent && "bg-slate-950"
      )}>
        <div className="mx-auto max-w-[1240px] px-6 max-sm:px-[18px]">
          <div className="flex h-16 items-center justify-between">
            {/* Wordmark — intentionally plain, like the search-first prototype. */}
            <Link href="/home" className={cn("campcareer-wordmark shrink-0", textColor)} aria-label="campcareer home">
              campcareer
            </Link>

            {/* Right-side action group: map, language, then login. */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link href="/maps" aria-label={pathLocale === "ko" ? "지도" : "Maps"} className={cn("hidden items-center justify-center rounded-lg p-2 transition sm:flex", mutedColor, hoverBg)}>
                <MapPinned className="size-4" />
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
                          opt === pathLocale ? "bg-[#f1f1ef] font-semibold text-[#1b1b1b]" : "text-slate-700 hover:bg-[#f6f6f4]"
                        )}
                      >
                        <span className="text-lg">{opt === "ko" ? "🇰🇷" : "🇺🇸"}</span>
                        <span className="flex-1 text-left">{LOCALE_META[opt].label}</span>
                        {opt === pathLocale && <Check className="w-4 h-4 shrink-0 text-slate-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={localizePath("/login", pathLocale)}
                className={cn("inline-flex items-center gap-1.5 rounded-lg border border-[#d8d8d4] bg-white px-3 py-2 text-sm font-semibold text-[#1b1b1b] transition hover:bg-[#f6f6f4]", isTransparent && "border-white/20 bg-white text-slate-950")}
              >
                <UserRound className="size-4" />
                {pathLocale === "ko" ? "로그인" : "Log in"}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
