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

// 홈 검색 = 딱 두 가지만 고른다: 나라 + 카테고리(부족직종/고연봉).
// 지역(주)은 /map 에서 고르므로 여기서는 받지 않는다.
// 호주만 활성, 나머지 국가는 "곧 추가"(disabled).
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
const CATEGORY_ITEMS: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]))

export function HomeFinder() {
  const router = useRouter()
  const [country, setCountry] = useState("au")
  const [tab, setTab] = useState<"shortage" | "pay">("shortage")

  function go() {
    // 현재는 호주만 활성 → /map 이 AU 로 프레이밍되고, 탭만 미리 선택한다.
    router.push(`/map?tab=${tab}`)
  }

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-xl px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
          {/* Selector card */}
          <div className="rounded-2xl bg-white p-4 text-left shadow-xl sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="나라">
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

              <Field label="직업군">
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
