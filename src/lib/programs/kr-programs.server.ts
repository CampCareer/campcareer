import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"

export const KR_PROGRAM_PAGE_SIZE = 20

type KrProgramRow = {
  programme_id: string
  program_slug: string
  title: string
  source_department_name: string | null
  degree_level: string
  affiliation: string | null
  field_category: string | null
  english_course_ratio: string | null
  english_proficiency: string | null
  verification_tier: "A" | "B" | "C"
  institution_id: string
  institution_name: string
  institution_slug: string | null
  city: string | null
  default_duration_months: number | string | null
  tuition_fee_krw: number | string | null
  official_program_url: string | null
  studyinkorea_url: string
  international_students_eligible: boolean | null
  international_admission_status: "open" | "closed" | "not_yet_open" | "restricted" | "eligible_schedule_unknown" | "unknown"
  visa_context: string | null
  enrollment_period: string | null
  application_period: string | null
  intake_label: string | null
  intake_start_date: string | null
  application_deadline: string | null
  admission_source_url: string | null
  admission_guide_url: string | null
  admission_verification_status: "unverified" | "verified_general" | "verified_program" | "stale" | "rejected"
  occupation_ids: string[] | null
  source_verification_label?: string | null
  has_programme_accreditation_claim?: boolean | null
}

export type KrProgram = {
  id: string
  slug: string
  title: string
  sourceDepartmentName: string | null
  degreeLevel: string
  affiliation: string | null
  fieldCategory: string | null
  englishCourseRatio: string | null
  englishProficiency: string | null
  verificationTier: "A" | "B" | "C"
  institutionId: string
  institutionName: string
  institutionSlug: string | null
  city: string | null
  durationMonths: number | null
  tuitionFeeKrw: number | null
  officialProgramUrl: string | null
  studyInKoreaUrl: string
  internationalStudentsEligible: boolean | null
  internationalAdmissionStatus: KrProgramRow["international_admission_status"]
  visaContext: string | null
  enrollmentPeriod: string | null
  applicationPeriod: string | null
  intakeLabel: string | null
  intakeStartDate: string | null
  applicationDeadline: string | null
  admissionSourceUrl: string | null
  admissionGuideUrl: string | null
  admissionVerificationStatus: KrProgramRow["admission_verification_status"]
  occupationIds: string[]
}

export type KrProgramDetail = KrProgram & {
  sourceVerificationLabel: string | null
  hasProgrammeAccreditationClaim: boolean
}

export type KrProgramSearchResult = { programs: KrProgram[]; total: number; page: number; pageSize: number; pageCount: number }

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
    case "certificate": return ["CERTIFICATE"]
    default: return null
  }
}

function mapRow(row: KrProgramRow): KrProgram {
  return {
    id: row.programme_id, slug: row.program_slug, title: row.title, sourceDepartmentName: row.source_department_name,
    degreeLevel: row.degree_level, affiliation: row.affiliation, fieldCategory: row.field_category,
    englishCourseRatio: row.english_course_ratio, englishProficiency: row.english_proficiency, verificationTier: row.verification_tier,
    institutionId: row.institution_id, institutionName: row.institution_name, institutionSlug: row.institution_slug, city: row.city,
    durationMonths: numberOrNull(row.default_duration_months), tuitionFeeKrw: numberOrNull(row.tuition_fee_krw),
    officialProgramUrl: row.official_program_url, studyInKoreaUrl: row.studyinkorea_url,
    internationalStudentsEligible: row.international_students_eligible, internationalAdmissionStatus: row.international_admission_status,
    visaContext: row.visa_context, enrollmentPeriod: row.enrollment_period, applicationPeriod: row.application_period,
    intakeLabel: row.intake_label, intakeStartDate: row.intake_start_date, applicationDeadline: row.application_deadline,
    admissionSourceUrl: row.admission_source_url, admissionGuideUrl: row.admission_guide_url,
    admissionVerificationStatus: row.admission_verification_status, occupationIds: row.occupation_ids ?? [],
  }
}

const EXPLORER_SELECT = [
  "programme_id","program_slug","title","source_department_name","degree_level","affiliation","field_category","english_course_ratio","english_proficiency","verification_tier",
  "institution_id","institution_name","institution_slug","city","default_duration_months","tuition_fee_krw","official_program_url","studyinkorea_url",
  "international_students_eligible","international_admission_status","visa_context","enrollment_period","application_period","intake_label","intake_start_date","application_deadline",
  "admission_source_url","admission_guide_url","admission_verification_status","occupation_ids",
].join(",")

export async function searchKrPrograms(filters: ProgramSearchFilters): Promise<KrProgramSearchResult> {
  let query = supabaseAdmin.from("program_explorer_kr_v1").select(EXPLORER_SELECT, { count: "exact" })
  const search = safeSearchTerm(filters.q)
  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`
    query = query.or(`title.ilike.${pattern},source_department_name.ilike.${pattern},institution_name.ilike.${pattern},field_category.ilike.${pattern}`)
  }
  const levels = levelPattern(filters.level)
  if (levels) query = query.in("degree_level", levels)
  if (filters.source === "verified") query = query.eq("verification_tier", "A")
  if (filters.sort === "fee-low") query = query.order("tuition_fee_krw", { ascending: true, nullsFirst: false })
  else if (filters.sort === "fee-high") query = query.order("tuition_fee_krw", { ascending: false, nullsFirst: false })
  else if (filters.sort === "duration-short") query = query.order("default_duration_months", { ascending: true, nullsFirst: false })
  else if (filters.sort === "title") query = query.order("title", { ascending: true })
  else query = query.order("verification_tier", { ascending: true }).order("title", { ascending: true })
  const from = (filters.page - 1) * KR_PROGRAM_PAGE_SIZE
  const { data, error, count } = await query.range(from, from + KR_PROGRAM_PAGE_SIZE - 1)
  if (error) throw new Error(`Unable to load South Korea programs: ${error.message}`)
  const programs = ((data ?? []) as unknown as KrProgramRow[]).map(mapRow)
  const total = count ?? programs.length
  return { programs, total, page: filters.page, pageSize: KR_PROGRAM_PAGE_SIZE, pageCount: total === 0 ? 0 : Math.ceil(total / KR_PROGRAM_PAGE_SIZE) }
}

async function loadKrProgramBySlug(slug: string): Promise<KrProgramDetail | null> {
  const { data, error } = await supabaseAdmin.from("program_detail_kr_v1")
    .select(`${EXPLORER_SELECT},source_verification_label,has_programme_accreditation_claim`)
    .eq("program_slug", slug).maybeSingle()
  if (error) throw new Error(`Unable to load South Korea program detail: ${error.message}`)
  if (!data) return null
  const row = data as unknown as KrProgramRow
  return { ...mapRow(row), sourceVerificationLabel: row.source_verification_label ?? null, hasProgrammeAccreditationClaim: row.has_programme_accreditation_claim === true }
}

export const getKrProgramBySlug = cache(loadKrProgramBySlug)
