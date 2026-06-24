"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { RotateCcw, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations, useLocale } from "@/lib/i18n/locale-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import { SA4_BY_STATE, type SA4Region } from "@/data/sa4-regions"
import { getPathway, TAFE_BY_STATE, VET_PORTALS, cricosSearchUrl } from "@/lib/au-pathway"
import { WiseCta } from "@/components/partners/partner-cta"
import { OccupationPicker } from "@/components/map/occupation-picker"
import type { MapData, StateOccupation, HighPayOccupation, USOccupation, USCollege, StateSalaryMult, OccRow, StateShortageByOcc } from "@/lib/map-data"

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />,
})

type Tab = "shortage" | "pay" | "employment"

type NeroOccupation = { a4: string; name: string; emp: number }
type NeroData = Record<string, NeroOccupation[]>

// 지역(SA4) 단위 직업군 데이터 — public/region-occupations.json (IVI 채용공고 + 인구조사 고소득).
type RegionGroup = { code?: string; title: string; value: number }
type RegionEntry = { demand: RegionGroup[]; demandMetro: boolean; pay: RegionGroup[] }
type RegionOccData = Record<string, RegionEntry>

export default function AustraliaMap({
  data,
}: {
  data: MapData
}) {
  const t = useTranslations()
  // /map은 호주 비치헤드의 front door다 → 진입 즉시 주/지역 선택(검색) 바가 보이도록
  // 기본을 "AU"로 둔다. 월드맵(다른 국가)은 "전체 보기"로 빠져나가 볼 수 있다.
  const [activeCountry, setActiveCountry] = useState<"AU" | "US" | null>("AU")
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedSA4, setSelectedSA4] = useState<SA4Region | null>(null)
  const [tab, setTab] = useState<Tab>("shortage")
  const [neroData, setNeroData] = useState<NeroData | null>(null)
  const neroFetched = useRef(false)
  const [regionData, setRegionData] = useState<RegionOccData | null>(null)
  const regionFetched = useRef(false)
  // 직업 카드 열림 상태 — 툴바의 직업 검색에서도 열 수 있도록 최상위로 끌어올림.
  const [selectedOccCode, setSelectedOccCode] = useState<string | null>(null)
  const [selectedUsOcc, setSelectedUsOcc] = useState<USOccupation | null>(null)
  // 모바일에서는 우측 패널 대신 구글맵식 바텀시트(드래그로 확장)를 쓴다.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // 페이지가 정적(force-static)이므로 ?state=NSW&tab=pay 딥링크는 서버가 아니라
  // 여기서 마운트 후 읽어 반영한다. SSR 시점엔 기본값으로 렌더돼 하이드레이션
  // 불일치가 없다(홈 셀렉터 → /map 딥링크 동작 보존).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const raw = p.get("state")?.toUpperCase()
    if (raw && (STATE_CODES as string[]).includes(raw)) setSelected(raw as StateCode)
    if (p.get("tab") === "pay") setTab("pay")
  }, [])

  useEffect(() => {
    if (!selected || neroFetched.current) return
    neroFetched.current = true
    fetch("/nero-sa4.json")
      .then((r) => r.json())
      .then((d: NeroData) => setNeroData(d))
      .catch(() => {})
  }, [selected])

  useEffect(() => {
    if (!selected || regionFetched.current) return
    regionFetched.current = true
    fetch("/region-occupations.json")
      .then((r) => r.json())
      .then((d: RegionOccData) => setRegionData(d))
      .catch(() => {})
  }, [selected])

  useEffect(() => {
    setSelectedSA4(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // 주(state)·국가가 바뀌면 열려 있던 직업 상세를 닫는다 (stale 카드 방지).
  useEffect(() => {
    setSelectedOccCode(null)
    setSelectedUsOcc(null)
  }, [selected, activeCountry])

  const onSelectSA4 = useCallback((code: string) => {
    // 지역(SA4)을 눌러도 현재 보고 있던 탭(부족/고소득/고용)을 유지한다.
    // 강제로 "고용률" 탭으로 넘기지 않는다.
    const regions = selected ? SA4_BY_STATE[selected as StateCode] ?? [] : []
    const region = regions.find((r) => r.code === code) ?? null
    setSelectedSA4(region)
  }, [selected])

  const onSelectState = useCallback((s: string) => {
    setSelected(s)
  }, [])

  const onSelectCountry = useCallback((country: "AU" | "US") => {
    setActiveCountry(country)
    setSelected(null)
    setSelectedSA4(null)
  }, [])

  const onReset = useCallback(() => {
    if (selected !== null) {
      setSelected(null)
      setSelectedSA4(null)
    } else if (activeCountry !== null) {
      setActiveCountry(null)
    }
  }, [selected, activeCountry])

  const stateItems = useMemo(() => STATE_NAMES as Record<string, string>, [])
  const sa4Items = useMemo<Record<string, string>>(() => {
    if (!selected) return {}
    return Object.fromEntries((SA4_BY_STATE[selected as StateCode] ?? []).map((r) => [r.code, r.name]))
  }, [selected])

  const sa4Regions = selected ? SA4_BY_STATE[selected as StateCode] ?? [] : []

  return (
    <div className="flex h-full w-full flex-col">
      {activeCountry === "AU" && (
      <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectState}</span>
          <Select
            items={stateItems}
            value={selected}
            onValueChange={(v) => v && setSelected(v)}
          >
            <SelectTrigger className="h-10 w-56 rounded-lg border-slate-200 text-sm">
              <SelectValue placeholder={t.map.selectStatePlaceholder} />
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

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectRegion}</span>
          {selected ? (
            <Select
              items={sa4Items}
              value={selectedSA4?.code ?? null}
              onValueChange={(v) => v && onSelectSA4(v)}
            >
              <SelectTrigger className="h-10 w-64 rounded-lg border-slate-200 text-sm">
                <SelectValue placeholder={t.map.selectRegionPlaceholder} />
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
              {t.map.selectStateFirst}
            </div>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{t.map.selectOccupation}</span>
          <OccupationPicker
            key={selected ?? "none"}
            disabled={!selected}
            occupations={selected ? data.shortageByState[selected as StateCode] ?? [] : []}
            onSelect={(code) => setSelectedOccCode(code)}
          />
        </label>

        {(selected || selectedSA4) && (
          <button
            type="button"
            onClick={onReset}
            className="mb-0.5 inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t.map.reset}
          </button>
        )}
      </div>
      )}

      <div className="relative min-h-0 flex-1">
        <LeafletMap
          data={data}
          selected={selected}
          selectedSA4={activeCountry === "AU" ? selectedSA4 : null}
          activeCountry={activeCountry}
          onSelectState={onSelectState}
          onSelectCountry={onSelectCountry}
          onSelectSA4={onSelectSA4}
          onReset={onReset}
        />

        {selected && (() => {
          const panel = (
            <Panel
              data={data}
              selected={selected}
              selectedSA4={activeCountry === "AU" ? selectedSA4 : null}
              tab={tab}
              onTab={setTab}
              onClose={onReset}
              neroData={activeCountry === "AU" ? neroData : null}
              regionData={activeCountry === "AU" ? regionData : null}
              activeCountry={activeCountry}
              selectedOccCode={selectedOccCode}
              setSelectedOccCode={setSelectedOccCode}
              selectedUsOcc={selectedUsOcc}
              setSelectedUsOcc={setSelectedUsOcc}
            />
          )
          return isMobile ? (
            <MobileSheet>{panel}</MobileSheet>
          ) : (
            <div className="absolute right-4 top-4 z-[1000] flex max-h-[calc(100%-2rem)] w-[380px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              {panel}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
}

function Panel({
  data,
  selected,
  selectedSA4,
  tab,
  onTab,
  onClose,
  neroData,
  regionData,
  activeCountry,
  selectedOccCode,
  setSelectedOccCode,
  selectedUsOcc,
  setSelectedUsOcc,
}: {
  data: MapData
  selected: string
  selectedSA4: SA4Region | null
  tab: Tab
  onTab: (t: Tab) => void
  onClose: () => void
  neroData: Record<string, NeroOccupation[]> | null
  regionData: RegionOccData | null
  activeCountry: "AU" | "US" | null
  selectedOccCode: string | null
  setSelectedOccCode: (code: string | null) => void
  selectedUsOcc: USOccupation | null
  setSelectedUsOcc: (occ: USOccupation | null) => void
}) {
  const t = useTranslations()
  const isAU = activeCountry === "AU"
  const stateName = isAU
    ? STATE_NAMES[selected as StateCode] ?? selected
    : US_STATE_NAMES[selected] ?? selected

  const auShortage = isAU ? (data.shortageByState[selected as StateCode] ?? []) : []
  const usShortage = !isAU ? (data.usShortageByState[selected] ?? []) : []
  const usHighPay = !isAU ? (data.usHighPayByState[selected] ?? []) : []
  const panelSa4Regions = isAU ? SA4_BY_STATE[selected as StateCode] ?? [] : []

  const occ = selectedOccCode ? data.auOccupations[selectedOccCode] : null
  const stateShortages = selectedOccCode ? data.auStateShortages[selectedOccCode] ?? [] : []

  const handleSelectOcc = (code: string) => setSelectedOccCode(code)
  const handleBack = () => setSelectedOccCode(null)

  if (selectedUsOcc) {
    return (
      <USOccupationDetail
        occ={selectedUsOcc}
        stateName={stateName}
        stateCode={selected}
        colleges={data.usColleges}
        onBack={() => setSelectedUsOcc(null)}
        onClose={onClose}
        t={t}
      />
    )
  }

  if (selectedOccCode && occ) {
    return (
      <OccupationDetail
        occ={occ}
        stateShortages={stateShortages}
        onBack={handleBack}
        onClose={onClose}
        t={t}
        currentState={selected as StateCode}
        data={data}
      />
    )
  }

  return (
    <>
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 tracking-tight">
            {selectedSA4 ? selectedSA4.name : stateName}
          </h2>
          {selectedSA4 && isAU && (
            <p className="text-xs text-slate-400">{STATE_NAMES[selected as StateCode]}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pt-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-sm">
          <TabButton active={tab === "shortage"} onClick={() => onTab("shortage")}>
            {t.map.tabShortage}
          </TabButton>
          <TabButton active={tab === "pay"} onClick={() => onTab("pay")}>
            {t.map.tabPay}
          </TabButton>
          {isAU && (
            <TabButton active={tab === "employment"} onClick={() => onTab("employment")}>
              {t.map.tabEmployment}
            </TabButton>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {tab === "shortage" && isAU && (
          selectedSA4 ? (
            <RegionGroupList
              kind="demand"
              key={selectedSA4.code}
              entry={regionData?.[selectedSA4.code]}
              occupations={auShortage}
              onSelectOcc={handleSelectOcc}
              selected={selected as StateCode}
              stateSalaryMult={data.stateSalaryMult}
              highPay={data.highPay}
              t={t}
            />
          ) : (
            <ShortageList rows={auShortage} onSelectOcc={handleSelectOcc} />
          )
        )}
        {tab === "shortage" && !isAU && <USShortageList rows={usShortage} onSelectOcc={setSelectedUsOcc} />}
        {tab === "pay" && isAU && (
          selectedSA4 ? (
            <RegionGroupList
              kind="pay"
              key={selectedSA4.code}
              entry={regionData?.[selectedSA4.code]}
              occupations={auShortage}
              onSelectOcc={handleSelectOcc}
              selected={selected as StateCode}
              stateSalaryMult={data.stateSalaryMult}
              highPay={data.highPay}
              t={t}
            />
          ) : (
            <HighPayList
              rows={data.highPay}
              stateRows={auShortage}
              selected={selected as StateCode}
              stateSalaryMult={data.stateSalaryMult}
              onSelectOcc={handleSelectOcc}
            />
          )
        )}
        {tab === "pay" && !isAU && <USHighPayList rows={usHighPay} onSelectOcc={setSelectedUsOcc} />}
        {tab === "employment" && (
          <EmploymentList
            sa4={selectedSA4}
            stateCode={isAU ? (selected as StateCode) : null}
            sa4Regions={panelSa4Regions}
            neroData={neroData}
          />
        )}
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
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

// 모바일 바텀시트 — 구글맵 모바일처럼 손잡이를 위/아래로 끌어 높이를 조절한다.
// 스냅: peek(맵을 넓게) · 기본(절반) · full(화면 거의 전체). 콘텐츠 영역은 따로 스크롤.
function MobileSheet({ children }: { children: React.ReactNode }) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const liveH = useRef(0)
  const drag = useRef<{ startY: number; startH: number } | null>(null)

  const snaps = useCallback(() => {
    const ph = sheetRef.current?.parentElement?.clientHeight ?? 640
    return {
      peek: Math.round(ph * 0.3),
      half: Math.round(ph * 0.62),
      full: Math.max(0, ph - 10),
    }
  }, [])

  useEffect(() => {
    const { half } = snaps()
    liveH.current = half
    setHeight(half)
    const onResize = () => {
      const { peek, full } = snaps()
      setHeight((h) => {
        const next = h == null ? snaps().half : Math.min(full, Math.max(peek, h))
        liveH.current = next
        return next
      })
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [snaps])

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, startH: sheetRef.current?.offsetHeight ?? liveH.current }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const { peek, full } = snaps()
    const next = Math.min(full, Math.max(peek, drag.current.startH + (drag.current.startY - e.clientY)))
    liveH.current = next
    setHeight(next)
  }
  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    const { peek, half, full } = snaps()
    const h = liveH.current
    const nearest = [peek, half, full].reduce((a, b) => (Math.abs(b - h) < Math.abs(a - h) ? b : a))
    liveH.current = nearest
    setHeight(nearest)
  }

  return (
    <div
      ref={sheetRef}
      className={cn(
        "absolute inset-x-0 bottom-0 z-[1000] flex flex-col overflow-hidden rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-6px_24px_rgba(15,23,42,0.14)]",
        !dragging && "transition-[height] duration-200 ease-out",
      )}
      style={{ height: height ?? "55%" }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1 active:cursor-grabbing"
      >
        <span className="h-1.5 w-10 rounded-full bg-slate-300" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

function ShortageList({
  rows,
  onSelectOcc,
  hint,
}: {
  rows: StateOccupation[]
  onSelectOcc: (code: string) => void
  hint?: string
}) {
  const t = useTranslations()
  const locale = useLocale()
  const [limit, setLimit] = useState(10)
  const visible = rows.slice(0, limit)
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {hint && <li className="mb-1 px-3 text-xs text-slate-400">{hint}</li>}
      {visible.map((r, i) => (
        <li key={r.anzsco_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r.anzsco_code)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {r.state_count === 1 && <Badge tone="blue">{t.map.regionalSpecific}</Badge>}
                {r.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
              </span>
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${r.state_shortage_rating >= 3 ? 100 : r.state_shortage_rating >= 2 ? 66 : 33}%` }}
                />
              </span>
            </span>
            <ShortageLabel rating={r.state_shortage_rating} />
          </button>
        </li>
      ))}
      {limit < rows.length && (
        <li>
          <button
            type="button"
            onClick={() => setLimit((p) => Math.min(p + 10, rows.length))}
            className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {locale === "ko" ? "더보기" : "Show more"} ({rows.length - limit})
          </button>
        </li>
      )}
    </ol>
  )
}

// 지역(SA4) 부족/고소득 탭 — 보라색 분야(직업군) 막대 차트.
// 분야를 누르면 그 ANZSCO 2자리에 속한 주(state) 직종으로 펼쳐지고(부족=ShortageList, 고소득=HighPayList)
// 직업 클릭 시 상세 카드로 연결된다.
function RegionGroupList({
  kind,
  entry,
  occupations,
  onSelectOcc,
  selected,
  stateSalaryMult,
  highPay,
  t,
}: {
  kind: "demand" | "pay"
  entry: RegionEntry | undefined
  occupations: StateOccupation[]
  onSelectOcc: (code: string) => void
  selected: StateCode
  stateSalaryMult: StateSalaryMult
  highPay: HighPayOccupation[]
  t: ReturnType<typeof useTranslations>
}) {
  const [openGroup, setOpenGroup] = useState<RegionGroup | null>(null)
  const rows = (kind === "demand" ? entry?.demand : entry?.pay) ?? []
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.regionNoData}</p>
  }

  // 분야 드릴다운: 해당 ANZSCO 2자리로 시작하는 주(state) 직종 → 부족/고소득 리스트 재사용(클릭 시 상세).
  if (openGroup?.code) {
    const inGroup = occupations.filter((o) => o.anzsco_code.startsWith(openGroup.code!))
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpenGroup(null)}
          className="mb-1 inline-flex max-w-full items-center gap-1 px-3 text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="truncate">{openGroup.title}</span>
        </button>
        {inGroup.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">{t.map.regionGroupNoOcc}</p>
        ) : kind === "demand" ? (
          <ShortageList rows={inGroup} onSelectOcc={onSelectOcc} />
        ) : (
          <HighPayList
            rows={highPay}
            stateRows={inGroup}
            selected={selected}
            stateSalaryMult={stateSalaryMult}
            onSelectOcc={onSelectOcc}
          />
        )}
      </div>
    )
  }

  const max = Math.max(...rows.map((r) => r.value), 1)
  const metro = kind === "demand" && !!entry?.demandMetro
  return (
    <div>
      <p className="px-3 pb-2 text-xs text-slate-400">
        {kind === "demand" ? t.map.regionDemandHint : t.map.regionPayHint}
        {metro ? ` · ${t.map.regionMetroNote}` : ""}
      </p>
      <ol>
        {rows.map((r, i) => {
          const matchCount = r.code ? occupations.filter((o) => o.anzsco_code.startsWith(r.code!)).length : 0
          const inner = (
            <>
              <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{r.title}</span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${Math.round((r.value / max) * 100)}%` }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                {r.value.toLocaleString()}
              </span>
              {matchCount > 0 && <ChevronRight className="ml-1 h-4 w-4 shrink-0 text-slate-300" />}
            </>
          )
          return (
            <li key={r.title}>
              {matchCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setOpenGroup(r)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  {inner}
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">{inner}</div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function adjustedSalary(
  salary: number | null,
  anzscoCode: string,
  state: string | null,
  mult: StateSalaryMult,
): { value: number | null; adjusted: boolean } {
  if (salary == null || !state) return { value: salary, adjusted: false }
  const digit = anzscoCode[0]
  const factor = mult[state]?.[digit]
  if (!factor || factor === 1) return { value: salary, adjusted: false }
  return { value: Math.round(salary * factor), adjusted: true }
}

function HighPayList({
  rows,
  stateRows,
  selected,
  stateSalaryMult,
  onSelectOcc,
}: {
  rows: HighPayOccupation[]
  stateRows: StateOccupation[]
  selected: StateCode
  stateSalaryMult: StateSalaryMult
  onSelectOcc: (code: string) => void
}) {
  const t = useTranslations()
  const locale = useLocale()
  const hasStateRows = stateRows.length > 0

  // state 선택 시: 이 주의 부족직종 중 보정 연봉 순으로 정렬 후 상위 12
  type DisplayRow = { anzsco_code: string; occupation_ko: string | null; occupation_en: string; on_csol: boolean; median_salary_aud: number | null; state_count?: number }
  const displayRows: DisplayRow[] = hasStateRows
    ? [...stateRows]
        .filter((r) => r.median_salary_aud != null)
        .sort((a, b) => {
          const adjA = adjustedSalary(a.median_salary_aud, a.anzsco_code, selected, stateSalaryMult).value ?? 0
          const adjB = adjustedSalary(b.median_salary_aud, b.anzsco_code, selected, stateSalaryMult).value ?? 0
          return adjB - adjA
        })
        .slice(0, 12)
    : rows

  const hint = hasStateRows ? t.map.payHintState : t.map.payHintNational

  const computed = displayRows.map((r) => ({
    r,
    ...adjustedSalary(r.median_salary_aud, r.anzsco_code, hasStateRows ? selected : null, stateSalaryMult),
  }))
  const maxAdj = Math.max(...computed.map((c) => c.value ?? 0), 1)

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">{hint}</p>
      <ol>
        {computed.map(({ r, value: adj, adjusted }, i) => {
          return (
            <li key={r.anzsco_code}>
              <button
                type="button"
                onClick={() => onSelectOcc(r.anzsco_code)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
              >
                <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-800">
                    {locale === "ko" ? (r.occupation_ko ?? r.occupation_en) : r.occupation_en}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {r.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
                    {"state_count" in r && r.state_count === 1 && (
                      <Badge tone="blue">{t.map.regionalSpecific}</Badge>
                    )}
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${adj ? Math.round((adj / maxAdj) * 100) : 0}%` }}
                    />
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold tabular-nums text-slate-700">
                    {adj != null ? `A$${adj.toLocaleString()}` : "—"}
                  </span>
                  {adjusted && (
                    <span className="block text-[10px] text-slate-400">{selected} {t.map.salaryAdjusted} · Census 2021</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function EmploymentList({
  sa4,
  stateCode,
  sa4Regions,
  neroData,
}: {
  sa4: SA4Region | null
  stateCode: StateCode | null
  sa4Regions: SA4Region[]
  neroData: Record<string, NeroOccupation[]> | null
}) {
  const t = useTranslations()

  if (!neroData) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-500" />
        <p className="text-sm text-slate-400">{t.map.loadingEmployment}</p>
      </div>
    )
  }

  let occs: NeroOccupation[]

  if (sa4) {
    occs = neroData[sa4.code] ?? []
  } else if (stateCode && sa4Regions.length > 0) {
    const agg = new Map<string, number>()
    for (const region of sa4Regions) {
      const rows = neroData[region.code] ?? []
      for (const r of rows) {
        agg.set(r.name, (agg.get(r.name) ?? 0) + r.emp)
      }
    }
    occs = Array.from(agg.entries())
      .map(([name, emp]) => ({ a4: name, name, emp }))
      .sort((a, b) => b.emp - a.emp)
  } else {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noEmploymentData}</p>
  }

  if (occs.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noEmploymentData}</p>
  }

  const maxEmp = occs[0].emp

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">
        {t.map.employmentSource}
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
                {t.map.peopleFmt.replace('{n}', r.emp.toLocaleString())}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function USShortageList({ rows, onSelectOcc }: { rows: USOccupation[]; onSelectOcc: (occ: USOccupation) => void }) {
  const t = useTranslations()
  const locale = useLocale()
  const [limit, setLimit] = useState(10)
  const visible = rows.slice(0, limit)
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {visible.map((r, i) => (
        <li key={r.occ_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occ_title}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                {r.pct_change > 0 && <span>Growth: +{r.pct_change}%</span>}
                {r.annual_openings > 0 && <span>· Openings: {r.annual_openings.toLocaleString()}</span>}
              </span>
            </span>
            <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
              ${r.median_wage.toLocaleString()}
            </span>
          </button>
        </li>
      ))}
      {limit < rows.length && (
        <li>
          <button
            type="button"
            onClick={() => setLimit((p) => Math.min(p + 10, rows.length))}
            className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {locale === "ko" ? "더보기" : "Show more"} ({rows.length - limit})
          </button>
        </li>
      )}
    </ol>
  )
}

function USHighPayList({ rows, onSelectOcc }: { rows: USOccupation[]; onSelectOcc: (occ: USOccupation) => void }) {
  const t = useTranslations()
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {rows.map((r, i) => (
        <li key={r.occ_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occ_title}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-slate-700">
                ${r.median_wage.toLocaleString()}
              </span>
              {r.pct_change > 0 && (
                <span className="text-[10px] text-emerald-600">+{r.pct_change}% growth</span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ol>
  )
}

function shortageLabel(score: number | null, t: ReturnType<typeof useTranslations>): string {
  if (score == null || score < 3) return t.map.detailLevelLow
  if (score >= 5) return t.map.detailLevelStrong
  if (score >= 4) return t.map.detailLevelHigh
  return t.map.detailLevelMedium
}

function shortageColor(score: number | null): string {
  if (score == null || score < 3) return "bg-slate-300"
  if (score >= 5) return "bg-rose-500"
  if (score >= 4) return "bg-orange-400"
  return "bg-amber-300"
}

// 코스의 "관련 학과" 링크 — 대학 공식 도메인(website_url) 안에서 코스명으로 사이트 검색.
// 별도 URL 데이터 없이도 학교 홈페이지가 아니라 해당 프로그램 페이지로 바로 안내한다.
function courseProgramUrl(websiteUrl: string | null, title: string): string | null {
  if (!websiteUrl) return null
  let domain: string
  try {
    domain = new URL(websiteUrl).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
  if (!domain) return null
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} site:${domain}`)}`
}

// 미국 대학은 데이터에 공식 URL이 없어, 학교명 검색으로 공식 사이트까지 안내한다.
// (/roi-explorer 는 현재 next.config 에서 soft-hide 되어 내부 링크가 홈으로 리다이렉트됨.)
function collegeSearchUrl(name: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(name)}`
}

function aqfLabel(level: number | null): string {
  if (!level) return ""
  if (level >= 10) return "Doctoral"
  if (level === 9) return "Master"
  if (level === 8) return "Grad Cert"
  if (level === 7) return "Bachelor"
  if (level === 6) return "Adv Dip"
  if (level === 5) return "Diploma"
  return `Cert ${level}`
}

function OccupationDetail({
  occ,
  stateShortages,
  onBack,
  onClose,
  t,
  currentState,
  data,
}: {
  occ: OccRow
  stateShortages: StateShortageByOcc[]
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  currentState: StateCode
  data: MapData
}) {
  const locale = useLocale()
  const name = locale === "ko" && occ.occupation_ko ? occ.occupation_ko : occ.occupation_en

  const currentStateShortage = stateShortages.find((s) => s.state === currentState)
  const stateRating = currentStateShortage?.rating ?? 0

  const hasNational = occ.shortage_rating != null && occ.shortage_rating > 0
  const nationalWidth = hasNational ? Math.round((occ.shortage_rating! / 5) * 100) : 0

  // "공부하는 곳"·"비자"는 모두 맵 초기 데이터(data)에서 동기적으로 계산한다 → 카드 열면 즉시.
  // (예전엔 /api/occupations/related 를 카드 열 때 fetch 해서 몇 초 지연이 있었다.)
  const pathway = getPathway(occ.anzsco_code)
  const relatedData = {
    pathway,
    courses:
      pathway === "degree" && occ.related_broad_field
        ? data.coursesByFieldState[occ.related_broad_field]?.[currentState] ?? []
        : [],
    tafe: pathway === "vet" ? TAFE_BY_STATE[currentState] : null,
    vetPortals: pathway === "vet" ? VET_PORTALS : [],
    cricosSearch: cricosSearchUrl(),
    prPathway: data.prPathway,
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.map.detailBack}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 tracking-tight">
          {name}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="gray">ANZSCO {occ.anzsco_code}</Badge>
          {occ.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.map.detailMedianSalary}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-800">
              {occ.median_salary_aud != null ? `A$${occ.median_salary_aud.toLocaleString()}` : "—"}
            </p>
          </div>

          {stateRating > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {currentState} {t.map.detailStateShortages}
              </p>
              <div className="mt-2">
                <ShortageLabel rating={stateRating} />
              </div>
            </div>
          )}

          {stateShortages.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t.map.detailStateShortages} ({locale === "ko" ? "전체주" : "all states"})
              </p>
              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                {stateShortages.map((s) => (
                  <span key={s.state} className="inline-flex items-center gap-1 text-xs text-slate-700">
                    <span className={cn("font-medium", s.state === currentState && "text-slate-900 underline")}>
                      {s.state}
                    </span>
                    <ShortageLabel rating={s.rating} className="!text-[10px]" />
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasNational && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {t.map.detailNationalShortage}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", shortageColor(occ.shortage_rating))}
                    style={{ width: `${nationalWidth}%` }}
                  />
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                  {occ.shortage_rating}/5
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{shortageLabel(occ.shortage_rating, t)}</p>
            </div>
          )}

          {relatedData.pathway === "degree" ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t.map.detailDegreesInState.replace("{state}", currentState)}
              </p>
              {relatedData.courses.length > 0 ? (
              <div className="space-y-2">
                {relatedData.courses.map((c) => {
                  const href = c.institution_id ? `/roi-explorer/au/${c.institution_id}` : null
                  const programUrl = courseProgramUrl(c.website_url, c.title)
                  const info = (
                    <>
                      <p className="text-sm font-medium text-slate-800 leading-snug">{c.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {c.institution_name && <>{c.institution_name} · </>}
                        {c.aqf_level != null && <>{aqfLabel(c.aqf_level)} · </>}
                        {c.duration_years != null && (
                          <>{c.duration_years} yr{c.duration_years > 1 ? "s" : ""} · </>
                        )}
                        {c.tuition_fee_aud != null && <>A${c.tuition_fee_aud.toLocaleString()}/yr</>}
                      </p>
                    </>
                  )
                  // 코스 카드는 /roi-explorer 링크와 외부(CRICOS/홈페이지) 링크를 형제로 둔다.
                  // (앵커 중첩 = 잘못된 HTML 이라 hydration 에러가 난다.)
                  return (
                    <div
                      key={c.id}
                      className="rounded-md border border-slate-100 bg-white p-2.5"
                    >
                      {href ? (
                        <Link href={href} className="block transition-opacity hover:opacity-70">
                          {info}
                        </Link>
                      ) : (
                        info
                      )}
                      {(programUrl || c.cricos_url || c.website_url) && (
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {programUrl && (
                            <a
                              href={programUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.map.detailCoursePage}
                            </a>
                          )}
                          {c.cricos_url && (
                            <a
                              href={c.cricos_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.map.detailCricosLink}
                            </a>
                          )}
                          {c.website_url && (
                            <a
                              href={c.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t.map.detailCollegeWebsite}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              ) : (
                <div className="text-xs text-slate-500 leading-relaxed">
                  <p>{t.map.detailNoStateDegrees.replace("{state}", currentState)}</p>
                  {relatedData.cricosSearch && (
                    <a
                      href={relatedData.cricosSearch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t.map.detailCricosLink}
                    </a>
                  )}
                </div>
              )}
              {relatedData.courses.length > 0 && relatedData.cricosSearch && (
                <a
                  href={relatedData.cricosSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t.map.detailCricosMore}
                </a>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t.map.detailVetInState.replace("{state}", currentState)}
              </p>
              {relatedData.tafe && (
                <a
                  href={relatedData.tafe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-slate-100 bg-white p-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span className="text-sm font-medium text-slate-800">{relatedData.tafe.name}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-400">
                    {t.map.detailOfficialTafe}
                  </span>
                </a>
              )}
              {relatedData.vetPortals.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-[11px] text-slate-400">{t.map.detailVetPortals}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {relatedData.vetPortals.map((p) => (
                      <a
                        key={p.url}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {p.name}
                      </a>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">{t.map.detailVetHint}</p>
                </div>
              )}
            </div>
          )}

          {(relatedData.prPathway || (occ.pr_note_ko && locale === "ko")) && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                {t.map.detailVisaPathway}
              </p>
              {relatedData.prPathway ? (
                <>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {locale === "ko"
                      ? (relatedData.prPathway.route_ko ?? relatedData.prPathway.route_en)
                      : relatedData.prPathway.route_en}
                  </p>
                  {(() => {
                    const caveat =
                      locale === "ko"
                        ? relatedData.prPathway.caveat_ko
                        : relatedData.prPathway.caveat_en
                    return caveat ? <p className="mt-1.5 text-xs text-slate-400">{caveat}</p> : null
                  })()}
                </>
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed">{occ.pr_note_ko}</p>
              )}
            </div>
          )}

          {occ.last_verified && (
            <p className="text-xs text-slate-400">
              {t.map.detailUpdated}: {occ.last_verified}
            </p>
          )}

          <WiseCta />
        </div>
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
      </p>
    </>
  )
}

// 미국 직업 상세 카드 — AU OccupationDetail 와 같은 패널 크롬을 쓰되, 우리가 이미 로드한
// 데이터(임금·고용·부족점수)와 외부 링크(O*NET/BLS), 주별 ROI 상위 대학으로 구성한다.
function USOccupationDetail({
  occ,
  stateName,
  stateCode,
  colleges,
  onBack,
  onClose,
  t,
}: {
  occ: USOccupation
  stateName: string
  stateCode: string
  colleges: USCollege[]
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  // SOC 코드(예: 15-1252) → O*NET 8자리(.00), BLS OEWS(하이픈 제거) 공식 페이지로 연결.
  const onetUrl = `https://www.onetonline.org/link/summary/${occ.occ_code}.00`
  const blsUrl = `https://www.bls.gov/oes/current/oes${occ.occ_code.replace("-", "")}.htm`

  const topSchools = colleges
    .filter((c) => c.college_state === stateCode && c.roi_score != null)
    .sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
    .slice(0, 6)

  const shortageWidth = Math.max(0, Math.min(100, Math.round(occ.shortage_score)))

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.map.detailBack}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.map.close}
          className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 tracking-tight">
          {occ.occ_title}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="gray">{t.map.detailSoc} {occ.occ_code}</Badge>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.map.detailMedianSalary}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-800">
              ${occ.median_wage.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              {t.map.detailEmployment}
            </p>
            <dl className="space-y-1.5 text-sm">
              {occ.tot_emp > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t.map.detailEmployed}</dt>
                  <dd className="font-medium tabular-nums text-slate-700">{occ.tot_emp.toLocaleString()}</dd>
                </div>
              )}
              {occ.pct_change !== 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t.map.detailGrowth}</dt>
                  <dd className={cn("font-medium tabular-nums", occ.pct_change > 0 ? "text-emerald-600" : "text-slate-700")}>
                    {occ.pct_change > 0 ? "+" : ""}{occ.pct_change}%
                  </dd>
                </div>
              )}
              {occ.annual_openings > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t.map.detailAnnualOpenings}</dt>
                  <dd className="font-medium tabular-nums text-slate-700">{occ.annual_openings.toLocaleString()}</dd>
                </div>
              )}
            </dl>
            {occ.shortage_score > 0 && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{t.map.detailShortageScore}</span>
                  <span className="tabular-nums">{Math.round(occ.shortage_score)}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-rose-500 transition-all" style={{ width: `${shortageWidth}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              {t.map.detailLearnMore}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={onetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <ExternalLink className="h-3 w-3" />
                {t.map.detailOnet}
              </a>
              <a
                href={blsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <ExternalLink className="h-3 w-3" />
                {t.map.detailBls}
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              {t.map.detailTopSchools.replace("{state}", stateName)}
            </p>
            {topSchools.length > 0 ? (
              <div className="space-y-2">
                {topSchools.map((c) => (
                  <a
                    key={c.college_id}
                    href={collegeSearchUrl(c.college_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border border-slate-100 bg-white p-2.5 transition-opacity hover:opacity-70"
                  >
                    <p className="flex items-center gap-1 text-sm font-medium text-slate-800 leading-snug">
                      {c.college_name}
                      <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {c.city_name && <>{c.city_name} · </>}
                      {c.roi_score != null && <>ROI {c.roi_score.toFixed(1)}</>}
                      {c.net_salary != null && <> · ${Math.round(c.net_salary).toLocaleString()}</>}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t.map.detailNoSchools}</p>
            )}
          </div>

          <WiseCta />
        </div>
      </div>

      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        {t.map.source}
      </p>
    </>
  )
}

function ShortageLabel({ rating, className }: { rating: number; className?: string }) {
  const locale = useLocale()
  const isKo = locale === "ko"
  if (rating >= 3) {
    return (
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200", className)}>
        {isKo ? "상" : "High"}
      </span>
    )
  }
  if (rating >= 2) {
    return (
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200", className)}>
        {isKo ? "중" : "Mid"}
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200", className)}>
      {isKo ? "하" : "Low"}
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
