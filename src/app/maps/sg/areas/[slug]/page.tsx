import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SG_DEMAND_OCCUPATIONS } from "@/data/sg-map-data"
import { SG_AREA_MAP_PAGES } from "@/lib/sg-map-seo"

type Props = { params: Promise<{ slug: string }> }

function findPage(slug: string) { return SG_AREA_MAP_PAGES.find((page) => page.slug === slug) ?? null }

export function generateStaticParams() { return SG_AREA_MAP_PAGES.map((page) => ({ slug: page.slug })) }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const page = findPage(params.slug)
  if (!page) return {}
  return { title: `${page.nameEn} Singapore rent and work data | CampCareer`, description: `URA ${page.uraSegment} rental-market context and national MOM job-demand signals for ${page.nameEn}, Singapore.`, alternates: { canonical: `https://www.campcareer.com${page.path}` } }
}

export default async function SingaporeAreaMapPage(props: Props) {
  const params = await props.params;
  const page = findPage(params.slug)
  if (!page) notFound()
  return <main className="mx-auto max-w-5xl px-5 py-12 text-slate-900"><p className="text-sm font-semibold text-teal-700">Singapore Maps · official data</p><h1 className="mt-2 text-3xl font-semibold">{page.nameEn} jobs and rental-market context</h1><p className="mt-2 text-slate-600">{page.nameKo} · Singapore city-state comparison</p><div className="mt-6 grid gap-4 md:grid-cols-2"><section className="rounded-lg border border-slate-200 p-5"><h2 className="font-semibold">URA rental market proxy</h2><p className="mt-3 text-2xl font-bold">{page.uraSegment} {page.rentalIndex.toFixed(1)}</p><p className="mt-2 text-sm text-slate-500">Private non-landed rental index, 1Q 2026. Quarterly change: {page.rentalChangePct >= 0 ? "+" : ""}{page.rentalChangePct.toFixed(1)}%. This is not average monthly rent.</p></section><section className="rounded-lg border border-slate-200 p-5"><h2 className="font-semibold">National job-demand coverage</h2><p className="mt-3 text-2xl font-bold">{SG_DEMAND_OCCUPATIONS.length} MOM occupations</p><p className="mt-2 text-sm text-slate-500">MOM does not publish occupation shortages by this local area. Demand cards remain national by design.</p></section></div><section className="mt-8"><h2 className="text-xl font-semibold">National high-demand occupations</h2><div className="mt-3 divide-y divide-slate-100 border-y border-slate-200">{SG_DEMAND_OCCUPATIONS.slice(0, 10).map((occupation) => <div key={occupation.sourceCode} className="flex items-center justify-between gap-4 py-3"><span>{occupation.nameEn}</span><span className="text-right text-sm"><b>S${occupation.offeredWageLowSgd.toLocaleString()}-{occupation.offeredWageHighSgd.toLocaleString()}</b><br /><span className="text-slate-500">MOM offer range/mo</span></span></div>)}</div></section><p className="mt-8 text-xs leading-relaxed text-slate-500">Sources: URA Rental Index, 1Q 2026; MOM Job Vacancies 2025. Checked {page.lastChecked}. Rent and demand use different geographic scopes and are not combined into an occupation-level local score.</p><Link href={`/map?country=sg&area=${page.code}`} className="mt-6 inline-block font-medium text-teal-700 hover:underline">Open {page.nameEn} on the interactive map</Link></main>
}
