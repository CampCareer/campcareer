"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

const COLLAPSE_COOKIE = "sidebar_collapsed"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // 쿠키에서 초기 상태 복원
  useEffect(() => {
    const match = document.cookie.split("; ").find((r) => r.startsWith(`${COLLAPSE_COOKIE}=`))
    if (match?.split("=")[1] === "1") setCollapsed(true)
  }, [])

  // 경로가 바뀌면 모바일 드로어 자동 닫힘
  useEffect(() => setMobileOpen(false), [pathname])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      document.cookie = `${COLLAPSE_COOKIE}=${next ? "1" : "0"}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
      return next
    })
  }

  function toggleMobile() {
    setMobileOpen((prev) => !prev)
  }

  // 랜딩·로그인 페이지는 사이드바·헤더 없이 풀스크린
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/degree-risk")) {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className={`${collapsed ? "md:ml-16" : "md:ml-60"} flex flex-col min-h-screen transition-all duration-200`}>
        <Header onToggleSidebar={toggleCollapsed} onToggleMobile={toggleMobile} collapsed={collapsed} />
        <main className="flex-1 bg-slate-50">
          {children}
        </main>
      </div>
    </>
  )
}
