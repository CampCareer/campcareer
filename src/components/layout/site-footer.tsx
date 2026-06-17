"use client"

import Link from "next/link"
import { useTranslations } from "@/lib/i18n/locale-provider"

// Shared site footer. Blog moved here from the top nav (it's editorial, not a
// core tool), alongside the legal/methodology links.
export function SiteFooter() {
  const t = useTranslations()
  const tf = t.landing.footer

  const links: { href: string; label: string }[] = [
    { href: "/blog", label: t.nav.blog },
    { href: "/explore", label: t.nav.explore },
    { href: "/methodology", label: "Methodology" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ]

  return (
    <footer className="border-t border-slate-200 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <span>{tf.copyright}</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-slate-600 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="text-xs text-slate-400">{tf.dataSources}</span>
      </div>
    </footer>
  )
}
