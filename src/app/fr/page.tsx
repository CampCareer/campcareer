import type { Metadata } from "next"
import Link from "next/link"
import { FR_CITIES, FR_DEMAND_OCCUPATIONS, FR_REGIONS, FR_UNIVERSITIES, isFranceDemandOccupationIndexable } from "@/data/fr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const metadata: Metadata = {
  ...pageMetadata({
  title: "France Career, Rent and University Map | CampCareer",
  description: "Compare France Travail hiring demand, INSEE salary groups, city rent indicators and public universities across metropolitan France.",
  path: "/fr",
  }),
  alternates: { canonical: "/fr", languages: { en: "/fr", "ko-KR": "/ko/fr" } },
}

export default function FranceHubPage() {
  const occupations = FR_DEMAND_OCCUPATIONS.filter(isFranceDemandOccupationIndexable)
  return <main className="min-h-screen bg-white text-slate-950"><section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16"><p className="text-sm font-semibold uppercase tracking-widest text-blue-700">France</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">프랑스 지역별 커리어·주거·대학 비교</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">France Travail의 고용권역 채용 수요, INSEE 임금 직업군, 코뮌 임대광고 지표, 공공 고등교육기관을 분리해 비교합니다.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/map?country=fr" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">France Maps 열기</Link><Link href="/fr/jobs" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100">직업 데이터 보기</Link></div></div></section><section className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="grid gap-3 sm:grid-cols-4"><Metric value="13" label="본토 레지옹" note="공식 IGN 경계" /><Metric value={String(FR_CITIES.length)} label="핵심 도시" note="BMO 고용권역 연결" /><Metric value={String(occupations.length)} label="색인 직업군" note="한·영·불 이름과 BMO 수요" /><Metric value={String(FR_UNIVERSITIES.length)} label="공공기관 핀" note="MESR 기관 카탈로그" /></div><section className="mt-10"><h2 className="text-xl font-semibold">레지옹 선택</h2><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{FR_REGIONS.map((region) => <Link key={region.code} href={`/maps/fr/regions/${region.slug}`} className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-slate-400 hover:bg-slate-50"><span className="font-semibold text-slate-900">{region.nameFr}</span><span className="ml-2 text-slate-500">BMO {region.topDemand.length}개 직업군</span></Link>)}</div></section></section></main>
}
function Metric({ value, label, note }: { value: string; label: string; note: string }) { return <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div> }
