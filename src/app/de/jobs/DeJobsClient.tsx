"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown } from "lucide-react"

type DeOccRow = {
  kldb_code: string
  occupation_en: string
  median_salary_eur: number | null
  shortage_rating: number | null
}

type SortKey = "alpha" | "salary" | "shortage"

export function DeJobsClient({ occupations }: { occupations: DeOccRow[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("alpha")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const base = q
      ? occupations.filter((o) => o.occupation_en.toLowerCase().includes(q))
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
            placeholder="Search occupations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide shrink-0">Sort</span>
          {(["alpha", "salary", "shortage"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                sort === key
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-slate-600 border-slate-200 hover:border-brand/40"
              }`}
            >
              {key === "alpha" ? "A–Z" : key === "salary" ? "Salary" : "Shortage"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-500">Occupation</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-500">Median Salary</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-500">Shortage</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((occ) => (
              <tr key={occ.kldb_code} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/roi-explorer/de/occupation/${occ.kldb_code}`}
                    className="font-medium text-foreground hover:text-brand transition-colors"
                  >
                    {occ.occupation_en}
                  </Link>
                  <span className="ml-2 text-xs text-slate-400">KldB {occ.kldb_code}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">
                  {occ.median_salary_eur != null ? `€${occ.median_salary_eur.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {occ.shortage_rating != null ? (
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      occ.shortage_rating >= 4 ? "bg-red-100 text-red-700" :
                      occ.shortage_rating >= 3 ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
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

      <p className="mt-4 text-xs text-slate-400 text-center">
        Showing {filtered.length} of {occupations.length} occupations
      </p>
    </>
  )
}
