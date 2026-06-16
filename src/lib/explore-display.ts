import "server-only"
import {
  type MajorRow,
  type LayerKey,
  COUNTRY_META,
  RISK_BADGE,
  layerMeta,
  majorLabel,
} from "@/lib/degree-risk"
import { getTranslations } from "@/lib/i18n/server"
import type { ExploreRow } from "@/components/explore/ranking-table"

const RISK_RANK = { low: 0, medium: 1, high: 2 } as const
const AI_RANK = { low: 0, medium: 1, high: 2 } as const

function aiBand(band: string): "low" | "medium" | "high" {
  return band === "low" || band === "high" ? band : "medium"
}

// Build serializable display rows for the client ranking table. `nameMode`
// decides what the first column shows: countries (one major across countries)
// or majors (one country's majors).
export function toExploreRows(rows: MajorRow[], nameMode: "country" | "major"): ExploreRow[] {
  const t = getTranslations()
  const rr = t.degreeRisk.result
  const ex = t.explore
  const opts = t.degreeRisk.options as Record<string, string>
  const est = (row: MajorRow, layer: LayerKey) => layerMeta(row, layer).confidence !== "verified"
  const ai = (b: string) => (b === "low" ? ex.aiLow : b === "high" ? ex.aiHigh : ex.aiMedium)

  return rows.map((row) => {
    const band = aiBand(row.ai_exposure_band)
    return {
      href: `/degree-risk/result?major=${row.slug}&view=${row.country}`,
      name: nameMode === "country" ? rr.countries[row.country] : opts[row.slug] ?? majorLabel(row.slug),
      flag: nameMode === "country" ? COUNTRY_META[row.country].flag : undefined,
      risk: row.overall_risk,
      riskLabel: rr.risk[row.overall_risk],
      riskClass: RISK_BADGE[row.overall_risk].className,
      riskRank: RISK_RANK[row.overall_risk],
      employment: row.employment_rate,
      employmentText: ex.empFmt.replace("{n}", String(row.employment_rate)),
      visaText: ex.visaFmt.replace("{n}", String(row.post_study_work_years)),
      pswYears: row.post_study_work_years,
      demand: row.market_demand_score,
      demandText: String(row.market_demand_score),
      ai: band,
      aiText: ai(band),
      aiRank: AI_RANK[band],
      payback: row.payback_years,
      paybackText: ex.paybackFmt.replace("{n}", String(row.payback_years)),
      est: {
        employment: est(row, "employment"),
        visa: est(row, "visa"),
        demand: est(row, "demand"),
        ai: est(row, "ai_exposure"),
        roi: est(row, "roi"),
      },
    }
  })
}
