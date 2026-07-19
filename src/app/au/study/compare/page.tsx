import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, ExternalLink, GraduationCap, MapPin, Plus } from 'lucide-react'
import { AU_AQF_FILTERS, aqfLabel, getAuUniversityCatalog, isAuAqfFilter, type AuAqfFilter } from '@/lib/au-universities'
import { getAuStudyCardCourseEvidence, getAuStudyEvidenceKey } from '@/lib/au-study-card-evidence'
import { fetchRoiData } from '@/lib/roi-query'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Compare Australian University ROI',
 description: 'Compare Australian university tuition and provider-level graduate outcomes in the same country.',
  robots: { index: false, follow: true },
}

type SearchParams = { schools?: string | string[]; field?: string; level?: string; aqf?: string }
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

const AQF_LEVELS = [5, 6, 7, 8, 9, 10] as const

function validAqfLevel(value: string | undefined) {
  const parsed = Number(value)
  return AQF_LEVELS.includes(parsed as typeof AQF_LEVELS[number]) ? parsed : null
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
  const selectedAqf = validAqfLevel(params.aqf)
  const levels = selectedAqf ? [selectedAqf] : AU_AQF_FILTERS[level].levels
  const selected = selectedSlugs.map((slug) => bySlug.get(slug)!)
  const rows = await Promise.all(selected.map(async (university) => {
    const result = await fetchRoiData({ country: 'au', collegeId: university.id, limit: 200, sort: 'roi_score' })
    return { university, row: bestMatchingRow(result.data as Row[], field, levels) }
  }))
  const courseEvidence = await getAuStudyCardCourseEvidence(rows.map(({ university, row }) => ({
    institutionId: university.institutionId,
    fieldName: row?.field_name ?? field,
    aqfLevel: row?.aqf_level ?? selectedAqf,
    providerWebsiteUrl: university.websiteUrl,
  })))

  const matchedRows = rows.filter((entry) => entry.row)
  const decisionCues = [
    {
      label: 'Lowest annual tuition',
      entries: matchedRows.filter(({ row }) => typeof row?.tuition === 'number'),
      value: (row: Row) => money(row.tuition),
      compare: (left: Row, right: Row) => (left.tuition ?? Infinity) - (right.tuition ?? Infinity),
    },
    {
      label: 'Highest graduate earnings*',
      entries: matchedRows.filter(({ row }) => typeof row?.median_earnings === 'number'),
      value: (row: Row) => money(row.median_earnings),
      compare: (left: Row, right: Row) => (right.median_earnings ?? -Infinity) - (left.median_earnings ?? -Infinity),
    },
    {
      label: 'Shortest estimated payback',
      entries: matchedRows.filter(({ row }) => typeof row?.payback_years === 'number'),
      value: (row: Row) => `${row.payback_years?.toFixed(1)} years`,
      compare: (left: Row, right: Row) => (left.payback_years ?? Infinity) - (right.payback_years ?? Infinity),
    },
  ].map((cue) => {
    const winner = [...cue.entries].sort((left, right) => cue.compare(left.row!, right.row!))[0]
    return winner ? { label: cue.label, value: cue.value(winner.row!), university: winner.university.name } : null
  }).filter((cue): cue is { label: string; value: string; university: string } => cue !== null)

  const comparisonMetrics: Array<[string, (entry: typeof rows[number]) => ReactNode]> = [
    ['Matched field & AQF', ({ row }) => row ? `${row.field_name?.replace(/\.$/, '') || 'Best available'} · ${aqfLabel(row.aqf_level)}` : 'No equivalent course group found'],
    ['Annual tuition', ({ row }) => money(row?.tuition)],
    ['Graduate earnings*', ({ row }) => money(row?.median_earnings)],
    ['Employment rate*', ({ row }) => percent(row?.employment_rate)],
    ['Completion rate*', ({ row }) => percent(row?.graduation_rate)],
    ['ROI estimate', ({ row }) => row?.roi_score?.toFixed(1) ?? '—'],
    ['Estimated payback', ({ row }) => row?.payback_years ? `${row.payback_years.toFixed(1)} years` : '—'],
    ['Official course source', ({ university, row }) => {
      if (!row) return <span className="font-normal text-slate-500">No equivalent course group</span>
      const source = courseEvidence[getAuStudyEvidenceKey({ institutionId: university.institutionId, fieldName: row.field_name, aqfLevel: row.aqf_level })]
      if (!source?.href) return <span className="font-normal text-slate-500">{source?.label ?? 'Pending verification'}</span>
      return <a href={source.href} target="_blank" rel="noreferrer" className="inline-flex max-w-[13rem] items-center gap-1 text-blue-700 hover:text-blue-800 hover:underline"><span className="truncate">{source.label}</span><ExternalLink className="size-3.5 shrink-0" /></a>
    }],
  ]

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-blue-100 bg-[radial-gradient(circle_at_top_right,_rgba(191,219,254,.6),_transparent_42%),linear-gradient(180deg,_#ffffff,_#eff6ff)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
          <Link href="/au/study" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"><ArrowRight className="h-4 w-4 rotate-180" /> Australian study options</Link>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-blue-800"><GraduationCap className="h-3.5 w-3.5" /> Australia · same-country comparison</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Compare university ROI in Australia</h1>
            </div>
            {selected.length > 0 && <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 text-sm shadow-sm"><p className="font-semibold text-slate-950">{selected.length} school{selected.length === 1 ? '' : 's'} selected</p><p className="mt-0.5 text-xs text-slate-500">Add up to three side by side</p></div>}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Keep the country constant, then compare the same field and AQF level against the same kind of provider-level graduate outcome evidence.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <form action="/au/study/compare" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <label key={index} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition focus-within:border-blue-200 focus-within:bg-blue-50/50">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">University {index + 1}{index > 0 ? ' (optional)' : ''}</span>
                <select name="schools" defaultValue={selectedSlugs[index] ?? ''} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Choose a university</option>
                  {catalog.map((university) => <option key={university.id} value={university.institutionId}>{university.name}{university.state ? ` · ${university.state}` : ''}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <input name="field" defaultValue={field} maxLength={80} placeholder="Optional subject, e.g. nursing" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <select name="aqf" defaultValue={selectedAqf ? String(selectedAqf) : ''} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="">Choose an AQF level</option>
              {AQF_LEVELS.map((aqf) => <option key={aqf} value={aqf}>AQF {aqf} · {aqfLabel(aqf)}</option>)}
            </select>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"><BarChart3 className="h-4 w-4" /> Compare</button>
          </div>
        </form>

        {selected.length > 0 && <div className="mt-5 flex flex-wrap gap-2">
          {selected.map((university, index) => <div key={university.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">{index + 1}</span><span className="font-semibold text-slate-800">{university.name}</span>{university.state && <span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{university.state}</span>}</div>)}
        </div>}

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Comparison basis</p><p className="mt-1 text-sm font-semibold text-slate-950">{field || 'Choose a subject'} {selectedAqf ? `· AQF ${selectedAqf} (${aqfLabel(selectedAqf)})` : '· Choose one AQF level'}</p><p className="mt-1 text-xs leading-5 text-slate-600">Each column is matched to this same basis. A blank cell means we could not confirm an equivalent group—not that the university has no course.</p></div>
          <Link href="/au/study" className="mt-3 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 sm:mt-0">Change shortlist <ArrowRight className="size-4" /></Link>
        </div>

        {selected.length < 2 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Plus className="mx-auto h-6 w-6 text-slate-400" />
            <h2 className="mt-3 font-semibold text-slate-950">Select two or three universities</h2>
            <p className="mt-2 text-sm text-slate-500">A field is optional. Without one, each university’s highest available ROI group is shown.</p>
          </div>
        ) : (
          <>
          {decisionCues.length > 0 && <div className="mt-6 grid gap-3 md:grid-cols-3">
            {decisionCues.map((cue) => <div key={cue.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{cue.label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{cue.value}</p><p className="mt-1 text-sm text-slate-600">{cue.university}</p></div>)}
          </div>}
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4 font-semibold">Decision measure</th>{rows.map(({ university }) => <th key={university.id} className="px-5 py-4 font-semibold text-slate-800"><span className="block">{university.name}</span>{university.state && <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-slate-500"><MapPin className="size-3" />{university.state}</span>}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonMetrics.map(([label, render]) => (
                  <tr key={label}><th className="px-5 py-4 font-medium text-slate-600">{label}</th>{rows.map((entry) => <td key={entry.university.id} className="px-5 py-4 font-semibold text-slate-900">{render(entry)}</td>)}</tr>
                ))}
                <tr><th className="px-5 py-4 font-medium text-slate-600">Profile</th>{rows.map(({ university }) => <td key={university.id} className="px-5 py-4"><Link className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800" href={`/au/study/providers/${university.institutionId}`}>View details <ArrowRight className="h-4 w-4" /></Link></td>)}</tr>
              </tbody>
            </table>
          </div>
          </>
        )}

        <aside className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-6 text-slate-700"><div className="flex items-center gap-2 font-semibold text-slate-950"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Comparison rule</div><p className="mt-1">* Earnings, employment and completion measures are provider-level outcome data. Tuition and course grouping are field/AQF-specific. Confirm the exact course, fees and entry requirements with each university.</p></aside>
      </section>
    </main>
  )
}
