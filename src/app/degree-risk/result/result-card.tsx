import Link from "next/link"
import { Fragment } from "react"
import { ExternalLink, AlertTriangle, ArrowRight } from "lucide-react"
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
import { getTranslations, getLocale } from "@/lib/i18n/server"
import { ImmigrationTimeline } from "@/components/immigration-timeline"

type ResultMeta = ReturnType<typeof getTranslations>["degreeRisk"]["resultMeta"]

// Interpolate a "{key}" template with React nodes (keeps emphasized numbers).
function fill(template: string, values: Record<string, React.ReactNode>): React.ReactNode {
  return template.split(/(\{[a-z_]+\})/g).map((part, i) => {
    const m = part.match(/^\{([a-z_]+)\}$/)
    return <Fragment key={i}>{m ? values[m[1]] ?? part : part}</Fragment>
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
  children,
}: {
  label: string
  meta: LayerMeta
  note: string | null
  rm: ResultMeta
  priorityLabel: string
  highlighted?: boolean
  // `cell` renders the layer as a self-contained bordered cell (for the 2-col
  // grid layout); the default keeps the flat top-divider list rows.
  cell?: boolean
  spanFull?: boolean
  // `compact` drops the per-layer note box and source/methodology footer (used
  // in the multi-country compare grid, where the single-country view holds the
  // full provenance). The estimate badge and small policy chip are kept.
  compact?: boolean
  children: React.ReactNode
}) {
  const verified = meta.confidence === "verified"
  const containerClass = cell
    ? [
        "rounded-xl border p-4",
        spanFull ? "md:col-span-2" : "",
        highlighted ? "border-transparent bg-brand-tint ring-2 ring-brand/30" : "border-slate-200",
      ]
        .filter(Boolean)
        .join(" ")
    : highlighted
      ? "py-4 border-t border-slate-100 first:border-t-0 -mx-3 px-3 rounded-xl bg-brand-tint ring-2 ring-brand/30"
      : "py-4 border-t border-slate-100 first:border-t-0"
  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2">
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
      </div>

      <div className="mt-1 text-base text-slate-700 leading-relaxed">{children}</div>

      {note && !compact && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{note}</span>
        </p>
      )}

      {!compact && (
      <p className="mt-1.5 text-[11px] text-slate-400">
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

export function ResultCard({
  row,
  pr = null,
  priorityLayers = [],
  layout = "list",
}: {
  row: MajorRow
  pr?: PrPathway | null
  priorityLayers?: string[]
  // "grid" lays the five layers out in a 2-column grid (used for the wide,
  // single-country result); "list" keeps the stacked rows (compare grid).
  layout?: "list" | "grid"
}) {
  const t = getTranslations()
  const rm = t.degreeRisk.resultMeta
  const rr = t.degreeRisk.result
  const tl = t.degreeRisk.timeline
  const opts = t.degreeRisk.options as Record<string, string>
  const locale = getLocale()

  const flag = COUNTRY_META[row.country].flag
  const countryName = rr.countries[row.country]
  const majorName = opts[row.slug] ?? majorLabel(row.slug)
  const hot = (layer: LayerKey) => priorityLayers.includes(layer)
  const meta = (layer: LayerKey) => layerMeta(row, layer)
  const note = (layer: LayerKey) => layerNoteText(meta(layer), locale)
  const grid = layout === "grid"
  // Compare ("all") view: each country card is a scannable summary, so the full
  // timeline (and per-layer source footers) is replaced by a one-line visa→PR
  // recap that links out to this country's single-country result for the full
  // path, sources, and nationality toggle.
  const compact = layout === "list"
  const detailHref = `/degree-risk/result?major=${row.slug}&view=${row.country}`

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">
            {flag} {countryName}
          </p>
          <h2 className="mt-0.5 font-display text-2xl font-semibold text-slate-900 tracking-tight">
            {majorName}
          </h2>
        </div>
        <span
          className={`inline-block shrink-0 px-3 py-1.5 rounded-full border-2 text-sm font-bold ${RISK_BADGE[row.overall_risk].className}`}
        >
          {rr.risk[row.overall_risk]}
        </span>
      </div>

      {/* Summary — high-risk majors get cost/conditions framing, never "don't study X".
          risk_summary / ai_note are English-first DB free-text; ko falls back to the
          English original until risk_summary_ko / ai_note_ko are seeded. */}
      {row.overall_risk === "high" && (
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
          {rr.highRiskFraming}
        </p>
      )}
      <p className={`${row.overall_risk === "high" ? "mt-1" : "mt-4"} text-body-lg text-slate-600`}>
        {riskSummaryText(row, locale)}
      </p>

      {/* Immigration path: full timeline (single view) or a one-line visa→PR
          recap (compare view, where the card stays scannable). */}
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
        <div className="mt-5">
          <ImmigrationTimeline
            country={row.country}
            postStudyYears={row.post_study_work_years}
            visa={meta("visa")}
            pr={pr}
          />
        </div>
      )}

      {/* Five layers — stacked list (compare grid) or 2-col grid (wide single) */}
      <div className={grid ? "mt-5 grid grid-cols-1 md:grid-cols-2 gap-4" : "mt-5"}>
        <LayerRow label={rr.layerEmployment} rm={rm} priorityLabel={rr.priority} meta={meta("employment")} note={note("employment")} highlighted={hot("employment")} cell={grid} compact={compact}>
          {fill(rr.employmentValue, { rate: <strong>{row.employment_rate}%</strong> })}
        </LayerRow>

        <LayerRow label={rr.layerVisa} rm={rm} priorityLabel={rr.priority} meta={meta("visa")} note={note("visa")} highlighted={hot("visa")} cell={grid} compact={compact}>
          {row.occupation_list_match ? rr.visaOnList : rr.visaOffList}
          {" · "}
          {fill(rr.visaYears, { n: <strong>{row.post_study_work_years}</strong> })}
        </LayerRow>

        <LayerRow label={rr.layerDemand} rm={rm} priorityLabel={rr.priority} meta={meta("demand")} note={note("demand")} highlighted={hot("demand")} cell={grid} compact={compact}>
          <span className="flex items-center gap-2.5">
            <strong>{row.market_demand_score}</strong>/100
            <span className="flex-1 max-w-[10rem] h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${Math.min(Math.max(row.market_demand_score, 0), 100)}%` }}
              />
            </span>
          </span>
        </LayerRow>

        <LayerRow label={rr.layerAi} rm={rm} priorityLabel={rr.priority} meta={meta("ai_exposure")} note={note("ai_exposure")} highlighted={hot("ai_exposure")} cell={grid} compact={compact}>
          <strong className="capitalize">{row.ai_exposure_band}</strong>
          {(() => {
            const aiNote = aiNoteText(row, locale)
            return aiNote && <> — {aiNote}</>
          })()}
        </LayerRow>

        <LayerRow label={rr.layerRoi} rm={rm} priorityLabel={rr.priority} meta={meta("roi")} note={note("roi")} highlighted={hot("roi")} cell={grid} spanFull={grid} compact={compact}>
          {fill(rr.roiValue, {
            tuition: formatMoney(row.avg_annual_tuition_intl, row.country),
            salary: formatMoney(row.median_starting_salary, row.country),
            payback: <strong>{row.payback_years}</strong>,
          })}
        </LayerRow>
      </div>
    </div>
  )
}
