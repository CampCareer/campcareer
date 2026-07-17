import Link from "next/link"
import { ES_CITIES, ES_COMMUNITIES, ES_OCCUPATIONS, ES_UNIVERSITIES, isSpainOccupationIndexable } from "@/data/es-map-data"
import { pageMetadata } from "@/lib/seo"
import {
  SpainDecisionOverview,
  SpainQuickRoiPreview,
} from "@/components/country-profiles/australia-decision-overview"
export const revalidate = 86400
export const metadata = pageMetadata({ title: "Spain Career, Rent and University Map | CampCareer", description: "Compare SEPE hard-to-fill occupations by province, INE salary groups, SERPAVI rent and RUCT universities across Spain.", path: "/es" })
export default function SpainHub() {
  const jobs = ES_OCCUPATIONS.filter(isSpainOccupationIndexable)

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-700">Spain</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">스페인 유학 후 취업·주거·대학 비교</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">도별 SEPE 충원 곤란 직종, INE 직업군 임금, SERPAVI 임대료, RUCT 등록 대학을 분리해 비교합니다.</p>
            <div className="mt-7 flex gap-3">
              <Link href="/map?country=es" className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Spain Maps 열기</Link>
              <Link href="/es/jobs" className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold">직업 데이터 보기</Link>
            </div>
          </div>
          <SpainQuickRoiPreview />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric value="17" label="자치주" />
          <Metric value="50" label="도·핵심 도시" />
          <Metric value={String(jobs.length)} label="SEPE 부족직종" />
          <Metric value={String(ES_UNIVERSITIES.length)} label="RUCT 대학 핀" />
        </div>

        <SpainDecisionOverview />

        <section className="mt-10">
          <h2 className="text-xl font-semibold">자치주 선택</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ES_COMMUNITIES.map((item) => (
              <Link key={item.code} href={`/maps/es/regions/${item.slug}`} className="rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
                <span className="font-semibold">{item.nameKo}</span>
                <span className="ml-2 text-sm text-slate-500">{item.rent.monthlyEur != null ? `€${Math.round(item.rent.monthlyEur).toLocaleString()}/month` : "공식 월 임대료 없음"}</span>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-slate-500">도시 데이터 {ES_CITIES.length}개는 공식 행정경계와 CartoCiudad 위치 데이터를 사용합니다.</p>
        </section>
      </section>
    </main>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-lg border border-slate-200 p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>
}
