"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATE_CODES, STATE_NAMES, type StateCode } from "@/app/map/states"

// 랜딩 = 가이드 셀렉터. 국가 → 주 → 카테고리 를 고르면 /map 으로 딥링크.
// (호주만 활성, 나머지 국가는 곧 추가 — disabled)
const COUNTRIES = [
  { value: "au", label: "🇦🇺 호주", enabled: true },
  { value: "ca", label: "🇨🇦 캐나다 (곧 추가)", enabled: false },
  { value: "uk", label: "🇬🇧 영국 (곧 추가)", enabled: false },
  { value: "us", label: "🇺🇸 미국 (곧 추가)", enabled: false },
]

const CATEGORIES = [
  { value: "shortage", label: "부족 직업군" },
  { value: "pay", label: "고연봉 직업군" },
] as const

// base-ui Select 은 items 맵으로 선택값의 라벨을 트리거에 렌더한다.
const COUNTRY_ITEMS: Record<string, string> = Object.fromEntries(COUNTRIES.map((c) => [c.value, c.label]))
const STATE_ITEMS: Record<string, string> = Object.fromEntries(
  STATE_CODES.map((c) => [c, `${STATE_NAMES[c]} (${c})`]),
)
const CATEGORY_ITEMS: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]))

export function JobFinder() {
  const router = useRouter()
  const [country, setCountry] = useState("au")
  const [state, setState] = useState<StateCode>("NSW")
  const [tab, setTab] = useState<"shortage" | "pay">("shortage")

  function go() {
    router.push(`/map?state=${state}&tab=${tab}`)
  }

  return (
    <div className="bg-background">
      {/* ── Selector hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
          <h1 className="font-display text-3xl font-semibold leading-[1.14] tracking-tight text-white sm:text-[2.6rem] break-keep">
            어디서 일할 수 있는지부터 시작하세요
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-blue-100 break-keep sm:text-base">
            국가와 지역을 고르면, 그 지역에서 사람이 부족한 직업과 연봉이 높은 직업을 바로 보여드려요.
          </p>

          {/* Selector card */}
          <div className="mt-8 rounded-2xl bg-white p-4 text-left shadow-xl sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="국가">
                <Select items={COUNTRY_ITEMS} value={country} onValueChange={(v) => v && setCountry(v)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} disabled={!c.enabled}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="지역 (주·준주)">
                <Select items={STATE_ITEMS} value={state} onValueChange={(v) => v && setState(v as StateCode)}>
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

              <Field label="카테고리">
                <Select items={CATEGORY_ITEMS} value={tab} onValueChange={(v) => v && setTab(v as "shortage" | "pay")}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <button
              type="button"
              onClick={go}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              직업 보기
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/map"
              className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              <MapPin className="h-3.5 w-3.5" />
              지도에서 바로 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* ── Provenance strip ── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center">
          <h2 className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            정부·공공 데이터 기반
          </h2>
          <p className="mt-2 text-xs text-slate-500 break-keep">
            부족 직종은 OSCA 2025 부족직종 목록, 연봉은 ABS 소득 데이터를 사용합니다. 일부 수치는 추정치이며 공식 출처로 검증 중입니다.
          </p>
        </div>
      </section>
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
