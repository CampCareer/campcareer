"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  Globe,
  CheckSquare,
  Calendar,
  Map,
  Bookmark,
  BookOpen,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/logo-mark"
import { useTranslations } from "@/lib/i18n/locale-provider"
import type { Dictionary } from "@/lib/i18n/dictionaries"

const navItems: { key: keyof Dictionary["nav"]; href: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard",   href: "/dashboard",    icon: LayoutDashboard },
  { key: "saved",       href: "/saved",        icon: Bookmark },
  { key: "roiExplorer", href: "/roi-explorer", icon: TrendingUp },
  { key: "compare",     href: "/compare",      icon: Globe },
  { key: "checklist",   href: "/checklist",    icon: CheckSquare },
  { key: "timeline",    href: "/timeline",     icon: Calendar },
  { key: "careerPath",  href: "/career-path",  icon: Map },
  { key: "documents",   href: "/documents",    icon: FolderOpen },
]

const secondaryItems: { key: keyof Dictionary["nav"]; href: string; icon: typeof LayoutDashboard }[] = [
  { key: "blog",        href: "/blog",         icon: BookOpen },
]

export function Sidebar({ collapsed = false, mobileOpen = false }: { collapsed?: boolean; mobileOpen?: boolean }) {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#FAFAFA] border-r border-slate-200 flex flex-col z-40 transition-all duration-200",
        // 모바일: 드로어 슬라이드, 데스크탑(md+)은 항상 열림
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        // 폭: 모바일은 항상 풀 드로어(w-60), 데스크탑만 collapsed 반영
        "w-60",
        collapsed && "md:w-16",
        !collapsed && "md:w-60"
      )}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5",
            collapsed && "md:justify-center"
          )}
        >
          <LogoMark size={36} />
          <span
            className={cn(
              "text-slate-900 font-semibold text-base tracking-tight",
              collapsed && "md:hidden"
            )}
          >
            CampCareer
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p
          className={cn(
            "px-3 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider",
            collapsed && "md:hidden"
          )}
        >
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={t.nav[item.key]}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    collapsed && "md:justify-center",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={cn(collapsed && "md:hidden")}>{t.nav[item.key]}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Secondary */}
      <div className="px-3 py-2 border-t border-slate-200">
        <ul className="space-y-0.5">
          {secondaryItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={t.nav[item.key]}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    collapsed && "md:justify-center",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={cn(collapsed && "md:hidden")}>{t.nav[item.key]}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer */}
      <div
        className={cn(
          "px-5 py-4 border-t border-slate-200",
          collapsed && "md:hidden"
        )}
      >
        <p className="text-xs text-slate-400">© 2026 CampCareer</p>
      </div>
    </aside>
  )
}
