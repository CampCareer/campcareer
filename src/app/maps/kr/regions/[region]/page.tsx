import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { KR_HIGH_PAY_BY_REGION, KR_OCCUPATIONS_BY_REGION, KR_REGIONS, getKoreaRegion, isKoreaRegionIndexable } from "@/data/kr-map-data"
import { pageMetadata } from "@/lib/seo"

function regionForSlug(slug: string) {
  return KR_REGIONS.find((region) => region.nameEn.toLowerCase() === slug.toLowerCase()) ?? null
}

export function generateStaticParams() {
  return KR_REGIONS.map((region) => ({ region: region.nameEn.toLowerCase() }))
}

export async function generateMetadata(props: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const params = await props.params;
  const region = regionForSlug(params.region)
  if (!region) return { title: "지역 페이지를 찾을 수 없습니다" }
  return {
    ...pageMetadata({ title: `${region.nameKo} 직업·주거·대학 지도 | CampCareer`, description: `${region.nameKo}의 직업 수요, 고소득 직군, 월세·전세, 유망 업종과 대학을 확인합니다.`, path: `/maps/kr/regions/${params.region}` }),
    robots: { index: isKoreaRegionIndexable(region), follow: true },
  }
}

export default async function KoreaRegionPage(props: { params: Promise<{ region: string }> }) {
  const params = await props.params;
  const region = regionForSlug(params.region)
  if (!region) notFound()
  const current = getKoreaRegion(region.code)!
  const demand = KR_OCCUPATIONS_BY_REGION[current.code] ?? []
  const highPay = KR_HIGH_PAY_BY_REGION[current.code] ?? []
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-slate-500"><Link href="/kr" className="hover:text-slate-900">한국</Link><span className="px-2">/</span>{current.nameKo}</nav>
      <h1 className="mt-5 text-4xl font-semibold text-slate-950">{current.nameKo} 직업·주거 지도</h1>
      <p className="mt-4 text-slate-600">{current.nameEn} · 시·도 단위 비교</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <DataBox title="월세" value={current.rent.monthlyRentKrw != null ? `KRW ${current.rent.monthlyRentKrw.toLocaleString()}/월` : "공개 표본·검증 대기"} note={current.rent.monthlyDepositKrw != null ? `보증금 KRW ${current.rent.monthlyDepositKrw.toLocaleString()}` : "40~85㎡ 아파트, 전세와 분리"} />
        <DataBox title="전세" value={current.rent.jeonseDepositKrw != null ? `KRW ${current.rent.jeonseDepositKrw.toLocaleString()}` : "공개 표본·검증 대기"} note="임의 월세 환산 없음" />
        <DataBox title="직업 데이터" value={`${demand.length}개 공개 후보`} note="공식 수요·임금 기준" />
      </section>
      <section className="mt-10 grid gap-8 md:grid-cols-2"><OccupationList title="부족·채용 수요" rows={demand} /><OccupationList title="고소득 직군" rows={highPay} /></section>
      <div className="mt-10"><Link href={`/map?country=kr&state=${current.code}`} className="text-sm font-semibold text-rose-700 hover:underline">인터랙티브 지도에서 보기</Link></div>
    </main>
  )
}

function DataBox({ title, value, note }: { title: string; value: string; note: string }) { return <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-medium text-slate-500">{title}</p><p className="mt-2 font-semibold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div> }
function OccupationList({ title, rows }: { title: string; rows: Array<{ kscoCode: string; nameKo: string; monthlyWageKrw: number | null; demandKind: string }> }) { return <section><h2 className="text-xl font-semibold">{title}</h2>{rows.length === 0 ? <p className="mt-3 text-sm text-slate-500">공식 수치와 이용 조건 검증 후 공개됩니다.</p> : <div className="mt-3 space-y-2">{rows.slice(0, 12).map((row) => <div key={row.kscoCode} className="rounded-lg border border-slate-200 px-4 py-3 text-sm"><span className="font-semibold">{row.nameKo}</span><span className="ml-2 text-slate-500">{row.monthlyWageKrw ? `KRW ${row.monthlyWageKrw.toLocaleString()}/월` : row.demandKind}</span></div>)}</div>}</section> }
