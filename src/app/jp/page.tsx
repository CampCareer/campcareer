import type { Metadata } from "next"
import Link from "next/link"
import {
  JP_CITIES,
  JP_HIGH_PAY_OCCUPATIONS,
  JP_PREFECTURE_SEO_DATA,
  JP_SHORTAGE_BY_PREFECTURE,
} from "@/data/jp-map-data"
import {
  JapanDecisionOverview,
  JapanQuickRoiPreview,
} from "@/components/country-profiles/australia-decision-overview"
import { pageMetadata } from "@/lib/seo"
import { JP_PREFECTURE_MAP_PAGES } from "@/lib/jp-map-seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Japan Career, Salary, Rent & University Guide | CampCareer",
  description:
    "Compare Japan's official MHLW occupation-demand and wage signals, prefecture rent bands, study-to-work pathways, and career ROI.",
  path: "/jp",
})

export default function JapanHubPage() {
  const prefWithShortageData = JP_PREFECTURE_SEO_DATA.filter(
    (prefecture) => (JP_SHORTAGE_BY_PREFECTURE[prefecture.code] ?? []).length > 0,
  ).length

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">Japan</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">일본 유학 후 취업·주거·직업 비교</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              후생노동성(MHLW)의 직업별 구인·구직 지표와 임금 기준선, 도도부현 임대료 구간을 분리해 비교합니다.
              부족 신호와 비자 결과는 별개의 판단 기준입니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/jp/jobs" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">일본 직업 데이터 보기</Link>
              <Link href="/map?country=jp" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100">Japan Maps 열기</Link>
            </div>
          </div>
          <JapanQuickRoiPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric value={String(JP_PREFECTURE_SEO_DATA.length)} label="도도부현" note="지역별 임대료·수요 비교" />
          <Metric value={String(prefWithShortageData)} label="수요 데이터 지역" note="MHLW 구인·구직 지표" />
          <Metric value={String(JP_HIGH_PAY_OCCUPATIONS.length)} label="임금 기준 직업" note="MHLW 시급 기준선" />
          <Metric value={String(JP_CITIES.length)} label="도시 생활권" note="공식 임대료 자료 연결" />
        </div>

        <JapanDecisionOverview />

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">도도부현 선택</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {JP_PREFECTURE_MAP_PAGES.slice(0, 12).map((prefecture) => (
                <Link key={prefecture.code} href={prefecture.path} className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-slate-400 hover:bg-slate-50">
                  <span className="font-semibold text-slate-900">{prefecture.ko}</span>
                  <span className="ml-2 text-slate-500">{prefecture.en}</span>
                </Link>
              ))}
            </div>
            <Link href="/map?country=jp" className="mt-4 inline-block text-sm font-semibold text-rose-700 hover:underline">전체 도도부현 지도 보기 →</Link>
          </div>

          <div>
            <h2 className="text-xl font-semibold">전국 임금 기준 상위 직업</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">후생노동성 시급 기준선입니다. 연봉 제안이나 지역별 급여를 뜻하지 않습니다.</p>
            <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
              {JP_HIGH_PAY_OCCUPATIONS.slice(0, 6).map((occupation) => (
                <div key={occupation.occupationCode} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium text-slate-900">{occupation.localName}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-rose-800">JPY {occupation.hourlyBaseWageYen.toLocaleString()}/hr</span>
                </div>
              ))}
            </div>
            <Link href="/jp/jobs" className="mt-4 inline-block text-sm font-semibold text-rose-700 hover:underline">직업 기준선 전체 보기 →</Link>
          </div>
        </section>
      </section>
    </main>
  )
}

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>
}
