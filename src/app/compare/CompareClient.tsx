"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X, ArrowRight, Plus } from "lucide-react"
import { OccupationSearch, type OccupationHit } from "@/components/occupation-search"
import { STATE_CODES, type StateCode } from "@/app/map/states"
import { cn } from "@/lib/utils"

interface CompareOccupation {
  anzsco_code: string
  occupation_en: string
  occupation_ko: string | null
  median_salary_aud: number | null
  on_csol: boolean
  shortage_rating: number | null
  confidence: string | null
  states: Partial<Record<StateCode, number>>
}

export default function CompareClient() {
  const router = useRouter()
  const [codes, setCodes] = useState<string[]>([])
  const [data, setData] = useState<CompareOccupation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (codes.length === 0) {
      setData([])
      return
    }
    setLoading(true)
    fetch(`/api/occupations/compare?codes=${codes.join(",")}`)
      .then((r) => r.json())
      .then((j) => setData(j.occupations ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [codes])

  function add(o: OccupationHit) {
    setCodes((prev) => (prev.includes(o.anzsco_code) || prev.length >= 4 ? prev : [...prev, o.anzsco_code]))
  }
  function remove(code: string) {
    setCodes((prev) => prev.filter((c) => c !== code))
  }

  return (
    <div className="space-y-5">
      {/* 검색 추가 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium text-slate-500">
          비교할 직업 추가 {codes.length > 0 && `(${codes.length}/4)`}
        </p>
        <OccupationSearch onSelect={add} placeholder="직업 검색해서 추가 (예: Nurse, Carpenter, 요리사)" />
      </div>

      {codes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Plus className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-600">비교할 직업을 검색해 추가하세요</p>
          <p className="mt-1 text-sm text-slate-400">최대 4개까지 나란히 비교할 수 있어요.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${data.length || codes.length}, minmax(220px, 1fr))` }}
          >
            {data.map((o) => (
              <article key={o.anzsco_code} className="rounded-xl border border-slate-200 bg-white p-4">
                {/* 헤더 */}
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/roi-explorer/au/occupation/${o.anzsco_code}`)}
                    className="min-w-0 text-left"
                  >
                    <span className="block text-sm font-semibold text-slate-900 hover:text-blue-600">
                      {o.occupation_ko ?? o.occupation_en}
                    </span>
                    {o.occupation_ko && (
                      <span className="block truncate text-xs text-slate-400">{o.occupation_en}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(o.anzsco_code)}
                    aria-label="제거"
                    className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* 배지 */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {o.on_csol && <Badge tone="green">비자 적격(스폰서)</Badge>}
                  {o.confidence !== "verified" && <Badge tone="gray">추정치</Badge>}
                </div>

                {/* 지표 */}
                <dl className="mt-4 space-y-3 border-t border-slate-100 pt-3 text-sm">
                  <Row label="평균 연봉">
                    <span className="font-semibold tabular-nums text-slate-800">
                      {o.median_salary_aud != null ? `A$${o.median_salary_aud.toLocaleString()}` : "—"}
                    </span>
                  </Row>
                  <Row label="전국 부족도">
                    <span className="font-medium text-slate-700">{nationalLabel(o.shortage_rating)}</span>
                  </Row>
                </dl>

                {/* 주별 부족 */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-xs font-medium text-slate-500">주별 인력 부족</p>
                  <ul className="space-y-1.5">
                    {STATE_CODES.map((s) => {
                      const r = o.states[s]
                      return (
                        <li key={s} className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{s}</span>
                          {r ? <Dots rating={r} /> : <span className="text-slate-300">—</span>}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(`/roi-explorer/au/occupation/${o.anzsco_code}`)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  상세 보기 <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            ))}

            {/* 빈 슬롯 안내 (로딩 중 폭 유지) */}
            {loading && data.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-400">불러오는 중…</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function nationalLabel(r: number | null): string {
  if (r == null) return "낮음"
  if (r >= 5) return "매우 강함"
  if (r >= 4) return "강함"
  if (r >= 3) return "보통"
  return "낮음"
}

function Dots({ rating }: { rating: number }) {
  const n = rating >= 3 ? 3 : 2
  return (
    <span className="flex items-center gap-1" title={`부족도 ${rating}`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-rose-400" />
      ))}
    </span>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function Badge({ tone, children }: { tone: "green" | "gray"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "green" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500",
      )}
    >
      {children}
    </span>
  )
}
