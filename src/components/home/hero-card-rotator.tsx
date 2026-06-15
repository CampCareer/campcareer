"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShieldCheck, Briefcase, TrendingUp, LineChart, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { COUNTRY_META, RISK_BADGE, type CountryCode, type RiskLevel } from "@/lib/degree-risk"
import { useTranslations } from "@/lib/i18n/locale-provider"

// Curated rotation set — every value is the real verified majors/layer_meta
// figure (matched to the live DB on 2026-06-13), so the card stays honest while
// rotating. Covers all five countries once + a Low→Medium→High risk spread, and
// the source label is the actual per-country provenance.
type Combo = {
  slug: string
  country: CountryCode
  risk: RiskLevel
  emp: number
  psw: number
  visaProgram: string
  demand: number
  ai: "low" | "medium" | "high"
  payback: number
  source: string
}

const CARDS: Combo[] = [
  { slug: "computer-science", country: "US", risk: "medium", emp: 85, psw: 3, visaProgram: "STEM-OPT", demand: 88, ai: "medium", payback: 5.9, source: "College Scorecard · BLS" },
  { slug: "nursing", country: "AU", risk: "low", emp: 90, psw: 2, visaProgram: "Subclass 485", demand: 90, ai: "low", payback: 3.3, source: "QILT · CRICOS" },
  { slug: "data-analytics", country: "CA", risk: "low", emp: 82, psw: 3, visaProgram: "PGWP", demand: 80, ai: "high", payback: 3.1, source: "Statistics Canada (NGS)" },
  { slug: "computer-science", country: "IE", risk: "low", emp: 88, psw: 1, visaProgram: "Stamp 1G", demand: 80, ai: "medium", payback: 3.3, source: "HEA · CSO" },
  { slug: "business-management", country: "UK", risk: "medium", emp: 74, psw: 2, visaProgram: "Graduate Route", demand: 63, ai: "high", payback: 5.2, source: "HESA · Discover Uni" },
  { slug: "music", country: "UK", risk: "high", emp: 59, psw: 2, visaProgram: "Graduate Route", demand: 44, ai: "medium", payback: 5.6, source: "HESA · Discover Uni" },
]

const ROTATE_MS = 4500
const FADE_MS = 400

export function HeroCardRotator() {
  const t = useTranslations()
  const h = t.landing.hero
  const opts = t.degreeRisk.options as Record<string, string>
  const countries = t.degreeRisk.result.countries
  const riskLabels = t.degreeRisk.result.risk
  const prShort = t.degreeRisk.timeline.prShort

  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Honour prefers-reduced-motion: no auto-rotation, no fade — pills still swap.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduced || paused) return
    const id = setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setI((p) => (p + 1) % CARDS.length)
        setVisible(true)
      }, FADE_MS)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [reduced, paused])

  const select = (idx: number) => {
    setI(idx)
    setVisible(true)
  }

  const c = CARDS[i]
  const aiLabel = c.ai === "low" ? h.aiBandLow : c.ai === "high" ? h.aiBandHigh : h.aiBandMedium
  const layers = [
    { Icon: Briefcase, label: h.sampleEmployment, value: h.heroEmpFmt.replace("{n}", String(c.emp)) },
    { Icon: TrendingUp, label: h.sampleDemand, value: `${c.demand} / 100` },
    { Icon: LineChart, label: h.sampleRoi, value: h.heroRoiFmt.replace("{n}", String(c.payback)) },
    { Icon: Cpu, label: h.sampleAi, value: aiLabel },
  ]
  const href = `/degree-risk/result?major=${c.slug}&view=${c.country}`

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Fixed min-height keeps rotation jump-free (no CLS). */}
      <div aria-live="polite" className="min-h-[27rem]">
        <Link
          href={href}
          className={cn(
            "block max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 transition-opacity ease-out hover:border-blue-300",
            visible ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">
                {COUNTRY_META[c.country].flag} {countries[c.country]}
              </p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">{opts[c.slug] ?? c.slug}</h2>
            </div>
            <span
              className={cn(
                "inline-block shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold",
                RISK_BADGE[c.risk].className
              )}
            >
              {riskLabels[c.risk]}
            </span>
          </div>

          {/* Visa pathway — the wedge, surfaced first and most prominently */}
          <div className="mt-4 rounded-xl border border-blue-100 bg-brand-tint px-4 py-3.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
              <ShieldCheck className="h-4 w-4 text-brand" />
              {h.sampleVisa}
            </span>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {c.visaProgram} · {h.heroVisaFmt.replace("{n}", String(c.psw))}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-brand">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">{h.samplePr}</span>
              {prShort[c.country]}
            </p>
          </div>

          <div className="mt-1 divide-y divide-slate-100">
            {layers.map((layer) => (
              <div key={layer.label} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                  <layer.Icon className="h-3.5 w-3.5 text-blue-400" />
                  {layer.label}
                </span>
                <span className="text-right text-sm font-medium text-slate-700">{layer.value}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            {h.heroSourcePrefix}: {c.source}
          </p>
        </Link>
      </div>

      {/* Manual preview pills — hint at the breadth across countries & majors */}
      <div className="mt-4">
        <p className="mb-2 text-center text-[11px] text-slate-400">{h.heroPillsLabel}</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {CARDS.map((card, idx) => (
            <button
              key={`${card.slug}-${card.country}`}
              type="button"
              onClick={() => select(idx)}
              aria-pressed={idx === i}
              aria-label={`${countries[card.country]} · ${opts[card.slug] ?? card.slug}`}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                idx === i
                  ? "border-brand bg-brand-tint text-brand"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {COUNTRY_META[card.country].flag} {opts[card.slug] ?? card.slug}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
