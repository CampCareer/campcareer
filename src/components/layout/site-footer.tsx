"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouteLocale, useRouteTranslations } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget"

// Shared site footer. Blog moved here from the top nav (it's editorial, not a
// core tool), alongside the legal/methodology links.
export function SiteFooter({ className }: { className?: string }) {
  const t = useRouteTranslations()
  const locale = useRouteLocale()
  const pathLocale = localeFromPathname(usePathname()) ?? locale
  const tf = t.landing.footer
  const ta = t.australia.footer

  return (
    <footer className={cn("border-t border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef3fc_100%)]", className)}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <span>{tf.copyright}</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href={localizePath("/comingsoon", pathLocale)} className="hover:text-slate-600 transition-colors">
            {ta.comingSoon}
          </Link>
          <Link href={localizePath("/blog", pathLocale)} className="hover:text-slate-600 transition-colors">
            {t.nav.blog}
          </Link>
          <Link href={localizePath("/methodology", pathLocale)} className="hover:text-slate-600 transition-colors">
            {ta.methodology}
          </Link>
          <Link href={localizePath("/au/study/compare", pathLocale)} className="hover:text-slate-600 transition-colors">
            {ta.compareStudy}
          </Link>
          <Link href={localizePath("/reports/australia", pathLocale)} className="hover:text-slate-600 transition-colors">
            {t.australia.journey.reportPrep}
          </Link>
          <Link href={localizePath("/privacy", pathLocale)} className="hover:text-slate-600 transition-colors">
            {ta.privacy}
          </Link>
          <Link href={localizePath("/terms", pathLocale)} className="hover:text-slate-600 transition-colors">
            {ta.terms}
          </Link>
          <FeedbackWidget />
        </nav>
        <span className="text-xs text-slate-400">{tf.dataSources}</span>
      </div>
    </footer>
  )
}
