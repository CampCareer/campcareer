"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"

export interface OccupationHit {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_aud: number | null
  on_csol: boolean
  shortage_rating: number | null
}

export function OccupationSearch({
  onSelect,
  placeholder = "직업을 검색하세요 (예: Nurse, Electrician, 회계사)",
  autoFocus = false,
}: {
  onSelect: (occ: OccupationHit) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const [q, setQ] = useState("")
  const [hits, setHits] = useState<OccupationHit[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(async () => {
      const term = q.trim()
      if (term.length < 2) {
        setHits([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/occupations/search?q=${encodeURIComponent(term)}`)
        const json = await res.json()
        setHits(json.occupations ?? [])
        setOpen(true)
      } catch {
        setHits([])
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  function pick(o: OccupationHit) {
    onSelect(o)
    setQ("")
    setHits([])
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-300" />}
      </div>

      {open && hits.length > 0 && (
        <ul className="absolute z-50 mt-1.5 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-left shadow-lg">
          {hits.map((o) => (
            <li key={o.anzsco_code}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(o)}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-slate-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-800">
                    {o.occupation_ko ?? o.occupation_en}
                  </span>
                  {o.occupation_ko && (
                    <span className="block truncate text-xs text-slate-400">{o.occupation_en}</span>
                  )}
                </span>
                {o.median_salary_aud != null && (
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">
                    A${o.median_salary_aud.toLocaleString()}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && q.trim().length >= 2 && hits.length === 0 && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-400 shadow-lg">
          검색 결과가 없어요. 영문 직업명으로도 검색해 보세요.
        </div>
      )}
    </div>
  )
}
