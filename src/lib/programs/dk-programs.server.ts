import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"

export const DK_PROGRAM_PAGE_SIZE = 20

type DkProgramRow = {
  programme_id: string; program_slug: string; title: string; source_program_name: string | null; degree_level: string; school_faculty: string | null; field_category: string | null; language_context: string | null; verification_tier: "A" | "B" | "C"; collection_status: string | null; institution_id: string; institution_name: string; institution_slug: string | null; city: string | null; default_duration_months: number | string | null; official_program_url: string | null; institution_program_url: string | null; international_source_url: string | null; international_students_eligible: boolean | null; international_admission_status: "open" | "closed" | "not_yet_open" | "restricted" | "eligible_schedule_unknown" | "unknown"; language_requirement_context: string | null; visa_context: string | null; intake_label: string | null; intake_start_date: string | null; application_deadline: string | null; admission_source_url: string | null; admission_verification_status: "unverified" | "verified_general" | "verified_program" | "stale" | "rejected"; occupation_ids: string[] | null; source_verification_label?: string | null; has_programme_accreditation_claim?: boolean | null
}

export type DkProgram = {
  id: string; slug: string; title: string; sourceProgramName: string | null; degreeLevel: string; schoolFaculty: string | null; fieldCategory: string | null; languageContext: string | null; verificationTier: "A" | "B" | "C"; collectionStatus: string | null; institutionId: string; institutionName: string; institutionSlug: string | null; city: string | null; durationMonths: number | null; officialProgramUrl: string | null; institutionProgramUrl: string | null; internationalSourceUrl: string | null; internationalStudentsEligible: boolean | null; internationalAdmissionStatus: DkProgramRow["international_admission_status"]; languageRequirementContext: string | null; visaContext: string | null; intakeLabel: string | null; intakeStartDate: string | null; applicationDeadline: string | null; admissionSourceUrl: string | null; admissionVerificationStatus: DkProgramRow["admission_verification_status"]; occupationIds: string[]
}
export type DkProgramDetail = DkProgram & { sourceVerificationLabel: string | null; hasProgrammeAccreditationClaim: boolean }
export type DkProgramSearchResult = { programs: DkProgram[]; total: number; page: number; pageSize: number; pageCount: number }

function numberOrNull(value: number | string | null) { if (value == null) return null; const parsed = typeof value === "number" ? value : Number(value); return Number.isFinite(parsed) ? parsed : null }
function safeSearchTerm(value: string) { return value.replace(/[^\p{L}\p{N}\s&.'()-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 80) }
function levelPattern(level: ProgramSearchFilters["level"]) { switch (level) { case "bachelor": return ["BACHELOR"]; case "master": return ["MASTER"]; case "doctorate": return ["DOCTORATE", "PROFESSIONAL"]; case "diploma": return ["DIPLOMA"]; case "certificate": return ["CERTIFICATE"]; default: return null } }
function mapRow(row: DkProgramRow): DkProgram { return { id: row.programme_id, slug: row.program_slug, title: row.title, sourceProgramName: row.source_program_name, degreeLevel: row.degree_level, schoolFaculty: row.school_faculty, fieldCategory: row.field_category, languageContext: row.language_context, verificationTier: row.verification_tier, collectionStatus: row.collection_status, institutionId: row.institution_id, institutionName: row.institution_name, institutionSlug: row.institution_slug, city: row.city, durationMonths: numberOrNull(row.default_duration_months), officialProgramUrl: row.official_program_url, institutionProgramUrl: row.institution_program_url, internationalSourceUrl: row.international_source_url, internationalStudentsEligible: row.international_students_eligible, internationalAdmissionStatus: row.international_admission_status, languageRequirementContext: row.language_requirement_context, visaContext: row.visa_context, intakeLabel: row.intake_label, intakeStartDate: row.intake_start_date, applicationDeadline: row.application_deadline, admissionSourceUrl: row.admission_source_url, admissionVerificationStatus: row.admission_verification_status, occupationIds: row.occupation_ids ?? [] } }
const EXPLORER_SELECT = ["programme_id","program_slug","title","source_program_name","degree_level","school_faculty","field_category","language_context","verification_tier","collection_status","institution_id","institution_name","institution_slug","city","default_duration_months","official_program_url","institution_program_url","international_source_url","international_students_eligible","international_admission_status","language_requirement_context","visa_context","intake_label","intake_start_date","application_deadline","admission_source_url","admission_verification_status","occupation_ids"].join(",")

export async function searchDkPrograms(filters: ProgramSearchFilters): Promise<DkProgramSearchResult> {
  let query = supabaseAdmin.from("program_explorer_dk_v1").select(EXPLORER_SELECT, { count: "exact" })
  const search = safeSearchTerm(filters.q)
  if (search) { const pattern = `%${search.replace(/\s+/g, "%")}%`; query = query.or(`title.ilike.${pattern},source_program_name.ilike.${pattern},institution_name.ilike.${pattern},field_category.ilike.${pattern}`) }
  const levels = levelPattern(filters.level); if (levels) query = query.in("degree_level", levels)
  if (filters.source === "verified") query = query.eq("verification_tier", "A")
  if (filters.sort === "duration-short") query = query.order("default_duration_months", { ascending: true, nullsFirst: false }); else if (filters.sort === "title") query = query.order("title", { ascending: true }); else query = query.order("international_admission_status", { ascending: true }).order("title", { ascending: true })
  const from = (filters.page - 1) * DK_PROGRAM_PAGE_SIZE
  const { data, error, count } = await query.range(from, from + DK_PROGRAM_PAGE_SIZE - 1)
  if (error) throw new Error(`Unable to load Denmark programs: ${error.message}`)
  const programs = ((data ?? []) as unknown as DkProgramRow[]).map(mapRow); const total = count ?? programs.length
  return { programs, total, page: filters.page, pageSize: DK_PROGRAM_PAGE_SIZE, pageCount: total === 0 ? 0 : Math.ceil(total / DK_PROGRAM_PAGE_SIZE) }
}
async function loadDkProgramBySlug(slug: string): Promise<DkProgramDetail | null> { const { data, error } = await supabaseAdmin.from("program_detail_dk_v1").select(`${EXPLORER_SELECT},source_verification_label,has_programme_accreditation_claim`).eq("program_slug", slug).maybeSingle(); if (error) throw new Error(`Unable to load Denmark program detail: ${error.message}`); if (!data) return null; const row = data as unknown as DkProgramRow; return { ...mapRow(row), sourceVerificationLabel: row.source_verification_label ?? null, hasProgrammeAccreditationClaim: row.has_programme_accreditation_claim === true } }
export const getDkProgramBySlug = cache(loadDkProgramBySlug)
