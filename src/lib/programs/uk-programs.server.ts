import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"

export const UK_PROGRAM_PAGE_SIZE = 20

type UkAdmissionState = "open" | "closed" | "not_yet_open" | "restricted" | "eligible_schedule_unknown" | "unknown"

type UkProgrammeRelation = {
  careerId?: string | null
  relationType?: string | null
  sourceRelationType?: string | null
  matchBasis?: string | null
  sourceCheckedAt?: string | null
}

type UkProgramRow = {
  programme_id: string
  institution_id: string
  institution_slug: string
  institution_name: string
  canonical_title: string
  qualification_title: string | null
  canonical_level: string | null
  programme_type: string | null
  field_name: string | null
  default_duration_months: number | string | null
  study_mode: string | null
  verification_tier: "A" | "B"
  publication_status: "publishable" | "review"
  indexable: boolean
  international_students_eligible: boolean | null
  student_sponsor_eligible: boolean | null
  canonical_admission_state: UkAdmissionState
  intake_label: string | null
  intake_start_date: string | null
  application_deadline: string | null
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
  native_framework?: string | null
  native_level_code?: string | null
  collection_status?: string | null
  official_qualification_url?: string | null
  international_admission_status?: string | null
  admission_source_url?: string | null
  international_source_url?: string | null
  sponsor_source_url?: string | null
  international_verification_status?: string | null
  verified_at?: string | null
  occupation_relations?: UkProgrammeRelation[] | null
}

export type UkProgram = {
  id: string
  slug: string
  institutionId: string
  institutionSlug: string
  institutionName: string
  title: string
  qualificationTitle: string | null
  canonicalLevel: string | null
  programmeType: string | null
  fieldName: string | null
  durationMonths: number | null
  studyMode: string | null
  verificationTier: "A" | "B"
  publicationStatus: "publishable" | "review"
  indexable: boolean
  internationalStudentsEligible: boolean | null
  studentSponsorEligible: boolean | null
  admissionState: UkAdmissionState
  intakeLabel: string | null
  intakeStartDate: string | null
  applicationDeadline: string | null
  enrolmentStatus: string | null
  offeringVerificationStatus: string | null
  careerIds: string[]
  officialProgramUrl: string | null
}

export type UkProgramDetail = UkProgram & {
  sourceName: string | null
  sourceProgramKey: string | null
  sourceProgramName: string | null
  nativeFramework: string | null
  nativeLevelCode: string | null
  collectionStatus: string | null
  officialQualificationUrl: string | null
  internationalAdmissionStatus: string | null
  admissionSourceUrl: string | null
  internationalSourceUrl: string | null
  sponsorSourceUrl: string | null
  internationalVerificationStatus: string | null
  verifiedAt: string | null
  occupationRelations: UkProgrammeRelation[]
}

export type UkProgramSearchResult = {
  programs: UkProgram[]
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

export function ukProgramSlug(institutionSlug: string, sourceProgramKey: string) {
  return slugPart(`${institutionSlug}-${sourceProgramKey}`)
}

function levelValues(level: ProgramSearchFilters["level"]) {
  switch (level) {
    case "bachelor": return ["BACHELOR"]
    case "master": return ["MASTER", "INTEGRATED_MASTER"]
    case "certificate": return ["POSTGRADUATE_CERTIFICATE"]
    case "doctorate": return ["DOCTORATE"]
    case "diploma": return ["DIPLOMA"]
    case "associate": return ["ASSOCIATE"]
    default: return null
  }
}

function mapRow(row: UkProgramRow): UkProgram {
  const sourceKey = row.source_program_key ?? row.programme_id
  return {
    id: row.programme_id,
    slug: ukProgramSlug(row.institution_slug, sourceKey),
    institutionId: row.institution_id,
    institutionSlug: row.institution_slug,
    institutionName: row.institution_name,
    title: row.canonical_title,
    qualificationTitle: row.qualification_title,
    canonicalLevel: row.canonical_level,
    programmeType: row.programme_type,
    fieldName: row.field_name,
    durationMonths: numberOrNull(row.default_duration_months),
    studyMode: row.study_mode,
    verificationTier: row.verification_tier,
    publicationStatus: row.publication_status,
    indexable: row.indexable === true,
    internationalStudentsEligible: row.international_students_eligible,
    studentSponsorEligible: row.student_sponsor_eligible,
    admissionState: row.canonical_admission_state,
    intakeLabel: row.intake_label,
    intakeStartDate: row.intake_start_date,
    applicationDeadline: row.application_deadline,
    enrolmentStatus: row.enrolment_status,
    offeringVerificationStatus: row.offering_verification_status,
    careerIds: row.canonical_career_ids ?? [],
    officialProgramUrl: row.official_program_url,
  }
}

const EXPLORER_SELECT = [
  "programme_id","institution_id","institution_slug","institution_name","canonical_title","qualification_title","canonical_level","programme_type","field_name",
  "default_duration_months","study_mode","verification_tier","publication_status","indexable","international_students_eligible","student_sponsor_eligible",
  "canonical_admission_state","intake_label","intake_start_date","application_deadline","enrolment_status","offering_verification_status","campus_id","city_slug","city_name",
  "canonical_career_ids","official_program_url","source_program_key",
].join(",")

export async function searchUkPrograms(filters: ProgramSearchFilters): Promise<UkProgramSearchResult> {
  let query = supabaseAdmin.from("program_detail_uk_v1").select(EXPLORER_SELECT, { count: "exact" })
  const search = safeSearchTerm(filters.q)
  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`
    query = query.or(`canonical_title.ilike.${pattern},institution_name.ilike.${pattern},field_name.ilike.${pattern},qualification_title.ilike.${pattern}`)
  }
  const levels = levelValues(filters.level)
  if (levels) query = query.in("canonical_level", levels)
  if (filters.source === "verified") query = query.eq("indexable", true)
  if (filters.sort === "duration-short") query = query.order("default_duration_months", { ascending: true, nullsFirst: false }).order("canonical_title", { ascending: true })
  else if (filters.sort === "title") query = query.order("canonical_title", { ascending: true })
  else query = query.order("indexable", { ascending: false }).order("canonical_admission_state", { ascending: true }).order("canonical_title", { ascending: true })

  const from = (filters.page - 1) * UK_PROGRAM_PAGE_SIZE
  const { data, error, count } = await query.range(from, from + UK_PROGRAM_PAGE_SIZE - 1)
  if (error) throw new Error(`Unable to load UK programs: ${error.message}`)
  const programs = ((data ?? []) as unknown as UkProgramRow[]).map(mapRow)
  const total = count ?? programs.length
  return {
    programs,
    total,
    page: filters.page,
    pageSize: UK_PROGRAM_PAGE_SIZE,
    pageCount: total === 0 ? 0 : Math.ceil(total / UK_PROGRAM_PAGE_SIZE),
  }
}

const DETAIL_SELECT = [
  EXPLORER_SELECT,"source_name","source_program_name","native_framework","native_level_code","collection_status","official_qualification_url",
  "international_admission_status","admission_source_url","international_source_url","sponsor_source_url","international_verification_status","verified_at","occupation_relations",
].join(",")

const loadUkProgramDetails = cache(async (): Promise<UkProgramDetail[]> => {
  const { data, error } = await supabaseAdmin.from("program_detail_uk_v1").select(DETAIL_SELECT)
  if (error) throw new Error(`Unable to load UK program details: ${error.message}`)
  return ((data ?? []) as unknown as UkProgramRow[]).map((row) => ({
    ...mapRow(row),
    sourceName: row.source_name ?? null,
    sourceProgramKey: row.source_program_key ?? null,
    sourceProgramName: row.source_program_name ?? null,
    nativeFramework: row.native_framework ?? null,
    nativeLevelCode: row.native_level_code ?? null,
    collectionStatus: row.collection_status ?? null,
    officialQualificationUrl: row.official_qualification_url ?? null,
    internationalAdmissionStatus: row.international_admission_status ?? null,
    admissionSourceUrl: row.admission_source_url ?? null,
    internationalSourceUrl: row.international_source_url ?? null,
    sponsorSourceUrl: row.sponsor_source_url ?? null,
    internationalVerificationStatus: row.international_verification_status ?? null,
    verifiedAt: row.verified_at ?? null,
    occupationRelations: Array.isArray(row.occupation_relations) ? row.occupation_relations : [],
  }))
})

export async function getUkProgramBySlug(slug: string) {
  const programs = await loadUkProgramDetails()
  return programs.find((program) => program.slug === slug) ?? null
}
