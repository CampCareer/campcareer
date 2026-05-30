"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // 랜딩 페이지는 사이드바·헤더 없이 풀스크린
  if (pathname === "/") {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar />
      <div className="ml-60 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-slate-50">
          {children}
        </main>
      </div>
    </>
  )
}
