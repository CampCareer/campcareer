"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { BriefcaseBusiness, LogIn, LogOut, Settings } from "lucide-react"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

type WorkspaceUserMenuProps = {
  className?: string
  minimal?: boolean
}

export function WorkspaceUserMenu({ className, minimal = false }: WorkspaceUserMenuProps) {
  const router = useRouter()
  const locale = useRouteLocale()
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [avatarFailed, setAvatarFailed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create the browser client only after hydration. Static generation and CI
    // therefore do not require public Supabase environment variables.
    const supabase = createClient()
    supabaseRef.current = supabase
    let active = true

    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
      supabaseRef.current = null
    }
  }, [])

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  useEffect(() => {
    setAvatarFailed(false)
  }, [avatarUrl])

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [isOpen])

  async function signOut() {
    const supabase = supabaseRef.current
    if (!supabase) {
      setSignOutError(locale === "ko" ? "로그아웃을 준비하지 못했습니다. 다시 시도해 주세요." : "We couldn't prepare sign out. Please try again.")
      return
    }

    setSignOutError(null)
    setIsSigningOut(true)
    const { error } = await supabase.auth.signOut()

    if (error) {
      setSignOutError(locale === "ko" ? "로그아웃하지 못했습니다. 다시 시도해 주세요." : "We couldn't log you out. Please try again.")
      setIsSigningOut(false)
      return
    }

    setIsOpen(false)
    setIsSigningOut(false)
    router.replace(localizePath("/", locale))
    router.refresh()
  }

  function openAccountPage(path: "/profile" | "/settings") {
    setIsOpen(false)
    router.push(localizePath(path, locale))
  }

  if (user) {
    const displayName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      user.email?.split("@")[0] ||
      (locale === "ko" ? "CampCareer 회원" : "CampCareer member")
    const initial = Array.from(displayName.trim())[0]?.toLocaleUpperCase() || "C"

    return (
      <div className={cn("relative", className)} ref={menuRef}>
        <button
          type="button"
          onClick={() => {
            setSignOutError(null)
            setIsOpen((open) => !open)
          }}
          className="rounded-full transition hover:ring-2 hover:ring-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label={locale === "ko" ? "계정 메뉴 열기" : "Open account menu"}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {avatarUrl && !avatarFailed ? (
            <img
              src={avatarUrl}
              alt=""
              className="size-7 rounded-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="grid size-7 place-items-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700" aria-hidden="true">{initial}</div>
          )}
        </button>

        {isOpen && (
          <div
            role="menu"
            aria-label={locale === "ko" ? "계정 메뉴" : "Account menu"}
            className="absolute right-0 top-full z-50 mt-2 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,.16)]"
          >
            <div className="border-b border-slate-100 px-3 pb-3 pt-2">
              <p className="truncate text-sm font-semibold text-slate-950">{displayName}</p>
              {user.email && <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>}
            </div>

            <div className="py-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => openAccountPage("/profile")}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50"
              >
                <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{locale === "ko" ? "프로필" : "Profile"}</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">{locale === "ko" ? "현재 방향과 저장한 커리어 탐색을 확인하세요." : "Review your direction and saved career research."}</span>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => openAccountPage("/settings")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <Settings className="size-4 text-slate-500" />
                {locale === "ko" ? "계정 관리" : "Manage your account"}
              </button>
            </div>

            <div className="border-t border-slate-100 pt-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => void signOut()}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut className="size-4" />
                {isSigningOut ? (locale === "ko" ? "로그아웃 중…" : "Logging out…") : (locale === "ko" ? "로그아웃" : "Log out")}
              </button>
              {signOutError && <p role="alert" className="px-3 pb-1 pt-1 text-xs leading-4 text-rose-600">{signOutError}</p>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={localizePath("/login", locale)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-[#d8d8d4] bg-white px-3 py-2 text-sm font-semibold text-[#1b1b1b] transition hover:bg-[#f6f6f4]",
        minimal && "border-0 bg-transparent px-2 py-1 hover:bg-slate-100",
        className
      )}
    >
      <LogIn className="size-4" />
      {!minimal && <span>{locale === "ko" ? "로그인" : "Log in"}</span>}
    </Link>
  )
}
