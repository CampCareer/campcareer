import "server-only"

import { getAuProgramShortlistItem } from "@/data/au-top-university-program-shortlist"
import { getAuVocationalProgramShortlistItem } from "@/data/au-vocational-program-shortlist"
import { getAuPhaseThreeUniversityCatalogue } from "@/data/au-phase-three-university-catalogues"
import { getStudyConcept } from "@/data/study-concepts"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { CourseOffering } from "@/lib/study-product/types"

const REGISTRY_LINKS: Record<string, { name: string; url: string }> = {
  AU: { name: "CRICOS", url: "https://cricos.education.gov.au/Course/CourseSearch.aspx" },
  US: { name: "College Scorecard", url: "https://collegescorecard.ed.gov/search/" },
  CA: { name: "Canadian Information Centre for International Credentials", url: "https://www.cicic.ca/868/search_the_directory_of_educational_institutions_in_canada.canada" },
  UK: { name: "Discover Uni", url: "https://discoveruni.gov.uk/" },
  IE: { name: "Qualifax", url: "https://www.qualifax.ie/" },
  DE: { name: "DAAD International Programmes", url: "https://www2.daad.de/deutschland/studienangebote/international-programmes/en/" },
  NL: { name: "Study in NL", url: "https://www.studyinnl.org/dutch-education/studies" },
  BE: { name: "Study in Flanders", url: "https://www.studyinflanders.be/programmes" },
}

export function getOfficialCourseRegistry(countryCode: string) {
  return REGISTRY_LINKS[countryCode.toUpperCase()] ?? null
}

export async function getVerifiedCourseOfferings(
  conceptId: string,
  countryCode: string,
  requestedLimit = 20,
): Promise<CourseOffering[]> {
  const concept = getStudyConcept(conceptId)
  if (!concept) return []
  const limit = Math.min(Math.max(Math.floor(requestedLimit), 1), 20)
  const country = countryCode.toUpperCase()

  if (country === "AU") return getAustraliaCourses(concept.id, concept.roiSearchTerm, limit)
  if (country === "IE") return getIrelandCourses(concept.roiSearchTerm, limit)
  return []
}

const AU_COURSE_SELECT = "id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, official_course_url, official_url_status, official_url_checked_at, synced_at"

async function getAustraliaCourses(conceptId: string, searchTerm: string, limit: number): Promise<CourseOffering[]> {
  const vocationalProgram = getAuVocationalProgramShortlistItem(conceptId)
  if (vocationalProgram) return [vocationalProgram]

  const shortlistItem = getAuProgramShortlistItem(conceptId)
  const featuredCourse = shortlistItem?.status === "available" && shortlistItem.institutionId && shortlistItem.courseCode
    ? await getAustraliaCourseByCode(shortlistItem.institutionId, shortlistItem.courseCode)
    : null

  const candidates = await getAustraliaCourseCandidates(searchTerm)
  const selected = diversifyAustraliaCourses([
    ...(featuredCourse ?? []),
    ...candidates,
  ], limit)

  return selected.length ? mapAustraliaCourses(selected) : []
}

async function getAustraliaCourseByCode(institutionId: string, courseCode: string) {
  const { data, error } = await supabaseAdmin
    .from("courses_au")
    .select(AU_COURSE_SELECT)
    .eq("institution_id", institutionId)
    .eq("course_code", courseCode)
    .eq("cricos_status", "active")
    .limit(1)
  return error || !data?.length ? null : data
}

async function getAustraliaCourseCandidates(searchTerm: string) {
  let { data, error } = await supabaseAdmin
    .from("courses_au")
    .select(AU_COURSE_SELECT)
    .ilike("field_name", `%${escapeIlike(searchTerm)}%`)
    .not("cricos_url", "is", null)
    .eq("cricos_status", "active")
    .order("official_url_status", { ascending: false, nullsFirst: false })
    .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
    .limit(200)

  if (!error && (!data || data.length === 0)) {
    const fallback = await supabaseAdmin
      .from("courses_au")
      .select(AU_COURSE_SELECT)
      .ilike("title", `%${escapeIlike(searchTerm)}%`)
      .not("cricos_url", "is", null)
      .eq("cricos_status", "active")
      .order("official_url_status", { ascending: false, nullsFirst: false })
      .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
      .limit(200)
    data = fallback.data
    error = fallback.error
  }

  if (error || !data?.length) return []
  return data
}

function diversifyAustraliaCourses(data: Array<Record<string, unknown>>, limit: number) {
  const seenCourseIds = new Set<string>()
  const seenProviders = new Set<string>()
  const selected: Array<Record<string, unknown>> = []

  for (const course of data) {
    const id = String(course.id)
    const providerId = String(course.institution_id)
    if (seenCourseIds.has(id) || seenProviders.has(providerId)) continue
    seenCourseIds.add(id)
    seenProviders.add(providerId)
    selected.push(course)
    if (selected.length >= limit) break
  }
  return selected
}

async function mapAustraliaCourses(data: Array<Record<string, unknown>>): Promise<CourseOffering[]> {
  const providerIds = Array.from(new Set(data.map((row) => row.institution_id as string)))
  const { data: providers } = await supabaseAdmin
    .from("colleges_au")
    .select("institution_id, name, state, city, website_url")
    .in("institution_id", providerIds)
  const providerById = new Map((providers ?? []).map((provider) => [provider.institution_id as string, provider]))

  return data.map((row) => {
    const provider = providerById.get(row.institution_id as string)
    const syncedAt = String(row.synced_at ?? "2026-04-01")
    const hasVerifiedProviderPage = row.official_url_status === "verified" && typeof row.official_course_url === "string"
    const providerCatalogue = getAuPhaseThreeUniversityCatalogue(row.institution_id as string)
    const officialUrl = hasVerifiedProviderPage
      ? row.official_course_url as string
      : providerCatalogue?.programmesUrl ?? row.cricos_url as string
    const officialLinkKind = hasVerifiedProviderPage
      ? "COURSE_PAGE" as const
      : providerCatalogue
        ? "PROVIDER_CATALOGUE" as const
        : "REGISTRY" as const
    return {
      id: `au:${row.id}`,
      countryCode: "AU",
      providerId: row.institution_id as string,
      providerName: (provider?.name as string | undefined) ?? humanizeSlug(row.institution_id as string),
      title: row.title as string,
      courseCode: row.course_code as string,
      qualificationLevel: (row.course_type as string | null) ?? (row.aqf_level ? `AQF ${row.aqf_level}` : undefined),
      tuitionAmount: row.tuition_fee_aud as number | undefined,
      tuitionCurrency: "AUD",
      durationMonths: row.duration_years ? Math.round(Number(row.duration_years) * 12) : undefined,
      campus: [provider?.city, provider?.state].filter(Boolean).join(", ") || undefined,
      internationalEligible: true,
      registrationStatus: "CURRENT" as const,
      officialUrl,
      officialLinkKind,
      sourceName: hasVerifiedProviderPage
        ? "Provider course page (verified)"
        : providerCatalogue
          ? "Official provider course finder"
          : "Australian Government CRICOS",
      lastVerifiedAt: String((hasVerifiedProviderPage ? row.official_url_checked_at : null) ?? providerCatalogue?.checkedAt ?? syncedAt),
    }
  })
}

async function getIrelandCourses(searchTerm: string, limit: number): Promise<CourseOffering[]> {
  let { data, error } = await supabaseAdmin
    .from("courses_ie")
    .select("id, course_code, title, nfq_level, course_type, college_name, institution_id, city, duration_years, qualifax_url, synced_at")
    .ilike("field_name", `%${escapeIlike(searchTerm)}%`)
    .not("qualifax_url", "is", null)
    .order("college_name", { ascending: true })
    .limit(limit)

  if (!error && (!data || data.length === 0)) {
    const fallback = await supabaseAdmin
      .from("courses_ie")
      .select("id, course_code, title, nfq_level, course_type, college_name, institution_id, city, duration_years, qualifax_url, synced_at")
      .ilike("title", `%${escapeIlike(searchTerm)}%`)
      .not("qualifax_url", "is", null)
      .order("college_name", { ascending: true })
      .limit(limit)
    data = fallback.data
    error = fallback.error
  }

  if (error || !data?.length) return []

  return data.map((row) => ({
    id: `ie:${row.id}`,
    countryCode: "IE",
    providerId: row.institution_id as string,
    providerName: row.college_name as string,
    title: row.title as string,
    courseCode: (row.course_code as string | null) ?? undefined,
    qualificationLevel: row.nfq_level ? `NFQ ${row.nfq_level}` : (row.course_type as string | null) ?? undefined,
    durationMonths: row.duration_years ? Math.round(Number(row.duration_years) * 12) : undefined,
    campus: (row.city as string | null) ?? undefined,
    internationalEligible: true,
    registrationStatus: "CURRENT" as const,
    officialUrl: row.qualifax_url as string,
    sourceName: "Qualifax — Ireland's National Learners' Database",
    lastVerifiedAt: String(row.synced_at ?? "2026-06-01"),
  }))
}

function escapeIlike(value: string) {
  return value.replace(/[%_]/g, "")
}

function humanizeSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ")
}
