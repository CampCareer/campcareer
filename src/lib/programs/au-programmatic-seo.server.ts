import "server-only"

import { cache } from "react"
import { getAuCityProfile } from "@/lib/cities/au-city-profile.server"
import { searchAuPrograms } from "@/lib/programs/au-programs.server"
import { parseProgramSearchParams } from "@/lib/programs/program-search"
import { supabaseAdmin } from "@/lib/supabase-admin"
import {
  AU_PROGRAMMATIC_MIN_INSTITUTIONS,
  AU_PROGRAMMATIC_MIN_PROGRAMS,
  getAuProgrammaticStudyPage,
} from "@/lib/programs/au-programmatic-seo"

type ProgramStatRow = {
  institution_id: string | null
  course_type: string | null
  tuition_fee_aud: number | string | null
  duration_years: number | string | null
  official_url_status: string | null
  location_source_last_modified: string | null
}

function numberValue(value: number | string | null) {
  if (value == null) return null
  const parsed = typeof value === "number" ? value : Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function median(values: number[]) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

function latestDate(values: Array<string | null>) {
  return values.filter((value): value is string => Boolean(value)).sort().at(-1) ?? null
}

async function loadAuProgrammaticStudyPage(citySlug: string, fieldSlug: string) {
  const route = getAuProgrammaticStudyPage(citySlug, fieldSlug)
  if (!route) return null

  const cityProfile = await getAuCityProfile(route.city.slug)
  if (!cityProfile) return null

  const { data, error, count } = await supabaseAdmin
    .from("courses_au")
    .select(
      "institution_id, course_type, tuition_fee_aud, duration_years, official_url_status, location_source_last_modified",
      { count: "exact" },
    )
    .eq("cricos_status", "active")
    .not("title", "is", null)
    .eq("broad_field", route.field.broadField)
    .contains("verified_city_slugs", [route.city.slug])
    .range(0, 999)

  if (error) {
    throw new Error(`Unable to load Australia programmatic SEO stats: ${error.message}`)
  }

  const rows = (data ?? []) as ProgramStatRow[]
  const programCount = count ?? rows.length
  const institutionCounts = new Map<string, number>()
  const courseTypeCounts = new Map<string, number>()

  for (const row of rows) {
    if (row.institution_id) {
      institutionCounts.set(row.institution_id, (institutionCounts.get(row.institution_id) ?? 0) + 1)
    }
    if (row.course_type) {
      courseTypeCounts.set(row.course_type, (courseTypeCounts.get(row.course_type) ?? 0) + 1)
    }
  }

  const cityInstitutionById = new Map(
    cityProfile.institutions.map((institution) => [institution.id, institution]),
  )
  const providers = [...institutionCounts.entries()]
    .map(([id, programs]) => ({
      id,
      name: cityInstitutionById.get(id)?.name ?? id,
      programs,
    }))
    .sort((a, b) => b.programs - a.programs || a.name.localeCompare(b.name))

  const courseTypes = [...courseTypeCounts.entries()]
    .map(([label, programs]) => ({ label, programs }))
    .sort((a, b) => b.programs - a.programs || a.label.localeCompare(b.label))

  const tuitionValues = rows
    .map((row) => numberValue(row.tuition_fee_aud))
    .filter((value): value is number => value != null && value > 0)
  const durationValues = rows
    .map((row) => numberValue(row.duration_years))
    .filter((value): value is number => value != null && value > 0)

  const filters = parseProgramSearchParams({
    city: route.city.slug,
    field: route.field.broadField,
  })
  const featured = await searchAuPrograms(filters)

  const institutionCount = institutionCounts.size
  const indexable =
    programCount >= AU_PROGRAMMATIC_MIN_PROGRAMS &&
    institutionCount >= AU_PROGRAMMATIC_MIN_INSTITUTIONS &&
    cityProfile.sources.length >= 3

  return {
    route,
    cityProfile,
    indexable,
    programCount,
    institutionCount,
    verifiedOfficialCount: rows.filter((row) => row.official_url_status === "verified").length,
    medianTuitionAud: median(tuitionValues),
    minTuitionAud: tuitionValues.length ? Math.min(...tuitionValues) : null,
    maxTuitionAud: tuitionValues.length ? Math.max(...tuitionValues) : null,
    medianDurationYears: median(durationValues),
    providers: providers.slice(0, 8),
    courseTypes: courseTypes.slice(0, 6),
    featuredPrograms: featured.programs.slice(0, 8),
    latestProgramLocationSource: latestDate(rows.map((row) => row.location_source_last_modified)),
  }
}

export const getAuProgrammaticStudyPageData = cache(loadAuProgrammaticStudyPage)
