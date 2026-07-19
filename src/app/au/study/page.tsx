import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Database, ExternalLink, MapPin } from 'lucide-react'
import { AU_AQF_FILTERS, AU_STATES, getAuUniversitiesByIds, isAuAqfFilter, type AuAqfFilter, aqfLabel } from '@/lib/au-universities'
import { getAuStudyCardCourseEvidence, getAuStudyEvidenceKey, type AuStudyCardCourseEvidence } from '@/lib/au-study-card-evidence'
import { AuStudyCompareToggle, AuStudyCompareTrayProvider } from '@/components/study/au-study-compare-tray'
import { AuStudyFilterBar } from '@/components/study/au-study-filter-bar'
import { STUDY_CATEGORIES } from '@/data/study-concepts'
import { fetchRoiData } from '@/lib/roi-query'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: 'Australia Study Options — Tuition, Graduate Outcomes & ROI',
  description: 'Compare Australian university study options by field, state and AQF level using published tuition, QILT provider outcomes and transparent ROI estimates.',
  path: '/au/study',
})

type SearchParams = { field?: string; state?: string; level?: string; category?: string; compare?: string }

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

function dateLabel(value: string | null) {
  if (!value) return 'Pending verification'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Pending verification'
    : new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function courseLinkStyle(evidence: AuStudyCardCourseEvidence) {
  if (evidence.kind === 'verified_course') return 'border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
  if (evidence.kind === 'cricos_record') return 'border-blue-200 bg-blue-50 text-blue-950 hover:bg-blue-100'
  if (evidence.kind === 'provider_catalogue' || evidence.kind === 'provider_site') return 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
  return 'border-amber-200 bg-amber-50 text-amber-900'
}

function readSearchParams(params: SearchParams) {
  const field = params.field?.trim().slice(0, 80) ?? ''
  const state = AU_STATES.includes(params.state as typeof AU_STATES[number]) ? params.state! : 'ALL_STATES'
  const level: AuAqfFilter = isAuAqfFilter(params.level) ? params.level : 'all'
  const category = STUDY_CATEGORIES.some((item) => item.id === params.category) ? params.category! : ''
  return { field, state, level, category }
}

function compareValues(value: string | undefined) {
  return [...new Set((value ?? '').split(',').map((item) => item.trim()).filter(Boolean))].slice(0, 3)
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
  const params = await searchParams
  const filters = readSearchParams(params)
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
  const courseEvidence = await getAuStudyCardCourseEvidence(rows.map((row) => {
    const university = universities.get(row.college_id)!
    return {
      institutionId: university.institutionId,
      fieldName: row.field_name,
      aqfLevel: row.aqf_level,
      providerWebsiteUrl: university.websiteUrl,
    }
  }))
  const visibleUniversities = new Map(rows.map((row) => {
    const university = universities.get(row.college_id)!
    return [university.institutionId, university]
  }))
  const rowByInstitutionId = new Map(rows.map((row) => {
    const university = universities.get(row.college_id)!
    return [university.institutionId, row]
  }))
  const initialCompare = compareValues(params.compare)
    .filter((institutionId) => visibleUniversities.has(institutionId))
    .map((institutionId) => {
      const university = visibleUniversities.get(institutionId)!
      const row = rowByInstitutionId.get(institutionId)
      return { id: university.institutionId, name: university.name, state: university.state, fieldName: row?.field_name?.replace(/\.$/, '') ?? null, aqfLevel: row?.aqf_level ?? null }
    })
  const filterKey = [filters.field, filters.category, filters.state, filters.level, initialCompare.map((item) => item.id).join(',')].join('|')

  return (
    <main className="min-h-screen bg-transparent">
      <section className="border-b border-slate-200/90 bg-transparent">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <h1 className="mb-5 text-left text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:whitespace-nowrap lg:text-4xl">Find the right study option in Australia</h1>
          <AuStudyFilterBar key={[filters.field, filters.category, filters.state, filters.level].join('|')} initialValues={filters} />
        </div>
      </section>

      <section className="bg-white"><div className="mx-auto max-w-6xl px-5 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{rows.length} {filters.category ? `${STUDY_CATEGORIES.find((item) => item.id === filters.category)?.label ?? ''} ` : ''}university options</h2>
            <p className="mt-1 text-sm text-slate-500">Sorted by the available ROI estimate. Each card separates field-level tuition from provider-level outcomes and shows the best official course source currently available.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/au/majors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-700">Explore majors <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/au/study/compare" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
              Compare universities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {rows.length > 0 ? (
          <AuStudyCompareTrayProvider key={filterKey} initialSelected={initialCompare} filters={filters}>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => {
              const university = universities.get(row.college_id)!
              const evidence = courseEvidence[getAuStudyEvidenceKey({ institutionId: university.institutionId, fieldName: row.field_name, aqfLevel: row.aqf_level })]
              return (
                <article key={row.college_id} className="group relative flex min-h-[31rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_14px_32px_rgba(37,99,235,.12)]">
                  <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">{row.field_name?.replace(/\.$/, '') || 'Best available field estimate'}</p>
                      <h3 className="mt-2 text-lg font-semibold leading-6 text-slate-950">{university.name}</h3>
                    </div>
                    <span className="shrink-0 rounded-xl border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 text-right text-xs font-semibold leading-4 text-indigo-900"><span className="block text-[10px] font-medium uppercase tracking-wide text-indigo-500">Value estimate</span>{row.roi_score?.toFixed(1) ?? '—'}</span>
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4" />{university.city ?? row.college_city ?? 'Australia'}{university.state ? `, ${university.state}` : ''}</p>
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-3 text-sm leading-5 text-slate-700">
                    <p className="font-semibold text-slate-950">Why this option appears</p>
                    <p className="mt-1">This is the strongest available value estimate for {university.name} in your current search, combining {aqfLabel(row.aqf_level).toLowerCase()} tuition with provider-level QILT outcomes. Estimated payback: <span className="font-semibold text-slate-950">{row.payback_years?.toFixed(1) ?? '—'} years</span>.</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                    <Metric label="Annual tuition" value={money(row.tuition)} detail={`${aqfLabel(row.aqf_level)} field group`} />
                    <Metric label="Graduate earnings*" value={money(row.median_earnings)} detail="Provider level · QILT 2024" />
                    <Metric label="Employment*" value={percent(row.employment_rate)} detail="Provider level · QILT 2024" />
                    <Metric label="Completion*" value={percent(row.graduation_rate)} detail="Provider level · QILT 2024" />
                  </div>
                  <div className={`mt-4 rounded-xl border p-3 ${courseLinkStyle(evidence)}`}>
                    <div className="flex items-start gap-2.5">
                      {evidence.kind === 'verified_course' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />}
                      <div className="min-w-0">
                        {evidence.href ? <a href={evidence.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-2 hover:underline">{evidence.label}<ExternalLink className="h-3.5 w-3.5" /></a> : <p className="text-sm font-semibold">{evidence.label}</p>}
                        <p className="mt-0.5 text-xs leading-5 opacity-80">{evidence.detail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500"><Database className="mt-0.5 h-3.5 w-3.5 shrink-0" /><p>Outcomes: QILT GOS 2024 · Course source checked: {dateLabel(evidence.checkedAt)}</p></div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <Link href={`/au/study/providers/${university.institutionId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-blue-700">Review outcomes <ArrowRight className="h-4 w-4" /></Link>
                    <AuStudyCompareToggle option={{ id: university.institutionId, name: university.name, state: university.state, fieldName: row.field_name?.replace(/\.$/, '') ?? null, aqfLevel: row.aqf_level ?? null }} />
                  </div>
                </article>
              )
            })}
          </div>
          </AuStudyCompareTrayProvider>
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

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div>
    <p className="text-[11px] font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</p>
    <p className="mt-1 text-[11px] leading-4 text-slate-500">{detail}</p>
  </div>
}
