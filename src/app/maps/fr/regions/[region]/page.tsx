import type { Metadata } from "next"
import Link from "next/link"
import { FR_DEMAND_BY_CODE, FR_REGIONS, FR_SALARY_BY_REGION, FR_UNIVERSITIES, isFranceRegionIndexable } from "@/data/fr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

function getRegion(slug: string) { return FR_REGIONS.find((region) => region.slug === slug) ?? null }
export function generateStaticParams() { return FR_REGIONS.map((region) => ({ region: region.slug })) }
export function generateMetadata({ params }: { params: { region: string } }): Metadata { const region = getRegion(params.region); if (!region) return { title: "France region not found" }; return { ...pageMetadata({ title: `${region.nameFr} jobs, rent and universities | CampCareer`, description: `Compare ${region.nameFr} France Travail hiring demand, INSEE salary groups, city rent indicators and public universities.`, path: `/maps/fr/regions/${region.slug}` }), robots: { index: isFranceRegionIndexable(region), follow: true } } }

export default function FranceRegionPage({ params }: { params: { region: string } }) {
  const region = getRegion(params.region)
  if (!region) return null
  const demand = region.topDemand.map((row) => ({ ...FR_DEMAND_BY_CODE.get(row.code)!, projects: row.recruitmentProjects })).filter(Boolean)
  const salaries = FR_SALARY_BY_REGION[region.code] ?? []
  const universities = FR_UNIVERSITIES.filter((university) => university.regionCode === region.code)
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><nav className="text-sm text-slate-500"><Link href="/fr" className="hover:text-slate-900">France</Link><span className="px-2">/</span>{region.nameFr}</nav><h1 className="mt-5 text-4xl font-semibold text-slate-950">{region.nameFr} 직업·주거·대학 지도</h1><p className="mt-4 text-slate-600">France Travail BMO 2026 · INSEE private-sector salaries · MESR public institutions</p><section className="mt-8 grid gap-4 md:grid-cols-3"><Box title="30㎡ 기준 월 임대료" value={region.rent.advertisedRentEurM2 != null ? `€${Math.round(region.rent.advertisedRentEurM2 * 30).toLocaleString()}/month` : "적격 도시 표본 부족"} note={region.rent.advertisedRentEurM2 != null ? `${region.rent.cityCoverage}/${region.rent.sourceCityCount} 핵심 도시 임대광고 지표를 환산한 참고값` : "실제 평균 월세 데이터 아님"} /><Box title="고용 수요" value={`${demand.length}개 BMO 직업군`} note="지역 채용계획 상위" /><Box title="공공기관" value={`${universities.length}개 핀`} note="MESR 기관 카탈로그" /></section><section className="mt-10 grid gap-8 md:grid-cols-2"><List title="채용 수요 상위" rows={demand.map((row) => ({ name: row.nameKo ?? row.localName, value: `${row.projects.toLocaleString()} projects` }))} /><List title="고소득 직업군" rows={salaries.map((salary) => ({ name: `PCS ${salary.pcsCode}`, value: `€${Math.round(salary.monthlyNetEur).toLocaleString()} net/month` }))} /></section><Link href={`/map?country=fr&state=${region.code}`} className="mt-10 inline-flex text-sm font-semibold text-blue-700 hover:underline">인터랙티브 지도에서 보기</Link></main>
}
function Box({ title, value, note }: { title: string; value: string; note: string }) { return <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-medium text-slate-500">{title}</p><p className="mt-2 font-semibold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div> }
function List({ title, rows }: { title: string; rows: Array<{ name: string; value: string }> }) { return <section><h2 className="text-xl font-semibold">{title}</h2><div className="mt-3 space-y-2">{rows.slice(0, 12).map((row) => <div key={row.name} className="flex justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm"><span className="font-semibold">{row.name}</span><span className="text-right text-slate-500">{row.value}</span></div>)}</div></section> }
