import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import type { CaProgramPgwpState, CaProgramPublicationTier } from "@/lib/programs/ca-publish-policy"

export const CA_PUBLISHED_CITY_SLUGS = [
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "calgary",
  "waterloo",
  "edmonton",
] as const

export type CaPublishedCitySlug = (typeof CA_PUBLISHED_CITY_SLUGS)[number]

const CITY_NAMES: Record<CaPublishedCitySlug, string> = {
  toronto: "Toronto",
  vancouver: "Vancouver",
  montreal: "Montreal",
  ottawa: "Ottawa",
  calgary: "Calgary",
  waterloo: "Waterloo",
  edmonton: "Edmonton",
}

type CaCityPublicationRow = {
  program_catalog_id: number
  title: string | null
  institution_name: string | null
  institution_slug: string | null
  city: string | null
  province: string | null
  credential_type: string | null
  career_ids: string[] | null
  pgwp_state: CaProgramPgwpState
  publication_tier: CaProgramPublicationTier
  indexable_detail: boolean
}

export type CaPublishedCityProgram = {
  id: number
  title: string
  institutionName: string
  institutionSlug: string | null
  credentialType: string | null
  pgwpState: CaProgramPgwpState
  publicationTier: CaProgramPublicationTier
  indexableDetail: boolean
}

export type CaPublishedCityProgramSummary = {
  slug: CaPublishedCitySlug
  name: string
  totalPrograms: number
  indexablePrograms: number
  pgwpEligiblePrograms: number
  pgwpUnknownPrograms: number
  institutionCount: number
  careerCount: number
  careerIds: string[]
  programs: CaPublishedCityProgram[]
}

function isPublishedCitySlug(value: string): value is CaPublishedCitySlug {
  return (CA_PUBLISHED_CITY_SLUGS as readonly string[]).includes(value)
}

function mapProgram(row: CaCityPublicationRow): CaPublishedCityProgram | null {
  const title = row.title?.trim()
  const institutionName = row.institution_name?.trim()
  if (!title || !institutionName) return null
  return {
    id: row.program_catalog_id,
    title,
    institutionName,
    institutionSlug: row.institution_slug,
    credentialType: row.credential_type,
    pgwpState: row.pgwp_state,
    publicationTier: row.publication_tier,
    indexableDetail: row.indexable_detail,
  }
}

async function loadCaPublishedCityProgramSummary(
  rawSlug: string,
): Promise<CaPublishedCityProgramSummary | null> {
  const slug = rawSlug.trim().toLowerCase()
  if (!isPublishedCitySlug(slug)) return null
  const name = CITY_NAMES[slug]

  const { data, error } = await supabaseAdmin
    .from("ca_program_publication_v1")
    .select([
      "program_catalog_id",
      "title",
      "institution_name",
      "institution_slug",
      "city",
      "province",
      "credential_type",
      "career_ids",
      "pgwp_state",
      "publication_tier",
      "indexable_detail",
    ].join(","))
    .eq("publicly_listed", true)
    .ilike("city", name)
    .order("publication_tier", { ascending: true })
    .order("institution_name", { ascending: true })
    .order("title", { ascending: true })

  if (error) throw new Error(`Unable to load Canadian city program publication: ${error.message}`)

  const rows = (data ?? []) as unknown as CaCityPublicationRow[]
  const careerIds = Array.from(new Set(rows.flatMap((row) => row.career_ids ?? []))).sort()
  const institutions = new Set(rows.map((row) => row.institution_slug).filter((value): value is string => Boolean(value)))
  const programs = rows.flatMap((row) => {
    const program = mapProgram(row)
    return program ? [program] : []
  })

  return {
    slug,
    name,
    totalPrograms: rows.length,
    indexablePrograms: rows.filter((row) => row.indexable_detail).length,
    pgwpEligiblePrograms: rows.filter((row) => row.pgwp_state === "eligible").length,
    pgwpUnknownPrograms: rows.filter((row) => row.pgwp_state === "unknown").length,
    institutionCount: institutions.size,
    careerCount: careerIds.length,
    careerIds,
    programs: programs.slice(0, 6),
  }
}

export const getCaPublishedCityProgramSummary = cache(loadCaPublishedCityProgramSummary)

export async function getCaPublishedCityProgramSummaries(): Promise<CaPublishedCityProgramSummary[]> {
  const summaries = await Promise.all(CA_PUBLISHED_CITY_SLUGS.map((slug) => getCaPublishedCityProgramSummary(slug)))
  return summaries.filter((summary): summary is CaPublishedCityProgramSummary => Boolean(summary))
}

export type CaPublishedCityPairSummary = {
  left: CaPublishedCityProgramSummary
  right: CaPublishedCityProgramSummary
  sharedCareerIds: string[]
  sharedCareerCount: number
}

export async function getCaPublishedCityPairSummary(
  leftSlug: string,
  rightSlug: string,
): Promise<CaPublishedCityPairSummary | null> {
  const [left, right] = await Promise.all([
    getCaPublishedCityProgramSummary(leftSlug),
    getCaPublishedCityProgramSummary(rightSlug),
  ])
  if (!left || !right || left.slug === right.slug) return null

  const rightCareers = new Set(right.careerIds)
  const sharedCareerIds = left.careerIds.filter((careerId) => rightCareers.has(careerId))
  return {
    left,
    right,
    sharedCareerIds,
    sharedCareerCount: sharedCareerIds.length,
  }
}
