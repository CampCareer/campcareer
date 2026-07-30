import "server-only"

import { getAuRouteCourseMatcher, matchesExactAuRouteCourse } from "@/data/au-route-course-matchers"
import {
  AU_STATE_CODES,
  normalizeQualification,
  parseAuState,
  parsePositiveAud,
  parseTuitionYear,
  parseVerifiedCampuses,
  type AuStateCode,
  type RouteStudyCampus,
  type RouteStudyFact,
  type RouteStudyOption,
  type RouteStudyOptions,
} from "@/data/au-route-study-contract"
import { supabaseAdmin } from "@/lib/supabase-admin"

export { AU_STATE_CODES, parsePositiveAud, parseTuitionYear, parseVerifiedCampuses }
export type { AuStateCode, RouteStudyCampus, RouteStudyFact, RouteStudyOption, RouteStudyOptions }

type CourseRow = {
  id: number
  institution_id: string | null
  course_code: string | null
  title: string
  aqf_level: number | null
  course_type: string | null
  duration_years: number | null
  tuition_fee_aud: number | null
  official_course_url: string | null
  official_url_status: string | null
  official_url_checked_at: string | null
}

type ProviderRow = {
  institution_id: string
  name: string | null
}

type ProgramFactKey = "annual_tuition_aud" | "english_requirement" | "entry_requirements" | "intakes" | "campus" | "duration" | "application_deadline"

type ProgramFactRow = {
  course_id: number
  field_key: ProgramFactKey
  value: unknown
  source_url: string
  reviewed_at: string | null
  extracted_at: string
}

const COURSE_SELECT = "id, institution_id, course_code, title, aqf_level, course_type, duration_years, tuition_fee_aud, official_course_url, official_url_status, official_url_checked_at"

/**
 * Gets only route-eligible programmes. This intentionally does not reference
 * courses_au.broad_field: title matching is the first career relevance gate.
 *
 * A course is not eligible for the result grid until its own verified campus
 * fact is present. Provider HQ/location is never used as a campus proxy.
 */
export async function getAuRouteStudyOptions(candidateId: string, state?: string | null, requestedLimit = 12): Promise<RouteStudyOptions | null> {
  const matcher = getAuRouteCourseMatcher(candidateId)
  if (!matcher) return null

  const normalizedState = parseAuState(state)
  if (matcher.kind === "training") {
    return { candidateId, kind: "training", state: normalizedState, options: [] }
  }

  const limit = Math.min(Math.max(Math.floor(requestedLimit), 1), 20)
  const queryFilter = matcher.queryTerms
    .map((term) => `title.ilike.%${term.replace(/[%_,()]/g, "")}%`)
    .join(",")

  const { data: candidates, error: candidatesError } = await supabaseAdmin
    .from("courses_au")
    .select(COURSE_SELECT)
    .eq("cricos_status", "active")
    .eq("official_url_status", "verified")
    .not("official_course_url", "is", null)
    .or(queryFilter)
    .order("official_url_checked_at", { ascending: false, nullsFirst: false })
    .limit(240)

  if (candidatesError || !candidates?.length) return { candidateId, kind: "course", state: normalizedState, options: [] }
  const exactCourses = (candidates as CourseRow[]).filter((course) => matchesExactAuRouteCourse(candidateId, course.title))
  if (!exactCourses.length) return { candidateId, kind: "course", state: normalizedState, options: [] }

  const factsByCourse = await getVerifiedFactsByCourse(exactCourses.map((course) => course.id))
  const providerById = await getProvidersById(exactCourses.map((course) => course.institution_id).filter((value): value is string => Boolean(value)))
  const seenCourses = new Set<number>()
  const options: RouteStudyOption[] = []

  for (const course of exactCourses) {
    if (!course.official_course_url || course.official_url_status !== "verified") continue
    if (seenCourses.has(course.id)) continue
    const facts = factsByCourse.get(course.id) ?? new Map()
    const campuses = parseVerifiedCampuses(facts.get("campus")?.value)
    if (!campuses.length) continue
    if (normalizedState && !campuses.some((campus) => campus.state === normalizedState)) continue

    seenCourses.add(course.id)
    const tuitionFact = facts.get("annual_tuition_aud")
    const providerTuition = parsePositiveAud(tuitionFact?.value)
    const registryTuition = parsePositiveAud(course.tuition_fee_aud)

    options.push({
      id: course.id,
      providerName: providerById.get(course.institution_id ?? "")?.name ?? course.institution_id ?? "Provider pending",
      courseCode: course.course_code,
      title: course.title,
      qualification: course.course_type ?? (course.aqf_level ? `AQF ${course.aqf_level}` : null),
      qualificationLevel: normalizeQualification(course.course_type),
      duration: factToText(facts.get("duration")) ?? durationFromYears(course.duration_years),
      tuitionAud: providerTuition ?? registryTuition,
      tuitionYear: providerTuition ? parseTuitionYear(tuitionFact?.value) : null,
      tuitionSource: providerTuition ? "provider" : registryTuition ? "registry" : "unconfirmed",
      englishRequirement: factToText(facts.get("english_requirement")),
      entryRequirements: factToText(facts.get("entry_requirements")),
      intakes: factToText(facts.get("intakes")),
      campuses,
      officialUrl: course.official_course_url,
      officialCheckedAt: course.official_url_checked_at,
    })
    if (options.length >= limit) break
  }

  return { candidateId, kind: "course", state: normalizedState, options }
}

async function getProvidersById(institutionIds: string[]) {
  const ids = [...new Set(institutionIds)]
  if (!ids.length) return new Map<string, ProviderRow>()
  const { data } = await supabaseAdmin.from("colleges_au").select("institution_id, name").in("institution_id", ids)
  return new Map((data as ProviderRow[] | null ?? []).map((provider) => [provider.institution_id, provider]))
}

async function getVerifiedFactsByCourse(courseIds: number[]) {
  const ids = [...new Set(courseIds)]
  const result = new Map<number, Map<ProgramFactKey, ProgramFactRow>>()
  if (!ids.length) return result
  const { data } = await supabaseAdmin
    .from("program_page_facts_au")
    .select("course_id, field_key, value, source_url, reviewed_at, extracted_at")
    .in("course_id", ids)
    .eq("review_status", "verified")
    .order("reviewed_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false })

  for (const fact of (data as ProgramFactRow[] | null) ?? []) {
    const facts = result.get(fact.course_id) ?? new Map<ProgramFactKey, ProgramFactRow>()
    if (!facts.has(fact.field_key)) facts.set(fact.field_key, fact)
    result.set(fact.course_id, facts)
  }
  return result
}

function factToText(fact: ProgramFactRow | undefined): RouteStudyFact | null {
  if (!fact || typeof fact.value !== "string" || !fact.value.trim()) return null
  return { value: fact.value.trim(), sourceUrl: fact.source_url, reviewedAt: fact.reviewed_at }
}

function durationFromYears(value: number | null): RouteStudyFact | null {
  if (!value || value <= 0) return null
  return { value: `${value} ${value === 1 ? "year" : "years"} full-time`, sourceUrl: "", reviewedAt: null }
}
