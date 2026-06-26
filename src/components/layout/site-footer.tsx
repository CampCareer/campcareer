"use client"

import Link from "next/link"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { cn } from "@/lib/utils"
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget"

// Shared site footer. Blog moved here from the top nav (it's editorial, not a
// core tool), alongside the legal/methodology links.
export function SiteFooter({ className }: { className?: string }) {
  const t = useTranslations()
  const tf = t.landing.footer

  return (
    <footer className={cn("border-t border-slate-200 bg-background", className)}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <span>{tf.copyright}</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/blog" className="hover:text-slate-600 transition-colors">
            {t.nav.blog}
          </Link>
          <Link href="/methodology" className="hover:text-slate-600 transition-colors">
            Methodology
          </Link>
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">
            Terms
          </Link>
          <FeedbackWidget />
        </nav>
        <span className="text-xs text-slate-400">{tf.dataSources}</span>
      </div>
    </footer>
  )
}
