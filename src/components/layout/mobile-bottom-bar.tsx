"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { Search, LayoutGrid, UserIcon, LogIn } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase-client"

export function MobileBottomBar() {
  const pathname = usePathname()
  const locale = useLocale()
  const pathLocale = localeFromPathname(pathname) ?? locale
  const barePathname = withoutLocalePrefix(pathname)
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onSearchOpen = () => setHidden(true)
    const onSearchClose = () => setHidden(false)
    window.addEventListener("search-modal-open" as any, onSearchOpen)
    window.addEventListener("search-modal-close" as any, onSearchClose)
    return () => {
      window.removeEventListener("search-modal-open" as any, onSearchOpen)
      window.removeEventListener("search-modal-close" as any, onSearchClose)
    }
  }, [])

  useEffect(() => {
    if (!toolsOpen) return
    const onDown = (e: MouseEvent) => { if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setToolsOpen(false) }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey) }
  }, [toolsOpen])

  const isExplore = barePathname === "/" || barePathname.startsWith("/au") || barePathname === "/countries/search"

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  return (
    <div className={cn("sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm safe-area-bottom transition-all duration-300", hidden ? "translate-y-full opacity-0 pointer-events-none" : "")}>
      <div className="flex items-center justify-around h-14">
        {/* Explore */}
        <Link href={localizePath("/", pathLocale)} className={cn("flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition", isExplore ? "text-blue-600" : "text-slate-400")}>
          <Search className="w-5 h-5" strokeWidth={isExplore ? 2.4 : 1.8} />
          <span>Explore</span>
        </Link>

        {/* Tools */}
        <div className="relative" ref={toolsRef}>
          <button type="button" onClick={() => setToolsOpen((o) => !o)} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium text-slate-400 transition">
            <LayoutGrid className="w-5 h-5" strokeWidth={1.8} />
            <span>Tools</span>
          </button>
          {toolsOpen && <div role="menu" className="absolute bottom-full right-0 mb-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <Link href={localizePath("/", pathLocale)} role="menuitem" onClick={() => setToolsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <span className="grid size-8 place-items-center rounded-lg bg-blue-100 text-base">🏠</span>
              Home
            </Link>
            <Link href={localizePath("/maps", pathLocale)} role="menuitem" onClick={() => setToolsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <span className="grid size-8 place-items-center rounded-lg bg-sky-100 text-base">🗺️</span>
              Maps
            </Link>
            <Link href={localizePath("/planner", pathLocale)} role="menuitem" onClick={() => setToolsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <span className="grid size-8 place-items-center rounded-lg bg-violet-100 text-base">🧭</span>
              Planner
            </Link>
          </div>}
        </div>

        {/* Profile / Login */}
        {user ? (
          <Link href={localizePath("/profile", pathLocale)} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium text-slate-400 transition">
            {avatarUrl ? <img src={avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" /> : <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center"><UserIcon className="w-3 h-3 text-blue-600" /></div>}
            <span>Profile</span>
          </Link>
        ) : (
          <Link href={localizePath("/login", pathLocale)} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium text-slate-400 transition">
            <LogIn className="w-5 h-5" strokeWidth={1.8} />
            <span>Log in</span>
          </Link>
        )}
      </div>
    </div>
  )
}
