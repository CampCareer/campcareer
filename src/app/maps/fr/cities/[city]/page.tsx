import type { Metadata } from "next"
import Link from "next/link"
import { FR_CITIES, FR_DEMAND_BY_CODE, FR_REGIONS, isFranceCityIndexable } from "@/data/fr-map-data"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
function getCity(slug: string) { return FR_CITIES.find((city) => city.slug === slug) ?? null }
export function generateStaticParams() { return FR_CITIES.map((city) => ({ city: city.slug })) }
export function generateMetadata({ params }: { params: { city: string } }): Metadata { const city = getCity(params.city); if (!city) return { title: "France city not found" }; return { ...pageMetadata({ title: `${city.nameFr} jobs, rent and universities | CampCareer`, description: `${city.nameFr} employment-basin hiring demand, advertised rent indicator and nearby public institutions in France.`, path: `/maps/fr/cities/${city.slug}` }), robots: { index: isFranceCityIndexable(city), follow: true } } }

export default function FranceCityPage({ params }: { params: { city: string } }) {
  const city = getCity(params.city)
  if (!city) return null
  const region = FR_REGIONS.find((item) => item.code === city.regionCode)
  const demand = city.topDemand.map((row) => ({ ...FR_DEMAND_BY_CODE.get(row.code)!, projects: row.recruitmentProjects })).filter(Boolean)
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><nav className="text-sm text-slate-500"><Link href="/fr" className="hover:text-slate-900">France</Link><span className="px-2">/</span><Link href={`/maps/fr/regions/${region?.slug}`} className="hover:text-slate-900">{region?.nameFr}</Link><span className="px-2">/</span>{city.nameFr}</nav><h1 className="mt-5 text-4xl font-semibold text-slate-950">{city.nameFr} 취업·주거 데이터</h1><p className="mt-4 text-slate-600">France Travail {city.basinName} 고용권역 · 2025 코뮌 임대광고 지표</p><section className="mt-8 grid gap-4 sm:grid-cols-3"><Card label="임대광고" value={city.rent.advertisedRentEurM2 != null ? `€${city.rent.advertisedRentEurM2.toFixed(1)}/m² / month` : "품질 기준 미달"} note={city.rent.status === "available" ? `30m² 참고 €${Math.round((city.rent.advertisedRentEurM2 ?? 0) * 30).toLocaleString()}/month` : "광고 지표이며 평균 월세가 아님"} /><Card label="관측 품질" value={city.rent.observationCount != null ? `${city.rent.observationCount.toLocaleString()} listings` : "n/a"} note={city.rent.r2Adjusted != null ? `R² ${city.rent.r2Adjusted.toFixed(2)}` : "검증 대기"} /><Card label="채용 수요" value={`${demand.length} 직업군`} note="BMO 고용권역 상위" /></section><section className="mt-10"><h2 className="text-xl font-semibold">채용 수요 상위 직업군</h2><div className="mt-3 space-y-2">{demand.slice(0, 20).map((row) => <div key={row.bmoCode} className="flex justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 text-sm"><span><span className="block font-semibold">{row.nameKo ?? row.localName}</span><span className="text-xs text-slate-500">{row.nameEn ?? row.localName}</span></span><span className="shrink-0 font-semibold text-blue-800">{row.projects.toLocaleString()} projects</span></div>)}</div></section><Link href={`/map?country=fr&state=${city.regionCode}&city=${city.code}`} className="mt-10 inline-flex text-sm font-semibold text-blue-700 hover:underline">지도에서 이 도시 보기</Link></main>
}
function Card({ label, value, note }: { label: string; value: string; note: string }) { return <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 font-semibold">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div> }
