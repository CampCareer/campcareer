import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  canonicalProgrammeRef,
  validateCampusPilotPayload,
  type CampusPilotAccreditation,
  type CampusPilotOutcome,
  type CampusPilotPayload,
  type CampusPilotRequirement,
  type CampusPilotSource,
} from './lib/campus-pilot'

const apply = process.argv.includes('--apply')
const fileIndex = process.argv.indexOf('--file')
const sourceFile = path.resolve(
  fileIndex >= 0 && process.argv[fileIndex + 1]
    ? process.argv[fileIndex + 1]
    : 'data/curated/au/campus-pilot-nursing.json',
)

type SourceResolution = {
  sourceId: string
  snapshotId: string
}

type ResolvedProgramme = {
  programmeId: string
  institutionId: string
  offeringId: string
  title: string
}

type ImportSummary = {
  sources: number
  outcomes: number
  requirements: number
  accreditations: number
  careerLinks: number
}

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function sourceHash(value: string): string {
  return value.replace(/^sha256:/i, '')
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function resolveQualificationLevel(client: SupabaseClient, levelCode: string): Promise<string> {
  const { data: framework, error: frameworkError } = await client
    .schema('core')
    .from('qualification_frameworks')
    .select('id')
    .eq('country_code', 'AU')
    .eq('framework_code', 'AQF')
    .maybeSingle()

  if (frameworkError) throw frameworkError
  if (!framework) throw new Error('Missing canonical AU AQF framework.')

  const { data: level, error: levelError } = await client
    .schema('core')
    .from('qualification_levels')
    .select('id')
    .eq('framework_id', framework.id)
    .eq('level_code', levelCode)
    .maybeSingle()

  if (levelError) throw levelError
  if (!level) throw new Error(`Missing canonical AQF level ${levelCode}.`)
  return level.id as string
}

async function resolveInstitution(
  client: SupabaseClient,
  identifier: CampusPilotOutcome['institutionIdentifier'],
): Promise<string> {
  const { data, error } = await client
    .schema('catalog')
    .from('institution_identifiers')
    .select('institution_id')
    .eq('identifier_system', identifier.system)
    .eq('identifier_value', identifier.value)
    .maybeSingle()

  if (error) throw error
  if (!data?.institution_id) {
    throw new Error(`Unresolved institution identifier ${identifier.system}:${identifier.value}. Fuzzy matching is forbidden.`)
  }
  return data.institution_id as string
}

async function resolveProgramme(client: SupabaseClient, cricosCode: string): Promise<ResolvedProgramme> {
  const { data: identifier, error: identifierError } = await client
    .schema('catalog')
    .from('programme_identifiers')
    .select('programme_id')
    .eq('identifier_system', 'CRICOS_COURSE_CODE')
    .eq('identifier_value', cricosCode)
    .maybeSingle()

  if (identifierError) throw identifierError
  if (!identifier?.programme_id) {
    throw new Error(`Unresolved CRICOS programme ${cricosCode}. Exact canonical identity is required.`)
  }

  const { data: programme, error: programmeError } = await client
    .schema('catalog')
    .from('programmes')
    .select('id, institution_id, canonical_title, status')
    .eq('id', identifier.programme_id)
    .maybeSingle()

  if (programmeError) throw programmeError
  if (!programme || programme.status !== 'active') {
    throw new Error(`CRICOS programme ${cricosCode} is missing or not active.`)
  }

  const { data: offerings, error: offeringError } = await client
    .schema('catalog')
    .from('programme_offerings')
    .select('id, market, enrolment_status, verification_status, source_checked_at, updated_at')
    .eq('programme_id', programme.id)
    .in('market', ['international', 'both'])
    .eq('verification_status', 'verified')
    .neq('enrolment_status', 'closed')
    .order('source_checked_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .limit(1)

  if (offeringError) throw offeringError
  const offering = offerings?.[0]
  if (!offering) {
    throw new Error(`CRICOS programme ${cricosCode} has no verified non-closed international offering.`)
  }

  return {
    programmeId: programme.id as string,
    institutionId: programme.institution_id as string,
    offeringId: offering.id as string,
    title: programme.canonical_title as string,
  }
}

async function ensureSourceAndSnapshot(
  client: SupabaseClient,
  source: CampusPilotSource,
): Promise<SourceResolution> {
  const sourcePayload = {
    source_key: source.sourceKey,
    organisation_name: source.organisationName,
    source_name: source.sourceName,
    source_type: source.sourceType,
    canonical_url: source.canonicalUrl,
    country_code: 'AU',
    active: true,
    updated_at: new Date().toISOString(),
  }

  const { data: sourceRow, error: sourceError } = await client
    .schema('evidence')
    .from('sources')
    .upsert(sourcePayload, { onConflict: 'source_key' })
    .select('id')
    .single()

  if (sourceError) throw sourceError

  const hash = sourceHash(source.snapshot.contentSha256)
  const { data: existingSnapshot, error: existingError } = await client
    .schema('evidence')
    .from('source_snapshots')
    .select('id')
    .eq('source_id', sourceRow.id)
    .eq('content_sha256', hash)
    .maybeSingle()

  if (existingError) throw existingError
  if (existingSnapshot?.id) {
    return { sourceId: sourceRow.id as string, snapshotId: existingSnapshot.id as string }
  }

  const { data: snapshot, error: snapshotError } = await client
    .schema('evidence')
    .from('source_snapshots')
    .insert({
      source_id: sourceRow.id,
      source_url: source.snapshot.sourceUrl,
      content_sha256: hash,
      published_at: source.snapshot.publishedAt ?? null,
      data_as_of: source.snapshot.dataAsOf ?? null,
      retrieved_at: source.snapshot.retrievedAt,
      snapshot_status: 'captured',
      metadata: source.snapshot.metadata ?? {},
    })
    .select('id')
    .single()

  if (snapshotError) throw snapshotError
  return { sourceId: sourceRow.id as string, snapshotId: snapshot.id as string }
}

async function upsertMetricObservation(
  client: SupabaseClient,
  input: {
    metricKey: string
    scopeType: string
    scopeId: string
    value: unknown
    unit?: string | null
    sourceSnapshotId: string
    confidence: 'high' | 'medium' | 'low'
    methodology: string
    assumptions?: Record<string, unknown>
  },
): Promise<string> {
  const { data: existingRows, error: existingError } = await client
    .schema('evidence')
    .from('metric_observations')
    .select('id')
    .eq('metric_key', input.metricKey)
    .eq('scope_type', input.scopeType)
    .eq('scope_id', input.scopeId)
    .eq('source_snapshot_id', input.sourceSnapshotId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (existingError) throw existingError

  const payload = {
    metric_key: input.metricKey,
    scope_type: input.scopeType,
    scope_id: input.scopeId,
    value: input.value,
    unit: input.unit ?? null,
    source_snapshot_id: input.sourceSnapshotId,
    evidence_kind: 'observed',
    confidence: input.confidence,
    methodology: input.methodology,
    assumptions: input.assumptions ?? {},
    review_status: 'verified',
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const existing = existingRows?.[0]
  if (existing?.id) {
    const { error } = await client
      .schema('evidence')
      .from('metric_observations')
      .update(payload)
      .eq('id', existing.id)
    if (error) throw error
    return existing.id as string
  }

  const { data, error } = await client
    .schema('evidence')
    .from('metric_observations')
    .insert(payload)
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

async function importOutcome(
  client: SupabaseClient,
  outcome: CampusPilotOutcome,
  source: SourceResolution,
  qualificationLevelId: string,
): Promise<void> {
  const institutionId = await resolveInstitution(client, outcome.institutionIdentifier)
  const scopeId = `${institutionId}:${outcome.fieldKey}:AQF-${outcome.qualificationLevelCode}`
  const evidenceId = await upsertMetricObservation(client, {
    metricKey: outcome.metricKey,
    scopeType: 'institution_field_level',
    scopeId,
    value: outcome.value,
    unit: outcome.unit,
    sourceSnapshotId: source.snapshotId,
    confidence: (outcome.confidence ?? 'medium') as 'high' | 'medium' | 'low',
    methodology: outcome.methodology ?? 'Curated official provider x study-area x qualification-level graduate outcome.',
    assumptions: {
      institution_identifier: outcome.institutionIdentifier,
      field_key: outcome.fieldKey,
      qualification_level_code: outcome.qualificationLevelCode,
      cohort_type: outcome.cohortType ?? 'all',
    },
  })

  const payload = {
    country_code: 'AU',
    institution_id: institutionId,
    programme_id: null,
    field_code: outcome.fieldKey,
    field_name: outcome.fieldName,
    qualification_level_id: qualificationLevelId,
    cohort_type: outcome.cohortType ?? 'all',
    graduation_year: outcome.graduationYear ?? null,
    outcome_window_months: outcome.outcomeWindowMonths ?? null,
    metric_key: outcome.metricKey,
    value: outcome.value,
    unit: outcome.unit,
    respondent_count: outcome.respondentCount ?? null,
    population_count: outcome.populationCount ?? null,
    evidence_id: evidenceId,
    review_status: 'verified',
    updated_at: new Date().toISOString(),
  }

  const { data: existingRows, error: existingError } = await client
    .schema('labour')
    .from('outcome_observations')
    .select('id')
    .eq('evidence_id', evidenceId)
    .limit(1)
  if (existingError) throw existingError

  const existing = existingRows?.[0]
  const { error } = existing?.id
    ? await client.schema('labour').from('outcome_observations').update(payload).eq('id', existing.id)
    : await client.schema('labour').from('outcome_observations').insert(payload)
  if (error) throw error
}

async function importRequirement(
  client: SupabaseClient,
  programme: ResolvedProgramme,
  requirement: CampusPilotRequirement,
  source: SourceResolution,
): Promise<void> {
  const evidenceId = await upsertMetricObservation(client, {
    metricKey: `programme_requirement:${requirement.requirementType}`,
    scopeType: 'programme_offering',
    scopeId: programme.offeringId,
    value: {
      text: requirement.requirementText,
      structured_value: requirement.structuredValue ?? {},
    },
    sourceSnapshotId: source.snapshotId,
    confidence: 'high',
    methodology: 'Curated provider-course requirement verification.',
    assumptions: { cricos_code: programme.programmeId },
  })

  const payload = {
    offering_id: programme.offeringId,
    requirement_type: requirement.requirementType,
    requirement_text: requirement.requirementText,
    structured_value: requirement.structuredValue ?? {},
    evidence_id: evidenceId,
    effective_from: requirement.effectiveFrom ?? null,
    effective_to: requirement.effectiveTo ?? null,
    review_status: 'verified',
    updated_at: new Date().toISOString(),
  }

  const { data: existingRows, error: existingError } = await client
    .schema('catalog')
    .from('programme_requirements')
    .select('id')
    .eq('offering_id', programme.offeringId)
    .eq('requirement_type', requirement.requirementType)
    .eq('evidence_id', evidenceId)
    .limit(1)
  if (existingError) throw existingError

  const existing = existingRows?.[0]
  const { error } = existing?.id
    ? await client.schema('catalog').from('programme_requirements').update(payload).eq('id', existing.id)
    : await client.schema('catalog').from('programme_requirements').insert(payload)
  if (error) throw error
}

async function importAccreditation(
  client: SupabaseClient,
  programme: ResolvedProgramme,
  accreditation: CampusPilotAccreditation,
  source: SourceResolution,
): Promise<void> {
  const evidenceId = await upsertMetricObservation(client, {
    metricKey: `programme_accreditation:${slugify(accreditation.authorityName)}`,
    scopeType: 'programme',
    scopeId: programme.programmeId,
    value: {
      status: accreditation.status,
      status_text: accreditation.statusText ?? null,
      accreditation_type: accreditation.accreditationType,
    },
    sourceSnapshotId: source.snapshotId,
    confidence: 'high',
    methodology: 'Curated regulator approved-programme verification.',
  })

  const payload = {
    programme_id: programme.programmeId,
    campus_id: null,
    authority_name: accreditation.authorityName,
    authority_url: accreditation.authorityUrl ?? null,
    accreditation_type: accreditation.accreditationType,
    status: accreditation.status,
    status_text: accreditation.statusText ?? null,
    evidence_id: evidenceId,
    effective_from: accreditation.effectiveFrom ?? null,
    effective_to: accreditation.effectiveTo ?? null,
    last_checked_at: accreditation.lastCheckedAt,
    review_status: 'verified',
    updated_at: new Date().toISOString(),
  }

  const { data: existingRows, error: existingError } = await client
    .schema('catalog')
    .from('programme_accreditations')
    .select('id')
    .eq('programme_id', programme.programmeId)
    .eq('authority_name', accreditation.authorityName)
    .eq('accreditation_type', accreditation.accreditationType)
    .order('updated_at', { ascending: false })
    .limit(1)
  if (existingError) throw existingError

  const existing = existingRows?.[0]
  const { error } = existing?.id
    ? await client.schema('catalog').from('programme_accreditations').update(payload).eq('id', existing.id)
    : await client.schema('catalog').from('programme_accreditations').insert(payload)
  if (error) throw error
}

async function importCareerLink(
  client: SupabaseClient,
  programme: ResolvedProgramme,
  link: NonNullable<CampusPilotPayload['programmes'][number]['careerLinks']>[number],
): Promise<void> {
  const { data: profile, error: profileError } = await client
    .from('country_occupation_profiles')
    .select('profile_key')
    .eq('profile_key', link.profileKey)
    .maybeSingle()
  if (profileError) throw profileError
  if (!profile) throw new Error(`Unknown Career profile ${link.profileKey}.`)

  if (link.legacyProgramRef) {
    const { data: legacy, error: legacyError } = await client
      .from('country_occupation_program_links')
      .select('profile_key, program_ref')
      .eq('profile_key', link.profileKey)
      .eq('program_ref', link.legacyProgramRef)
      .maybeSingle()
    if (legacyError) throw legacyError
    if (legacy) {
      const { error } = await client
        .from('country_occupation_program_links')
        .update({
          programme_id: programme.programmeId,
          relation_type: link.relationType,
          source_checked_at: link.sourceCheckedAt,
        })
        .eq('profile_key', link.profileKey)
        .eq('program_ref', link.legacyProgramRef)
      if (error) throw error
      return
    }
  }

  const { data: existingRows, error: existingError } = await client
    .from('country_occupation_program_links')
    .select('profile_key, program_ref')
    .eq('profile_key', link.profileKey)
    .eq('programme_id', programme.programmeId)
    .eq('relation_type', link.relationType)
    .limit(1)
  if (existingError) throw existingError
  if (existingRows?.length) return

  const { error } = await client
    .from('country_occupation_program_links')
    .insert({
      profile_key: link.profileKey,
      program_ref: canonicalProgrammeRef(programme.programmeId),
      programme_id: programme.programmeId,
      relation_type: link.relationType,
      source_checked_at: link.sourceCheckedAt,
    })
  if (error) throw error
}

async function validateCanonicalTargets(client: SupabaseClient, payload: CampusPilotPayload) {
  const qualificationLevelId = await resolveQualificationLevel(client, payload.qualificationLevelCode)
  const institutions = new Map<string, string>()
  for (const outcome of payload.outcomes) {
    const key = `${outcome.institutionIdentifier.system}:${outcome.institutionIdentifier.value}`
    if (!institutions.has(key)) institutions.set(key, await resolveInstitution(client, outcome.institutionIdentifier))
  }

  const programmes = new Map<string, ResolvedProgramme>()
  for (const programme of payload.programmes) {
    programmes.set(programme.cricosCode, await resolveProgramme(client, programme.cricosCode))
  }

  return { qualificationLevelId, institutions, programmes }
}

async function main() {
  const payload = JSON.parse(await readFile(sourceFile, 'utf8')) as CampusPilotPayload
  const validationErrors = validateCampusPilotPayload(payload)
  if (validationErrors.length) {
    throw new Error(`Campus pilot payload is invalid:\n- ${validationErrors.join('\n- ')}`)
  }

  const client = createClient(
    requiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  )

  const targets = await validateCanonicalTargets(client, payload)
  console.log(`Validated ${targets.institutions.size} provider identities and ${targets.programmes.size} canonical programmes.`)
  console.log(`Resolved AQF ${payload.qualificationLevelCode} to ${targets.qualificationLevelId}.`)

  if (!apply) {
    console.log('Dry run complete. No database writes performed. Re-run with --apply after reviewing the payload and diff.')
    return
  }

  const sources = new Map<string, SourceResolution>()
  for (const source of payload.sources) {
    sources.set(source.sourceKey, await ensureSourceAndSnapshot(client, source))
  }

  const summary: ImportSummary = {
    sources: sources.size,
    outcomes: 0,
    requirements: 0,
    accreditations: 0,
    careerLinks: 0,
  }

  for (const outcome of payload.outcomes) {
    const source = sources.get(outcome.sourceKey)
    if (!source) throw new Error(`Missing resolved source ${outcome.sourceKey}.`)
    await importOutcome(client, outcome, source, targets.qualificationLevelId)
    summary.outcomes += 1
  }

  for (const programmeRecord of payload.programmes) {
    const programme = targets.programmes.get(programmeRecord.cricosCode)
    if (!programme) throw new Error(`Missing resolved programme ${programmeRecord.cricosCode}.`)

    for (const requirement of programmeRecord.requirements ?? []) {
      const source = sources.get(requirement.sourceKey)
      if (!source) throw new Error(`Missing resolved source ${requirement.sourceKey}.`)
      await importRequirement(client, programme, requirement, source)
      summary.requirements += 1
    }

    for (const accreditation of programmeRecord.accreditations ?? []) {
      const source = sources.get(accreditation.sourceKey)
      if (!source) throw new Error(`Missing resolved source ${accreditation.sourceKey}.`)
      await importAccreditation(client, programme, accreditation, source)
      summary.accreditations += 1
    }

    for (const careerLink of programmeRecord.careerLinks ?? []) {
      await importCareerLink(client, programme, careerLink)
      summary.careerLinks += 1
    }
  }

  console.log('Campus pilot import complete:', summary)
}

void main().catch((error) => {
  console.error('[au-campus-pilot] failed:', error)
  process.exitCode = 1
})
