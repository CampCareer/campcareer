"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { LogIn, MapPinned } from "lucide-react"
import { LanguageMenu } from "@/components/layout/language-menu"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

export function TopNav() {
  const pathname = usePathname()
  const routeLocale = useRouteLocale()
  const pathLocale = localeFromPathname(pathname) ?? routeLocale
  const isLanding = withoutLocalePrefix(pathname) === "/"
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const isTransparent = false

  useEffect(() => {
    let active = true

    const syncUser = async (nextUser?: User | null) => {
      const user = nextUser ?? (await supabase.auth.getUser()).data.user
      if (!active) return

      setUser(user)
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

  const profileDestination = localizePath("/profile", pathLocale)
  const logoDestination = isLanding || !user
    ? localizePath("/", pathLocale)
    : localizePath("/home", pathLocale)
  const displayName = user
    ? ((user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "C")
    : "C"
  const accountInitial = Array.from(displayName.trim())[0]?.toLocaleUpperCase() || "C"

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
              href={logoDestination}
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

              {user ? <Link href={profileDestination} aria-label={pathLocale === "ko" ? "프로필 열기" : "Open profile"} className={cn("inline-flex rounded-lg border border-[#d8d8d4] bg-white p-1.5 text-sm font-semibold text-[#1b1b1b] transition hover:bg-[#f6f6f4]", isTransparent && "border-white/20 bg-white text-slate-950")}>
                <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700" aria-hidden="true">{accountInitial}</span>
              </Link> : <Link href={`${localizePath("/login", pathLocale)}?next=${encodeURIComponent(localizePath("/home", pathLocale))}`} className={cn("inline-flex items-center gap-1.5 rounded-lg border border-[#d8d8d4] bg-white px-3 py-2 text-sm font-semibold text-[#1b1b1b] transition hover:bg-[#f6f6f4]", isTransparent && "border-white/20 bg-white text-slate-950")}>
                <LogIn className="size-4" />
                {pathLocale === "ko" ? "로그인" : "Log in"}
              </Link>}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
