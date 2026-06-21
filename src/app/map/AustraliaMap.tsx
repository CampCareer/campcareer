"use client"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { STATE_NAMES, type StateCode } from "./states"
import type { MapData, StateOccupation, HighPayOccupation } from "@/lib/map-data"

// Leaflet 은 SSR 불가 → 실제 지도는 ssr:false 로 동적 import.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />,
})

type Tab = "shortage" | "pay"

export default function AustraliaMap({
  data,
  initialState = null,
  initialTab = "shortage",
}: {
  data: MapData
  initialState?: StateCode | null
  initialTab?: Tab
}) {
  const [selected, setSelected] = useState<StateCode | null>(initialState)
  const [tab, setTab] = useState<Tab>(initialTab)

  const onSelectState = useCallback((s: StateCode) => setSelected(s), [])
  const onReset = useCallback(() => setSelected(null), [])

  return (
    <div className="relative h-full w-full">
      <LeafletMap data={data} selected={selected} onSelectState={onSelectState} onReset={onReset} />

      {/* 주 선택 시에만 떠오르는 패널 (구글맵 스타일 오버레이) */}
      {selected && (
        <div
          className={cn(
            "absolute z-[1000] flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl",
            "inset-x-3 bottom-3 max-h-[58%]",
            "sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:w-[380px] sm:max-h-[calc(100%-2rem)]",
          )}
        >
          <Panel
            data={data}
            selected={selected}
            tab={tab}
            onTab={setTab}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  )
}

function Panel({
  data,
  selected,
  tab,
  onTab,
  onClose,
}: {
  data: MapData
  selected: StateCode
  tab: Tab
  onTab: (t: Tab) => void
  onClose: () => void
}) {
  const shortage = data.shortageByState[selected] ?? []

  return (
    <>
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 tracking-tight">{STATE_NAMES[selected]}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pt-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-sm">
          <TabButton active={tab === "shortage"} onClick={() => onTab("shortage")}>
            가장 부족한 직종
          </TabButton>
          <TabButton active={tab === "pay"} onClick={() => onTab("pay")}>
            연봉 높은 직종
          </TabButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {tab === "shortage" ? <ShortageList rows={shortage} /> : <HighPayList rows={data.highPay} />}
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        출처: OSCA 2025 부족직종 목록 + ABS 소득 · 호주
      </p>
    </>
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
    <ol>
      {rows.map((r, i) => (
        <li key={r.anzsco_code}>
          <button
            type="button"
            onClick={() => router.push(`/roi-explorer/au/occupation/${r.anzsco_code}`)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
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
      <p className="mb-1 px-3 text-xs text-slate-400">전국 기준 (주별 연봉 데이터 준비 중)</p>
      <ol>
        {rows.map((r, i) => (
          <li key={r.anzsco_code}>
            <button
              type="button"
              onClick={() => router.push(`/roi-explorer/au/occupation/${r.anzsco_code}`)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
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
