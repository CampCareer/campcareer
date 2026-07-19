import { STUDY_CONCEPTS } from '@/data/study-concepts'

type StudyConcept = (typeof STUDY_CONCEPTS)[number]

function normalise(value: string | null | undefined) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(and|the|of|general|studies|study)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreFieldAgainstConcept(fieldName: string, concept: StudyConcept) {
  const target = normalise(fieldName)
  if (!target) return 0
  const candidates = [concept.label, concept.roiSearchTerm, ...concept.aliases]
  return Math.max(...candidates.map((candidate) => {
    const value = normalise(candidate)
    if (!value) return 0
    if (value === target) return 100
    if (target.includes(value) || value.includes(target)) return 82
    const targetWords = new Set(target.split(' ').filter((word) => word.length > 2))
    const candidateWords = new Set(value.split(' ').filter((word) => word.length > 2))
    const shared = [...targetWords].filter((word) => candidateWords.has(word)).length
    return shared ? Math.round((shared / Math.max(targetWords.size, candidateWords.size)) * 65) : 0
  }))
}

export function cleanAuStudyField(fieldName: string | null | undefined) {
  return (fieldName ?? '').replace(/\.$/, '').trim()
}

export function findAuStudyConceptForField(fieldName: string | null | undefined) {
  const cleanField = cleanAuStudyField(fieldName)
  if (!cleanField) return null
  const ranked = STUDY_CONCEPTS
    .map((concept) => ({ concept, score: scoreFieldAgainstConcept(cleanField, concept) }))
    .sort((left, right) => right.score - left.score)
  return ranked[0]?.score >= 45 ? ranked[0].concept : null
}

export function aqfFilterForLevel(level: number | null | undefined) {
  if (level != null && level <= 6) return 'vocational'
  if (level === 7) return 'bachelor'
  if (level != null && level >= 8) return 'postgraduate'
  return null
}

export function auStudySearchHref(fieldName: string | null | undefined, aqfLevel?: number | null) {
  const params = new URLSearchParams()
  const field = cleanAuStudyField(fieldName)
  const level = aqfFilterForLevel(aqfLevel)
  if (field) params.set('field', field)
  if (level) params.set('level', level)
  return `/au/study${params.size ? `?${params.toString()}` : ''}`
}

export function auProgramDirectoryHref(fieldName: string | null | undefined, aqfLevel?: number | null, providerId?: string | null) {
  const concept = findAuStudyConceptForField(fieldName)
  if (!concept) return auStudySearchHref(fieldName, aqfLevel)
  const params = new URLSearchParams()
  const level = aqfFilterForLevel(aqfLevel)
  if (level) params.set('level', level)
  if (providerId) params.set('provider', providerId)
  return `/au/study/programs/${concept.slug}${params.size ? `?${params.toString()}` : ''}`
}
