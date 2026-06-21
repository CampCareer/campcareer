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
  course_url: string | null
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

// Raw row shape returned by the courses_au select below (course_url is derived
// from cricos_url/qualifax_url, so those two are present instead).
type CourseRowAU = Omit<CourseAU, "course_url"> & {
  cricos_url: string | null
  qualifax_url: string | null
}

export async function getCoursesForOccupation(
  broadField: string,
  limit = 20,
): Promise<CourseAU[]> {
  const { data, error } = await supabase
    .from("courses_au")
    .select(
      "id, title, course_type, aqf_level, duration_years, tuition_fee_aud, employment_rate, cricos_url, qualifax_url",
    )
    .eq("broad_field", broadField)
    .order("employment_rate", { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) {
    console.error("[occupations-au] courses failed:", error)
    return []
  }
  return ((data ?? []) as CourseRowAU[]).map((r) => ({
    id: r.id,
    title: r.title,
    course_type: r.course_type,
    aqf_level: r.aqf_level,
    duration_years: r.duration_years,
    tuition_fee_aud: r.tuition_fee_aud,
    employment_rate: r.employment_rate,
    course_url: r.cricos_url ?? r.qualifax_url ?? null,
  }))
}