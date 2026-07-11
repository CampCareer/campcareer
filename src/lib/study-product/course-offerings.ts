import "server-only"

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

  if (country === "AU") return getAustraliaCourses(concept.roiSearchTerm, limit)
  if (country === "IE") return getIrelandCourses(concept.roiSearchTerm, limit)
  return []
}

async function getAustraliaCourses(searchTerm: string, limit: number): Promise<CourseOffering[]> {
  let { data, error } = await supabaseAdmin
    .from("courses_au")
    .select("id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, synced_at")
    .ilike("field_name", `%${escapeIlike(searchTerm)}%`)
    .not("cricos_url", "is", null)
    .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
    .limit(limit)

  if (!error && (!data || data.length === 0)) {
    const fallback = await supabaseAdmin
      .from("courses_au")
      .select("id, institution_id, course_code, title, field_name, aqf_level, course_type, duration_years, tuition_fee_aud, cricos_url, synced_at")
      .ilike("title", `%${escapeIlike(searchTerm)}%`)
      .not("cricos_url", "is", null)
      .order("tuition_fee_aud", { ascending: true, nullsFirst: false })
      .limit(limit)
    data = fallback.data
    error = fallback.error
  }

  if (error || !data?.length) return []

  const providerIds = Array.from(new Set(data.map((row) => row.institution_id as string)))
  const { data: providers } = await supabaseAdmin
    .from("colleges_au")
    .select("institution_id, name, state, city, website_url")
    .in("institution_id", providerIds)
  const providerById = new Map((providers ?? []).map((provider) => [provider.institution_id as string, provider]))

  return data.map((row) => {
    const provider = providerById.get(row.institution_id as string)
    const syncedAt = String(row.synced_at ?? "2026-04-01")
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
      officialUrl: row.cricos_url as string,
      sourceName: "Australian Government CRICOS",
      lastVerifiedAt: syncedAt,
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
