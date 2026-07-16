"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown } from "lucide-react"

type OccRow = {
  anzsco_code: string
  occupation_en: string
  median_salary_aud: number | null
  shortage_rating: number | null
}

type SortKey = "alpha" | "salary" | "shortage"

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function AuJobsClient({ occupations }: { occupations: OccRow[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("alpha")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const base = q
      ? occupations.filter((o) => o.occupation_en.toLowerCase().includes(q))
      : [...occupations]

    if (sort === "salary") {
      return [...base].sort((a, b) => (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0))
    } else if (sort === "shortage") {
      return [...base].sort((a, b) => (b.shortage_rating ?? 0) - (a.shortage_rating ?? 0))
    }
    return [...base].sort((a, b) => a.occupation_en.localeCompare(b.occupation_en))
  }, [occupations, query, sort])

  return (
    <>
      {/* Search + filter bar */}
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
          <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm">
            {(
              [
                { key: "alpha", label: "A–Z" },
                { key: "salary", label: "Salary ↓" },
                { key: "shortage", label: "Shortage ↓" },
              ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`px-3 py-2 transition-colors ${
                  sort === key
                    ? "bg-brand text-white font-semibold"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-4 text-xs text-slate-400">
        {filtered.length === occupations.length
          ? `${occupations.length} occupations`
          : `${filtered.length} of ${occupations.length} occupations`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
          No occupations match &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((occ) => (
            <Link
              key={occ.anzsco_code}
              href={`/au/jobs/${slugify(occ.occupation_en)}`}
              className="group p-4 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors"
            >
              <div className="font-medium text-sm text-foreground group-hover:text-brand-press leading-snug mb-2">
                {occ.occupation_en}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                {occ.median_salary_aud && (
                  <span className="font-semibold text-slate-700">
                    A${occ.median_salary_aud.toLocaleString()}
                  </span>
                )}
                {occ.shortage_rating != null && occ.shortage_rating >= 3 && (
                  <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                    Shortage
                  </span>
                )}
                <span className="ml-auto">{occ.anzsco_code}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
