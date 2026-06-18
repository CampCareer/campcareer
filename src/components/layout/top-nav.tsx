"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { LogoMark } from "@/components/logo-mark"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

// Numbeo-style horizontal category nav. Replaces the old sidebar — every core
// feature is one click from the top bar. Blog lives in the footer.
export function TopNav() {
  const pathname = usePathname()
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

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const navItems: { href: string; label: string }[] = [
    { href: "/roi-explorer", label: t.nav.roiExplorer },
    { href: "/compare", label: t.nav.compare },
    { href: "/degree-risk", label: t.nav.degreeRisk },
    { href: "/explore", label: t.nav.explore },
  ]

  const linkEls = navItems.map((item) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
          active
            ? "bg-blue-50 text-blue-600"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        {item.label}
      </Link>
    )
  })

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-auto">
            <LogoMark size={30} />
            <span className="font-semibold text-slate-900 text-base tracking-tight">
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                {t.common.signOut}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.common.signIn}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile: links on a full-width second row, scrolls cleanly */}
        <nav className="sm:hidden flex items-center justify-center gap-1 overflow-x-auto no-scrollbar pb-2">
          {linkEls}
        </nav>
      </div>
    </header>
  )
}
