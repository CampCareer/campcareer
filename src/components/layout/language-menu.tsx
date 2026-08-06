"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Check, Globe } from "lucide-react"
import { useRouteLocale, useSetLocale } from "@/lib/i18n/locale-provider"
import {
  LOCALE_META,
  PUBLISHED_LOCALE_OPTIONS,
  localeForUi,
  localeFromPathname,
  type LocaleOption,
} from "@/lib/i18n/config"
import { getLocaleNavigationPath } from "@/lib/i18n/legacy-locale-home"
import { cn } from "@/lib/utils"

type LanguageMenuProps = {
  className?: string
  buttonClassName?: string
}

export function LanguageMenu({ className, buttonClassName }: LanguageMenuProps) {
  const pathname = usePathname()
  const router = useRouter()
  const routeLocale = useRouteLocale()
  const setLocale = useSetLocale()
  const selectedLocale = localeFromPathname(pathname) ?? routeLocale
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [open])

  function switchLanguage(next: LocaleOption) {
    setLocale(localeForUi(next))
    const target = getLocaleNavigationPath(pathname, next)
    const query = window.location.search
    router.replace(query ? `${target}${query}` : target)
    setOpen(false)
  }

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={selectedLocale === "ko" ? "언어 선택" : "Choose a language"}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900",
          buttonClassName
        )}
      >
        <Globe className="size-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <p className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {selectedLocale === "ko" ? "언어 선택" : "Choose a language"}
          </p>
          {PUBLISHED_LOCALE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={option === selectedLocale}
              onClick={() => switchLanguage(option)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition",
                option === selectedLocale
                  ? "bg-[#f1f1ef] font-semibold text-[#1b1b1b]"
                  : "text-slate-700 hover:bg-[#f6f6f4]"
              )}
            >
              <span className="text-lg" aria-hidden="true">
                {option === "ko" ? "🇰🇷" : "🇺🇸"}
              </span>
              <span className="flex-1 text-left">{LOCALE_META[option].label}</span>
              {option === selectedLocale && <Check className="size-4 shrink-0 text-slate-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
