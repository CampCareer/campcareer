import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { InstitutionMvpCountryCode } from "@/lib/institutions/institution-search"

type InstitutionDetailRow = {
  institution_id: string
  country_code: string
  slug: string
  canonical_name: string
  institution_kind: string | null
  ownership_type: string | null
  website_url: string | null
  status: string
  program_count: number | string | null
  campus_count: number | string | null
  city_count: number | string | null
  city_names: string[] | null
  cricos_provider_code: string | null
  cricos_source_url: string | null
  campus_locations: unknown
  study_areas: unknown
  programme_types: unknown
  programme_preview: unknown
}

export type InstitutionCampusLocation = {
  id: string
  name: string | null
  city: string | null
  citySlug: string | null
  reportedCity: string | null
  region: string | null
  address: string | null
  postalCode: string | null
  officialUrl: string | null
}

export type InstitutionCountBreakdown = {
  name: string
  count: number
}

export type InstitutionProgrammePreview = {
  id: string
  legacyProgramId: number | null
  title: string
  programmeType: string | null
  fieldName: string | null
}

export type InstitutionDetail = {
  id: string
  countryCode: InstitutionMvpCountryCode
  slug: string
  name: string
  institutionKind: string | null
  ownershipType: string | null
  websiteUrl: string | null
  status: string
  programCount: number
  campusCount: number
  cityCount: number
  cityNames: string[]
  cricosProviderCode: string | null
  cricosSourceUrl: string | null
  campuses: InstitutionCampusLocation[]
  studyAreas: InstitutionCountBreakdown[]
  programmeTypes: InstitutionCountBreakdown[]
  programs: InstitutionProgrammePreview[]
}

function safeNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function safePositiveIntegerOrNull(value: unknown) {
  const parsed = safeNumber(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function safeNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null
}

function recordValue(value: unknown, key: string) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)[key]
    : undefined
}

function parseCampuses(value: unknown): InstitutionCampusLocation[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const id = safeNullableString(recordValue(item, "id"))
    if (!id) return []

    return [{
      id,
      name: safeNullableString(recordValue(item, "name")),
      city: safeNullableString(recordValue(item, "city")),
      citySlug: safeNullableString(recordValue(item, "citySlug")),
      reportedCity: safeNullableString(recordValue(item, "reportedCity")),
      region: safeNullableString(recordValue(item, "region")),
      address: safeNullableString(recordValue(item, "address")),
      postalCode: safeNullableString(recordValue(item, "postalCode")),
      officialUrl: safeNullableString(recordValue(item, "officialUrl")),
    }]
  })
}

function parseBreakdown(value: unknown): InstitutionCountBreakdown[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const name = safeNullableString(recordValue(item, "name"))
    if (!name) return []

    return [{
      name,
      count: safeNumber(recordValue(item, "count")),
    }]
  })
}

function parsePrograms(value: unknown): InstitutionProgrammePreview[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const id = safeNullableString(recordValue(item, "id"))
    const title = safeNullableString(recordValue(item, "title"))
    if (!id || !title) return []

    return [{
      id,
      legacyProgramId: safePositiveIntegerOrNull(recordValue(item, "legacyProgramId")),
      title,
      programmeType: safeNullableString(recordValue(item, "programmeType")),
      fieldName: safeNullableString(recordValue(item, "fieldName")),
    }]
  })
}

export const getInstitutionDetail = cache(async (
  countryCode: InstitutionMvpCountryCode,
  slug: string,
): Promise<InstitutionDetail | null> => {
  const { data, error } = await supabaseAdmin
    .from("institution_detail_v1")
    .select(
      [
        "institution_id",
        "country_code",
        "slug",
        "canonical_name",
        "institution_kind",
        "ownership_type",
        "website_url",
        "status",
        "program_count",
        "campus_count",
        "city_count",
        "city_names",
        "cricos_provider_code",
        "cricos_source_url",
        "campus_locations",
        "study_areas",
        "programme_types",
        "programme_preview",
      ].join(","),
    )
    .eq("country_code", countryCode)
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load institution detail: ${error.message}`)
  }

  if (!data) return null

  const row = data as unknown as InstitutionDetailRow

  return {
    id: row.institution_id,
    countryCode,
    slug: row.slug,
    name: row.canonical_name,
    institutionKind: row.institution_kind,
    ownershipType: row.ownership_type,
    websiteUrl: row.website_url,
    status: row.status,
    programCount: safeNumber(row.program_count),
    campusCount: safeNumber(row.campus_count),
    cityCount: safeNumber(row.city_count),
    cityNames: Array.isArray(row.city_names)
      ? row.city_names.filter((city): city is string => typeof city === "string" && Boolean(city))
      : [],
    cricosProviderCode: row.cricos_provider_code,
    cricosSourceUrl: row.cricos_source_url,
    campuses: parseCampuses(row.campus_locations),
    studyAreas: parseBreakdown(row.study_areas),
    programmeTypes: parseBreakdown(row.programme_types),
    programs: parsePrograms(row.programme_preview),
  }
})
