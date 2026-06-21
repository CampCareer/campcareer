"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import { SA4_BY_STATE, type SA4Region } from "@/data/sa4-regions"
import type { MapData, StateOccupation, HighPayOccupation } from "@/lib/map-data"

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />,
})

type Tab = "shortage" | "pay" | "employment"

type NeroOccupation = { a4: string; name: string; emp: number }
type NeroData = Record<string, NeroOccupation[]>

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
  const [selectedSA4, setSelectedSA4] = useState<SA4Region | null>(null)
  const [tab, setTab] = useState<Tab>(initialTab)
  const [neroData, setNeroData] = useState<NeroData | null>(null)
  const neroFetched = useRef(false)

  // Fetch NERO employment data once on first SA4 selection
  useEffect(() => {
    if (!selectedSA4 || neroFetched.current) return
    neroFetched.current = true
    fetch("/nero-sa4.json")
      .then((r) => r.json())
      .then((d: NeroData) => setNeroData(d))
      .catch(() => {})
  }, [selectedSA4])

  // Reset SA4 when state changes; auto-switch employment tab when SA4 selected
  useEffect(() => {
    setSelectedSA4(null)
    if (tab === "employment") setTab("shortage")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const onSelectSA4 = useCallback((code: string) => {
    const regions = selected ? SA4_BY_STATE[selected] ?? [] : []
    const region = regions.find((r) => r.code === code) ?? null
    setSelectedSA4(region)
    if (region) setTab("employment")
  }, [selected])

  const onSelectState = useCallback((s: StateCode) => setSelected(s), [])
  const onReset = useCallback(() => {
    setSelected(null)
    setSelectedSA4(null)
  }, [])

  // Build items maps for base-ui Select trigger label rendering
  const stateItems = useMemo(() => STATE_NAMES as Record<string, string>, [])
  const sa4Items = useMemo<Record<string, string>>(() => {
    if (!selected) return {}
    return Object.fromEntries((SA4_BY_STATE[selected] ?? []).map((r) => [r.code, r.name]))
  }, [selected])

  const sa4Regions = selected ? SA4_BY_STATE[selected] ?? [] : []

  return (
    <div className="flex h-full w-full flex-col">
      {/* ── 셀렉터 바 ── */}
      <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-white px-4 py-3">
        {/* State */}
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">주 (State)</span>
          <Select
            items={stateItems}
            value={selected}
            onValueChange={(v) => v && setSelected(v as StateCode)}
          >
            <SelectTrigger className="h-10 w-56 rounded-lg border-slate-200 text-sm">
              <SelectValue placeholder="주를 선택하세요" />
            </SelectTrigger>
            <SelectContent className="z-[2000]">
              {STATE_CODES.map((c) => (
                <SelectItem key={c} value={c}>
                  {STATE_NAMES[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* Region (SA4) — enabled when a state is selected */}
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">지역 (SA4 Region)</span>
          {selected ? (
            <Select
              items={sa4Items}
              value={selectedSA4?.code ?? null}
              onValueChange={(v) => v && onSelectSA4(v)}
            >
              <SelectTrigger className="h-10 w-64 rounded-lg border-slate-200 text-sm">
                <SelectValue placeholder="지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="z-[2000]">
                {sa4Regions.map((r) => (
                  <SelectItem key={r.code} value={r.code}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-10 w-64 cursor-not-allowed items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
              주를 먼저 선택하세요
            </div>
          )}
        </label>

        {(selected || selectedSA4) && (
          <button
            type="button"
            onClick={onReset}
            className="mb-0.5 inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            초기화
          </button>
        )}
      </div>

      {/* ── 지도 + 패널 오버레이 ── */}
      <div className="relative min-h-0 flex-1">
        <LeafletMap data={data} selected={selected} onSelectState={onSelectState} onReset={onReset} />

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
              selectedSA4={selectedSA4}
              tab={tab}
              onTab={setTab}
              onClose={onReset}
              neroData={neroData}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function Panel({
  data,
  selected,
  selectedSA4,
  tab,
  onTab,
  onClose,
  neroData,
}: {
  data: MapData
  selected: StateCode
  selectedSA4: SA4Region | null
  tab: Tab
  onTab: (t: Tab) => void
  onClose: () => void
  neroData: Record<string, NeroOccupation[]> | null
}) {
  const shortage = data.shortageByState[selected] ?? []

  return (
    <>
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 tracking-tight">
            {selectedSA4 ? selectedSA4.name : STATE_NAMES[selected]}
          </h2>
          {selectedSA4 && (
            <p className="text-xs text-slate-400">{STATE_NAMES[selected]}</p>
          )}
        </div>
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
            부족 직종
          </TabButton>
          <TabButton active={tab === "pay"} onClick={() => onTab("pay")}>
            고연봉 부족직종
          </TabButton>
          {selectedSA4 && (
            <TabButton active={tab === "employment"} onClick={() => onTab("employment")}>
              지역 고용
            </TabButton>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {tab === "shortage" && <ShortageList rows={shortage} />}
        {tab === "pay" && <HighPayList rows={data.highPay} stateRows={shortage} />}
        {tab === "employment" && (
          <EmploymentList
            sa4={selectedSA4}
            neroData={neroData}
          />
        )}
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        출처: OSCA 2025 부족직종 · ABS 소득 · JSA NERO 2026-05
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
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">이 주의 부족 직종 데이터가 아직 없어요.</p>
  }
  return (
    <ol>
      {rows.map((r, i) => (
        <li key={r.anzsco_code}>
          <a
            href={`/roi-explorer/au/occupation/${r.anzsco_code}`}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occupation_ko ?? r.occupation_en}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {r.state_count === 1 && <Badge tone="blue">이 지역 특화</Badge>}
                {r.state_count >= 7 && <Badge tone="gray">전국 공통</Badge>}
                {r.on_csol && <Badge tone="green">비자 적격(스폰서)</Badge>}
              </span>
            </span>
            <ShortageDots rating={r.state_shortage_rating} />
          </a>
        </li>
      ))}
    </ol>
  )
}

function HighPayList({
  rows,
  stateRows,
}: {
  rows: HighPayOccupation[]
  stateRows: StateOccupation[]
}) {
  const useState = stateRows.length > 0

  // state 선택 시: 이 주의 부족직종 중 연봉 상위 12
  const displayRows: Array<{ anzsco_code: string; occupation_ko: string | null; occupation_en: string; on_csol: boolean; median_salary_aud: number | null; state_count?: number }> = useState
    ? [...stateRows]
        .filter((r) => r.median_salary_aud != null)
        .sort((a, b) => (b.median_salary_aud ?? 0) - (a.median_salary_aud ?? 0))
        .slice(0, 12)
    : rows

  const hint = useState
    ? "이 주의 부족직종 중 연봉 상위 (전국 중위연봉 기준)"
    : "전국 기준 고연봉 상위 12"

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">{hint}</p>
      <ol>
        {displayRows.map((r, i) => (
          <li key={r.anzsco_code}>
            <a
              href={`/roi-explorer/au/occupation/${r.anzsco_code}`}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">
                  {r.occupation_ko ?? r.occupation_en}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  {r.on_csol && <Badge tone="green">비자 적격(스폰서)</Badge>}
                  {"state_count" in r && r.state_count === 1 && (
                    <Badge tone="blue">이 지역 특화</Badge>
                  )}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                {r.median_salary_aud != null ? `A$${r.median_salary_aud.toLocaleString()}` : "—"}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

function EmploymentList({
  sa4,
  neroData,
}: {
  sa4: SA4Region | null
  neroData: Record<string, NeroOccupation[]> | null
}) {
  if (!sa4) return null

  if (!neroData) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-500" />
        <p className="text-sm text-slate-400">고용 데이터 불러오는 중...</p>
      </div>
    )
  }

  const occs = neroData[sa4.code] ?? []
  if (occs.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">해당 지역 데이터가 없어요.</p>
  }

  const maxEmp = occs[0].emp

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">
        JSA NERO 2026-05 · ANZSCO 4자리 단위직군 기준 고용자 수 추정치
      </p>
      <ol>
        {occs.map((r, i) => (
          <li key={r.a4}>
            <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left">
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{r.name}</span>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{ width: `${Math.round((r.emp / maxEmp) * 100)}%` }}
                  />
                </div>
              </span>
              <span className="ml-2 shrink-0 text-xs tabular-nums text-slate-500">
                {r.emp.toLocaleString()}명
              </span>
            </div>
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

function Badge({ tone, children }: { tone: "green" | "gray" | "blue"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "green"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : tone === "blue"
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "bg-slate-100 text-slate-500",
      )}
    >
      {children}
    </span>
  )
}
