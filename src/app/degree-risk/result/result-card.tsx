import Link from "next/link"
import { ExternalLink, AlertTriangle } from "lucide-react"
import {
  type MajorRow,
  type LayerKey,
  type LayerMeta,
  COUNTRY_META,
  RISK_BADGE,
  formatMoney,
  layerMeta,
  layerNoteText,
  majorLabel,
} from "@/lib/degree-risk"
import { getTranslations, getLocale } from "@/lib/i18n/server"

type ResultMeta = ReturnType<typeof getTranslations>["degreeRisk"]["resultMeta"]

function LayerRow({
  label,
  meta,
  note,
  rm,
  highlighted = false,
  children,
}: {
  label: string
  meta: LayerMeta
  note: string | null
  rm: ResultMeta
  highlighted?: boolean
  children: React.ReactNode
}) {
  const verified = meta.confidence === "verified"
  return (
    <div
      className={
        highlighted
          ? "py-4 border-t border-slate-100 first:border-t-0 -mx-3 px-3 rounded-xl bg-brand-tint ring-2 ring-brand/30"
          : "py-4 border-t border-slate-100 first:border-t-0"
      }
    >
      <div className="flex items-center gap-2">
        <p
          className={
            highlighted
              ? "text-sm font-bold text-brand uppercase tracking-wider shrink-0"
              : "text-sm font-semibold text-slate-400 uppercase tracking-wider shrink-0"
          }
        >
          {label}
          {highlighted && <span className="ml-1.5 normal-case font-medium text-brand/70">· your priority</span>}
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

      {note && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{note}</span>
        </p>
      )}

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
    </div>
  )
}

export function ResultCard({
  row,
  priorityLayers = [],
}: {
  row: MajorRow
  priorityLayers?: string[]
}) {
  const country = COUNTRY_META[row.country]
  const badge = RISK_BADGE[row.overall_risk]
  const rm = getTranslations().degreeRisk.resultMeta
  const locale = getLocale()
  const hot = (layer: LayerKey) => priorityLayers.includes(layer)
  const meta = (layer: LayerKey) => layerMeta(row, layer)
  const note = (layer: LayerKey) => layerNoteText(meta(layer), locale)

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">
            {country.flag} {country.name}
          </p>
          <h2 className="mt-0.5 font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            {majorLabel(row.slug)}
          </h2>
        </div>
        <span
          className={`inline-block shrink-0 px-3 py-1.5 rounded-full border-2 text-sm font-bold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Summary — high-risk majors get cost/conditions framing, never "don't study X" */}
      {row.overall_risk === "high" && (
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
          What this path costs — and when it works
        </p>
      )}
      <p className={`${row.overall_risk === "high" ? "mt-1" : "mt-4"} text-body-lg text-slate-600`}>
        {row.risk_summary}
      </p>

      {/* Five layers */}
      <div className="mt-5">
        <LayerRow label="Employment" rm={rm} meta={meta("employment")} note={note("employment")} highlighted={hot("employment")}>
          <strong>{row.employment_rate}%</strong> of recent graduates in full-time work
        </LayerRow>

        <LayerRow label="Visa pathway" rm={rm} meta={meta("visa")} note={note("visa")} highlighted={hot("visa")}>
          {row.occupation_list_match
            ? "On the skilled occupation list"
            : "Not on the skilled occupation list"}
          {" · "}
          <strong>{row.post_study_work_years}</strong>{" "}
          {row.post_study_work_years === 1 ? "year" : "years"} post-study work visa
        </LayerRow>

        <LayerRow label="Market demand" rm={rm} meta={meta("demand")} note={note("demand")} highlighted={hot("demand")}>
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

        <LayerRow label="AI exposure" rm={rm} meta={meta("ai_exposure")} note={note("ai_exposure")} highlighted={hot("ai_exposure")}>
          <strong className="capitalize">{row.ai_exposure_band}</strong>
          {row.ai_note && <> — {row.ai_note}</>}
        </LayerRow>

        <LayerRow label="ROI" rm={rm} meta={meta("roi")} note={note("roi")} highlighted={hot("roi")}>
          {formatMoney(row.avg_annual_tuition_intl, row.country)} tuition ·{" "}
          {formatMoney(row.median_starting_salary, row.country)} median starting salary ·{" "}
          <strong>{row.payback_years}</strong>{" "}
          {row.payback_years === 1 ? "year" : "years"} payback
        </LayerRow>
      </div>
    </div>
  )
}
