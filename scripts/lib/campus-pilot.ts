export const CAMPUS_PILOT_SCHEMA_VERSION = '1.0.0' as const

const SOURCE_TYPES = new Set([
  'regulator',
  'government_dataset',
  'provider',
  'professional_body',
  'official_correspondence',
  'market',
  'internal',
])

const REQUIREMENT_TYPES = new Set([
  'academic',
  'english',
  'placement',
  'registration',
  'experience',
  'document',
  'other',
])

const ACCREDITATION_STATUSES = new Set([
  'approved',
  'conditional',
  'pending',
  'expired',
  'not_approved',
  'unknown',
])

const RELATION_TYPES = new Set(['direct', 'graduate_entry', 'progression', 'related'])
const CONFIDENCE = new Set(['high', 'medium', 'low'])
const COHORT_TYPES = new Set(['all', 'domestic', 'international', 'mixed', 'unknown'])

export type CampusPilotSource = {
  sourceKey: string
  organisationName: string
  sourceName: string
  sourceType: string
  canonicalUrl: string
  snapshot: {
    sourceUrl: string
    contentSha256: string
    publishedAt?: string | null
    dataAsOf?: string | null
    retrievedAt: string
    metadata?: Record<string, unknown>
  }
}

export type CampusPilotOutcome = {
  sourceKey: string
  institutionIdentifier: {
    system: string
    value: string
  }
  fieldKey: string
  fieldName: string
  qualificationLevelCode: string
  metricKey: 'median_earnings' | 'employment_rate'
  value: number
  unit: 'AUD' | 'ratio' | 'percent'
  cohortType?: string
  graduationYear?: number | null
  outcomeWindowMonths?: number | null
  respondentCount?: number | null
  populationCount?: number | null
  confidence?: string
  methodology?: string
}

export type CampusPilotRequirement = {
  sourceKey: string
  requirementType: string
  requirementText: string
  structuredValue?: Record<string, unknown>
  effectiveFrom?: string | null
  effectiveTo?: string | null
}

export type CampusPilotAccreditation = {
  sourceKey: string
  authorityName: string
  authorityUrl?: string | null
  accreditationType: string
  status: string
  statusText?: string | null
  effectiveFrom?: string | null
  effectiveTo?: string | null
  lastCheckedAt: string
}

export type CampusPilotCareerLink = {
  profileKey: string
  relationType: string
  legacyProgramRef?: string | null
  sourceCheckedAt: string
}

export type CampusPilotProgramme = {
  cricosCode: string
  requirements?: CampusPilotRequirement[]
  accreditations?: CampusPilotAccreditation[]
  careerLinks?: CampusPilotCareerLink[]
}

export type CampusPilotPayload = {
  schemaVersion: string
  countryCode: 'AU'
  fieldKey: string
  qualificationLevelCode: string
  studentMarket: 'international'
  sources: CampusPilotSource[]
  outcomes: CampusPilotOutcome[]
  programmes: CampusPilotProgramme[]
}

function requireNonEmpty(value: unknown, label: string, errors: string[]) {
  if (typeof value !== 'string' || value.trim().length === 0) errors.push(`${label} must be a non-empty string.`)
}

function requireHttps(value: string, label: string, errors: string[]) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') errors.push(`${label} must use HTTPS.`)
  } catch {
    errors.push(`${label} must be a valid URL.`)
  }
}

function requireDate(value: string | null | undefined, label: string, errors: string[]) {
  if (value == null) return
  if (Number.isNaN(Date.parse(value))) errors.push(`${label} must be a valid ISO date/datetime.`)
}

export function canonicalProgrammeRef(programmeId: string): string {
  return `programme:${programmeId}`
}

export function validateCampusPilotPayload(payload: CampusPilotPayload): string[] {
  const errors: string[] = []

  if (payload.schemaVersion !== CAMPUS_PILOT_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${CAMPUS_PILOT_SCHEMA_VERSION}.`)
  }
  if (payload.countryCode !== 'AU') errors.push('countryCode must be AU for this importer.')
  if (payload.studentMarket !== 'international') errors.push('studentMarket must be international for the AU pilot.')
  requireNonEmpty(payload.fieldKey, 'fieldKey', errors)
  requireNonEmpty(payload.qualificationLevelCode, 'qualificationLevelCode', errors)

  const sourceKeys = new Set<string>()
  for (const source of payload.sources ?? []) {
    requireNonEmpty(source.sourceKey, 'source.sourceKey', errors)
    if (sourceKeys.has(source.sourceKey)) errors.push(`Duplicate sourceKey: ${source.sourceKey}.`)
    sourceKeys.add(source.sourceKey)
    requireNonEmpty(source.organisationName, `${source.sourceKey}.organisationName`, errors)
    requireNonEmpty(source.sourceName, `${source.sourceKey}.sourceName`, errors)
    if (!SOURCE_TYPES.has(source.sourceType)) errors.push(`${source.sourceKey}.sourceType is not allowed.`)
    requireHttps(source.canonicalUrl, `${source.sourceKey}.canonicalUrl`, errors)
    requireHttps(source.snapshot.sourceUrl, `${source.sourceKey}.snapshot.sourceUrl`, errors)
    if (!/^sha256:[a-f0-9]{64}$/i.test(source.snapshot.contentSha256)) {
      errors.push(`${source.sourceKey}.snapshot.contentSha256 must be sha256:<64 hex>.`)
    }
    requireDate(source.snapshot.publishedAt, `${source.sourceKey}.snapshot.publishedAt`, errors)
    requireDate(source.snapshot.dataAsOf, `${source.sourceKey}.snapshot.dataAsOf`, errors)
    requireDate(source.snapshot.retrievedAt, `${source.sourceKey}.snapshot.retrievedAt`, errors)
  }

  for (const outcome of payload.outcomes ?? []) {
    if (!sourceKeys.has(outcome.sourceKey)) errors.push(`Outcome references unknown sourceKey: ${outcome.sourceKey}.`)
    requireNonEmpty(outcome.institutionIdentifier.system, 'outcome.institutionIdentifier.system', errors)
    requireNonEmpty(outcome.institutionIdentifier.value, 'outcome.institutionIdentifier.value', errors)
    if (outcome.fieldKey !== payload.fieldKey) errors.push(`Outcome fieldKey ${outcome.fieldKey} does not match payload fieldKey ${payload.fieldKey}.`)
    if (outcome.qualificationLevelCode !== payload.qualificationLevelCode) {
      errors.push(`Outcome qualificationLevelCode ${outcome.qualificationLevelCode} does not match payload qualificationLevelCode ${payload.qualificationLevelCode}.`)
    }
    if (!Number.isFinite(outcome.value)) errors.push(`Outcome ${outcome.metricKey} value must be finite.`)
    if (outcome.metricKey === 'median_earnings') {
      if (outcome.unit !== 'AUD') errors.push('median_earnings unit must be AUD for the AU pilot.')
      if (!(outcome.value > 0)) errors.push('median_earnings must be greater than zero.')
    }
    if (outcome.metricKey === 'employment_rate') {
      if (outcome.unit === 'ratio' && (outcome.value < 0 || outcome.value > 1)) errors.push('employment_rate ratio must be between 0 and 1.')
      if (outcome.unit === 'percent' && (outcome.value < 0 || outcome.value > 100)) errors.push('employment_rate percent must be between 0 and 100.')
      if (!['ratio', 'percent'].includes(outcome.unit)) errors.push('employment_rate unit must be ratio or percent.')
    }
    if (outcome.cohortType && !COHORT_TYPES.has(outcome.cohortType)) errors.push(`Invalid cohortType: ${outcome.cohortType}.`)
    if (outcome.confidence && !CONFIDENCE.has(outcome.confidence)) errors.push(`Invalid outcome confidence: ${outcome.confidence}.`)
  }

  const cricosCodes = new Set<string>()
  for (const programme of payload.programmes ?? []) {
    requireNonEmpty(programme.cricosCode, 'programme.cricosCode', errors)
    if (cricosCodes.has(programme.cricosCode)) errors.push(`Duplicate CRICOS programme: ${programme.cricosCode}.`)
    cricosCodes.add(programme.cricosCode)

    for (const requirement of programme.requirements ?? []) {
      if (!sourceKeys.has(requirement.sourceKey)) errors.push(`Requirement references unknown sourceKey: ${requirement.sourceKey}.`)
      if (!REQUIREMENT_TYPES.has(requirement.requirementType)) errors.push(`Invalid requirementType: ${requirement.requirementType}.`)
      requireNonEmpty(requirement.requirementText, `${programme.cricosCode}.requirementText`, errors)
      requireDate(requirement.effectiveFrom, `${programme.cricosCode}.requirement.effectiveFrom`, errors)
      requireDate(requirement.effectiveTo, `${programme.cricosCode}.requirement.effectiveTo`, errors)
    }

    for (const accreditation of programme.accreditations ?? []) {
      if (!sourceKeys.has(accreditation.sourceKey)) errors.push(`Accreditation references unknown sourceKey: ${accreditation.sourceKey}.`)
      requireNonEmpty(accreditation.authorityName, `${programme.cricosCode}.authorityName`, errors)
      if (accreditation.authorityUrl) requireHttps(accreditation.authorityUrl, `${programme.cricosCode}.authorityUrl`, errors)
      requireNonEmpty(accreditation.accreditationType, `${programme.cricosCode}.accreditationType`, errors)
      if (!ACCREDITATION_STATUSES.has(accreditation.status)) errors.push(`Invalid accreditation status: ${accreditation.status}.`)
      requireDate(accreditation.effectiveFrom, `${programme.cricosCode}.accreditation.effectiveFrom`, errors)
      requireDate(accreditation.effectiveTo, `${programme.cricosCode}.accreditation.effectiveTo`, errors)
      requireDate(accreditation.lastCheckedAt, `${programme.cricosCode}.accreditation.lastCheckedAt`, errors)
    }

    for (const link of programme.careerLinks ?? []) {
      requireNonEmpty(link.profileKey, `${programme.cricosCode}.careerLink.profileKey`, errors)
      if (!RELATION_TYPES.has(link.relationType)) errors.push(`Invalid career relationType: ${link.relationType}.`)
      requireDate(link.sourceCheckedAt, `${programme.cricosCode}.careerLink.sourceCheckedAt`, errors)
    }
  }

  return errors
}
