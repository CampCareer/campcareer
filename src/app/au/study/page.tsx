import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BarChart3, MapPin, Search } from 'lucide-react'
import { AU_AQF_FILTERS, AU_STATES, getAuUniversitiesByIds, isAuAqfFilter, type AuAqfFilter, aqfLabel } from '@/lib/au-universities'
import { STUDY_CATEGORIES } from '@/data/study-concepts'
import { fetchRoiData } from '@/lib/roi-query'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: 'Australia Study Options — Tuition, Graduate Outcomes & ROI',
  description: 'Compare Australian university study options by field, state and AQF level using published tuition, QILT provider outcomes and transparent ROI estimates.',
  path: '/au/study',
})

type SearchParams = { field?: string; state?: string; level?: string; category?: string }

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
  const category = STUDY_CATEGORIES.some((item) => item.id === params.category) ? params.category! : ''
  return { field, state, level, category }
}

const CATEGORY_FIELD_PATTERNS: Record<string, RegExp> = {
  trades: /apprentice|building|construction|carpentry|electrical|plumbing|welding|trade/i,
  health: /health|nurs|medical|clinical|pharmacy|therapy|rehabilitation|care/i,
  technology: /computer|software|information|data|cyber|digital|artificial intelligence|it\b/i,
  engineering: /engineering|built environment|mechanical|civil|electrical|manufacturing/i,
  business: /business|commerce|accounting|finance|economics|management|marketing/i,
  education: /education|teaching|early childhood|social work|community services/i,
  environment: /environment|agriculture|sustainability|natural resource|science/i,
  design: /design|architecture|media|creative|visual|communication/i,
  hospitality: /hospitality|tourism|hotel|culinary|food/i,
  transport: /aviation|transport|maritime|automotive|logistics/i,
}

function matchesCategory(fieldName: string | null | undefined, category: string) {
  if (!category) return true
  return CATEGORY_FIELD_PATTERNS[category]?.test(fieldName ?? '') ?? true
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
  for (const rawRow of (result.data as RoiRow[]).filter((row) => matchesCategory(row.field_name, filters.category))) {
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
    <main className="min-h-screen bg-transparent">
      <section className="border-b border-slate-200/90 bg-transparent">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <h1 className="mb-5 text-left text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:whitespace-nowrap lg:text-4xl">Find the right study option in Australia</h1>
          <form className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]" action="/au/study">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="relative block flex-1">
                <span className="mb-1 block text-xs font-semibold text-slate-600">Study field</span>
                <Search className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 text-slate-400" />
                <input name="field" defaultValue={filters.field} maxLength={80} placeholder="e.g. nursing or software" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="block min-w-52"><span className="mb-1 block text-xs font-semibold text-slate-600">Major category</span><select name="category" defaultValue={filters.category} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="">All categories</option>{STUDY_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label className="block min-w-36"><span className="mb-1 block text-xs font-semibold text-slate-600">State</span><select name="state" defaultValue={filters.state} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="ALL_STATES">All states</option>{AU_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
              <label className="block min-w-48"><span className="mb-1 block text-xs font-semibold text-slate-600">Study level</span><select name="level" defaultValue={filters.level} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{Object.entries(AU_AQF_FILTERS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label>
              <button className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">Search</button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white"><div className="mx-auto max-w-6xl px-5 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{rows.length} {filters.category ? `${STUDY_CATEGORIES.find((item) => item.id === filters.category)?.label ?? ''} ` : ''}university options</h2>
            <p className="mt-1 text-sm text-slate-500">Sorted by the available ROI estimate. Select a university to review its fields and assumptions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/au/majors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-700">Explore majors <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/au/study/compare" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
              Compare universities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {rows.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => {
              const university = universities.get(row.college_id)!
              const compareHref = `/au/study/compare?schools=${encodeURIComponent(university.institutionId)}`
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
                    <Link href={`/au/study/providers/${university.institutionId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-blue-700">Review outcomes <ArrowRight className="h-4 w-4" /></Link>
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
      </div></section>
    </main>
  )
}
