"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown } from "lucide-react"

type NlOccRow = {
  sbc_code: string
  occupation_en: string
  occupation_nl: string
  median_salary_eur: number | null
  shortage_rating: number | null
  related_broad_field: string | null
}

type SortKey = "alpha" | "salary" | "shortage"

export function NlJobsClient({ occupations }: { occupations: NlOccRow[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("shortage")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const base = q
      ? occupations.filter(
          (o) =>
            o.occupation_en.toLowerCase().includes(q) ||
            o.occupation_nl.toLowerCase().includes(q),
        )
      : [...occupations]

    if (sort === "salary") {
      return [...base].sort((a, b) => (b.median_salary_eur ?? 0) - (a.median_salary_eur ?? 0))
    } else if (sort === "shortage") {
      return [...base].sort((a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0))
    }
    return [...base].sort((a, b) => a.occupation_en.localeCompare(b.occupation_en))
  }, [occupations, query, sort])

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search occupations (EN or NL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-4 shrink-0 text-slate-400" />
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">Sort</span>
          {(["shortage", "salary", "alpha"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                sort === key
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand/40"
              }`}
            >
              {key === "alpha" ? "A–Z" : key === "salary" ? "Salary" : "Shortage"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Occupation</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 hidden sm:table-cell">Field</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-500">Median Salary</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-500">Shortage</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((occ) => (
              <tr
                key={occ.sbc_code}
                className="border-t border-slate-100 transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/roi-explorer/nl/occupation/${occ.sbc_code}`}
                    className="font-medium text-foreground transition-colors hover:text-brand"
                  >
                    {occ.occupation_en}
                  </Link>
                  <span className="ml-1.5 text-xs text-slate-400">{occ.occupation_nl}</span>
                  <span className="ml-2 hidden text-xs text-slate-300 sm:inline">SBC {occ.sbc_code}</span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-slate-500 sm:table-cell">
                  {occ.related_broad_field ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">
                  {occ.median_salary_eur != null ? `€${occ.median_salary_eur.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {occ.shortage_rating != null ? (
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        occ.shortage_rating >= 4
                          ? "bg-red-100 text-red-700"
                          : occ.shortage_rating >= 3
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {occ.shortage_rating}/5
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Showing {filtered.length} of {occupations.length} occupations · CBS/SBC classification
      </p>
    </>
  )
}
