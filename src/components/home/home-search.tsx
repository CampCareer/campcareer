"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { HeroSearch } from "@/components/hero-search"
import { useTranslations } from "@/lib/i18n/locale-provider"

// Popular searches — each deep-links into the ROI Explorer prefilled with a
// field + country (same params HeroSearch submits). Field labels stay English to
// match the real ROI field names and the /api/roi/fields ilike lookup.
const POPULAR = [
  { field: "computer science", country: "us", flag: "🇺🇸", label: "Computer Science" },
  { field: "data science", country: "ca", flag: "🇨🇦", label: "Data Science" },
  { field: "nursing", country: "au", flag: "🇦🇺", label: "Nursing" },
  { field: "business", country: "uk", flag: "🇬🇧", label: "Business" },
  { field: "software engineering", country: "ie", flag: "🇮🇪", label: "Software Engineering" },
]

export function HomeSearch() {
  const t = useTranslations()
  const hs = t.landing.heroSearch

  return (
    <div className="bg-background">
      {/* ── Search hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
          <h1 className="font-display text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-[2.7rem] break-keep">
            {hs.title}
          </h1>

          <div className="mt-8 flex w-full justify-center">
            <HeroSearch />
          </div>

          {/* Our edge: visa & PR ride along with every result */}
          <p className="mt-4 max-w-xl text-sm text-blue-100 break-keep">{t.landing.home.visaLine}</p>

          {/* Popular searches — instant scent of what to search */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-blue-200">{hs.popularLabel}</span>
            {POPULAR.map((p) => (
              <Link
                key={`${p.field}-${p.country}`}
                href={`/roi-explorer?field=${encodeURIComponent(p.field)}&country=${p.country}&source=hero-popular`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <span>{p.flag}</span>
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slim trust strip — government-data provenance ── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center">
          <h2 className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            {t.landing.provenance.title}
          </h2>
          <p className="mt-2 text-xs text-slate-500 break-keep">{t.landing.provenance.employment}</p>
          <Link
            href="/methodology"
            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            {t.landing.provenance.methodologyLink}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  )
}
