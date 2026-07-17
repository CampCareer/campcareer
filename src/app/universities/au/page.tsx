import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BarChart3, Building2, MapPin, Search, ShieldCheck } from 'lucide-react'
import { AU_AQF_FILTERS, AU_STATES, getAuUniversitiesByIds, isAuAqfFilter, type AuAqfFilter, aqfLabel } from '@/lib/au-universities'
import { fetchRoiData } from '@/lib/roi-query'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: 'Australian Universities — Tuition, Graduate Outcomes & ROI',
  description: 'Compare Australian universities by field, state and study level using published tuition, QILT provider outcomes and transparent ROI estimates.',
  path: '/universities/au',
})

type SearchParams = { field?: string; state?: string; level?: string }

type RoiRow = {
  college_id: string
  college_name: string
  college_state: string
  college_city?: string | null
  field_name?: string | null
  aqf_level?: number | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  graduation_rate?: number | null
  roi_score?: number | null
  payback_years?: number | null
  course_count?: number | null
}

function money(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value)
    ? `A$${Math.round(value).toLocaleString()}`
    : '—'
}

function percent(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value * 100)}%` : '—'
}

function readSearchParams(params: SearchParams) {
  const field = params.field?.trim().slice(0, 80) ?? ''
  const state = AU_STATES.includes(params.state as typeof AU_STATES[number]) ? params.state! : 'ALL_STATES'
  const level: AuAqfFilter = isAuAqfFilter(params.level) ? params.level : 'all'
  return { field, state, level }
}

export default async function AustralianUniversitiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = readSearchParams(await searchParams)
  const result = await fetchRoiData({
    country: 'au',
    state: filters.state,
    field: filters.field || null,
    aqfLevels: AU_AQF_FILTERS[filters.level].levels,
    limit: 500,
    sort: 'roi_score',
  })

  // With no field selected the useful discovery unit is a university, not a
  // repetitive list of the same provider's course groups.
  const rowsByUniversity = new Map<string, RoiRow>()
  for (const rawRow of result.data as RoiRow[]) {
    const current = rowsByUniversity.get(rawRow.college_id)
    if (!current || (rawRow.roi_score ?? 0) > (current.roi_score ?? 0)) {
      rowsByUniversity.set(rawRow.college_id, rawRow)
    }
  }
  const universities = await getAuUniversitiesByIds([...rowsByUniversity.keys()])
  const rows = [...rowsByUniversity.values()]
    .filter((row) => universities.has(row.college_id))
    .slice(0, 60)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
          <p className="text-sm font-semibold text-blue-700">Australia · Universities</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Find an Australian university that fits your field and budget
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Compare published tuition with provider-level graduate outcomes. ROI is an estimate for comparing options—not a promise of an individual outcome.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-800"><Building2 className="h-4 w-4" /> 41 providers with ROI-ready records</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800"><ShieldCheck className="h-4 w-4" /> Tuition + QILT provider outcomes</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_140px_210px_auto]" action="/universities/au">
          <label className="relative block">
            <span className="sr-only">Study field</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input name="field" defaultValue={filters.field} maxLength={80} placeholder="Search a field, e.g. nursing or software" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </label>
          <label>
            <span className="sr-only">State</span>
            <select name="state" defaultValue={filters.state} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="ALL_STATES">All states</option>
              {AU_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Study level</span>
            <select name="level" defaultValue={filters.level} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              {Object.entries(AU_AQF_FILTERS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
          </label>
          <button className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">Search</button>
        </form>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{rows.length} university options</h2>
            <p className="mt-1 text-sm text-slate-500">Sorted by the available ROI estimate. Select a university to review its fields and assumptions.</p>
          </div>
          <Link href="/universities/au/compare" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
            Compare universities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {rows.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => {
              const university = universities.get(row.college_id)!
              const compareHref = `/universities/au/compare?schools=${encodeURIComponent(university.institutionId)}`
              return (
                <article key={row.college_id} className="flex min-h-72 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{row.field_name?.replace(/\.$/, '') || 'Best available field estimate'}</p>
                      <h3 className="mt-1 text-lg font-semibold leading-6 text-slate-950">{university.name}</h3>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">ROI {row.roi_score?.toFixed(1) ?? '—'}</span>
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4" />{university.city ?? row.college_city ?? 'Australia'}{university.state ? `, ${university.state}` : ''}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-sm">
                    <div><p className="text-xs text-slate-500">Annual tuition</p><p className="mt-1 font-semibold text-slate-900">{money(row.tuition)}</p></div>
                    <div><p className="text-xs text-slate-500">Graduate earnings</p><p className="mt-1 font-semibold text-slate-900">{money(row.median_earnings)}</p></div>
                    <div><p className="text-xs text-slate-500">Study level</p><p className="mt-1 font-medium text-slate-800">{aqfLabel(row.aqf_level)}</p></div>
                    <div><p className="text-xs text-slate-500">Employment rate</p><p className="mt-1 font-medium text-slate-800">{percent(row.employment_rate)}</p></div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <Link href={`/universities/au/${university.institutionId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-blue-700">Review outcomes <ArrowRight className="h-4 w-4" /></Link>
                    <Link href={compareHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"><BarChart3 className="h-4 w-4" /> Compare</Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-slate-950">No matching university estimate yet</h2>
            <p className="mt-2 text-sm text-slate-500">Try a broader field name, a different study level, or all states.</p>
          </div>
        )}

        <aside className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-slate-950">How to use this comparison</p>
          <p className="mt-1">Tuition and course counts are grouped by field and AQF level. Graduate earnings, employment and completion data are provider-level QILT measures, so use them to shortlist—not to infer a guaranteed course-specific result.</p>
        </aside>
      </section>
    </main>
  )
}
