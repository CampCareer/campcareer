import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"

export const NZ_PROGRAM_PAGE_SIZE = 20

type NzAdmissionState = "open" | "closed" | "not_yet_open" | "restricted" | "eligible_schedule_unknown" | "unknown"

type NzProgrammeRelation = {
  careerId?: string | null
  relationType?: string | null
  sourceRelationType?: string | null
  matchBasis?: string | null
  sourceCheckedAt?: string | null
  reviewerNote?: string | null
}

type NzProgramRow = {
  programme_id: string
  institution_id: string
  institution_slug: string
  institution_name: string
  canonical_title: string
  qualification_name: string | null
  degree_level: string | null
  nzqcf_level: number | string | null
  nzqcf_credits: number | string | null
  programme_type: string | null
  field_name: string | null
  default_duration_months: number | string | null
  study_mode: string | null
  verification_tier: "A"
  publication_status: "publishable"
  indexable: boolean
  international_students_eligible: boolean | null
  code_signatory_status: string | null
  canonical_admission_state: NzAdmissionState
  intake_label: string | null
  intake_start_date: string | null
  application_deadline: string | null
  post_study_work_context: string | null
  enrolment_status: string | null
  offering_verification_status: string | null
  campus_id: string | null
  city_slug: string | null
  city_name: string | null
  canonical_career_ids: string[] | null
  official_program_url: string | null
  source_name?: string | null
  source_program_key?: string | null
  source_program_name?: string | null
  provider_number?: string | null
  programme_authority?: string | null
  programme_authority_url?: string | null
  collection_status?: string | null
  language_context?: string | null
  programme_international_source_url?: string | null
  international_admission_status?: string | null
  admission_source_url?: string | null
  international_source_url?: string | null
  code_signatory_source_url?: string | null
  student_visa_context?: string | null
  post_study_work_rule_effective_date?: string | null
  visa_source_url?: string | null
  international_verification_status?: string | null
  international_source_checked_at?: string | null
  verified_at?: string | null
  occupation_relations?: NzProgrammeRelation[] | null
}

export type NzProgram = {
  id: string
  slug: string
  institutionId: string
  institutionSlug: string
  institutionName: string
  title: string
  qualificationName: string | null
  degreeLevel: string | null
  nzqcfLevel: number | null
  nzqcfCredits: number | null
  programmeType: string | null
  fieldName: string | null
  durationMonths: number | null
  studyMode: string | null
  verificationTier: "A"
  publicationStatus: "publishable"
  indexable: boolean
  internationalStudentsEligible: boolean | null
  codeSignatoryStatus: string | null
  admissionState: NzAdmissionState
  intakeLabel: string | null
  intakeStartDate: string | null
  applicationDeadline: string | null
  postStudyWorkContext: string | null
  enrolmentStatus: string | null
  offeringVerificationStatus: string | null
  careerIds: string[]
  officialProgramUrl: string | null
}

export type NzProgramDetail = NzProgram & {
  sourceName: string | null
  sourceProgramKey: string | null
  sourceProgramName: string | null
  providerNumber: string | null
  programmeAuthority: string | null
  programmeAuthorityUrl: string | null
  collectionStatus: string | null
  languageContext: string | null
  programmeInternationalSourceUrl: string | null
  internationalAdmissionStatus: string | null
  admissionSourceUrl: string | null
  internationalSourceUrl: string | null
  codeSignatorySourceUrl: string | null
  studentVisaContext: string | null
  postStudyWorkRuleEffectiveDate: string | null
  visaSourceUrl: string | null
  internationalVerificationStatus: string | null
  internationalSourceCheckedAt: string | null
  verifiedAt: string | null
  occupationRelations: NzProgrammeRelation[]
}

export type NzProgramSearchResult = {
  programs: NzProgram[]
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

function slugPart(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function nzProgramSlug(institutionSlug: string, sourceProgramKey: string) {
  return slugPart(`${institutionSlug}-${sourceProgramKey}`)
}

function levelValues(level: ProgramSearchFilters["level"]) {
  switch (level) {
    case "bachelor": return ["BACHELOR", "BACHELOR_HONOURS"]
    case "master": return ["MASTER", "INTEGRATED_MASTER"]
    case "certificate": return ["POSTGRADUATE_CERTIFICATE"]
    case "doctorate": return ["DOCTORATE"]
    case "diploma": return ["DIPLOMA"]
    case "associate": return ["ASSOCIATE"]
    default: return null
  }
}

function mapRow(row: NzProgramRow): NzProgram {
  const sourceKey = row.source_program_key ?? row.programme_id
  return {
    id: row.programme_id,
    slug: nzProgramSlug(row.institution_slug, sourceKey),
    institutionId: row.institution_id,
    institutionSlug: row.institution_slug,
    institutionName: row.institution_name,
    title: row.canonical_title,
    qualificationName: row.qualification_name,
    degreeLevel: row.degree_level,
    nzqcfLevel: numberOrNull(row.nzqcf_level),
    nzqcfCredits: numberOrNull(row.nzqcf_credits),
    programmeType: row.programme_type,
    fieldName: row.field_name,
    durationMonths: numberOrNull(row.default_duration_months),
    studyMode: row.study_mode,
    verificationTier: row.verification_tier,
    publicationStatus: row.publication_status,
    indexable: row.indexable === true,
    internationalStudentsEligible: row.international_students_eligible,
    codeSignatoryStatus: row.code_signatory_status,
    admissionState: row.canonical_admission_state,
    intakeLabel: row.intake_label,
    intakeStartDate: row.intake_start_date,
    applicationDeadline: row.application_deadline,
    postStudyWorkContext: row.post_study_work_context,
    enrolmentStatus: row.enrolment_status,
    offeringVerificationStatus: row.offering_verification_status,
    careerIds: row.canonical_career_ids ?? [],
    officialProgramUrl: row.official_program_url,
  }
}

const EXPLORER_SELECT = [
  "programme_id","institution_id","institution_slug","institution_name","canonical_title","qualification_name","degree_level","nzqcf_level","nzqcf_credits",
  "programme_type","field_name","default_duration_months","study_mode","verification_tier","publication_status","indexable","international_students_eligible",
  "code_signatory_status","canonical_admission_state","intake_label","intake_start_date","application_deadline","post_study_work_context","enrolment_status",
  "offering_verification_status","campus_id","city_slug","city_name","canonical_career_ids","official_program_url","source_program_key",
].join(",")

export async function searchNzPrograms(filters: ProgramSearchFilters): Promise<NzProgramSearchResult> {
  let query = supabaseAdmin.from("program_detail_nz_v1").select(EXPLORER_SELECT, { count: "exact" })
  const search = safeSearchTerm(filters.q)
  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`
    query = query.or(`canonical_title.ilike.${pattern},institution_name.ilike.${pattern},field_name.ilike.${pattern},qualification_name.ilike.${pattern}`)
  }
  const levels = levelValues(filters.level)
  if (levels) query = query.in("degree_level", levels)
  if (filters.source === "verified") query = query.eq("indexable", true)
  if (filters.sort === "duration-short") query = query.order("default_duration_months", { ascending: true, nullsFirst: false }).order("canonical_title", { ascending: true })
  else if (filters.sort === "title") query = query.order("canonical_title", { ascending: true })
  else query = query.order("canonical_admission_state", { ascending: true }).order("canonical_title", { ascending: true })

  const from = (filters.page - 1) * NZ_PROGRAM_PAGE_SIZE
  const { data, error, count } = await query.range(from, from + NZ_PROGRAM_PAGE_SIZE - 1)
  if (error) throw new Error(`Unable to load NZ programs: ${error.message}`)
  const programs = ((data ?? []) as unknown as NzProgramRow[]).map(mapRow)
  const total = count ?? programs.length
  return {
    programs,
    total,
    page: filters.page,
    pageSize: NZ_PROGRAM_PAGE_SIZE,
    pageCount: total === 0 ? 0 : Math.ceil(total / NZ_PROGRAM_PAGE_SIZE),
  }
}

const DETAIL_SELECT = [
  EXPLORER_SELECT,"source_name","source_program_name","provider_number","programme_authority","programme_authority_url","collection_status","language_context",
  "programme_international_source_url","international_admission_status","admission_source_url","international_source_url","code_signatory_source_url","student_visa_context",
  "post_study_work_rule_effective_date","visa_source_url","international_verification_status","international_source_checked_at","verified_at","occupation_relations",
].join(",")

const loadNzProgramDetails = cache(async (): Promise<NzProgramDetail[]> => {
  const { data, error } = await supabaseAdmin.from("program_detail_nz_v1").select(DETAIL_SELECT)
  if (error) throw new Error(`Unable to load NZ program details: ${error.message}`)
  return ((data ?? []) as unknown as NzProgramRow[]).map((row) => ({
    ...mapRow(row),
    sourceName: row.source_name ?? null,
    sourceProgramKey: row.source_program_key ?? null,
    sourceProgramName: row.source_program_name ?? null,
    providerNumber: row.provider_number ?? null,
    programmeAuthority: row.programme_authority ?? null,
    programmeAuthorityUrl: row.programme_authority_url ?? null,
    collectionStatus: row.collection_status ?? null,
    languageContext: row.language_context ?? null,
    programmeInternationalSourceUrl: row.programme_international_source_url ?? null,
    internationalAdmissionStatus: row.international_admission_status ?? null,
    admissionSourceUrl: row.admission_source_url ?? null,
    internationalSourceUrl: row.international_source_url ?? null,
    codeSignatorySourceUrl: row.code_signatory_source_url ?? null,
    studentVisaContext: row.student_visa_context ?? null,
    postStudyWorkRuleEffectiveDate: row.post_study_work_rule_effective_date ?? null,
    visaSourceUrl: row.visa_source_url ?? null,
    internationalVerificationStatus: row.international_verification_status ?? null,
    internationalSourceCheckedAt: row.international_source_checked_at ?? null,
    verifiedAt: row.verified_at ?? null,
    occupationRelations: Array.isArray(row.occupation_relations) ? row.occupation_relations : [],
  }))
})

export async function getNzProgramBySlug(slug: string) {
  const programs = await loadNzProgramDetails()
  return programs.find((program) => program.slug === slug) ?? null
}
