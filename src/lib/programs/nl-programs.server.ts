import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"

export const NL_PROGRAM_PAGE_SIZE = 20

type NlAdmissionState = "open" | "closed" | "not_yet_open" | "restricted" | "eligible_schedule_unknown" | "unknown"

type NlProgrammeRelation = {
  careerId?: string | null
  relationType?: string | null
  sourceRelationType?: string | null
  matchBasis?: string | null
  sourceCheckedAt?: string | null
}

type NlProgramRow = {
  programme_id: string
  institution_id: string
  institution_slug: string
  institution_name: string
  canonical_title: string
  recognised_program_code: string | null
  education_sector: string | null
  native_level_code: string | null
  degree_type: string | null
  eqf_level: number | string | null
  nlqf_level: number | string | null
  ects: number | string | null
  canonical_level: string | null
  programme_type: string | null
  field_name: string | null
  default_duration_months: number | string | null
  study_mode: string | null
  language_code: string | null
  verification_tier: "A"
  publication_status: "publishable"
  indexable: boolean
  international_students_eligible: boolean | null
  student_sponsor_eligible: boolean | null
  accredited_programme_evidence: boolean | null
  full_time_evidence: boolean | null
  canonical_admission_state: NlAdmissionState
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
  offered_program_code?: string | null
  brin_code?: string | null
  source_city?: string | null
  source_campus?: string | null
  collection_status?: string | null
  recognition_source_url?: string | null
  international_admission_status?: string | null
  admission_source_url?: string | null
  international_source_url?: string | null
  sponsor_source_url?: string | null
  international_verification_status?: string | null
  verified_at?: string | null
  occupation_relations?: NlProgrammeRelation[] | null
}

export type NlProgram = {
  id: string
  slug: string
  institutionId: string
  institutionSlug: string
  institutionName: string
  title: string
  degreeType: string | null
  canonicalLevel: string | null
  programmeType: string | null
  fieldName: string | null
  durationMonths: number | null
  studyMode: string | null
  languageCode: string | null
  ects: number | null
  verificationTier: "A"
  publicationStatus: "publishable"
  indexable: boolean
  internationalStudentsEligible: boolean | null
  studentSponsorEligible: boolean | null
  accreditedProgrammeEvidence: boolean | null
  fullTimeEvidence: boolean | null
  admissionState: NlAdmissionState
  intakeLabel: string | null
  intakeStartDate: string | null
  applicationDeadline: string | null
  enrolmentStatus: string | null
  offeringVerificationStatus: string | null
  careerIds: string[]
  officialProgramUrl: string | null
}

export type NlProgramDetail = NlProgram & {
  recognisedProgramCode: string | null
  educationSector: string | null
  nativeLevelCode: string | null
  eqfLevel: number | null
  nlqfLevel: number | null
  sourceName: string | null
  sourceProgramKey: string | null
  sourceProgramName: string | null
  offeredProgramCode: string | null
  brinCode: string | null
  collectionStatus: string | null
  recognitionSourceUrl: string | null
  internationalAdmissionStatus: string | null
  admissionSourceUrl: string | null
  internationalSourceUrl: string | null
  sponsorSourceUrl: string | null
  internationalVerificationStatus: string | null
  verifiedAt: string | null
  occupationRelations: NlProgrammeRelation[]
}

export type NlProgramSearchResult = {
  programs: NlProgram[]
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

export function nlProgramSlug(institutionSlug: string, sourceProgramKey: string) {
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

function mapRow(row: NlProgramRow): NlProgram {
  const sourceKey = row.source_program_key ?? row.programme_id
  return {
    id: row.programme_id,
    slug: nlProgramSlug(row.institution_slug, sourceKey),
    institutionId: row.institution_id,
    institutionSlug: row.institution_slug,
    institutionName: row.institution_name,
    title: row.canonical_title,
    degreeType: row.degree_type,
    canonicalLevel: row.canonical_level,
    programmeType: row.programme_type,
    fieldName: row.field_name,
    durationMonths: numberOrNull(row.default_duration_months),
    studyMode: row.study_mode,
    languageCode: row.language_code,
    ects: numberOrNull(row.ects),
    verificationTier: row.verification_tier,
    publicationStatus: row.publication_status,
    indexable: row.indexable === true,
    internationalStudentsEligible: row.international_students_eligible,
    studentSponsorEligible: row.student_sponsor_eligible,
    accreditedProgrammeEvidence: row.accredited_programme_evidence,
    fullTimeEvidence: row.full_time_evidence,
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
  "programme_id","institution_id","institution_slug","institution_name","canonical_title","degree_type","canonical_level","programme_type","field_name",
  "default_duration_months","study_mode","language_code","ects","verification_tier","publication_status","indexable","international_students_eligible","student_sponsor_eligible",
  "accredited_programme_evidence","full_time_evidence","canonical_admission_state","intake_label","intake_start_date","application_deadline","enrolment_status",
  "offering_verification_status","campus_id","city_slug","city_name","canonical_career_ids","official_program_url","source_program_key",
].join(",")

export async function searchNlPrograms(filters: ProgramSearchFilters): Promise<NlProgramSearchResult> {
  let query = supabaseAdmin.from("program_detail_nl_v1").select(EXPLORER_SELECT, { count: "exact" })
  const search = safeSearchTerm(filters.q)
  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`
    query = query.or(`canonical_title.ilike.${pattern},institution_name.ilike.${pattern},field_name.ilike.${pattern},degree_type.ilike.${pattern}`)
  }
  const levels = levelValues(filters.level)
  if (levels) query = query.in("canonical_level", levels)
  if (filters.source === "verified") query = query.eq("indexable", true)
  if (filters.sort === "duration-short") query = query.order("default_duration_months", { ascending: true, nullsFirst: false }).order("canonical_title", { ascending: true })
  else if (filters.sort === "title") query = query.order("canonical_title", { ascending: true })
  else query = query.order("canonical_admission_state", { ascending: true }).order("canonical_title", { ascending: true })

  const from = (filters.page - 1) * NL_PROGRAM_PAGE_SIZE
  const { data, error, count } = await query.range(from, from + NL_PROGRAM_PAGE_SIZE - 1)
  if (error) throw new Error(`Unable to load NL programs: ${error.message}`)
  const programs = ((data ?? []) as unknown as NlProgramRow[]).map(mapRow)
  const total = count ?? programs.length
  return {
    programs,
    total,
    page: filters.page,
    pageSize: NL_PROGRAM_PAGE_SIZE,
    pageCount: total === 0 ? 0 : Math.ceil(total / NL_PROGRAM_PAGE_SIZE),
  }
}

const DETAIL_SELECT = [
  EXPLORER_SELECT,"recognised_program_code","education_sector","native_level_code","eqf_level","nlqf_level","source_name","source_program_name","offered_program_code","brin_code",
  "collection_status","recognition_source_url","international_admission_status","admission_source_url","international_source_url","sponsor_source_url",
  "international_verification_status","verified_at","occupation_relations",
].join(",")

const loadNlProgramDetails = cache(async (): Promise<NlProgramDetail[]> => {
  const { data, error } = await supabaseAdmin.from("program_detail_nl_v1").select(DETAIL_SELECT)
  if (error) throw new Error(`Unable to load NL program details: ${error.message}`)
  return ((data ?? []) as unknown as NlProgramRow[]).map((row) => ({
    ...mapRow(row),
    recognisedProgramCode: row.recognised_program_code ?? null,
    educationSector: row.education_sector ?? null,
    nativeLevelCode: row.native_level_code ?? null,
    eqfLevel: numberOrNull(row.eqf_level),
    nlqfLevel: numberOrNull(row.nlqf_level),
    sourceName: row.source_name ?? null,
    sourceProgramKey: row.source_program_key ?? null,
    sourceProgramName: row.source_program_name ?? null,
    offeredProgramCode: row.offered_program_code ?? null,
    brinCode: row.brin_code ?? null,
    collectionStatus: row.collection_status ?? null,
    recognitionSourceUrl: row.recognition_source_url ?? null,
    internationalAdmissionStatus: row.international_admission_status ?? null,
    admissionSourceUrl: row.admission_source_url ?? null,
    internationalSourceUrl: row.international_source_url ?? null,
    sponsorSourceUrl: row.sponsor_source_url ?? null,
    internationalVerificationStatus: row.international_verification_status ?? null,
    verifiedAt: row.verified_at ?? null,
    occupationRelations: Array.isArray(row.occupation_relations) ? row.occupation_relations : [],
  }))
})

export async function getNlProgramBySlug(slug: string) {
  const programs = await loadNlProgramDetails()
  return programs.find((program) => program.slug === slug) ?? null
}
