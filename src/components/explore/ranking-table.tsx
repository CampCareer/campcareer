"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/degree-risk"

export type ExploreRow = {
  href: string
  name: string
  flag?: string
  risk: RiskLevel
  riskLabel: string
  riskClass: string
  riskRank: number
  employment: number
  employmentText: string
  visaText: string
  pswYears: number
  demand: number
  demandText: string
  ai: "low" | "medium" | "high"
  aiText: string
  aiRank: number
  payback: number
  paybackText: string
  est: { employment: boolean; visa: boolean; demand: boolean; ai: boolean; roi: boolean }
}

export type RankingLabels = {
  nameHeader: string
  risk: string
  employment: string
  visa: string
  demand: string
  ai: string
  roi: string
  estimate: string
  view: string
  sortHint: string
}

type SortKey = "fit" | "risk" | "employment" | "visa" | "demand" | "ai" | "roi"

const sorters: Record<Exclude<SortKey, "fit">, (a: ExploreRow, b: ExploreRow) => number> = {
  risk: (a, b) => a.riskRank - b.riskRank || b.employment - a.employment,
  employment: (a, b) => b.employment - a.employment,
  visa: (a, b) => b.pswYears - a.pswYears,
  demand: (a, b) => b.demand - a.demand,
  ai: (a, b) => a.aiRank - b.aiRank || b.employment - a.employment,
  roi: (a, b) => a.payback - b.payback,
}

export function RankingTable({ rows, labels }: { rows: ExploreRow[]; labels: RankingLabels }) {
  const [sort, setSort] = useState<SortKey>("fit")
  const sorted = sort === "fit" ? rows : [...rows].sort(sorters[sort])

  const cols: { key: SortKey; label: string; estKey?: keyof ExploreRow["est"] }[] = [
    { key: "risk", label: labels.risk },
    { key: "employment", label: labels.employment, estKey: "employment" },
    { key: "visa", label: labels.visa, estKey: "visa" },
    { key: "demand", label: labels.demand, estKey: "demand" },
    { key: "ai", label: labels.ai, estKey: "ai" },
    { key: "roi", label: labels.roi, estKey: "roi" },
  ]

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
        <ArrowUpDown className="h-3 w-3" />
        {labels.sortHint}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {labels.nameHeader}
                </th>
                {cols.map((c) => {
                  const active = sort === c.key
                  return (
                    <th key={c.key} className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSort(c.key)}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                          active ? "text-brand" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {c.label}
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      </button>
                    </th>
                  )
                })}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((r) => (
                <tr key={r.href} className="group hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={r.href} className="flex items-center gap-2 font-medium text-slate-800 group-hover:text-blue-600">
                      {r.flag && <span className="shrink-0">{r.flag}</span>}
                      <span className="truncate">{r.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={cn("inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold", r.riskClass)}>
                      {r.riskLabel}
                    </span>
                  </td>
                  <Cell text={r.employmentText} est={r.est.employment} estLabel={labels.estimate} />
                  <Cell text={r.visaText} est={r.est.visa} estLabel={labels.estimate} />
                  <Cell text={r.demandText} est={r.est.demand} estLabel={labels.estimate} />
                  <Cell text={r.aiText} est={r.est.ai} estLabel={labels.estimate} />
                  <Cell text={r.paybackText} est={r.est.roi} estLabel={labels.estimate} />
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={r.href}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={labels.view}
                    >
                      {labels.view}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Cell({ text, est, estLabel }: { text: string; est: boolean; estLabel: string }) {
  return (
    <td className="whitespace-nowrap px-3 py-3 text-right text-slate-700">
      <span className="inline-flex items-center justify-end gap-1.5">
        {text}
        {est && (
          <span
            title={estLabel}
            className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500"
          >
            <AlertTriangle className="h-2.5 w-2.5" />
          </span>
        )}
      </span>
    </td>
  )
}
