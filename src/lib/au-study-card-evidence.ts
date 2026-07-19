import 'server-only'

import { unstable_cache } from 'next/cache'
import { getAuPhaseThreeUniversityCatalogue } from '@/data/au-phase-three-university-catalogues'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type AuStudyCardRequest = {
  institutionId: string
  fieldName: string | null | undefined
  aqfLevel: number | null | undefined
  providerWebsiteUrl: string | null | undefined
}

export type AuStudyCardCourseEvidence = {
  kind: 'verified_course' | 'cricos_record' | 'provider_catalogue' | 'provider_site' | 'pending'
  label: string
  detail: string
  href: string | null
  checkedAt: string | null
}

type CourseRow = {
  institution_id: string | null
  field_name: string | null
  title: string | null
  aqf_level: number | null
  official_course_url: string | null
  official_url_status: string | null
  official_url_checked_at: string | null
  cricos_url: string | null
  cricos_last_seen_at: string | null
  synced_at: string | null
}

function normalise(value: string | null | undefined) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(and|the|of|general|studies|study)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * A provider can surface more than one field/AQF group on a profile. Keep
 * evidence keyed to the actual group so a Dentistry record is never shown as
 * proof for a Nursing estimate at the same university.
 */
export function getAuStudyEvidenceKey(request: Pick<AuStudyCardRequest, 'institutionId' | 'fieldName' | 'aqfLevel'>) {
  return [request.institutionId, normalise(request.fieldName), request.aqfLevel ?? 'any'].join('::')
}

function fieldMatchScore(target: string, candidate: string) {
  const left = normalise(target)
  const right = normalise(candidate)
  if (!left || !right) return 0
  if (left === right) return 100
  if (left.includes(right) || right.includes(left)) return 80
  const leftWords = new Set(left.split(' ').filter((word) => word.length > 2))
  const rightWords = new Set(right.split(' ').filter((word) => word.length > 2))
  const overlap = [...leftWords].filter((word) => rightWords.has(word)).length
  return overlap ? Math.round((overlap / Math.max(leftWords.size, rightWords.size)) * 60) : 0
}

function dateValue(value: string | null | undefined) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null
}

function providerFallback(request: AuStudyCardRequest): AuStudyCardCourseEvidence {
  const catalogue = getAuPhaseThreeUniversityCatalogue(request.institutionId)
  if (catalogue) {
    return {
      kind: 'provider_catalogue',
      label: 'Official provider course finder',
      detail: 'A matching course page is still being verified.',
      href: catalogue.programmesUrl,
      checkedAt: catalogue.checkedAt,
    }
  }
  if (request.providerWebsiteUrl) {
    return {
      kind: 'provider_site',
      label: 'Official provider site',
      detail: 'A matching course page is not verified yet.',
      href: request.providerWebsiteUrl,
      checkedAt: null,
    }
  }
  return {
    kind: 'pending',
    label: 'Official course link pending',
    detail: 'Check CRICOS and the provider before applying.',
    href: null,
    checkedAt: null,
  }
}

/**
 * Resolves the safest available source for each provider/field card. A CRICOS
 * registration is never labelled as a provider course page; only rows marked
 * verified may receive that stronger label.
 */
export const getAuStudyCardCourseEvidence = unstable_cache(async (requests: readonly AuStudyCardRequest[]) => {
  const uniqueRequests = [...new Map(requests.map((request) => [getAuStudyEvidenceKey(request), request])).values()]
  const ids = uniqueRequests.map((request) => request.institutionId).filter(Boolean)
  // `unstable_cache` persists JSON values; a Map would be deserialised as a
  // plain object on the next read. Keep this response explicitly serialisable.
  const fallback: Record<string, AuStudyCardCourseEvidence> = Object.fromEntries(
    uniqueRequests.map((request) => [getAuStudyEvidenceKey(request), providerFallback(request)]),
  )
  if (ids.length === 0) return fallback

  const { data, error } = await supabaseAdmin
    .from('courses_au')
    .select('institution_id, field_name, title, aqf_level, official_course_url, official_url_status, official_url_checked_at, cricos_url, cricos_last_seen_at, synced_at')
    .in('institution_id', ids)
    .eq('cricos_status', 'active')
    .not('cricos_url', 'is', null)
    .order('official_url_status', { ascending: false, nullsFirst: false })
    .order('official_url_checked_at', { ascending: false, nullsFirst: false })
    .limit(3000)

  if (error || !data?.length) return fallback

  const coursesByProvider = new Map<string, CourseRow[]>()
  for (const course of data as CourseRow[]) {
    if (!course.institution_id) continue
    const existing = coursesByProvider.get(course.institution_id) ?? []
    existing.push(course)
    coursesByProvider.set(course.institution_id, existing)
  }

  for (const request of uniqueRequests) {
    const candidate = (coursesByProvider.get(request.institutionId) ?? [])
      .map((course) => ({
        course,
        score: fieldMatchScore(request.fieldName ?? '', course.field_name ?? course.title ?? '')
          + (request.aqfLevel && course.aqf_level === request.aqfLevel ? 25 : 0)
          + (course.official_url_status === 'verified' && course.official_course_url ? 10 : 0),
      }))
      .filter(({ score }) => score >= 40)
      .sort((left, right) => right.score - left.score)[0]?.course

    if (!candidate) continue
    const verifiedUrl = candidate.official_url_status === 'verified' ? candidate.official_course_url : null
    if (verifiedUrl) {
      fallback[getAuStudyEvidenceKey(request)] = {
        kind: 'verified_course',
        label: 'Official course page verified',
        detail: 'Matched to the provider’s course page.',
        href: verifiedUrl,
        checkedAt: dateValue(candidate.official_url_checked_at ?? candidate.synced_at),
      }
      continue
    }
    if (candidate.cricos_url) {
      fallback[getAuStudyEvidenceKey(request)] = {
        kind: 'cricos_record',
        label: 'Active CRICOS course record',
        detail: 'Government registry record; provider page not verified yet.',
        href: candidate.cricos_url,
        checkedAt: dateValue(candidate.cricos_last_seen_at ?? candidate.synced_at),
      }
    }
  }

  return fallback
}, ['au-study-card-course-evidence'], { revalidate: 86400 })
