"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  Globe,
  CheckSquare,
  Calendar,
  Bookmark,
  BookOpen,
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
  { key: "blog",        href: "/blog",         icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#FAFAFA] border-r border-slate-200 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="text-slate-900 font-semibold text-base tracking-tight">
            CampCareer
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {t.nav[item.key]}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-400">© 2025 CampCareer</p>
      </div>
    </aside>
  )
}
