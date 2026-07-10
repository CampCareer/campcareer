import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JP_HIGH_PAY_OCCUPATIONS, JP_SHORTAGE_BY_PREFECTURE } from "@/data/jp-map-data"
import { JP_PREFECTURE_MAP_PAGES } from "@/lib/jp-map-seo"

type Props = { params: { slug: string } }

function findPage(slug: string) {
  return JP_PREFECTURE_MAP_PAGES.find((page) => page.slug === slug) ?? null
}

export function generateStaticParams() {
  return JP_PREFECTURE_MAP_PAGES.map((page) => ({ slug: page.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const page = findPage(params.slug)
  if (!page) return {}
  const title = `${page.en} Japan jobs, rent and salary data | CampCareer`
  const description = `Official Japan labour demand, rent distribution and MHLW wage data for ${page.en}.`
  return { title, description, alternates: { canonical: `https://www.campcareer.com${page.path}` } }
}

export default function JapanPrefectureMapPage({ params }: Props) {
  const page = findPage(params.slug)
  if (!page) notFound()
  const shortage = JP_SHORTAGE_BY_PREFECTURE[page.code] ?? []
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 text-slate-900">
      <p className="text-sm font-medium text-rose-700">Japan Maps · official data</p>
      <h1 className="mt-2 text-3xl font-semibold">{page.en} jobs, rent and salary data</h1>
      <p className="mt-2 text-slate-600">{page.ja} · {page.ko}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="border border-slate-200 p-5">
          <h2 className="font-semibold">Private-rental median band</h2>
          <p className="mt-3 text-2xl font-bold">{page.rent?.medianRentBandLabel ?? "Not available"}</p>
          <p className="mt-2 text-sm text-slate-500">Lower edge of the official 2023 monthly median private-rental band. It is not an average rent.</p>
        </section>
        <section className="border border-slate-200 p-5">
          <h2 className="font-semibold">Labour-demand coverage</h2>
          <p className="mt-3 text-2xl font-bold">{shortage.length} occupation groups</p>
          <p className="mt-2 text-sm text-slate-500">FY2025 annual-average effective job openings and job seekers from MHLW.</p>
        </section>
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Highest openings-to-seekers ratios</h2>
        <div className="mt-3 divide-y divide-slate-100 border-y border-slate-200">
          {shortage.slice(0, 12).map((row) => <div key={row.shortageGroupCode} className="flex items-center justify-between gap-4 py-3"><span>{row.localName}</span><span className="text-right text-sm"><b>{row.openingsToApplicantsRatio.toFixed(2)}x</b><br /><span className="text-slate-500">{row.jobOpenings.toLocaleString()} openings</span></span></div>)}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">National high-pay occupations</h2>
        <p className="mt-1 text-sm text-slate-500">These MHLW hourly baselines are national, not prefecture-specific.</p>
        <div className="mt-3 divide-y divide-slate-100 border-y border-slate-200">{JP_HIGH_PAY_OCCUPATIONS.slice(0, 10).map((row) => <div key={row.occupationCode} className="flex items-center justify-between gap-4 py-3"><span>{row.localName}</span><b>JPY {row.hourlyBaseWageYen.toLocaleString()}/hr</b></div>)}</div>
      </section>
      <p className="mt-8 text-xs leading-relaxed text-slate-500">Sources: MHLW Employment-related indicators by occupation (FY2025); MHLW Wage Structure Basic Statistical Survey; Statistics Bureau 2023 Housing and Land Survey. Checked {page.rent?.lastChecked ?? "2026-07-10"}.</p>
      <Link href={`/maps?country=jp&state=${page.code}&tab=stateInfo`} className="mt-6 inline-block font-medium text-rose-700 hover:underline">Open {page.en} on the interactive map</Link>
    </main>
  )
}
