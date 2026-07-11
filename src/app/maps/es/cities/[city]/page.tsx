import Link from "next/link"
import { ES_PROVINCES, ES_UNIVERSITIES } from "@/data/es-map-data"
import cities from "@/data/es-cities.json"
import { pageMetadata } from "@/lib/seo"
export async function generateMetadata(props: { params: Promise<{ city: string }> }) {
  const params = await props.params;
  const item = (cities as Array<{ slug: string; nameEs: string }>).find((row) => row.slug === params.city);return pageMetadata({ title: item ? `${item.nameEs} Spain career and university map | CampCareer` : "Spain city", description: "Spain city career and university context.", path: `/maps/es/cities/${params.city}` })
}
export default async function SpainCity(props: { params: Promise<{ city: string }> }) {
  const params = await props.params;
  const item = (cities as Array<{ slug: string; nameEs: string; provinceCode: string; regionCode: string }>).find((row) => row.slug === params.city);if (!item) return null;const province = ES_PROVINCES.find((row) => row.code === item.provinceCode);const universities = ES_UNIVERSITIES.filter((row) => row.regionCode === item.regionCode);return <main className="mx-auto max-w-4xl px-4 py-12"><Link href="/es" className="text-sm font-semibold text-blue-700">Spain</Link><h1 className="mt-5 text-4xl font-semibold">{item.nameEs} 취업·대학 정보</h1><p className="mt-4 text-slate-600">도별 SEPE 부족직종은 {province?.nameEs ?? "this province"} 기준으로 확인합니다. 도시 평균 임대료는 재사용 가능한 공식 집계가 없어 표시하지 않습니다.</p><h2 className="mt-10 text-xl font-semibold">같은 자치주의 RUCT 대학</h2><div className="mt-3 space-y-2">{universities.map((row) => <Link key={row.slug} href={`/map/es/university/${row.slug}`} className="block rounded border p-3 hover:bg-slate-50">{row.nameEs}</Link>)}</div></main>
}
