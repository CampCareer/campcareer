"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react"
import { useTranslations } from "@/lib/i18n/locale-provider"

// Major values are the FIELD_ALIASES keys (lib/field-aliases.ts) so the
// roi-explorer ilike + alias fallback resolves them reliably to real field_name
// rows. Labels stay English (field-of-study names) for both locales.
const MAJOR_OPTIONS = [
  { value: "computer science", label: "Computer Science" },
  { value: "data science", label: "Data Science" },
  { value: "software engineering", label: "Software Engineering" },
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business" },
  { value: "finance", label: "Finance" },
  { value: "accounting", label: "Accounting" },
  { value: "economics", label: "Economics" },
  { value: "nursing", label: "Nursing" },
  { value: "medicine", label: "Medicine" },
  { value: "law", label: "Law" },
  { value: "psychology", label: "Psychology" },
]

// Lowercase values match roi-explorer's ?country= (normalizeRoiCountry).
const COUNTRY_OPTIONS = [
  { value: "us", label: "🇺🇸 United States" },
  { value: "ca", label: "🇨🇦 Canada" },
  { value: "uk", label: "🇬🇧 United Kingdom" },
  { value: "au", label: "🇦🇺 Australia" },
  { value: "ie", label: "🇮🇪 Ireland" },
]

export function HomePageClient() {
  const t = useTranslations()
  const h = t.landing.home
  const router = useRouter()

  const [major, setMajor] = useState("")
  const [country, setCountry] = useState("")

  // Deep-link to ROI Explorer with whatever was chosen. Partial selection is
  // graceful: country-only, major-only, or neither all resolve there.
  function showRoi() {
    const params = new URLSearchParams()
    if (country) params.set("country", country)
    if (major) params.set("field", major)
    const qs = params.toString()
    router.push(`/roi-explorer${qs ? `?${qs}` : ""}`)
  }

  const selectClass =
    "w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"

  return (
    <div className="bg-background">
      {/* ── Entry: intro + ROI search ── */}
      <section className="max-w-3xl mx-auto px-6 pt-14 sm:pt-20 pb-12 text-center">
        <h1 className="font-display text-3xl sm:text-[2.6rem] font-semibold text-slate-900 leading-[1.12] tracking-tight break-keep">
          {h.intro}
        </h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="home-major">{h.majorAll}</label>
            <select
              id="home-major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={selectClass}
            >
              <option value="">{h.majorAll}</option>
              {MAJOR_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="home-country">{h.countryAll}</label>
            <select
              id="home-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={selectClass}
            >
              <option value="">{h.countryAll}</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={showRoi}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <TrendingUp className="w-4 h-4" />
              {h.showRoi}
            </button>
          </div>
        </div>

        {/* Our edge: visa & PR are part of every result */}
        <p className="mt-3 text-sm text-slate-500">{h.visaLine}</p>

        {/* Secondary entries — ROI is primary, these are lighter */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <Link href="/degree-risk" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors">
            {h.orRisk}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/compare" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors">
            {h.orCompare}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Slim trust strip — government-data provenance ── */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            {t.landing.provenance.title}
          </h2>
          <p className="mt-2 text-xs text-slate-500">{t.landing.provenance.employment}</p>
          <Link
            href="/methodology"
            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            {t.landing.provenance.methodologyLink}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>
    </div>
  )
}
