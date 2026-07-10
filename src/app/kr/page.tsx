import type { Metadata } from "next"
import Link from "next/link"
import { KR_OCCUPATIONS, KR_REGIONS, KR_UNIVERSITIES } from "@/data/kr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "한국 지역별 직업·주거·대학 지도 | CampCareer",
  description: "17개 시·도별 직업 수요, 임금, 월세·전세, 유망 업종과 QS Top 500 대학을 같은 지도에서 비교합니다.",
  path: "/kr",
})

export default function KoreaHubPage() {
  const publishedOccupations = KR_OCCUPATIONS.filter((occupation) => occupation.reviewStatus === "approved" && occupation.commercialUseAllowed)
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">South Korea</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">한국 지역별 커리어와 주거비 비교</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">부족·채용 수요, 직업 임금, 월세와 전세, 관련 학과, 대학을 시·도 단위로 분리해 봅니다. 출처와 이용 조건이 확인된 값만 공개합니다.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/map?country=kr" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">한국 Maps 열기</Link>
            <Link href="/kr/jobs" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100">직업 데이터 보기</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric value="17" label="시·도" note="첫 지역 단위" />
          <Metric value={String(publishedOccupations.length)} label="품질 통과 직업" note="임금·수요·출처 기준" />
          <Metric value={String(KR_UNIVERSITIES.length)} label="QS 검증 대학 핀" note="2027 출처 연결" />
        </div>
        <section className="mt-10">
          <h2 className="text-xl font-semibold">지역 선택</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {KR_REGIONS.map((region) => (
              <Link key={region.code} href={`/maps/kr/regions/${region.nameEn.toLowerCase()}`} className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-slate-400 hover:bg-slate-50">
                <span className="font-semibold text-slate-900">{region.nameKo}</span>
                <span className="ml-2 text-slate-500">{region.nameEn}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>
}
