import "server-only"
import { supabase } from "@/lib/supabase"
import { cache } from "react"

export type LanguageSchool = {
  id: number
  slug: string
  name_en: string
  name_ko: string | null
  city: string
  region: string | null
  lat: number | null
  lng: number | null
  website_url: string | null
  accreditation: string[] | null
  established_year: number | null
  google_rating: number | null
  student_capacity: number | null
  average_nationalities: number | null
  min_age: number
  accommodation_types: string[] | null
  homestay_price_week: number | null
  residence_price_week: number | null
  price_range_week: string | null
  description_ko: string | null
  description_en: string | null
  logo_url: string | null
}

export type LanguageCourse = {
  id: number
  school_id: number
  course_type: string
  name_en: string
  name_ko: string | null
  lessons_per_week: number | null
  max_class_size: number | null
  duration_min: number | null
  duration_max: number | null
  price_per_week: number | null
  registration_fee: number | null
  description_ko: string | null
  description_en: string | null
}

export type SchoolWithCourses = LanguageSchool & { courses: LanguageCourse[] }

const SCHOOL_SELECT = [
  "id", "slug", "name_en", "name_ko", "city", "region",
  "lat", "lng", "website_url", "accreditation", "established_year",
  "google_rating", "student_capacity", "average_nationalities",
  "min_age", "accommodation_types", "homestay_price_week",
  "residence_price_week", "price_range_week", "description_ko",
  "description_en", "logo_url",
].join(",")

export const getAllSchools = cache(async (): Promise<LanguageSchool[]> => {
  const { data } = await supabase
    .from("language_schools_ie")
    .select(SCHOOL_SELECT)
    .order("city")
    .order("name_en")
  return (data ?? []) as unknown as LanguageSchool[]
})

export const getCities = cache(async (): Promise<string[]> => {
  const { data } = await supabase
    .from("language_schools_ie")
    .select("city")
    .order("city")
  const cities = new Set((data ?? []).map((r) => (r as { city: string }).city))
  return Array.from(cities)
})

export const getSchoolsByCity = cache(async (city: string): Promise<LanguageSchool[]> => {
  const { data } = await supabase
    .from("language_schools_ie")
    .select(SCHOOL_SELECT)
    .eq("city", city)
    .order("name_en")
  return (data ?? []) as unknown as LanguageSchool[]
})

export const getSchoolBySlug = cache(async (slug: string): Promise<SchoolWithCourses | null> => {
  const { data: school } = await supabase
    .from("language_schools_ie")
    .select(SCHOOL_SELECT)
    .eq("slug", slug)
    .maybeSingle()
  if (!school) return null

  const { data: courses } = await supabase
    .from("language_courses_ie")
    .select("*")
    .eq("school_id", (school as unknown as LanguageSchool).id)
    .order("price_per_week")

  return { ...(school as unknown as LanguageSchool), courses: (courses ?? []) as unknown as LanguageCourse[] }
})

export const getAllSlugs = cache(async (): Promise<string[]> => {
  const { data } = await supabase.from("language_schools_ie").select("slug")
  return ((data ?? []).map((r) => (r as { slug: string }).slug)).filter(Boolean)
})
