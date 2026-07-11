import type { Metadata } from "next"
import Link from "next/link"
import { FR_DEMAND_OCCUPATIONS, isFranceDemandOccupationIndexable } from "@/data/fr-map-data"
import { slugifyMapTerm } from "@/lib/map-slugs"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const metadata: Metadata = { ...pageMetadata({ title: "France Hiring-Demand Occupations | CampCareer", description: "France Travail BMO 2026 occupation groups with recruitment projects, recruitment difficulty and official source links.", path: "/fr/jobs" }), alternates: { canonical: "/fr/jobs", languages: { en: "/fr/jobs", "ko-KR": "/ko/fr/jobs" } } }

export default function FranceJobsPage() {
  const rows = FR_DEMAND_OCCUPATIONS.filter(isFranceDemandOccupationIndexable)
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><Link href="/fr" className="text-sm font-semibold text-blue-700 hover:underline">France hub</Link><h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">프랑스 채용 수요 직업군</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">France Travail BMO 2026의 채용계획과 채용난이도입니다. 법정 부족직업 목록이나 비자 승인 가능성으로 해석하지 않습니다.</p><div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{rows.map((occupation) => <Link key={occupation.bmoCode} href={`/maps/fr/${slugifyMapTerm(occupation.nameEn!)}`} className="flex items-center gap-4 py-4 hover:bg-slate-50"><span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900">{occupation.nameKo}</span><span className="mt-1 block text-sm text-slate-500">{occupation.nameEn} · {occupation.localName}</span></span><span className="text-right text-sm font-semibold tabular-nums text-blue-800">{occupation.recruitmentProjects.toLocaleString()}<span className="block text-[11px] font-normal text-slate-400">2026 projects</span></span></Link>)}</div></main>
}
