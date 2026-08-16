"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { LogIn } from "lucide-react"
import { LanguageMenu } from "@/components/layout/language-menu"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

export function TopNav() {
  const pathname = usePathname()
  const routeLocale = useRouteLocale()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const normalizedPath = withoutLocalePrefix(pathname || "/")
  const homeDestination = localizePath("/", pathLocale)
  const fifoDestination = localizePath("/fifo", pathLocale)
  const profileDestination = localizePath("/profile", pathLocale)
  const loginPath = localizePath("/login", pathLocale)
  const fallbackLoginDestination = `${loginPath}?next=${encodeURIComponent(pathname || homeDestination)}`
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let active = true

    const syncUser = async (nextUser?: User | null) => {
      const next = nextUser ?? (await supabase.auth.getUser()).data.user
      if (!active) return
      setUser(next)
    }

    void syncUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncUser(session?.user ?? null)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const isFifoSurface = normalizedPath === "/" || normalizedPath === "/fifo" || normalizedPath.startsWith("/fifo/")

  if (isFifoSurface) {
    const nav = pathLocale === "ko"
      ? [
          { href: fifoDestination, label: "FIFO 직업" },
          { href: `${fifoDestination}#tickets`, label: "티켓" },
          { href: `${homeDestination}#fifo-report`, label: "FIFO 리포트" },
          { href: localizePath("/blog", pathLocale), label: "Blog" },
        ]
      : [
          { href: fifoDestination, label: "FIFO Jobs" },
          { href: `${fifoDestination}#tickets`, label: "Tickets" },
          { href: `${homeDestination}#fifo-report`, label: "FIFO Report" },
          { href: localizePath("/blog", pathLocale), label: "Blog" },
        ]

    return (
      <header className="sticky top-0 z-40 h-[68px] border-b border-[hsl(var(--cc-border))] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[1240px] items-center px-5 sm:px-6">
          <Link href={homeDestination} className="flex items-center gap-2.5" aria-label="CampCareer home">
            <Image src="/brand/campcareer-c.svg" width={34} height={34} alt="" priority className="size-8 sm:size-[34px]" />
            <span className="text-[20px] font-semibold tracking-[-0.035em] text-[hsl(var(--cc-ink))] sm:text-[22px]">
              CampCareer
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="FIFO navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[hsl(var(--cc-ink-secondary))] transition hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={`${homeDestination}#fifo-report`}
            className="ml-auto inline-flex min-h-10 items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] lg:ml-8"
          >
            {pathLocale === "ko" ? "리포트 보기" : "Get the Report"}
          </Link>
        </div>
      </header>
    )
  }

  const displayName = user
    ? ((user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "C")
    : "C"
  const accountInitial = Array.from(displayName.trim())[0]?.toLocaleUpperCase() || "C"

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[hsl(var(--cc-border))] bg-white">
      <div className="mx-auto max-w-[1240px] px-6 max-sm:px-[18px]">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={homeDestination}
            className="campcareer-wordmark shrink-0 text-[hsl(var(--cc-ink))]"
            aria-label="CampCareer career search"
          >
            campcareer
          </Link>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <LanguageMenu buttonClassName="text-[hsl(var(--cc-muted))] hover:bg-slate-100" />

            {user ? (
              <Link
                href={profileDestination}
                aria-label={pathLocale === "ko" ? "프로필 열기" : "Open profile"}
                className="inline-flex rounded-lg border border-[hsl(var(--cc-border))] bg-white p-1.5 text-sm font-semibold text-[hsl(var(--cc-ink))] transition hover:bg-slate-50"
              >
                <span className="grid size-6 place-items-center rounded-full bg-blue-50 text-[10px] font-semibold text-brand" aria-hidden="true">
                  {accountInitial}
                </span>
              </Link>
            ) : (
              <Link
                href={fallbackLoginDestination}
                onClick={(event) => {
                  event.preventDefault()
                  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
                  window.location.assign(`${loginPath}?next=${encodeURIComponent(returnTo || homeDestination)}`)
                }}
                className={cn("inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--cc-border))] bg-white px-3 py-2 text-sm font-semibold text-[hsl(var(--cc-ink))] transition hover:bg-slate-50")}
              >
                <LogIn className="size-4" />
                {pathLocale === "ko" ? "로그인" : "Log in"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
