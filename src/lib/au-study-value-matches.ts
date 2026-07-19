import 'server-only'

import { unstable_cache } from 'next/cache'
import { getAuUniversitiesByIds, type AuUniversity } from '@/lib/au-universities'
import { fetchRoiData } from '@/lib/roi-query'

type RoiRow = {
  college_id?: unknown
  field_name?: unknown
  aqf_level?: unknown
  tuition?: unknown
  median_earnings?: unknown
  employment_rate?: unknown
  graduation_rate?: unknown
  roi_score?: unknown
  payback_years?: unknown
  course_count?: unknown
}

export type AuStudyValueMatch = {
  collegeId: string
  institutionId: string
  university: string
  city: string | null
  state: string | null
  field: string
  aqfLevel: number
  tuition: number
  medianEarnings: number
  employmentRate: number
  graduationRate: number
  roiScore: number
  paybackYears: number
  courseCount: number | null
  valueReasons: string[]
}

type Candidate = Omit<AuStudyValueMatch, 'institutionId' | 'university' | 'city' | 'state' | 'valueReasons'>

function numberValue(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function median(values: readonly number[]) {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

function toCandidate(row: RoiRow): Candidate | null {
  const collegeId = typeof row.college_id === 'string' ? row.college_id : ''
  const field = typeof row.field_name === 'string' ? row.field_name.replace(/\.$/, '').trim() : ''
  const aqfLevel = numberValue(row.aqf_level)
  const tuition = numberValue(row.tuition)
  const medianEarnings = numberValue(row.median_earnings)
  const employmentRate = numberValue(row.employment_rate)
  const graduationRate = numberValue(row.graduation_rate)
  const roiScore = numberValue(row.roi_score)
  const paybackYears = numberValue(row.payback_years)
  const courseCount = numberValue(row.course_count)

  // A spotlight card is intentionally more conservative than the full study
  // directory: it must have every decision metric and be a Bachelor field
  // group. This prevents a missing field from looking like a weak outcome.
  if (!collegeId || !field || aqfLevel !== 7 || tuition == null || medianEarnings == null || employmentRate == null || graduationRate == null || roiScore == null || paybackYears == null) return null
  if (tuition <= 0 || medianEarnings <= 0 || employmentRate <= 0 || graduationRate <= 0 || roiScore <= 0 || paybackYears <= 0) return null

  // The ROI calculator has a dedicated medicine earnings assumption. It is
  // useful in the full explorer with its methodology, but not suitable for a
  // general value spotlight beside directly observed field groups.
  if (/\bmedicine\b/i.test(field)) return null

  return {
    collegeId,
    field,
    aqfLevel,
    tuition,
    medianEarnings,
    employmentRate,
    graduationRate,
    roiScore,
    paybackYears,
    courseCount: courseCount && courseCount > 0 ? Math.round(courseCount) : null,
  }
}

function reasonsFor(candidate: Candidate, benchmarks: { tuition: number; earnings: number; employment: number; payback: number }) {
  const reasons: string[] = []
  if (candidate.tuition <= benchmarks.tuition) reasons.push('lower tuition in this shortlisted set')
  if (candidate.medianEarnings >= benchmarks.earnings) reasons.push('above-set graduate earnings')
  if (candidate.employmentRate >= benchmarks.employment) reasons.push('strong employment signal')
  if (candidate.paybackYears <= benchmarks.payback) reasons.push('short estimated payback')
  return reasons.slice(0, 2)
}

/**
 * Six Australian Bachelor field groups with complete published indicators.
 * This is a discovery aid, not a ranking of all Australian providers.
 */
export const getAuStudyValueMatches = unstable_cache(async (): Promise<AuStudyValueMatch[]> => {
  const result = await fetchRoiData({
    country: 'au',
    state: 'ALL_STATES',
    aqfLevels: [7],
    limit: 500,
    sort: 'roi_score',
  })

  const bestByUniversity = new Map<string, Candidate>()
  for (const row of result.data as RoiRow[]) {
    const candidate = toCandidate(row)
    if (!candidate) continue
    const current = bestByUniversity.get(candidate.collegeId)
    if (!current || candidate.roiScore > current.roiScore) bestByUniversity.set(candidate.collegeId, candidate)
  }

  const universities = await getAuUniversitiesByIds([...bestByUniversity.keys()])
  const candidates = [...bestByUniversity.values()]
    .filter((candidate) => universities.has(candidate.collegeId))
    .sort((left, right) => right.roiScore - left.roiScore)

  if (candidates.length === 0) return []

  const benchmarks = {
    tuition: median(candidates.map((candidate) => candidate.tuition)),
    earnings: median(candidates.map((candidate) => candidate.medianEarnings)),
    employment: median(candidates.map((candidate) => candidate.employmentRate)),
    payback: median(candidates.map((candidate) => candidate.paybackYears)),
  }

  // Keep one field group per provider and avoid a page made entirely of one
  // state where the available data supports a broader shortlist.
  const selected: Candidate[] = []
  const selectedFields = new Set<string>()
  const selectedStates = new Map<string, number>()
  for (const candidate of candidates) {
    const university = universities.get(candidate.collegeId)!
    const state = university.state ?? ''
    const fieldKey = candidate.field.toLowerCase()
    if (selectedFields.has(fieldKey) || (state && (selectedStates.get(state) ?? 0) >= 2)) continue
    selected.push(candidate)
    selectedFields.add(fieldKey)
    if (state) selectedStates.set(state, (selectedStates.get(state) ?? 0) + 1)
    if (selected.length === 6) break
  }

  // Do not leave the page sparse if a future data refresh happens to have a
  // narrow state distribution.
  if (selected.length < 6) {
    for (const candidate of candidates) {
      if (selected.some((item) => item.collegeId === candidate.collegeId)) continue
      selected.push(candidate)
      if (selected.length === 6) break
    }
  }

  return selected.map((candidate) => toValueMatch(candidate, universities.get(candidate.collegeId)!, benchmarks))
}, ['au-study-value-matches'], { revalidate: 86400 })

function toValueMatch(candidate: Candidate, university: AuUniversity, benchmarks: { tuition: number; earnings: number; employment: number; payback: number }): AuStudyValueMatch {
  return {
    ...candidate,
    institutionId: university.institutionId,
    university: university.name,
    city: university.city,
    state: university.state,
    valueReasons: reasonsFor(candidate, benchmarks),
  }
}
