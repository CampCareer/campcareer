"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Map as MapIcon, ShieldCheck } from "lucide-react"
import { OccupationSearch, type OccupationHit } from "@/components/occupation-search"

const POPULAR = [
  { code: "265432", label: "Registered Nurse" },
  { code: "381231", label: "Electrician" },
  { code: "131131", label: "Construction Project Manager" },
  { code: "251331", label: "Secondary School Teacher" },
  { code: "321131", label: "Chef" },
]

export function HomeFinder() {
  const router = useRouter()

  function goToOccupation(o: OccupationHit) {
    router.push(`/roi-explorer/au/occupation/${o.anzsco_code}`)
  }

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
          <h1 className="font-display text-3xl font-semibold leading-[1.14] tracking-tight text-white sm:text-[2.6rem] break-keep">
            호주에서 어떤 직업이 나를 부를까?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-blue-100 break-keep sm:text-base">
            직업을 검색하면 호주 주별 인력 부족 정도, 평균 연봉, 비자·코스 정보를 한 번에 볼 수 있어요.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <OccupationSearch onSelect={goToOccupation} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-blue-200">인기 직업</span>
            {POPULAR.map((p) => (
              <Link
                key={p.code}
                href={`/roi-explorer/au/occupation/${p.code}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <Link
            href="/map"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-blue-100 hover:text-white"
          >
            <MapIcon className="h-4 w-4" />
            지도에서 주별로 둘러보기
            <ArrowRight className="h-4 w-4" />
          </Link>
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
