import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, Plus } from 'lucide-react'
import { AU_AQF_FILTERS, aqfLabel, getAuUniversityCatalog, isAuAqfFilter, type AuAqfFilter } from '@/lib/au-universities'
import { fetchRoiData } from '@/lib/roi-query'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Compare Australian University ROI',
 description: 'Compare Australian university tuition and provider-level graduate outcomes in the same country.',
  robots: { index: false, follow: true },
}

type SearchParams = { schools?: string | string[]; field?: string; level?: string }
type Row = {
  field_name?: string | null
  aqf_level?: number | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  graduation_rate?: number | null
  roi_score?: number | null
  payback_years?: number | null
}

function queryValues(value: string | string[] | undefined) {
  return [...new Set((Array.isArray(value) ? value : value ? [value] : []).filter(Boolean))].slice(0, 3)
}

function money(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `A$${Math.round(value).toLocaleString()}` : '—'
}

function percent(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value * 100)}%` : '—'
}

function bestMatchingRow(rows: Row[], field: string, levels: readonly number[]) {
  return rows
    .filter((row) => !field || (row.field_name ?? '').toLowerCase().includes(field.toLowerCase()))
    .filter((row) => levels.length === 0 || (typeof row.aqf_level === 'number' && levels.includes(row.aqf_level)))
    .sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))[0] ?? null
}

export default async function AustralianUniversityComparePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const catalog = await getAuUniversityCatalog()
  const bySlug = new Map(catalog.map((university) => [university.institutionId, university]))
  const selectedSlugs = queryValues(params.schools).filter((slug) => bySlug.has(slug))
  const field = params.field?.trim().slice(0, 80) ?? ''
  const level: AuAqfFilter = isAuAqfFilter(params.level) ? params.level : 'all'
  const levels = AU_AQF_FILTERS[level].levels
  const selected = selectedSlugs.map((slug) => bySlug.get(slug)!)
  const rows = await Promise.all(selected.map(async (university) => {
    const result = await fetchRoiData({ country: 'au', collegeId: university.id, limit: 200, sort: 'roi_score' })
    return { university, row: bestMatchingRow(result.data as Row[], field, levels) }
  }))

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
          <Link href="/au/study" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Australian universities</Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Compare university ROI in Australia</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Keep the country constant, then compare tuition groups against the same kind of provider-level graduate outcome evidence.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <form action="/au/study/compare" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <label key={index}>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">University {index + 1}{index > 0 ? ' (optional)' : ''}</span>
                <select name="schools" defaultValue={selectedSlugs[index] ?? ''} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Choose a university</option>
                  {catalog.map((university) => <option key={university.id} value={university.institutionId}>{university.name}{university.state ? ` · ${university.state}` : ''}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <input name="field" defaultValue={field} maxLength={80} placeholder="Optional field, e.g. nursing" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <select name="level" defaultValue={level} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              {Object.entries(AU_AQF_FILTERS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"><BarChart3 className="h-4 w-4" /> Compare</button>
          </div>
        </form>

        {selected.length < 2 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Plus className="mx-auto h-6 w-6 text-slate-400" />
            <h2 className="mt-3 font-semibold text-slate-950">Select two or three universities</h2>
            <p className="mt-2 text-sm text-slate-500">A field is optional. Without one, each university’s highest available ROI group is shown.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4 font-semibold">Measure</th>{rows.map(({ university }) => <th key={university.id} className="px-5 py-4 font-semibold text-slate-800">{university.name}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Matched field & level', ({ row }: typeof rows[number]) => row ? `${row.field_name?.replace(/\.$/, '') || 'Best available'} · ${aqfLabel(row.aqf_level)}` : 'No matching group'],
                  ['Annual tuition', ({ row }: typeof rows[number]) => money(row?.tuition)],
                  ['Graduate earnings*', ({ row }: typeof rows[number]) => money(row?.median_earnings)],
                  ['Employment rate*', ({ row }: typeof rows[number]) => percent(row?.employment_rate)],
                  ['Completion rate*', ({ row }: typeof rows[number]) => percent(row?.graduation_rate)],
                  ['ROI estimate', ({ row }: typeof rows[number]) => row?.roi_score?.toFixed(1) ?? '—'],
                  ['Estimated payback', ({ row }: typeof rows[number]) => row?.payback_years ? `${row.payback_years} years` : '—'],
                ].map(([label, render]) => (
                  <tr key={label as string}><th className="px-5 py-4 font-medium text-slate-600">{label as string}</th>{rows.map((entry) => <td key={entry.university.id} className="px-5 py-4 font-semibold text-slate-900">{(render as (entry: typeof rows[number]) => string)(entry)}</td>)}</tr>
                ))}
                <tr><th className="px-5 py-4 font-medium text-slate-600">Profile</th>{rows.map(({ university }) => <td key={university.id} className="px-5 py-4"><Link className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800" href={`/au/study/providers/${university.institutionId}`}>View details <ArrowRight className="h-4 w-4" /></Link></td>)}</tr>
              </tbody>
            </table>
          </div>
        )}

        <aside className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-6 text-slate-700"><div className="flex items-center gap-2 font-semibold text-slate-950"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Comparison rule</div><p className="mt-1">* Earnings, employment and completion measures are provider-level outcome data. Tuition and course grouping are field/AQF-specific. Confirm the exact course, fees and entry requirements with each university.</p></aside>
      </section>
    </main>
  )
}
