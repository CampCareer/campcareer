"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RotateCcw, ChevronLeft } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations, useLocale } from "@/lib/i18n/locale-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, type StateCode } from "./states"
import { SA4_BY_STATE, type SA4Region } from "@/data/sa4-regions"
import type { MapData, StateOccupation, HighPayOccupation, USOccupation, StateSalaryMult, OccRow, StateShortageByOcc } from "@/lib/map-data"

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
  const t = useTranslations()
  const [activeCountry, setActiveCountry] = useState<"AU" | "US" | null>(initialState ? "AU" : null)
  const [selected, setSelected] = useState<string | null>(initialState)
  const [selectedSA4, setSelectedSA4] = useState<SA4Region | null>(null)
  const [tab, setTab] = useState<Tab>(initialTab)
  const [neroData, setNeroData] = useState<NeroData | null>(null)
  const neroFetched = useRef(false)

  useEffect(() => {
    if (!selectedSA4 || neroFetched.current) return
    neroFetched.current = true
    fetch("/nero-sa4.json")
      .then((r) => r.json())
      .then((d: NeroData) => setNeroData(d))
      .catch(() => {})
  }, [selectedSA4])

  useEffect(() => {
    setSelectedSA4(null)
    if (tab === "employment") setTab("shortage")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const onSelectSA4 = useCallback((code: string) => {
    const regions = selected ? SA4_BY_STATE[selected as StateCode] ?? [] : []
    const region = regions.find((r) => r.code === code) ?? null
    setSelectedSA4(region)
    if (region) setTab("employment")
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
          activeCountry={activeCountry}
          onSelectState={onSelectState}
          onSelectCountry={onSelectCountry}
          onReset={onReset}
        />

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
              selectedSA4={activeCountry === "AU" ? selectedSA4 : null}
              tab={tab}
              onTab={setTab}
              onClose={onReset}
              neroData={activeCountry === "AU" ? neroData : null}
              activeCountry={activeCountry}
            />
          </div>
        )}
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
  activeCountry,
}: {
  data: MapData
  selected: string
  selectedSA4: SA4Region | null
  tab: Tab
  onTab: (t: Tab) => void
  onClose: () => void
  neroData: Record<string, NeroOccupation[]> | null
  activeCountry: "AU" | "US" | null
}) {
  const t = useTranslations()
  const isAU = activeCountry === "AU"
  const stateName = isAU
    ? STATE_NAMES[selected as StateCode] ?? selected
    : US_STATE_NAMES[selected] ?? selected

  const auShortage = isAU ? (data.shortageByState[selected as StateCode] ?? []) : []
  const usShortage = !isAU ? (data.usShortageByState[selected] ?? []) : []
  const usHighPay = !isAU ? (data.usHighPayByState[selected] ?? []) : []

  const [selectedOccCode, setSelectedOccCode] = useState<string | null>(null)

  const occ = selectedOccCode ? data.auOccupations[selectedOccCode] : null
  const stateShortages = selectedOccCode ? data.auStateShortages[selectedOccCode] ?? [] : []

  const handleSelectOcc = useCallback((code: string) => {
    setSelectedOccCode(code)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedOccCode(null)
  }, [])

  if (selectedOccCode && occ) {
    return (
      <OccupationDetail
        occ={occ}
        stateShortages={stateShortages}
        onBack={handleBack}
        onClose={onClose}
        t={t}
        currentState={selected as StateCode}
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
          {isAU && selectedSA4 && (
            <TabButton active={tab === "employment"} onClick={() => onTab("employment")}>
              {t.map.tabEmployment}
            </TabButton>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {tab === "shortage" && isAU && <ShortageList rows={auShortage} onSelectOcc={handleSelectOcc} />}
        {tab === "shortage" && !isAU && <USShortageList rows={usShortage} />}
        {tab === "pay" && isAU && (
          <HighPayList
            rows={data.highPay}
            stateRows={auShortage}
            selected={selected as StateCode}
            stateSalaryMult={data.stateSalaryMult}
            onSelectOcc={handleSelectOcc}
          />
        )}
        {tab === "pay" && !isAU && <USHighPayList rows={usHighPay} />}
        {tab === "employment" && (
          <EmploymentList
            sa4={selectedSA4}
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

function ShortageList({ rows, onSelectOcc }: { rows: StateOccupation[]; onSelectOcc: (code: string) => void }) {
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
        <li key={r.anzsco_code}>
          <button
            type="button"
            onClick={() => onSelectOcc(r.anzsco_code)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="w-5 shrink-0 text-sm tabular-nums text-slate-400">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {r.occupation_ko ?? r.occupation_en}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {r.state_count === 1 && <Badge tone="blue">{t.map.regionalSpecific}</Badge>}
                {r.state_count >= 7 && <Badge tone="gray">{t.map.nationalCommon}</Badge>}
                {r.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
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

  return (
    <div>
      <p className="mb-1 px-3 text-xs text-slate-400">{hint}</p>
      <ol>
        {displayRows.map((r, i) => {
          const { value: adj, adjusted } = adjustedSalary(r.median_salary_aud, r.anzsco_code, hasStateRows ? selected : null, stateSalaryMult)
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
                    {r.occupation_ko ?? r.occupation_en}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {r.on_csol && <Badge tone="green">{t.map.visaEligible}</Badge>}
                    {"state_count" in r && r.state_count === 1 && (
                      <Badge tone="blue">{t.map.regionalSpecific}</Badge>
                    )}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold tabular-nums text-slate-700">
                    {adj != null ? `A$${adj.toLocaleString()}` : "—"}
                  </span>
                  {adjusted && (
                    <span className="block text-[10px] text-slate-400">{selected} 보정 · Census 2021</span>
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
  neroData,
}: {
  sa4: SA4Region | null
  neroData: Record<string, NeroOccupation[]> | null
}) {
  const t = useTranslations()
  if (!sa4) return null

  if (!neroData) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-500" />
        <p className="text-sm text-slate-400">{t.map.loadingEmployment}</p>
      </div>
    )
  }

  const occs = neroData[sa4.code] ?? []
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

function USShortageList({ rows }: { rows: USOccupation[] }) {
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
          <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50">
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
          </div>
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

function USHighPayList({ rows }: { rows: USOccupation[] }) {
  const t = useTranslations()
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">{t.map.noShortageData}</p>
  }
  return (
    <ol>
      {rows.map((r, i) => (
        <li key={r.occ_code}>
          <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50">
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
          </div>
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

function OccupationDetail({
  occ,
  stateShortages,
  onBack,
  onClose,
  t,
  currentState,
}: {
  occ: OccRow
  stateShortages: StateShortageByOcc[]
  onBack: () => void
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  currentState: StateCode
}) {
  const locale = useLocale()
  const name = locale === "ko" && occ.occupation_ko ? occ.occupation_ko : occ.occupation_en

  const currentStateShortage = stateShortages.find((s) => s.state === currentState)
  const stateRating = currentStateShortage?.rating ?? 0

  const hasNational = occ.shortage_rating != null && occ.shortage_rating > 0
  const nationalWidth = hasNational ? Math.round((occ.shortage_rating! / 5) * 100) : 0

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

          {occ.pr_note_ko && locale === "ko" && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                {t.map.detailVisaPathway}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{occ.pr_note_ko}</p>
            </div>
          )}

          {occ.last_verified && (
            <p className="text-xs text-slate-400">
              {t.map.detailUpdated}: {occ.last_verified}
            </p>
          )}
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
