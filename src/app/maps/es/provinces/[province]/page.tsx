import Link from "next/link"
import { ES_CITIES, ES_SHORTAGE_BY_PROVINCE, getSpainProvince } from "@/data/es-map-data"
import { pageMetadata } from "@/lib/seo"
export async function generateMetadata(props: { params: Promise<{ province: string }> }) {
  const params = await props.params;
  const item = getSpainProvince(params.province);return pageMetadata({ title: item ? `${item.nameEs} shortage occupations | CampCareer` : "Spain province", description: "SEPE province-level hard-to-fill occupations and student work pathways.", path: `/maps/es/provinces/${item?.slug ?? params.province}` })
}
export default async function SpainProvince(props: { params: Promise<{ province: string }> }) {
  const params = await props.params;
  const item = getSpainProvince(params.province);if (!item) return null;const jobs = ES_SHORTAGE_BY_PROVINCE[item.code] ?? [];const city = ES_CITIES.find((row) => row.provinceCode === item.code);return <main className="mx-auto max-w-4xl px-4 py-12"><Link href="/es" className="text-sm font-semibold text-blue-700">Spain</Link><h1 className="mt-5 text-4xl font-semibold">{item.nameEs} 충원 곤란 직종</h1><p className="mt-4 leading-7 text-slate-600">SEPE {item.sourceQuarter} 목록입니다. 이 도에서 목록 직종은 외국인 고용허가 신청 근거가 될 수 있으나 승인·채용 보장은 아닙니다.</p><div className="mt-8 space-y-2">{jobs.map((row) => <Link key={row.code} href={`/maps/es/${row.nameEn?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} className="block rounded-lg border p-4 hover:bg-slate-50"><b>{row.nameKo}</b><span className="mt-1 block text-sm text-slate-500">{row.nameEn} · {row.localName}</span></Link>)}</div>{city && <Link href={`/maps/es/cities/${city.slug}`} className="mt-8 inline-flex text-sm font-semibold text-blue-700">{city.nameEs} 도시 정보</Link>}</main>;
}
