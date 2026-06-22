"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, type StateCode } from "@/app/map/states"
import { useTranslations } from "@/lib/i18n/locale-provider"

// 홈 검색 = 국가 → 주(state) → 직업군(부족직종/고연봉) 3단 선택 후 /map 으로 딥링크.
// 호주만 활성, 나머지 국가는 비활성("곧 추가").
const COUNTRIES = [
  { value: "au", flag: "🇦🇺", nameKey: "australia", enabled: true },
  { value: "ca", flag: "🇨🇦", nameKey: "canada", enabled: false },
  { value: "uk", flag: "🇬🇧", nameKey: "uk", enabled: false },
  { value: "us", flag: "🇺🇸", nameKey: "usa", enabled: false },
] as const

export function HomeFinder() {
  const t = useTranslations()
  const f = t.landing.home.finder
  const router = useRouter()
  const [country, setCountry] = useState("au")
  const [state, setState] = useState<StateCode>("NSW")
  const [tab, setTab] = useState<"shortage" | "pay">("shortage")

  // base-ui Select 은 items 맵으로 선택값 라벨을 트리거에 렌더한다.
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
  const stateItems = useMemo<Record<string, string>>(
    () => Object.fromEntries(STATE_CODES.map((c) => [c, `${STATE_NAMES[c]} (${c})`])),
    [],
  )
  const categoryItems = useMemo<Record<string, string>>(
    () => ({ shortage: f.shortage, pay: f.pay }),
    [f],
  )

  function go() {
    router.push(`/map?state=${state}&tab=${tab}`)
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-background">
      {/* 중앙 정렬 미니멀 검색 */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-3">
              <Field label={f.country}>
                <Select items={countryItems} value={country} onValueChange={(v) => v && setCountry(v)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 text-sm">
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
              </Field>

              <Field label={f.state}>
                <Select items={stateItems} value={state} onValueChange={(v) => v && setState(v as StateCode)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_CODES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {STATE_NAMES[c]} ({c})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label={f.category}>
                <Select items={categoryItems} value={tab} onValueChange={(v) => v && setTab(v as "shortage" | "pay")}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortage">{f.shortage}</SelectItem>
                    <SelectItem value="pay">{f.pay}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <button
              type="button"
              onClick={go}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              {f.cta}
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/map"
              className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              <MapPin className="h-3.5 w-3.5" />
              {f.browseMap}
            </Link>
          </div>
        </div>
      </div>

      {/* 정부·공공 데이터 기반 멘트 — 맨 하단에 작게 */}
      <p className="px-6 pb-6 text-center text-[11px] leading-relaxed text-slate-400">
        {f.dataNote}
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}
