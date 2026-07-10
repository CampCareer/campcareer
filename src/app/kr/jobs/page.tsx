import type { Metadata } from "next"
import Link from "next/link"
import { KR_OCCUPATIONS, isKoreaOccupationIndexable } from "@/data/kr-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "한국 지역별 부족·고소득 직업 | CampCareer",
  description: "출처와 갱신일, 임금과 지역 수요가 모두 확인된 한국 직업만 공개합니다.",
  path: "/kr/jobs",
})

export default function KoreaJobsPage() {
  const rows = KR_OCCUPATIONS.filter(isKoreaOccupationIndexable)
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link href="/kr" className="text-sm font-semibold text-rose-700 hover:underline">한국 허브</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">한국 지역별 직업 데이터</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">직업 코드, 지역 수요, 임금, 출처, 갱신일이 모두 있는 행만 색인 후보로 표시합니다. 채용 사이트의 개별 공고와 기업 정보는 저장하지 않습니다.</p>
      {rows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">공식 API 키와 상업 이용 조건 검증이 완료되면 직업 행이 여기에 공개됩니다. 현재는 검증 대기 데이터를 sitemap에 넣지 않습니다.</div>
      ) : (
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{rows.map((occupation) => <Link key={`${occupation.kscoCode}-${occupation.regionCode}`} href={`/maps/kr/${slugifyMapTerm(occupation.nameEn ?? occupation.nameKo)}`} className="flex items-center gap-4 py-4 hover:bg-slate-50"><span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900">{occupation.nameKo}</span><span className="mt-1 block text-sm text-slate-500">{occupation.nameEn} · KSCO {occupation.kscoCode}</span></span><span className="text-right text-sm font-semibold tabular-nums text-rose-800">KRW {occupation.annualWageKrw?.toLocaleString()}<span className="block text-[11px] font-normal text-slate-400">연 임금</span></span></Link>)}</div>
      )}
    </main>
  )
}
