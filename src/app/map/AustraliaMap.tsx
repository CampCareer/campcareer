"use client"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { STATE_NAMES, type StateCode } from "./states"
import type { MapData, StateOccupation, HighPayOccupation } from "@/lib/map-data"

// Leaflet 은 SSR 불가 → 실제 지도는 ssr:false 로 동적 import.
// (RoiExplorerClient 의 SalaryGrowthChart 와 동일 패턴)
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[440px] sm:h-[560px] w-full rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
  ),
})

type Tab = "shortage" | "pay"

export default function AustraliaMap({ data }: { data: MapData }) {
  const [selected, setSelected] = useState<StateCode | null>(null)
  const [tab, setTab] = useState<Tab>("shortage")

  const onSelectState = useCallback((s: StateCode) => setSelected(s), [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      {/* 왼쪽: 지도 */}
      <LeafletMap data={data} selected={selected} onSelectState={onSelectState} />

      {/* 오른쪽: 패널 */}
      <Panel
        data={data}
        selected={selected}
        tab={tab}
        onTab={setTab}
      />
    </div>
  )
}

function Panel({
  data,
  selected,
  tab,
  onTab,
}: {
  data: MapData
  selected: StateCode | null
  tab: Tab
  onTab: (t: Tab) => void
}) {
  if (!selected) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 min-h-[440px] flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xl mb-3">
          📍
        </div>
        <p className="text-base font-medium text-slate-700">주를 선택하세요</p>
        <p className="mt-1 text-sm text-slate-400 max-w-xs">
          왼쪽 지도에서 주·준주를 클릭하면 그 지역의 부족 직종과 고연봉 직종이 여기에 표시돼요.
        </p>
      </div>
    )
  }

  const shortage = data.shortageByState[selected] ?? []

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-slate-900 tracking-tight">
        {STATE_NAMES[selected]}
      </h2>

      {/* 탭 토글 */}
      <div className="mt-4 inline-flex rounded-lg bg-slate-100 p-1 text-sm">
        <TabButton active={tab === "shortage"} onClick={() => onTab("shortage")}>
          가장 부족한 직종
        </TabButton>
        <TabButton active={tab === "pay"} onClick={() => onTab("pay")}>
          연봉 높은 직종
        </TabButton>
      </div>

      <div className="mt-4">
        {tab === "shortage" ? (
          <ShortageList rows={shortage} />
        ) : (
          <HighPayList rows={data.highPay} />
        )}
      </div>

      <p className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
        출처: OSCA 2025 부족직종 목록 + ABS 소득 · 호주
      </p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 font-medium transition-colors",
        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
      )}
    >
      {children}
    </button>
  )
}

function ShortageList({ rows }: { rows: StateOccupation[] }) {
  const router = useRouter()
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">이 주의 부족 직종 데이터가 아직 없어요.</p>
  }
  return (
    <ol className="max-h-[520px] overflow-y-auto -mx-1 pr-1">
      {rows.map((r, i) => (
        <li key={r.anzsco_code}>
          <button
            type="button"
            onClick={() => router.push(`/roi-explorer/au/occupation/${r.anzsco_code}`)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occupation_ko ?? r.occupation_en}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {r.on_csol && <Badge tone="green">비자 적격(스폰서)</Badge>}
                {r.confidence !== "verified" && <Badge tone="gray">추정치</Badge>}
              </span>
            </span>
            <ShortageDots rating={r.state_shortage_rating} />
          </button>
        </li>
      ))}
    </ol>
  )
}

function HighPayList({ rows }: { rows: HighPayOccupation[] }) {
  const router = useRouter()
  return (
    <div>
      <p className="mb-2 text-xs text-slate-400">전국 기준 (주별 연봉 데이터 준비 중)</p>
      <ol className="max-h-[500px] overflow-y-auto -mx-1 pr-1">
        {rows.map((r, i) => (
          <li key={r.anzsco_code}>
            <button
              type="button"
              onClick={() => router.push(`/roi-explorer/au/occupation/${r.anzsco_code}`)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">
                  {r.occupation_ko ?? r.occupation_en}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  {r.on_csol && <Badge tone="green">비자 적격(스폰서)</Badge>}
                  {r.confidence !== "verified" && <Badge tone="gray">추정치</Badge>}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                {r.median_salary_aud != null ? `A$${r.median_salary_aud.toLocaleString()}` : "—"}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ShortageDots({ rating }: { rating: number }) {
  const n = rating >= 3 ? 3 : rating >= 2 ? 2 : 1
  return (
    <span className="flex shrink-0 items-center gap-1" aria-label={`부족도 ${rating}`} title={`부족도 ${rating}`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-rose-400" />
      ))}
    </span>
  )
}

function Badge({ tone, children }: { tone: "green" | "gray"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "green"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-slate-100 text-slate-500",
      )}
    >
      {children}
    </span>
  )
}
