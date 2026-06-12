import Link from "next/link"
import { ExternalLink } from "lucide-react"
import {
  type MajorRow,
  type MajorSource,
  COUNTRY_META,
  LAYER_SOURCE_KEYWORDS,
  RISK_BADGE,
  findSource,
  formatMoney,
  majorLabel,
} from "@/lib/degree-risk"

function LayerRow({
  label,
  source,
  children,
}: {
  label: string
  source: MajorSource | null
  children: React.ReactNode
}) {
  return (
    <div className="py-3.5 border-t border-slate-100 first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider shrink-0">
          {label}
        </p>
      </div>
      <div className="mt-1 text-sm text-slate-700 leading-relaxed">{children}</div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        {source && (
          <>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 hover:text-slate-600 underline underline-offset-2"
            >
              {source.name}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="mx-1.5">·</span>
          </>
        )}
        <Link href="/methodology" className="hover:text-slate-600 underline underline-offset-2">
          Data: estimate — methodology
        </Link>
      </p>
    </div>
  )
}

export function ResultCard({ row }: { row: MajorRow }) {
  const country = COUNTRY_META[row.country]
  const badge = RISK_BADGE[row.overall_risk]

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">
            {country.flag} {country.name}
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
            {majorLabel(row.slug)}
          </h2>
        </div>
        <span
          className={`inline-block shrink-0 px-2.5 py-1 rounded-full border text-xs font-bold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Summary — high-risk majors get cost/conditions framing, never "don't study X" */}
      {row.overall_risk === "high" && (
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          What this path costs — and when it works
        </p>
      )}
      <p className={`${row.overall_risk === "high" ? "mt-1" : "mt-4"} text-sm text-slate-600 leading-relaxed`}>
        {row.risk_summary}
      </p>

      {/* Five layers */}
      <div className="mt-5">
        <LayerRow
          label="Employment"
          source={findSource(row.sources, LAYER_SOURCE_KEYWORDS.employment)}
        >
          <strong>{row.employment_rate}%</strong> of recent graduates in full-time work
        </LayerRow>

        <LayerRow label="Visa pathway" source={findSource(row.sources, LAYER_SOURCE_KEYWORDS.visa)}>
          {row.occupation_list_match
            ? "On the skilled occupation list"
            : "Not on the skilled occupation list"}
          {" · "}
          <strong>{row.post_study_work_years}</strong>{" "}
          {row.post_study_work_years === 1 ? "year" : "years"} post-study work visa
        </LayerRow>

        <LayerRow
          label="Market demand"
          source={findSource(row.sources, LAYER_SOURCE_KEYWORDS.demand)}
        >
          <span className="flex items-center gap-2.5">
            <strong>{row.market_demand_score}</strong>/100
            <span className="flex-1 max-w-[10rem] h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <span
                className="block h-full rounded-full bg-indigo-500"
                style={{ width: `${Math.min(Math.max(row.market_demand_score, 0), 100)}%` }}
              />
            </span>
          </span>
        </LayerRow>

        <LayerRow label="AI exposure" source={findSource(row.sources, LAYER_SOURCE_KEYWORDS.ai)}>
          <strong className="capitalize">{row.ai_exposure_band}</strong>
          {row.ai_note && <> — {row.ai_note}</>}
        </LayerRow>

        <LayerRow label="ROI" source={findSource(row.sources, LAYER_SOURCE_KEYWORDS.roi)}>
          {formatMoney(row.tuition, row.country)} tuition ·{" "}
          {formatMoney(row.median_starting_salary, row.country)} median starting salary ·{" "}
          <strong>{row.payback_years}</strong>{" "}
          {row.payback_years === 1 ? "year" : "years"} payback
        </LayerRow>
      </div>
    </div>
  )
}
