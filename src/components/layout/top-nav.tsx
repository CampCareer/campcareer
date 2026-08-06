"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPinned, UserRound } from "lucide-react"
import { LanguageMenu } from "@/components/layout/language-menu"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function TopNav() {
  const pathname = usePathname()
  const routeLocale = useRouteLocale()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const isTransparent = false

  const textColor = isTransparent ? "text-white" : "text-slate-900"
  const mutedColor = isTransparent ? "text-slate-200" : "text-slate-500"
  const hoverBg = isTransparent ? "hover:bg-white/10" : "hover:bg-slate-100"

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-16 border-b border-[#e7e7e3] bg-[#f7f7f6]",
          isTransparent && "bg-slate-950"
        )}
      >
        <div className="mx-auto max-w-[1240px] px-6 max-sm:px-[18px]">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/home"
              className={cn("campcareer-wordmark shrink-0", textColor)}
              aria-label="campcareer home"
            >
              campcareer
            </Link>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/maps"
                aria-label={pathLocale === "ko" ? "지도" : "Maps"}
                className={cn(
                  "hidden items-center justify-center rounded-lg p-2 transition sm:flex",
                  mutedColor,
                  hoverBg
                )}
              >
                <MapPinned className="size-4" />
              </Link>

              <LanguageMenu buttonClassName={cn(mutedColor, hoverBg)} />

              <Link
                href={localizePath("/login", pathLocale)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border border-[#d8d8d4] bg-white px-3 py-2 text-sm font-semibold text-[#1b1b1b] transition hover:bg-[#f6f6f4]",
                  isTransparent && "border-white/20 bg-white text-slate-950"
                )}
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
