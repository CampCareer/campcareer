import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react'
import { CollegeDetailClient, type DetailRow } from '@/app/roi-explorer/[country]/[college_id]/CollegeDetailClient'
import { aqfLabel, getAuUniversityBySlug } from '@/lib/au-universities'
import { fetchRoiData } from '@/lib/roi-query'
import { pageMetadata } from '@/lib/seo'
import { JsonLd, breadcrumbLd } from '@/components/seo/json-ld'

export const revalidate = 86400

type Params = { institution: string }

type AuDetailRow = DetailRow & {
  aqf_level?: number | null
  course_count?: number | null
  employment_rate?: number | null
}

const getUniversityRows = unstable_cache(async (collegeId: string): Promise<AuDetailRow[]> => {
  const result = await fetchRoiData({ country: 'au', collegeId, limit: 200, sort: 'roi_score' })
  return result.data as AuDetailRow[]
}, ['au-university-detail-rows'], { revalidate: 86400 })

function money(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `A$${Math.round(value).toLocaleString()}` : '—'
}

function percent(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value * 100)}%` : '—'
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { institution } = await params
  const university = await getAuUniversityBySlug(institution)
  if (!university) return { title: 'University not found' }
  const rows = await getUniversityRows(university.id)
  const best = rows[0]

  return pageMetadata({
    title: `${university.name} — Tuition, Graduate Outcomes & ROI`,
    description: best
      ? `${university.name}: published tuition from ${money(best.tuition)}/year, provider-level graduate earnings ${money(best.median_earnings)}, and transparent ROI estimates for Australian study options.`
      : `${university.name}: Australian university profile with tuition and graduate-outcome evidence.`,
    path: `/universities/au/${institution}`,
  })
}

export default async function AustralianUniversityDetailPage({ params }: { params: Promise<Params> }) {
  const { institution } = await params
  const university = await getAuUniversityBySlug(institution)
  if (!university) notFound()

  const rows = await getUniversityRows(university.id)
  if (!rows.length) notFound()

  const fields = [...rows]
    .sort((a, b) => (b.roi_score ?? 0) - (a.roi_score ?? 0))
    .slice(0, 24)

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: 'Universities', path: '/universities' },
        { name: 'Australia', path: '/universities/au' },
        { name: university.name, path: `/universities/au/${university.institutionId}` },
      ])} />
      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6">
            <Link href="/universities/au" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Australian universities</Link>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-blue-700">Australia · University profile</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{university.name}</h1>
                <p className="mt-2 text-sm text-slate-600">{[university.city, university.state].filter(Boolean).join(', ') || 'Australia'} · Provider-level outcomes and field-level tuition groups</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/universities/au/compare?schools=${encodeURIComponent(university.institutionId)}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"><BarChart3 className="h-4 w-4" /> Compare ROI</Link>
                {university.websiteUrl && <a href={university.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"><ExternalLink className="h-4 w-4" /> Official site</a>}
              </div>
            </div>
          </div>
        </section>

        <CollegeDetailClient country="au" rows={rows} websiteUrl={university.websiteUrl} backHref="/universities/au" backLabel="Back to Australian universities" />

        <section className="mx-auto max-w-5xl px-5 pb-12 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">Study options & ROI estimates</h2></div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Each row combines a field/AQF tuition group with the university’s published provider-level graduate outcomes. It is not a course-specific employment or salary claim.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">{rows.length} available field groups</span>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="pb-3 pr-4 font-semibold">Field & level</th><th className="pb-3 pr-4 font-semibold">Annual tuition</th><th className="pb-3 pr-4 font-semibold">Graduate earnings*</th><th className="pb-3 pr-4 font-semibold">ROI estimate</th><th className="pb-3 font-semibold">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map((row, index) => (
                    <tr key={`${row.field_name}-${row.aqf_level}-${index}`} className="align-top">
                      <td className="py-4 pr-4"><p className="font-semibold text-slate-900">{row.field_name?.replace(/\.$/, '') || 'Available study group'}</p><p className="mt-1 text-xs text-slate-500">{aqfLabel(row.aqf_level)}{row.course_count ? ` · ${row.course_count} course${row.course_count === 1 ? '' : 's'}` : ''}</p></td>
                      <td className="py-4 pr-4 font-medium text-slate-800">{money(row.tuition)}</td>
                      <td className="py-4 pr-4"><p className="font-medium text-slate-800">{money(row.median_earnings)}</p><p className="mt-1 text-xs text-slate-500">Employment {percent(row.employment_rate)}</p></td>
                      <td className="py-4 pr-4"><span className="font-semibold text-blue-700">{row.roi_score?.toFixed(1) ?? '—'}</span><p className="mt-1 text-xs text-slate-500">Payback {row.payback_years ?? '—'} yrs</p></td>
                      <td className="py-4"><Link href={`/universities/au/compare?schools=${encodeURIComponent(university.institutionId)}&field=${encodeURIComponent(row.field_name ?? '')}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">Compare <ArrowRight className="h-3.5 w-3.5" /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-6 text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-slate-950"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Data confidence</div>
            <p className="mt-1">* Graduate earnings, employment and completion measures are reported at provider level from QILT-linked source data; tuition and course counts are grouped by field and AQF level. Confirm course fees, CRICOS status and entry requirements with the university before applying.</p>
          </div>
        </section>
      </main>
    </>
  )
}
