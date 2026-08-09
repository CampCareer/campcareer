import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { safeInstitutionLogoUrl } from "@/lib/institutions/institution-logo"
import type {
  InstitutionCampusLocation,
  InstitutionDetail,
} from "@/lib/institutions/institution-detail.server"

type SpainDetailRow = {
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
  campus_locations: unknown
}

type SpainIdentityRow = {
  official_name: string | null
  official_name_source_url: string | null
  registry_reference_url: string | null
}

type LogoRow = { logo_url: string | null }

export type SpainInstitutionIdentity = {
  officialName: string
  officialNameSourceUrl: string
  registryReferenceUrl: string
}

export type SpainInstitutionDetailResult = {
  institution: InstitutionDetail
  identity: SpainInstitutionIdentity
}

function safeNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function safeString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function recordValue(value: unknown, key: string) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)[key]
    : undefined
}

function parseCampuses(value: unknown): InstitutionCampusLocation[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const id = safeString(recordValue(item, "id"))
    if (!id) return []

    return [{
      id,
      name: safeString(recordValue(item, "name")),
      city: safeString(recordValue(item, "city")),
      citySlug: safeString(recordValue(item, "citySlug")),
      reportedCity: safeString(recordValue(item, "reportedCity")),
      region: safeString(recordValue(item, "region")),
      address: safeString(recordValue(item, "address")),
      postalCode: safeString(recordValue(item, "postalCode")),
      officialUrl: safeString(recordValue(item, "officialUrl")),
    }]
  })
}

export const getSpainInstitutionDetail = cache(async (
  slug: string,
): Promise<SpainInstitutionDetailResult | null> => {
  const { data, error } = await supabaseAdmin
    .from("institution_detail_es_v1")
    .select([
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
      "campus_locations",
    ].join(","))
    .eq("country_code", "ES")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw new Error(`Unable to load Spain institution detail: ${error.message}`)
  if (!data) return null

  const row = data as unknown as SpainDetailRow
  const [identityResult, logoResult] = await Promise.all([
    supabaseAdmin
      .from("institution_identity_es_v1")
      .select("official_name,official_name_source_url,registry_reference_url")
      .eq("institution_id", row.institution_id)
      .maybeSingle(),
    supabaseAdmin
      .from("institution_logo_v1")
      .select("logo_url")
      .eq("institution_id", row.institution_id)
      .maybeSingle(),
  ])

  if (identityResult.error) {
    throw new Error(`Unable to load Spain institution identity: ${identityResult.error.message}`)
  }
  if (logoResult.error) console.error("Unable to load Spain institution logo", logoResult.error)

  const identityRow = identityResult.data as unknown as SpainIdentityRow | null
  const officialName = safeString(identityRow?.official_name)
  const officialNameSourceUrl = safeString(identityRow?.official_name_source_url)
  const registryReferenceUrl = safeString(identityRow?.registry_reference_url)

  if (!officialName || !officialNameSourceUrl || !registryReferenceUrl) {
    throw new Error(`ES institution ${row.institution_id} is missing source-backed official identity`)
  }

  const logoRow = logoResult.data as unknown as LogoRow | null

  return {
    identity: {
      officialName,
      officialNameSourceUrl,
      registryReferenceUrl,
    },
    institution: {
      id: row.institution_id,
      countryCode: "ES",
      slug: row.slug,
      name: row.canonical_name,
      institutionKind: row.institution_kind,
      ownershipType: row.ownership_type,
      websiteUrl: row.website_url,
      logoUrl: safeInstitutionLogoUrl(logoRow?.logo_url),
      status: row.status,
      programCount: safeNumber(row.program_count),
      campusCount: safeNumber(row.campus_count),
      cityCount: safeNumber(row.city_count),
      cityNames: Array.isArray(row.city_names)
        ? row.city_names.filter((city): city is string => typeof city === "string" && Boolean(city))
        : [],
      cricosProviderCode: null,
      cricosSourceUrl: null,
      ukprn: null,
      ukprnSourceUrl: null,
      dliNumber: null,
      dliSourceUrl: null,
      brinCode: null,
      brinSourceUrl: null,
      providerNumber: null,
      providerSourceUrl: null,
      uen: null,
      uenSourceUrl: null,
      officialDomain: null,
      officialDomainSourceUrl: null,
      uai: null,
      uaiSourceUrl: null,
      campuses: parseCampuses(row.campus_locations),
      studyAreas: [],
      programmeTypes: [],
      programs: [],
    },
  }
})
