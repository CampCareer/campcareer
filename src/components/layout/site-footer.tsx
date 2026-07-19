"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget"

// Shared site footer. Blog moved here from the top nav (it's editorial, not a
// core tool), alongside the legal/methodology links.
export function SiteFooter({ className }: { className?: string }) {
  const t = useTranslations()
  const locale = useLocale()
  const pathLocale = localeFromPathname(usePathname()) ?? locale
  const tf = t.landing.footer

  return (
    <footer className={cn("border-t border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef3fc_100%)]", className)}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <span>{tf.copyright}</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href={localizePath("/blog", pathLocale)} className="hover:text-slate-600 transition-colors">
            {t.nav.blog}
          </Link>
          <Link href={localizePath("/methodology", pathLocale)} className="hover:text-slate-600 transition-colors">
            Methodology
          </Link>
          <Link href={localizePath("/compare", pathLocale)} className="hover:text-slate-600 transition-colors">
            {t.nav.compare}
          </Link>
          <Link href={localizePath("/privacy", pathLocale)} className="hover:text-slate-600 transition-colors">
            Privacy
          </Link>
          <Link href={localizePath("/terms", pathLocale)} className="hover:text-slate-600 transition-colors">
            Terms
          </Link>
          <FeedbackWidget />
        </nav>
        <span className="text-xs text-slate-400">{tf.dataSources}</span>
      </div>
    </footer>
  )
}
