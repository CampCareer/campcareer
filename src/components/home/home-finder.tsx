"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, US_STATE_CODES, US_STATE_NAMES, CA_PROVINCE_CODES, CA_PROVINCE_NAMES } from "@/app/map/states"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { track } from "@/lib/analytics"

// 홈 = 검색 우선 랜딩(에어비앤비/스카이스캐너 류). 헤드라인 + 한 줄 검색바 + 예시 칩.
// 검색바: 국가 → 주(state) → 직업군(부족직종/고연봉) 선택 후 /map?state=&tab= 으로 딥링크.
// 호주만 활성, 나머지 국가는 비활성("곧 추가").
const COUNTRIES = [
  { value: "au", flag: "🇦🇺", nameKey: "australia", enabled: true },
  { value: "us", flag: "🇺🇸", nameKey: "usa", enabled: true },
  { value: "ca", flag: "🇨🇦", nameKey: "canada", enabled: true },
  { value: "uk", flag: "🇬🇧", nameKey: "uk", enabled: false },
] as const

// 각 호주 주의 고용 규모 Top 3 직업 (JSA NERO 2026-05 기반)
const EMPLOYMENT_TOP3: Record<string, { name: string; emp: number }[]> = {
  "ACT": [
    { name: "General Clerks", emp: 12721 },
    { name: "Intelligence and Policy Analysts", emp: 8535 },
    { name: "Sales Assistants (General)", emp: 8156 },
  ],
  "NSW": [
    { name: "Sales Assistants (General)", emp: 190779 },
    { name: "Aged and Disabled Carers", emp: 98151 },
    { name: "Registered Nurses", emp: 96396 },
  ],
  "NT": [
    { name: "Sales Assistants (General)", emp: 4726 },
    { name: "Registered Nurses", emp: 4687 },
    { name: "General Clerks", emp: 4166 },
  ],
  "QLD": [
    { name: "Sales Assistants (General)", emp: 123573 },
    { name: "Registered Nurses", emp: 83470 },
    { name: "Aged and Disabled Carers", emp: 80748 },
  ],
  "SA": [
    { name: "Aged and Disabled Carers", emp: 39924 },
    { name: "Sales Assistants (General)", emp: 36360 },
    { name: "Registered Nurses", emp: 29695 },
  ],
  "TAS": [
    { name: "Aged and Disabled Carers", emp: 11082 },
    { name: "Sales Assistants (General)", emp: 10984 },
    { name: "Registered Nurses", emp: 7035 },
  ],
  "VIC": [
    { name: "Sales Assistants (General)", emp: 145060 },
    { name: "Registered Nurses", emp: 106568 },
    { name: "Aged and Disabled Carers", emp: 88896 },
  ],
  "WA": [
    { name: "Sales Assistants (General)", emp: 62692 },
    { name: "Registered Nurses", emp: 41453 },
    { name: "Aged and Disabled Carers", emp: 32357 },
  ],
}

// base-ui Select 트리거를 테두리 없는 "검색바 세그먼트"처럼 보이게 하는 클래스.
const segmentTrigger =
  "h-auto w-full justify-between gap-1 border-0 bg-transparent p-0 text-sm font-semibold text-foreground shadow-none focus-visible:border-0 focus-visible:ring-0 data-[size=default]:h-auto"

export function HomeFinder() {
  const t = useTranslations()
  const f = t.landing.home.finder
  const router = useRouter()
  const [country, setCountry] = useState("au")
  const [state, setState] = useState<string>("NSW")
  const [tab, setTab] = useState<"shortage" | "pay">("shortage")

  const countryName: Record<string, string> = {
    au: f.australia,
    ca: f.canada,
    uk: f.uk,
    us: f.usa,
  }
  const countryItems = useMemo<Record<string, string>>(
    () =>
      Object.fromEntries(
        COUNTRIES.map((c) => [
          c.value,
          `${c.flag} ${countryName[c.value]}${c.enabled ? "" : ` (${f.comingSoon})`}`,
        ]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f],
  )

  const isUS = country === "us"
  const isCA = country === "ca"
  const activeStateCodes = isUS ? US_STATE_CODES : isCA ? CA_PROVINCE_CODES : STATE_CODES
  const activeStateNames: Record<string, string> = isUS ? US_STATE_NAMES : isCA ? CA_PROVINCE_NAMES : STATE_NAMES
  const stateItems = useMemo<Record<string, string>>(
    () => Object.fromEntries(activeStateCodes.map((c) => [c, `${activeStateNames[c]}`])),
    [activeStateCodes, activeStateNames],
  )
  // reset state when switching country
  useEffect(() => {
    if (isUS) setState("CA")
    else if (isCA) setState("ON")
    else setState("NSW")
  }, [isUS, isCA])

  const categoryItems = useMemo<Record<string, string>>(
    () => ({ shortage: f.shortageShort, pay: f.payShort }),
    [f],
  )

  function go() {
    track("finder_search", { country, state, tab })
    router.push(`/map?country=${country}&state=${state}&tab=${tab}`)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col overflow-y-auto bg-background">
      {/* 은은한 브랜드 글로우(맵 제품의 정체성을 암시) — CSS만, 이미지/지도 임베드 없음 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(60%_60%_at_50%_-5%,hsl(var(--brand-tint))_0%,transparent_70%)]"
      />

      <div className="flex flex-1 flex-col items-center px-6 pt-8 pb-2 sm:pt-10">
        <div className="w-full max-w-xl text-center">
          <h1 className="font-sans text-[2rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {f.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
            {f.subhead}
          </p>

          {/* 검색바 — 랜딩의 주인공 */}
          <div className="mx-auto mt-7 w-full">
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:py-1.5 sm:pr-1.5 sm:pl-2">
              <div className="flex flex-1 flex-col divide-y divide-slate-100 sm:flex-row sm:items-stretch sm:divide-x sm:divide-y-0">
                <Segment label={f.country}>
                  <Select
                    items={countryItems}
                    value={country}
                    onValueChange={(v) => v && setCountry(v)}
                  >
                    <SelectTrigger className={segmentTrigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.value} value={c.value} disabled={!c.enabled}>
                          {countryItems[c.value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Segment>

                <Segment label={f.state}>
                  <Select
                    items={stateItems}
                    value={state}
                    onValueChange={(v) => v && setState(v)}
                  >
                    <SelectTrigger className={segmentTrigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activeStateCodes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {activeStateNames[c]} ({c})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Segment>

                <Segment label={f.category}>
                  <Select
                    items={categoryItems}
                    value={tab}
                    onValueChange={(v) => v && setTab(v as "shortage" | "pay")}
                  >
                    <SelectTrigger className={segmentTrigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shortage">{f.shortage}</SelectItem>
                      <SelectItem value="pay">{f.pay}</SelectItem>
                    </SelectContent>
                  </Select>
                </Segment>
              </div>

              <button
                type="button"
                onClick={go}
                aria-label={f.cta}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-press sm:w-12 sm:shrink-0 sm:rounded-full"
              >
                <span className="sm:hidden">{f.cta}</span>
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 주별 고용 Top 3 카드 */}
        <div className="mt-7 w-full max-w-5xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {f.tryThese}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATE_CODES.map((code) => {
              const jobs = EMPLOYMENT_TOP3[code]
              if (!jobs) return null
              return (
                <Link
                  key={code}
                  href={`/map?country=au&state=${code}&tab=employment`}
                  className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-brand/30 hover:bg-brand-tint sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-press">
                      {STATE_NAMES[code]}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{code}</span>
                  </div>
                  <ol className="space-y-1">
                    {jobs.map((job, i) => (
                      <li key={job.name} className="flex items-center gap-2">
                        <span className="w-4 shrink-0 text-[11px] font-medium text-slate-400">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium text-slate-700">
                            {job.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {job.emp.toLocaleString()} employed
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Link>
              )
            })}
          </div>
        </div>

        <Link
          href="/map"
          className="mt-6 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <MapPin className="h-3.5 w-3.5" />
          {f.browseMap}
        </Link>
      </div>

      {/* 정부·공공 데이터 기반 멘트 — 맨 하단에 작게 */}
      <p className="px-6 pb-6 text-center text-[11px] leading-relaxed text-slate-400">
        {f.dataNote}
      </p>
    </div>
  )
}

// 검색바의 한 칸 — 위에 작은 라벨, 아래에 선택값(테두리 없는 Select 트리거).
function Segment({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-4 py-2.5 text-left sm:py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </div>
  )
}
