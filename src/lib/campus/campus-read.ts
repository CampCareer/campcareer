import 'server-only'

import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  scoreCampusValueCohort,
  type CampusValueCohort,
  type CampusValueInput,
} from '@/lib/campus/campus-value'

export type CampusProgrammeValueRow = CampusValueInput & {
  institutionSlug: string | null
  institutionName: string
  institutionKind: string | null
  programmeTitle: string
  cricosCode: string | null
  fieldKey: string
  fieldName: string
  qualificationFramework: string
  qualificationLevelCode: string
  qualificationLevelLabel: string
  offeringId: string
  studentMarket: string
  enrolmentStatus: string
  offeringSourceUrl: string | null
  offeringSourceCheckedAt: string | null
  campusId: string | null
  campusName: string | null
  city: string | null
  region: string | null
  latitude: number | null
  longitude: number | null
  currencyCode: string | null
  earningsConfidence: string | null
  employmentConfidence: string | null
  englishRequirementText: string | null
  englishRequirement: Record<string, unknown> | null
  accreditationAuthority: string | null
  accreditationAuthorityUrl: string | null
  accreditationType: string | null
  accreditationStatus: string | null
  accreditationStatusText: string | null
  accreditationCheckedAt: string | null
}

type CampusProgrammeValueDbRow = {
  programme_id: string
  institution_id: string
  institution_slug: string | null
  institution_name: string
  institution_kind: string | null
  programme_title: string
  cricos_code: string | null
  field_key: string
  field_name: string
  qualification_framework: string
  qualification_level_code: string
  qualification_level_label: string
  offering_id: string
  student_market: string
  enrolment_status: string
  duration_months: number | null
  offering_source_url: string | null
  offering_source_checked_at: string | null
  campus_id: string | null
  campus_name: string | null
  city: string | null
  region: string | null
  latitude: number | string | null
  longitude: number | string | null
  annual_tuition: number | string | null
  currency_code: string | null
  median_earnings: number | string | null
  earnings_confidence: string | null
  employment_rate_pct: number | string | null
  employment_confidence: string | null
  english_requirement_text: string | null
  english_requirement: Record<string, unknown> | null
  accreditation_authority: string | null
  accreditation_authority_url: string | null
  accreditation_type: string | null
  accreditation_status: string | null
  accreditation_status_text: string | null
  accreditation_checked_at: string | null
}

function finiteNumber(value: number | string | null): number | null {
  if (value == null) return null
  const numeric = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function mapRow(row: CampusProgrammeValueDbRow): CampusProgrammeValueRow {
  return {
    programmeId: row.programme_id,
    institutionId: row.institution_id,
    institutionSlug: row.institution_slug,
    institutionName: row.institution_name,
    institutionKind: row.institution_kind,
    programmeTitle: row.programme_title,
    cricosCode: row.cricos_code,
    fieldKey: row.field_key,
    fieldName: row.field_name,
    qualificationFramework: row.qualification_framework,
    qualificationLevelCode: row.qualification_level_code,
    qualificationLevelLabel: row.qualification_level_label,
    offeringId: row.offering_id,
    studentMarket: row.student_market,
    enrolmentStatus: row.enrolment_status,
    durationMonths: finiteNumber(row.duration_months),
    offeringSourceUrl: row.offering_source_url,
    offeringSourceCheckedAt: row.offering_source_checked_at,
    campusId: row.campus_id,
    campusName: row.campus_name,
    city: row.city,
    region: row.region,
    latitude: finiteNumber(row.latitude),
    longitude: finiteNumber(row.longitude),
    annualTuition: finiteNumber(row.annual_tuition),
    currencyCode: row.currency_code,
    medianEarnings: finiteNumber(row.median_earnings),
    earningsConfidence: row.earnings_confidence,
    employmentRatePct: finiteNumber(row.employment_rate_pct),
    employmentConfidence: row.employment_confidence,
    englishRequirementText: row.english_requirement_text,
    englishRequirement: row.english_requirement,
    accreditationAuthority: row.accreditation_authority,
    accreditationAuthorityUrl: row.accreditation_authority_url,
    accreditationType: row.accreditation_type,
    accreditationStatus: row.accreditation_status,
    accreditationStatusText: row.accreditation_status_text,
    accreditationCheckedAt: row.accreditation_checked_at,
  }
}

export async function readCampusValueCohort(params: {
  countryCode: string
  fieldKey: string
  qualificationLevelCode: string
  studentMarket: 'international' | 'domestic' | 'both'
}): Promise<CampusValueCohort<CampusProgrammeValueRow>> {
  const { countryCode, fieldKey, qualificationLevelCode, studentMarket } = params

  if (countryCode !== 'AU') {
    throw new Error(`Campus value read model v1 currently supports AU only; received ${countryCode}.`)
  }

  const allowedMarkets = studentMarket === 'international'
    ? ['international', 'both']
    : studentMarket === 'domestic'
      ? ['domestic', 'both']
      : ['both']

  const { data, error } = await supabaseAdmin
    .from('campus_programme_value_inputs_v1')
    .select('*')
    .eq('field_key', fieldKey)
    .eq('qualification_level_code', qualificationLevelCode)
    .in('student_market', allowedMarkets)
    .order('institution_name', { ascending: true })
    .order('programme_title', { ascending: true })

  if (error) throw new Error(`[campus-read] ${error.message}`)

  const rows = ((data ?? []) as CampusProgrammeValueDbRow[]).map(mapRow)
  return scoreCampusValueCohort(rows)
}
