import { supabase } from "@/lib/supabase"

export type OccupationCategory = "shortage" | "pay"

export interface OccupationAU {
  id: number
  anzsco_code: string | null
  occupation_en: string
  occupation_ko: string | null
  shortage_rating: number | null
  on_csol: boolean
  median_salary_aud: number | null
  related_broad_field: string | null
  related_narrow_field: string | null
  pr_note_ko: string | null
  confidence: string | null
  source_name: string | null
  source_url: string | null
  last_verified: string | null
}

export interface CourseAU {
  id: number
  title: string
  course_type: string | null
  aqf_level: number | null
  duration_years: number | null
  tuition_fee_aud: number | null
  employment_rate: number | null
  /** A current course page on the university's own domain, manually verified. */
  official_course_url: string | null
  official_url_status: "unverified" | "verified" | "review_needed" | "not_found" | "stale"
  official_url_checked_at: string | null
  /** Government registry link retained when a provider page has not yet been verified. */
  cricos_url: string | null
  course_url: string | null
  course_link_kind: "provider" | "registry" | "none"
}

export async function getOccupations(
  category: OccupationCategory,
  limit = 12,
): Promise<OccupationAU[]> {
  let q = supabase.from("occupations_au").select("*")
  if (category === "shortage") {
    q = q
      .order("shortage_rating", { ascending: false, nullsFirst: false })
      .order("median_salary_aud", { ascending: false, nullsFirst: false })
  } else {
    q = q.order("median_salary_aud", { ascending: false, nullsFirst: false })
  }
  const { data, error } = await q.limit(limit)
  if (error) {
    console.error("[occupations-au] list failed:", error)
    return []
  }
  return (data ?? []) as OccupationAU[]
}

// Raw row shape returned by the courses_au select below (presentation fields
// such as course_url and course_link_kind are derived after the query).
type CourseRowAU = Omit<CourseAU, "course_url" | "course_link_kind"> & {
  qualifax_url: string | null
}

function toCourseAU(row: CourseRowAU): CourseAU {
  const hasVerifiedProviderPage = row.official_url_status === "verified" && Boolean(row.official_course_url)
  const fallbackUrl = row.cricos_url ?? row.qualifax_url ?? null

  return {
    ...row,
    course_url: hasVerifiedProviderPage ? row.official_course_url : fallbackUrl,
    course_link_kind: hasVerifiedProviderPage ? "provider" : fallbackUrl ? "registry" : "none",
  }
}

export async function getCoursesForOccupation(
  broadField: string,
  limit = 20,
): Promise<CourseAU[]> {
  const selection = "id, title, course_type, aqf_level, duration_years, tuition_fee_aud, employment_rate, official_course_url, official_url_status, official_url_checked_at, cricos_url, qualifax_url"
  const verifiedResult = await supabase
    .from("courses_au")
    .select(selection)
    .eq("broad_field", broadField)
    .eq("official_url_status", "verified")
    .not("official_course_url", "is", null)
    .order("official_url_checked_at", { ascending: false, nullsFirst: false })
    .order("employment_rate", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (verifiedResult.error) {
    console.error("[occupations-au] verified courses failed:", verifiedResult.error)
    return []
  }

  const verified = (verifiedResult.data ?? []) as CourseRowAU[]
  if (verified.length >= limit) return verified.map(toCourseAU)

  // A government CRICOS record remains useful while a provider page is being
  // checked, but it must never be represented as the university's own page.
  const fallbackResult = await supabase
    .from("courses_au")
    .select(selection)
    .eq("broad_field", broadField)
    .order("employment_rate", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true })
    .limit(limit * 2)

  if (fallbackResult.error) {
    console.error("[occupations-au] fallback courses failed:", fallbackResult.error)
    return verified.map(toCourseAU)
  }

  const seen = new Set(verified.map((course) => course.id))
  const combined = [...verified, ...((fallbackResult.data ?? []) as CourseRowAU[]).filter((course) => !seen.has(course.id))]
  return combined.slice(0, limit).map(toCourseAU)
}
