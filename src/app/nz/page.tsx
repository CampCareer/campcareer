import type { Metadata } from "next"
import Link from "next/link"
import { CountryDataNotice } from "@/components/country-profiles/country-data-notice"
import {
  NewZealandDecisionOverview,
  NewZealandQuickRoiPreview,
} from "@/components/country-profiles/australia-decision-overview"
import { NZ_CITIES, NZ_REGIONS, NZ_UNIVERSITIES } from "@/data/nz-map-data"
import { isCountrySearchIndexable } from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata: Metadata = {
  ...pageMetadata({
    title: "New Zealand Study and Career Profile | CampCareer",
    description: "Explore New Zealand regional study locations, institutions and career-comparison methodology.",
    path: "/nz",
  }),
  alternates: { canonical: "/nz" },
  robots: { index: isCountrySearchIndexable("NZ"), follow: true },
}

export default function NewZealandHubPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">New Zealand</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">New Zealand study and career profile</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Compare regional study locations, institutions, and the ANZSCO classification used for comparable career data.
              Use the country view for budget and policy context, then explore regional references on the map.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/nz/jobs" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">View occupation methodology</Link>
              <Link href="/map?country=nz" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100">Open New Zealand Maps</Link>
            </div>
          </div>
          <NewZealandQuickRoiPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric value={String(NZ_REGIONS.length)} label="Regional profiles" note="Regional reference data" />
          <Metric value={String(NZ_CITIES.length)} label="Cities" note="Location reference data" />
          <Metric value="ANZSCO" label="Occupation classification" note="Used for exact career mappings" />
          <Metric value={String(NZ_UNIVERSITIES.length)} label="Institutions" note="Institution reference data" />
        </div>

        <NewZealandDecisionOverview />

        {!isCountrySearchIndexable("NZ") && (
          <div className="mt-8">
            <CountryDataNotice countryName="New Zealand" />
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Regional study profiles</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {NZ_REGIONS.map((region) => (
              <Link key={region.code} href={`/maps/nz/regions/${region.slug}`} className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-slate-400 hover:bg-slate-50">
                <span className="font-semibold text-slate-900">{region.nameEn}</span>
                <span className="ml-2 text-slate-500">Regional profile</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>
}
