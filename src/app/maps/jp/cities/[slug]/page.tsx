import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JP_SHORTAGE_BY_PREFECTURE } from "@/data/jp-map-data"
import { JP_CITY_MAP_PAGES } from "@/lib/jp-map-seo"

type Props = { params: Promise<{ slug: string }> }
const findPage = (slug: string) => JP_CITY_MAP_PAGES.find((page) => page.slug === slug) ?? null

export function generateStaticParams() { return JP_CITY_MAP_PAGES.map((page) => ({ slug: page.slug })) }
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const page = findPage(params.slug)
  if (!page) return {}
  return { title: `${page.nameEn} Japan rent and job data | CampCareer`, description: `Official 2023 private-rental distribution and prefecture labour-demand data for ${page.nameEn}, Japan.`, alternates: { canonical: `https://www.campcareer.com${page.path}` } }
}

export default async function JapanCityMapPage(props: Props) {
  const params = await props.params;
  const page = findPage(params.slug)
  if (!page) notFound()
  const shortage = JP_SHORTAGE_BY_PREFECTURE[page.prefectureCode] ?? []
  return <main className="mx-auto max-w-4xl px-5 py-12 text-slate-900"><p className="text-sm font-medium text-rose-700">Japan Maps · official data</p><h1 className="mt-2 text-3xl font-semibold">{page.nameEn} rent and job data</h1><p className="mt-2 text-slate-600">{page.nameJa} · {page.nameKo}</p><section className="mt-6 border border-slate-200 p-5"><h2 className="font-semibold">Private-rental median band</h2><p className="mt-3 text-2xl font-bold">{page.medianRentBandLabel}</p><p className="mt-2 text-sm text-slate-500">Lower edge of the official 2023 monthly median private-rental band, not an average rent.</p></section><section className="mt-8"><h2 className="text-xl font-semibold">Top demand groups in {page.prefecture.en}</h2><p className="mt-1 text-sm text-slate-500">The MHLW labour statistic is available at prefecture level, so it is not represented as city-specific demand.</p><div className="mt-3 divide-y divide-slate-100 border-y border-slate-200">{shortage.slice(0, 10).map((row) => <div key={row.shortageGroupCode} className="flex justify-between gap-4 py-3"><span>{row.localName}</span><b>{row.openingsToApplicantsRatio.toFixed(2)}x</b></div>)}</div></section><p className="mt-8 text-xs text-slate-500">Sources: Statistics Bureau 2023 Housing and Land Survey; MHLW Employment-related indicators by occupation, FY2025. Checked {page.lastChecked}.</p><Link href={`/maps?country=jp&state=${page.prefectureCode}&tab=stateInfo`} className="mt-6 inline-block font-medium text-rose-700 hover:underline">Open {page.prefecture.en} on the interactive map</Link></main>
}
