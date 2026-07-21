import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { ArrowLeft, BarChart3, ExternalLink, MapPin } from 'lucide-react'
import { CollegeDetailClient, type DetailRow } from '@/app/roi-explorer/[country]/[college_id]/CollegeDetailClient'
import { aqfLabel, getAuUniversityBySlug } from '@/lib/au-universities'
import { getAuStudyCardCourseEvidence, getAuStudyEvidenceKey } from '@/lib/au-study-card-evidence'
import { auProgramDirectoryHref, cleanAuStudyField } from '@/lib/au-study-routing'
import { fetchRoiData } from '@/lib/roi-query'
import { pageMetadata } from '@/lib/seo'
import { JsonLd, breadcrumbLd } from '@/components/seo/json-ld'
import { FieldGroupsSection, type FieldGroupRow } from './FieldGroupsSection'

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
    path: `/au/study/providers/${institution}`,
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
  const fieldEvidence = await getAuStudyCardCourseEvidence(fields.map((row) => ({
    institutionId: university.institutionId,
    fieldName: row.field_name,
    aqfLevel: row.aqf_level,
    providerWebsiteUrl: university.websiteUrl,
  })))

  const fieldGroupRows: FieldGroupRow[] = fields.map((row) => {
    const evidenceKey = getAuStudyEvidenceKey({
      institutionId: university.institutionId,
      fieldName: row.field_name,
      aqfLevel: row.aqf_level,
    })
    const evidence = fieldEvidence[evidenceKey]
    return {
      fieldName: row.field_name ?? '',
      cleanFieldName: cleanAuStudyField(row.field_name) || '',
      aqfLabel: aqfLabel(row.aqf_level),
      courseCount: row.course_count ?? null,
      tuition: row.tuition,
      medianEarnings: row.median_earnings,
      employmentRate: row.employment_rate ?? null,
      roiScore: row.roi_score,
      paybackYears: row.payback_years,
      programHref: auProgramDirectoryHref(row.field_name, row.aqf_level, university.institutionId),
      compareHref: `/au/study/compare?schools=${encodeURIComponent(university.institutionId)}&field=${encodeURIComponent(cleanAuStudyField(row.field_name))}&aqf=${row.aqf_level ?? ''}`,
      evidenceHref: evidence?.href ?? null,
      evidenceLabel: evidence?.label ?? null,
    }
  })

  const best = rows[0]

  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: 'Study options', path: '/study' },
        { name: 'Australia', path: '/au/study' },
        { name: university.name, path: `/au/study/providers/${university.institutionId}` },
      ])} />
      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg4VjI4aDI4em0wLTR2Mkg0VjI0aDJ6bTAgNHYySDE0di0yaDEyem0wLTR2Mkg0VjIwaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
          <div className="relative mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
            <Link href="/au/study" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-100 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Australian universities
            </Link>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Australia
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    University profile
                  </span>
                </div>
                <h1
                  className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
                  style={{ fontFamily: 'var(--font-fraunces), serif' }}
                >
                  {university.name}
                </h1>
                <div className="mt-3 flex items-center gap-4 text-sm text-blue-100">
                  {(university.city || university.state) && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {[university.city, university.state].filter(Boolean).join(', ') || 'Australia'}
                    </span>
                  )}
                  <span>{rows.length} study fields</span>
                  {best?.roi_score != null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                      ROI {best.roi_score.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/au/study/compare?schools=${encodeURIComponent(university.institutionId)}`}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50"
                >
                  <BarChart3 className="h-4 w-4" /> Compare ROI
                </Link>
                {university.websiteUrl && (
                  <a
                    href={university.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" /> Official site
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <CollegeDetailClient country="au" rows={rows} websiteUrl={university.websiteUrl} backHref="/au/study" backLabel="Back to Australian universities" />

        <FieldGroupsSection
          fields={fieldGroupRows}
          rowsLength={rows.length}
          totalFields={rows.length}
        />
      </main>
    </>
  )
}
