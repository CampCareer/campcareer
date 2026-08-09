import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { ProgramSearchFilters } from "@/lib/programs/program-search"
import type { CaProgramPgwpState, CaProgramPublicationTier } from "@/lib/programs/ca-publish-policy"

export const CA_PROGRAM_PAGE_SIZE = 20

type CaProgramRow = {
  program_catalog_id: number
  source_name: string | null
  source_program_key: string | null
  institution_key: string | null
  institution_name: string | null
  institution_slug: string | null
  institution_website_url: string | null
  title: string | null
  credential_type: string | null
  education_level: string | null
  field_name: string | null
  language: string | null
  province: string | null
  city: string | null
  duration_years: number | string | null
  tuition_fee_cad: number | null
  program_code: string | null
  official_program_url: string | null
  source_url: string | null
  source_as_of: string | null
  source_status: string | null
  matched_dli_number: string | null
  international_students_eligible: boolean | null
  international_program_admission_status: string | null
  ircc_program_eligible: boolean | null
  pgwp_program_status: string | null
  cip_code: string | null
  ircc_detail_url: string | null
  verified_at: string | null
  career_ids: string[] | null
  relation_types: string[] | null
  hold_reason: string | null
  pgwp_state: CaProgramPgwpState
  publication_tier: CaProgramPublicationTier
  indexable_detail: boolean
  publicly_listed: boolean
}

export type CaProgramListItem = {
  id: number
  institutionKey: string | null
  institutionName: string
  institutionSlug: string | null
  institutionWebsite: string | null
  title: string
  credentialType: string | null
  educationLevel: string | null
  fieldName: string | null
  language: string | null
  province: string | null
  city: string | null
  durationYears: number | null
  tuitionFeeCad: number | null
  programCode: string | null
  officialProgramUrl: string | null
  sourceUrl: string | null
  sourceAsOf: string | null
  verifiedAt: string | null
  dliNumber: string | null
  internationalAdmissionStatus: string | null
  pgwpProgramStatus: string | null
  pgwpState: CaProgramPgwpState
  cipCode: string | null
  irccDetailUrl: string | null
  careerIds: string[]
  relationTypes: string[]
  publicationTier: CaProgramPublicationTier
  indexableDetail: boolean
}

export type CaProgramSearchResult = {
  programs: CaProgramListItem[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export type CaProgramSitemapItem = {
  id: number
  title: string
  lastModified: string
}

const CA_PROGRAM_SELECT = [
  "program_catalog_id",
  "source_name",
  "source_program_key",
  "institution_key",
  "institution_name",
  "institution_slug",
  "institution_website_url",
  "title",
  "credential_type",
  "education_level",
  "field_name",
  "language",
  "province",
  "city",
  "duration_years",
  "tuition_fee_cad",
  "program_code",
  "official_program_url",
  "source_url",
  "source_as_of",
  "source_status",
  "matched_dli_number",
  "international_students_eligible",
  "international_program_admission_status",
  "ircc_program_eligible",
  "pgwp_program_status",
  "cip_code",
  "ircc_detail_url",
  "verified_at",
  "career_ids",
  "relation_types",
  "hold_reason",
  "pgwp_state",
  "publication_tier",
  "indexable_detail",
  "publicly_listed",
].join(",")

function numberOrNull(value: number | string | null) {
  if (value == null) return null
  const number = typeof value === "number" ? value : Number.parseFloat(value)
  return Number.isFinite(number) ? number : null
}

function safeSearchTerm(value: string) {
  return value
    .replace(/[^\p{L}\p{N}\s&'()-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
}

function mapProgram(row: CaProgramRow): CaProgramListItem {
  return {
    id: row.program_catalog_id,
    institutionKey: row.institution_key,
    institutionName: row.institution_name ?? row.institution_key ?? "Institution unavailable",
    institutionSlug: row.institution_slug,
    institutionWebsite: row.institution_website_url,
    title: row.title ?? "Untitled program",
    credentialType: row.credential_type,
    educationLevel: row.education_level,
    fieldName: row.field_name,
    language: row.language,
    province: row.province,
    city: row.city,
    durationYears: numberOrNull(row.duration_years),
    tuitionFeeCad: row.tuition_fee_cad,
    programCode: row.program_code,
    officialProgramUrl: row.official_program_url,
    sourceUrl: row.source_url,
    sourceAsOf: row.source_as_of,
    verifiedAt: row.verified_at,
    dliNumber: row.matched_dli_number,
    internationalAdmissionStatus: row.international_program_admission_status,
    pgwpProgramStatus: row.pgwp_program_status,
    pgwpState: row.pgwp_state,
    cipCode: row.cip_code,
    irccDetailUrl: row.ircc_detail_url,
    careerIds: row.career_ids ?? [],
    relationTypes: row.relation_types ?? [],
    publicationTier: row.publication_tier,
    indexableDetail: row.indexable_detail,
  }
}

export async function searchCaPrograms(
  filters: ProgramSearchFilters,
): Promise<CaProgramSearchResult> {
  let query = supabaseAdmin
    .from("ca_program_publication_v1")
    .select(CA_PROGRAM_SELECT, { count: "exact" })
    .eq("publicly_listed", true)

  const search = safeSearchTerm(filters.q)
  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`
    query = query.or(
      `title.ilike.${pattern},institution_name.ilike.${pattern},field_name.ilike.${pattern},city.ilike.${pattern}`,
    )
  }

  if (filters.province !== "all") query = query.eq("province", filters.province)
  if (filters.career !== "all") query = query.contains("career_ids", [filters.career])
  if (filters.pgwp !== "all") query = query.eq("pgwp_state", filters.pgwp)
  if (filters.source === "verified") query = query.eq("publication_tier", "A")

  if (filters.duration === "under-1") query = query.lte("duration_years", 1)
  if (filters.duration === "1-2") query = query.gt("duration_years", 1).lte("duration_years", 2)
  if (filters.duration === "2-3") query = query.gt("duration_years", 2).lte("duration_years", 3)
  if (filters.duration === "3-plus") query = query.gt("duration_years", 3)

  if (filters.sort === "fee-low") {
    query = query.order("tuition_fee_cad", { ascending: true, nullsFirst: false })
  } else if (filters.sort === "fee-high") {
    query = query.order("tuition_fee_cad", { ascending: false, nullsFirst: false })
  } else if (filters.sort === "duration-short") {
    query = query.order("duration_years", { ascending: true, nullsFirst: false })
  } else if (filters.sort === "title") {
    query = query.order("title", { ascending: true })
  } else {
    query = query
      .order("publication_tier", { ascending: true })
      .order("institution_name", { ascending: true })
      .order("title", { ascending: true })
  }

  const from = (filters.page - 1) * CA_PROGRAM_PAGE_SIZE
  const to = from + CA_PROGRAM_PAGE_SIZE - 1
  const { data, error, count } = await query.range(from, to)

  if (error) throw new Error(`Unable to load Canadian programs: ${error.message}`)

  const programs = ((data ?? []) as unknown as CaProgramRow[]).map(mapProgram)
  const total = count ?? programs.length

  return {
    programs,
    total,
    page: filters.page,
    pageSize: CA_PROGRAM_PAGE_SIZE,
    pageCount: total === 0 ? 0 : Math.ceil(total / CA_PROGRAM_PAGE_SIZE),
  }
}

async function loadCaProgramById(id: number): Promise<CaProgramListItem | null> {
  const { data, error } = await supabaseAdmin
    .from("ca_program_publication_v1")
    .select(CA_PROGRAM_SELECT)
    .eq("program_catalog_id", id)
    .eq("publicly_listed", true)
    .maybeSingle()

  if (error) throw new Error(`Unable to load Canadian program: ${error.message}`)
  return data ? mapProgram(data as unknown as CaProgramRow) : null
}

export const getCaProgramById = cache(loadCaProgramById)

export async function getIndexableCaProgramsForSitemap(): Promise<CaProgramSitemapItem[]> {
  const { data, error } = await supabaseAdmin
    .from("ca_program_publication_v1")
    .select("program_catalog_id,title,source_as_of,verified_at")
    .eq("publicly_listed", true)
    .eq("indexable_detail", true)
    .order("program_catalog_id", { ascending: true })

  if (error) throw new Error(`Unable to load Canadian program sitemap: ${error.message}`)

  return ((data ?? []) as Array<{
    program_catalog_id: number
    title: string | null
    source_as_of: string | null
    verified_at: string | null
  }>).flatMap((row) => {
    const title = row.title?.trim()
    const lastModified = row.source_as_of ?? row.verified_at
    if (!title || !lastModified) return []
    return [{ id: row.program_catalog_id, title, lastModified }]
  })
}
