import "server-only"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { safeInstitutionLogoUrl } from "@/lib/institutions/institution-logo"
import type { InstitutionSearchFilters } from "@/lib/institutions/institution-search"
import type {
  InstitutionExplorerItem,
  InstitutionSearchResult,
} from "@/lib/institutions/institutions.server"
import { getCaPublishedProgramCountsByInstitution } from "@/lib/programs/ca-programs.server"

export const CA_INSTITUTION_PAGE_SIZE = 20

type CaInstitutionExplorerRow = {
  institution_id: string
  country_code: string
  slug: string
  canonical_name: string
  institution_kind: string | null
  ownership_type: string | null
  website_url: string | null
  campus_count: number | string | null
  city_count: number | string | null
  city_names: string[] | null
}

type InstitutionLogoRow = {
  institution_id: string
  logo_url: string | null
}

function safeNumber(value: number | string | null) {
  if (value == null) return 0
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function safeSearchTerm(value: string) {
  return value
    .replace(/[^\p{L}\p{N}\s&.'()-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
}

async function loadInstitutionLogos(ids: string[]) {
  const logos = new Map<string, string | null>()
  if (ids.length === 0) return logos

  const { data, error } = await supabaseAdmin
    .from("institution_logo_v1")
    .select("institution_id,logo_url")
    .in("institution_id", ids)

  if (error) {
    console.error("Unable to load Canadian institution logos", error)
    return logos
  }

  for (const row of (data ?? []) as unknown as InstitutionLogoRow[]) {
    logos.set(row.institution_id, safeInstitutionLogoUrl(row.logo_url))
  }
  return logos
}

function mapInstitution(
  row: CaInstitutionExplorerRow,
  logoUrl: string | null,
  programCount: number,
): InstitutionExplorerItem {
  return {
    id: row.institution_id,
    countryCode: "CA",
    slug: row.slug,
    name: row.canonical_name,
    institutionKind: row.institution_kind,
    ownershipType: row.ownership_type,
    websiteUrl: row.website_url,
    logoUrl,
    programCount,
    campusCount: safeNumber(row.campus_count),
    cityCount: safeNumber(row.city_count),
    cityNames: Array.isArray(row.city_names)
      ? row.city_names.filter((city): city is string => Boolean(city))
      : [],
  }
}

export async function searchCaInstitutions(
  filters: InstitutionSearchFilters,
): Promise<InstitutionSearchResult> {
  let query = supabaseAdmin
    .from("institution_explorer_ca_v1")
    .select([
      "institution_id",
      "country_code",
      "slug",
      "canonical_name",
      "institution_kind",
      "ownership_type",
      "website_url",
      "campus_count",
      "city_count",
      "city_names",
    ].join(","), { count: "exact" })
    .eq("country_code", "CA")

  const search = safeSearchTerm(filters.q)
  if (search) query = query.ilike("canonical_name", `%${search.replace(/\s+/g, "%")}%`)
  if (filters.kind !== "all") query = query.eq("institution_kind", filters.kind)

  const { data, error, count } = await query.order("canonical_name", { ascending: true })
  if (error) throw new Error(`Unable to load Canadian institution explorer: ${error.message}`)

  const allRows = (data ?? []) as unknown as CaInstitutionExplorerRow[]
  const programCounts = await getCaPublishedProgramCountsByInstitution(allRows.map((row) => row.slug))
  const sortedRows = [...allRows].sort((left, right) => {
    const difference = (programCounts.get(right.slug) ?? 0) - (programCounts.get(left.slug) ?? 0)
    return difference || left.canonical_name.localeCompare(right.canonical_name)
  })

  const from = (filters.page - 1) * CA_INSTITUTION_PAGE_SIZE
  const rows = sortedRows.slice(from, from + CA_INSTITUTION_PAGE_SIZE)
  const logos = await loadInstitutionLogos(rows.map((row) => row.institution_id))
  const institutions = rows.map((row) => mapInstitution(
    row,
    logos.get(row.institution_id) ?? null,
    programCounts.get(row.slug) ?? 0,
  ))
  const total = count ?? allRows.length

  return {
    institutions,
    total,
    page: filters.page,
    pageSize: CA_INSTITUTION_PAGE_SIZE,
    pageCount: total === 0 ? 0 : Math.ceil(total / CA_INSTITUTION_PAGE_SIZE),
  }
}
