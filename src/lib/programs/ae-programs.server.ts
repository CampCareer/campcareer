import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"

export const AE_PROGRAM_PAGE_SIZE = 20

type AeProgramRow = {
  programme_id: string
  program_slug: string
  title: string
  programme_level: string | null
  credential_type: string | null
  field_name: string | null
  verification_tier: "A" | "B" | "C"
  institution_id: string
  institution_name: string
  institution_slug: string | null
  city: string | null
  emirate: string | null
  default_duration_months: number | string | null
  tuition_fee_aed: number | string | null
  official_program_url: string | null
  caa_detail_url: string | null
  registry_source_url: string | null
  international_students_eligible: boolean | null
  international_admission_status: "open" | "closed" | "not_yet_open" | "restricted" | "eligible_schedule_unknown" | "unknown"
  visa_sponsorship_available: boolean | null
  intake_label: string | null
  intake_start_date: string | null
  application_deadline: string | null
  admission_source_url: string | null
  visa_source_url: string | null
  admission_verification_status: "unverified" | "verified" | "stale" | "rejected"
  occupation_ids: string[] | null
  accreditation_authority?: string | null
  accreditation_authority_url?: string | null
  accreditation_status?: string | null
  accreditation_review_status?: string | null
}

export type AeProgram = {
  id: string
  slug: string
  title: string
  programmeLevel: string | null
  credentialType: string | null
  fieldName: string | null
  verificationTier: "A" | "B" | "C"
  institutionId: string
  institutionName: string
  institutionSlug: string | null
  city: string | null
  emirate: string | null
  durationMonths: number | null
  tuitionFeeAed: number | null
  officialProgramUrl: string | null
  caaDetailUrl: string | null
  registrySourceUrl: string | null
  internationalStudentsEligible: boolean | null
  internationalAdmissionStatus: AeProgramRow["international_admission_status"]
  visaSponsorshipAvailable: boolean | null
  intakeLabel: string | null
  intakeStartDate: string | null
  applicationDeadline: string | null
  admissionSourceUrl: string | null
  visaSourceUrl: string | null
  admissionVerificationStatus: AeProgramRow["admission_verification_status"]
  occupationIds: string[]
}

export type AeProgramDetail = AeProgram & {
  accreditationAuthority: string | null
  accreditationAuthorityUrl: string | null
  accreditationStatus: string | null
  accreditationReviewStatus: string | null
}

export type AeProgramSearchResult = {
  programs: AeProgram[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

function numberOrNull(value: number | string | null) {
  if (value == null) return null
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function safeSearchTerm(value: string) {
  return value.replace(/[^\p{L}\p{N}\s&.'()-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 80)
}

function levelPattern(level: ProgramSearchFilters["level"]) {
  switch (level) {
    case "bachelor": return ["BACHELOR"]
    case "master": return ["MASTER"]
    case "doctorate": return ["DOCTORATE", "PROFESSIONAL"]
    case "diploma": return ["DIPLOMA"]
    case "certificate": return ["CERTIFICATE", "NQF LEVEL 3"]
    case "associate": return ["ASSOCIATE"]
    default: return null
  }
}

function mapRow(row: AeProgramRow): AeProgram {
  return {
    id: row.programme_id,
    slug: row.program_slug,
    title: row.title,
    programmeLevel: row.programme_level,
    credentialType: row.credential_type,
    fieldName: row.field_name,
    verificationTier: row.verification_tier,
    institutionId: row.institution_id,
    institutionName: row.institution_name,
    institutionSlug: row.institution_slug,
    city: row.city,
    emirate: row.emirate,
    durationMonths: numberOrNull(row.default_duration_months),
    tuitionFeeAed: numberOrNull(row.tuition_fee_aed),
    officialProgramUrl: row.official_program_url,
    caaDetailUrl: row.caa_detail_url,
    registrySourceUrl: row.registry_source_url,
    internationalStudentsEligible: row.international_students_eligible,
    internationalAdmissionStatus: row.international_admission_status,
    visaSponsorshipAvailable: row.visa_sponsorship_available,
    intakeLabel: row.intake_label,
    intakeStartDate: row.intake_start_date,
    applicationDeadline: row.application_deadline,
    admissionSourceUrl: row.admission_source_url,
    visaSourceUrl: row.visa_source_url,
    admissionVerificationStatus: row.admission_verification_status,
    occupationIds: row.occupation_ids ?? [],
  }
}

const EXPLORER_SELECT = [
  "programme_id","program_slug","title","programme_level","credential_type","field_name","verification_tier",
  "institution_id","institution_name","institution_slug","city","emirate","default_duration_months","tuition_fee_aed",
  "official_program_url","caa_detail_url","registry_source_url","international_students_eligible","international_admission_status",
  "visa_sponsorship_available","intake_label","intake_start_date","application_deadline","admission_source_url","visa_source_url",
  "admission_verification_status","occupation_ids",
].join(",")

export async function searchAePrograms(filters: ProgramSearchFilters): Promise<AeProgramSearchResult> {
  let query = supabaseAdmin.from("program_explorer_ae_v1").select(EXPLORER_SELECT, { count: "exact" })

  const search = safeSearchTerm(filters.q)
  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`
    query = query.or(`title.ilike.${pattern},institution_name.ilike.${pattern},field_name.ilike.${pattern}`)
  }

  const levels = levelPattern(filters.level)
  if (levels) query = query.or(levels.map((level) => `programme_level.ilike.%${level}%`).join(","))
  if (filters.source === "verified") query = query.eq("verification_tier", "A")

  if (filters.sort === "fee-low") query = query.order("tuition_fee_aed", { ascending: true, nullsFirst: false })
  else if (filters.sort === "fee-high") query = query.order("tuition_fee_aed", { ascending: false, nullsFirst: false })
  else if (filters.sort === "duration-short") query = query.order("default_duration_months", { ascending: true, nullsFirst: false })
  else if (filters.sort === "title") query = query.order("title", { ascending: true })
  else query = query.order("verification_tier", { ascending: true }).order("international_admission_status", { ascending: true }).order("title", { ascending: true })

  const from = (filters.page - 1) * AE_PROGRAM_PAGE_SIZE
  const { data, error, count } = await query.range(from, from + AE_PROGRAM_PAGE_SIZE - 1)
  if (error) throw new Error(`Unable to load UAE programs: ${error.message}`)

  const programs = ((data ?? []) as unknown as AeProgramRow[]).map(mapRow)
  const total = count ?? programs.length
  return { programs, total, page: filters.page, pageSize: AE_PROGRAM_PAGE_SIZE, pageCount: total === 0 ? 0 : Math.ceil(total / AE_PROGRAM_PAGE_SIZE) }
}

async function loadAeProgramBySlug(slug: string): Promise<AeProgramDetail | null> {
  const { data, error } = await supabaseAdmin
    .from("program_detail_ae_v1")
    .select(`${EXPLORER_SELECT},accreditation_authority,accreditation_authority_url,accreditation_status,accreditation_review_status`)
    .eq("program_slug", slug)
    .maybeSingle()

  if (error) throw new Error(`Unable to load UAE program detail: ${error.message}`)
  if (!data) return null
  const row = data as unknown as AeProgramRow
  return {
    ...mapRow(row),
    accreditationAuthority: row.accreditation_authority ?? null,
    accreditationAuthorityUrl: row.accreditation_authority_url ?? null,
    accreditationStatus: row.accreditation_status ?? null,
    accreditationReviewStatus: row.accreditation_review_status ?? null,
  }
}

export const getAeProgramBySlug = cache(loadAeProgramBySlug)
