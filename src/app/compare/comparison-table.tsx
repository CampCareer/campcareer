import Link from "next/link"
import { Fragment } from "react"
import { ExternalLink, AlertTriangle, ArrowUp } from "lucide-react"
import {
  type MajorRow,
  type CountryCode,
  type LayerKey,
  type LayerMeta,
  LAYERS,
  COUNTRY_META,
  RISK_BADGE,
  formatMoney,
  layerMeta,
  layerNoteText,
  aiNoteText,
} from "@/lib/degree-risk"
import { getTranslations, getLocale } from "@/lib/i18n/server"

type ResultStrings = ReturnType<typeof getTranslations>["degreeRisk"]["result"]
type MetaStrings = ReturnType<typeof getTranslations>["degreeRisk"]["resultMeta"]
type CompareStrings = ReturnType<typeof getTranslations>["compare"]

// Interpolate a "{key}" template with React nodes (keeps emphasized numbers).
function fill(template: string, values: Record<string, React.ReactNode>): React.ReactNode {
  return template.split(/(\{[a-z_]+\})/g).map((part, i) => {
    const m = part.match(/^\{([a-z_]+)\}$/)
    return <Fragment key={i}>{m ? values[m[1]] ?? part : part}</Fragment>
  })
}

// ── Numeric edge ─────────────────────────────────────────────────────────────
// Only the three quantitative layers get a head-to-head edge. "Better" is a
// purely mechanical comparison: higher employment / higher demand / shorter
// payback. Qualitative layers (visa, AI exposure) never show an edge.
const NUMERIC: Partial<Record<LayerKey, { value: (r: MajorRow) => number; lowerBetter?: boolean }>> = {
  employment: { value: (r) => r.employment_rate },
  demand: { value: (r) => r.market_demand_score },
  roi: { value: (r) => r.payback_years, lowerBetter: true },
}

function edgeOf(layer: LayerKey, a: MajorRow | null, b: MajorRow | null): { a: boolean; b: boolean } {
  const cfg = NUMERIC[layer]
  if (!cfg || !a || !b) return { a: false, b: false }
  const va = cfg.value(a)
  const vb = cfg.value(b)
  if (va === vb) return { a: false, b: false }
  const aWins = cfg.lowerBetter ? va < vb : va > vb
  return { a: aWins, b: !aWins }
}

// ── Cell value renderers (mirror the result card, compact) ───────────────────
function layerValue(
  layer: LayerKey,
  row: MajorRow,
  edge: boolean,
  rr: ResultStrings,
  locale: ReturnType<typeof getLocale>
): React.ReactNode {
  const strong = (node: React.ReactNode) => (
    <strong className={edge ? "text-slate-900 font-bold" : "font-semibold text-slate-800"}>{node}</strong>
  )
  switch (layer) {
    case "employment":
      return fill(rr.employmentValue, { rate: strong(`${row.employment_rate}%`) })
    case "visa":
      return (
        <>
          {row.occupation_list_match ? rr.visaOnList : rr.visaOffList}
          <span className="mx-1 text-slate-300">·</span>
          {fill(rr.visaYears, { n: <strong className="font-semibold text-slate-800">{row.post_study_work_years}</strong> })}
        </>
      )
    case "demand":
      return (
        <span className="flex items-center gap-2.5">
          {strong(row.market_demand_score)}<span className="text-slate-400">/100</span>
          <span className="flex-1 max-w-[8rem] h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <span
              className="block h-full rounded-full bg-brand"
              style={{ width: `${Math.min(Math.max(row.market_demand_score, 0), 100)}%` }}
            />
          </span>
        </span>
      )
    case "ai_exposure": {
      const aiNote = aiNoteText(row, locale)
      return (
        <>
          <strong className="font-semibold capitalize text-slate-800">{row.ai_exposure_band}</strong>
          {aiNote && <span className="text-slate-600"> — {aiNote}</span>}
        </>
      )
    }
    case "roi":
      return fill(rr.roiValue, {
        tuition: formatMoney(row.avg_annual_tuition_intl, row.country),
        salary: formatMoney(row.median_starting_salary, row.country),
        payback: strong(row.payback_years),
      })
  }
}

function CellMeta({ meta, note, rm }: { meta: LayerMeta; note: string | null; rm: MetaStrings }) {
  const verified = meta.confidence === "verified"
  return (
    <>
      {note && (
        <span className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-800 ring-1 ring-amber-100">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{note}</span>
        </span>
      )}
      <span className="mt-1.5 block text-[10px] text-slate-400">
        {verified && meta.source_name ? (
          meta.source_url ? (
            <a
              href={meta.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-slate-600"
            >
              {rm.verifiedFmt.replace("{source}", meta.source_name).replace("{date}", meta.last_verified ?? "")}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ) : (
            rm.verifiedFmt.replace("{source}", meta.source_name).replace("{date}", meta.last_verified ?? "")
          )
        ) : meta.source_name ? (
          meta.source_url ? (
            <a
              href={meta.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-slate-600"
            >
              {rm.sourcePrefix}: {meta.source_name}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ) : (
            `${rm.sourcePrefix}: ${meta.source_name}`
          )
        ) : (
          <Link href="/methodology" className="underline underline-offset-2 hover:text-slate-600">
            {rm.methodology}
          </Link>
        )}
      </span>
    </>
  )
}

function CountryHeader({ row, country, rr }: { row: MajorRow | null; country: CountryCode; rr: ResultStrings }) {
  const cm = COUNTRY_META[country]
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{cm.flag}</span>
        <span className="font-semibold text-slate-800 text-sm truncate">{rr.countries[country]}</span>
      </div>
      <div className="mt-2">
        {row ? (
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${RISK_BADGE[row.overall_risk].className}`}
          >
            {rr.risk[row.overall_risk]}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">—</span>
        )}
      </div>
    </div>
  )
}

function LayerCell({
  layer,
  row,
  edge,
  rr,
  rm,
  tc,
  locale,
}: {
  layer: LayerKey
  row: MajorRow | null
  edge: boolean
  rr: ResultStrings
  rm: MetaStrings
  tc: CompareStrings
  locale: ReturnType<typeof getLocale>
}) {
  if (!row) {
    return <div className="px-4 py-3 text-sm text-slate-400">{tc.notScoredTitle}</div>
  }
  const meta = layerMeta(row, layer)
  const note = layerNoteText(meta, locale)
  const verified = meta.confidence === "verified"
  return (
    <div className={`px-4 py-3 ${edge ? "bg-brand-tint/40" : ""}`}>
      <div className="flex items-start gap-1.5">
        <div className="flex-1 text-sm leading-relaxed text-slate-700">{layerValue(layer, row, edge, rr, locale)}</div>
        {edge && (
          <span
            title={tc.edgeBetter}
            className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-brand/10 px-1.5 py-0.5 text-brand"
          >
            <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
            <span className="sr-only">{tc.edgeBetter}</span>
          </span>
        )}
        {!verified && (
          <span className="mt-0.5 shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            {rm.estimateBadge}
          </span>
        )}
      </div>
      <CellMeta meta={meta} note={note} rm={rm} />
    </div>
  )
}

export function ComparisonTable({
  a,
  b,
  rowA,
  rowB,
}: {
  a: CountryCode
  b: CountryCode
  rowA: MajorRow | null
  rowB: MajorRow | null
}) {
  const t = getTranslations()
  const rr = t.degreeRisk.result
  const rm = t.degreeRisk.resultMeta
  const tc = t.compare
  const locale = getLocale()

  const LAYER_LABEL: Record<LayerKey, string> = {
    employment: rr.layerEmployment,
    visa: rr.layerVisa,
    demand: rr.layerDemand,
    ai_exposure: rr.layerAi,
    roi: rr.layerRoi,
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Country header row */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/60">
        <CountryHeader row={rowA} country={a} rr={rr} />
        <CountryHeader row={rowB} country={b} rr={rr} />
      </div>

      {/* One block per layer: full-width label, then the two aligned cells */}
      {LAYERS.map((layer) => {
        const edge = edgeOf(layer, rowA, rowB)
        return (
          <div key={layer} className="border-b border-slate-100 last:border-b-0">
            <div className="px-4 pt-3 pb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {LAYER_LABEL[layer]}
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-100">
              <LayerCell layer={layer} row={rowA} edge={edge.a} rr={rr} rm={rm} tc={tc} locale={locale} />
              <LayerCell layer={layer} row={rowB} edge={edge.b} rr={rr} rm={rm} tc={tc} locale={locale} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
