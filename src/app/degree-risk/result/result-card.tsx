"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { ExternalLink, AlertTriangle, ArrowRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type MajorRow,
  type LayerKey,
  type LayerMeta,
  type PrPathway,
  COUNTRY_META,
  RISK_BADGE,
  formatMoney,
  layerMeta,
  layerNoteText,
  riskSummaryText,
  aiNoteText,
  majorLabel,
} from "@/lib/degree-risk"
import { useTranslations, useLocale } from "@/lib/i18n/locale-provider"
import { ImmigrationTimeline } from "@/components/immigration-timeline"

const LAYER_KEYS: LayerKey[] = ["employment", "visa", "demand", "ai_exposure", "roi", "debt"]

function fill(template: string, values: Record<string, React.ReactNode>): React.ReactNode {
  return template.split(/(\{[a-z_]+\})/g).map((part, i) => {
    const m = part.match(/^\{([a-z_]+)\}$/)
    return <React.Fragment key={i}>{m ? values[m[1]] ?? part : part}</React.Fragment>
  })
}

function LayerRow({
  label,
  meta,
  note,
  rm,
  priorityLabel,
  highlighted = false,
  cell = false,
  spanFull = false,
  compact = false,
  accordionOpen = true,
  onToggle,
  children,
}: {
  label: string
  meta: LayerMeta
  note: string | null
  rm: ReturnType<typeof useTranslations>["degreeRisk"]["resultMeta"]
  priorityLabel: string
  highlighted?: boolean
  cell?: boolean
  spanFull?: boolean
  compact?: boolean
  accordionOpen?: boolean
  onToggle?: () => void
  children: React.ReactNode
}) {
  const verified = meta.confidence === "verified"
  const containerClass = cell
    ? [
        "rounded-xl border p-3 md:p-4",
        spanFull ? "md:col-span-2" : "",
        highlighted ? "border-transparent bg-brand-tint ring-2 ring-brand/30" : "border-slate-200",
      ]
        .filter(Boolean)
        .join(" ")
    : highlighted
      ? "py-3 md:py-4 border-t border-slate-100 first:border-t-0 -mx-3 px-3 rounded-xl bg-brand-tint ring-2 ring-brand/30"
      : "py-3 md:py-4 border-t border-slate-100 first:border-t-0"

  return (
    <div className={containerClass}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left md:cursor-default"
        aria-expanded={accordionOpen}
      >
        <p
          className={
            highlighted
              ? "text-sm font-bold text-brand uppercase tracking-wider shrink-0"
              : "text-sm font-semibold text-slate-400 uppercase tracking-wider shrink-0"
          }
        >
          {label}
          {highlighted && <span className="ml-1.5 normal-case font-medium text-brand/70">· {priorityLabel}</span>}
        </p>
        {!verified && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {rm.estimateBadge}
          </span>
        )}
        {note && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
            <AlertTriangle className="h-2.5 w-2.5" />
            {rm.policyChip}
          </span>
        )}
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-slate-300 transition-transform md:hidden",
            accordionOpen ? "rotate-180" : ""
          )}
        />
      </button>

      <div
        className={cn(
          "mt-1 text-base text-slate-700 leading-relaxed",
          accordionOpen ? "" : "hidden md:block"
        )}
      >
        {children}
      </div>

      {note && !compact && (
        <p
          className={cn(
            "mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100",
            accordionOpen ? "" : "hidden md:flex"
          )}
        >
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{note}</span>
        </p>
      )}

      {!compact && (
        <p
          className={cn(
            "mt-1.5 text-[11px] text-slate-400",
            accordionOpen ? "" : "hidden md:block"
          )}
        >
          {verified && meta.source_name ? (
            <>
              {meta.source_url ? (
                <a
                  href={meta.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 hover:text-slate-600 underline underline-offset-2"
                >
                  {rm.verifiedFmt
                    .replace("{source}", meta.source_name)
                    .replace("{date}", meta.last_verified ?? "")}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                rm.verifiedFmt
                  .replace("{source}", meta.source_name)
                  .replace("{date}", meta.last_verified ?? "")
              )}
              <span className="mx-1.5">·</span>
            </>
          ) : (
            meta.source_name && (
              <>
                {meta.source_url ? (
                  <a
                    href={meta.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 hover:text-slate-600 underline underline-offset-2"
                  >
                    {rm.sourcePrefix}: {meta.source_name}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  `${rm.sourcePrefix}: ${meta.source_name}`
                )}
                <span className="mx-1.5">·</span>
              </>
            )
          )}
          <Link href="/methodology" className="hover:text-slate-600 underline underline-offset-2">
            {rm.methodology}
          </Link>
        </p>
      )}
    </div>
  )
}

function LayerTabs({
  activeLayer,
  layerLabels,
  onSelect,
  className,
}: {
  activeLayer: LayerKey | null
  layerLabels: Record<LayerKey, string>
  onSelect: (key: LayerKey) => void
  className?: string
}) {
  return (
    <div className={cn("sticky top-10 md:top-14 z-40 bg-white border-b border-slate-200 overflow-x-auto no-scrollbar", className)}>
      <div className="flex gap-1 px-4">
        {LAYER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={cn(
              "shrink-0 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors",
              activeLayer === key
                ? "border-brand text-brand"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            {layerLabels[key]}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ResultCard({
  row,
  pr = null,
  priorityLayers = [],
  layout = "list",
}: {
  row: MajorRow
  pr?: PrPathway | null
  priorityLayers?: string[]
  layout?: "list" | "grid"
}) {
  const t = useTranslations()
  const rm = t.degreeRisk.resultMeta
  const rr = t.degreeRisk.result
  const tl = t.degreeRisk.timeline
  const opts = t.degreeRisk.options as Record<string, string>
  const locale = useLocale()

  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [expandedLayers, setExpandedLayers] = useState<Set<LayerKey>>(new Set())
  const [activeTab, setActiveTab] = useState<LayerKey | null>(null)
  const layerRefs = useRef<Record<LayerKey, HTMLDivElement | null>>({} as Record<LayerKey, HTMLDivElement | null>)

  const flag = COUNTRY_META[row.country].flag
  const countryName = rr.countries[row.country]
  const majorName = opts[row.slug] ?? majorLabel(row.slug)
  const hot = (layer: LayerKey) => priorityLayers.includes(layer)
  const meta = (layer: LayerKey) => layerMeta(row, layer)
  const note = (layer: LayerKey) => layerNoteText(meta(layer), locale)
  const grid = layout === "grid"
  const compact = layout === "list"
  const detailHref = `/degree-risk/result?major=${row.slug}&view=${row.country}`

  const toggleLayer = useCallback((key: LayerKey) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const scrollToLayer = useCallback((key: LayerKey) => {
    const el = layerRefs.current[key]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setExpandedLayers((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])

  useEffect(() => {
    if (!grid) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-layer-key") as LayerKey | null
            if (key) setActiveTab(key)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )
    for (const key of LAYER_KEYS) {
      const el = layerRefs.current[key]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [grid])

  const layerLabels: Record<LayerKey, string> = {
    employment: rr.layerEmployment,
    visa: rr.layerVisa,
    demand: rr.layerDemand,
    ai_exposure: rr.layerAi,
    roi: rr.layerRoi,
    debt: rr.layerDebt,
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-7">
      {/* Tab bar — mobile only */}
      {grid && (
        <div className="-mx-4 md:-mx-7 mb-4 md:hidden">
          <LayerTabs activeLayer={activeTab} layerLabels={layerLabels} onSelect={scrollToLayer} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">
            {flag} {countryName}
          </p>
          <h2 className="mt-0.5 font-display text-xl md:text-2xl font-semibold text-slate-900 tracking-tight truncate">
            {majorName}
          </h2>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border-2 text-xs md:text-sm font-bold ${RISK_BADGE[row.overall_risk].className}`}
        >
          {rr.risk[row.overall_risk]}
        </span>
      </div>

      {/* Summary */}
      {row.overall_risk === "high" && (
        <p className="mt-3 md:mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
          {rr.highRiskFraming}
        </p>
      )}
      <div className={`${row.overall_risk === "high" ? "mt-1" : "mt-3 md:mt-4"}`}>
        <p
          className={cn(
            "text-body-lg text-slate-600",
            summaryExpanded ? "" : "line-clamp-2 md:line-clamp-none"
          )}
        >
          {riskSummaryText(row, locale)}
        </p>
        <button
          type="button"
          onClick={() => setSummaryExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 md:hidden"
        >
          {summaryExpanded ? "Show less" : "Read more"}
        </button>
      </div>

      {/* Immigration path */}
      {compact ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{tl.heading}</p>
            {note("visa") && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <AlertTriangle className="h-2.5 w-2.5" />
                {rm.policyChip}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-slate-700">
            {fill(rr.compactVisaPr, {
              n: <strong className="text-slate-900">{row.post_study_work_years}</strong>,
              pr: <strong className="text-slate-900">{tl.prShort[row.country]}</strong>,
            })}
          </p>
          <Link
            href={detailHref}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {rr.seeFullPath}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="mt-4 md:mt-5">
          <ImmigrationTimeline
            country={row.country}
            postStudyYears={row.post_study_work_years}
            visa={meta("visa")}
            pr={pr}
          />
        </div>
      )}

      {/* Six layers */}
      <div className={grid ? "mt-4 md:mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" : "mt-4 md:mt-5"}>
        {LAYER_KEYS.map((key) => (
          <div key={key} ref={(el) => { layerRefs.current[key] = el }} data-layer-key={key}>
            <LayerRow
              label={layerLabels[key]}
              rm={rm}
              priorityLabel={rr.priority}
              meta={meta(key)}
              note={note(key)}
              highlighted={hot(key)}
              cell={grid}
              compact={compact}
              accordionOpen={grid ? expandedLayers.has(key) : true}
              onToggle={grid ? () => toggleLayer(key) : undefined}
            >
              {key === "employment" && (
                <>{fill(rr.employmentValue, { rate: <strong>{row.employment_rate}%</strong> })}</>
              )}
              {key === "visa" && (
                <>
                  {row.occupation_list_match ? rr.visaOnList : rr.visaOffList}
                  {" · "}
                  {fill(rr.visaYears, { n: <strong>{row.post_study_work_years}</strong> })}
                </>
              )}
              {key === "demand" && (
                <span className="flex items-center gap-2.5">
                  <strong>{row.market_demand_score}</strong>/100
                  <span className="flex-1 max-w-[10rem] h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-brand"
                      style={{ width: `${Math.min(Math.max(row.market_demand_score, 0), 100)}%` }}
                    />
                  </span>
                </span>
              )}
              {key === "ai_exposure" && (
                <>
                  <strong className="capitalize">{row.ai_exposure_band}</strong>
                  {(() => {
                    const aiNote = aiNoteText(row, locale)
                    return aiNote && <> — {aiNote}</>
                  })()}
                </>
              )}
              {key === "roi" && (
                <>
                  {fill(rr.roiValue, {
                    tuition: formatMoney(row.avg_annual_tuition_intl, row.country),
                    salary: formatMoney(row.median_starting_salary, row.country),
                    payback: <strong>{row.payback_years}</strong>,
                  })}
                  {row.earnings_p25 && row.earnings_p75 && (
                    <p className="mt-1 text-sm text-slate-500">
                      {fill(rr.roiIncomeRange, {
                        range: <strong>{formatMoney(row.earnings_p25, row.country)} – {formatMoney(row.earnings_p75, row.country)}</strong>,
                      })}
                    </p>
                  )}
                </>
              )}
              {key === "debt" && (
                <>
                  {row.median_debt ? (
                    fill(rr.debtValue, {
                      debt: <strong>{formatMoney(row.median_debt, row.country)}</strong>,
                      note: row.median_debt < 25000 ? "Below national average" : row.median_debt > 40000 ? "Above national average" : "Near national average",
                    })
                  ) : (
                    "Data not available"
                  )}
                </>
              )}
            </LayerRow>
          </div>
        ))}
      </div>
    </div>
  )
}
