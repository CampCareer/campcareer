import "server-only"

import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getUSOccCodes, getUSOccDetail } from "@/lib/us-occupation-detail"
import ukOccupationsRaw from "@/data/uk-occupations.json"
import deOccupationsRaw from "@/data/de-occupations.json"
import nlOccupationsRaw from "@/data/nl-occupations.json"
import { getBelgiumOccupations, getIrelandOccupations } from "@/lib/country-occupation-data"
import { getCountrySource, type SourceRecord } from "@/data/source-registry"

export const MAP_COUNTRIES = ["au", "ca", "us", "ie", "uk", "de", "nl", "be"] as const

export type MapCountry = (typeof MAP_COUNTRIES)[number]

type RawMapOccupation = {
  code: string
  name: string
  localName?: string | null
  medianSalary?: number | null
  currency: "AUD" | "CAD" | "USD" | "GBP" | "EUR"
  shortageRating?: number | null
  shortageScore?: number | null
  employment?: number | null
  field?: string | null
  codeLabel: string
}

export type MapOccupation = RawMapOccupation & {
  country: MapCountry
  countryName: string
  slug: string
  path: string
  dataSource: SourceRecord
}

const COUNTRY_NAME: Record<MapCountry, string> = {
  au: "Australia",
  ca: "Canada",
  us: "United States",
  ie: "Ireland",
  uk: "United Kingdom",
  de: "Germany",
  nl: "Netherlands",
  be: "Belgium",
}

const SOURCE_COUNTRY: Record<MapCountry, SourceRecord["country"]> = {
  au: "AU",
  ca: "CA",
  us: "US",
  ie: "IE",
  uk: "UK",
  de: "DE",
  nl: "NL",
  be: "BE",
}

const CURRENCY_SYMBOL: Record<MapOccupation["currency"], string> = {
  AUD: "A$",
  CAD: "C$",
  USD: "$",
  GBP: "£",
  EUR: "€",
}

export function isMapCountry(value: string): value is MapCountry {
  return (MAP_COUNTRIES as readonly string[]).includes(value)
}

export function slugifyMapTerm(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatMapSalary(value: number | null | undefined, currency: MapOccupation["currency"]): string {
  if (value == null || Number.isNaN(value)) return "Not available"
  return `${CURRENCY_SYMBOL[currency]}${Math.round(value).toLocaleString()}`
}

function withCanonicalSlugs(country: MapCountry, rows: RawMapOccupation[]): MapOccupation[] {
  const used = new Map<string, number>()

  return rows
    .filter((row) => row.code && row.name)
    .map((row) => {
      const base = slugifyMapTerm(row.name) || row.code.toLowerCase()
      const duplicateCount = used.get(base) ?? 0
      used.set(base, duplicateCount + 1)
      const slug = duplicateCount === 0 ? base : `${base}-${row.code.toLowerCase()}`
      return {
        ...row,
        country,
        countryName: COUNTRY_NAME[country],
        slug,
        path: `/maps/${country}/${slug}`,
        dataSource: getCountrySource(SOURCE_COUNTRY[country], "occupation"),
      }
    })
}

async function loadAustralia(): Promise<RawMapOccupation[]> {
  const { data, error } = await supabaseAdmin
    .from("occupations_au")
    .select("anzsco_code, occupation_en, occupation_ko, median_salary_aud, shortage_rating, related_broad_field")
    .order("occupation_en")

  if (error) {
    console.error("[maps] occupations_au failed:", error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    code: row.anzsco_code as string,
    name: row.occupation_en as string,
    localName: row.occupation_ko as string | null,
    medianSalary: row.median_salary_aud as number | null,
    currency: "AUD" as const,
    shortageRating: row.shortage_rating as number | null,
    field: row.related_broad_field as string | null,
    codeLabel: "ANZSCO",
  }))
}

async function loadCanada(): Promise<RawMapOccupation[]> {
  const { data, error } = await supabaseAdmin
    .from("occupations_ca")
    .select("noc_code, occupation_en, occupation_ko, median_salary_cad, shortage_rating, related_broad_field")
    .order("occupation_en")

  if (error) {
    console.error("[maps] occupations_ca failed:", error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    code: row.noc_code as string,
    name: row.occupation_en as string,
    localName: row.occupation_ko as string | null,
    medianSalary: row.median_salary_cad as number | null,
    currency: "CAD" as const,
    shortageRating: row.shortage_rating as number | null,
    field: row.related_broad_field as string | null,
    codeLabel: "NOC",
  }))
}

function loadUnitedStates(): RawMapOccupation[] {
  return getUSOccCodes()
    .map((code) => getUSOccDetail(code))
    .filter(Boolean)
    .map((row) => ({
      code: row!.occ_code,
      name: row!.occ_title,
      medianSalary: row!.median_wage,
      currency: "USD" as const,
      shortageScore: row!.shortage_score,
      employment: row!.tot_emp,
      codeLabel: "SOC",
    }))
}

function loadUnitedKingdom(): RawMapOccupation[] {
  type Row = {
    soc_code: string
    occupation_en: string
    median_salary_gbp: number | null
    employment_thousands: number | null
  }

  return Object.values(ukOccupationsRaw as Record<string, Row>).map((row) => ({
    code: row.soc_code,
    name: row.occupation_en,
    medianSalary: row.median_salary_gbp,
    currency: "GBP" as const,
    employment: row.employment_thousands,
    codeLabel: "SOC",
  }))
}

function loadIreland(): RawMapOccupation[] {
  return getIrelandOccupations().map((row) => ({
    code: row.code,
    name: row.name,
    localName: row.localName,
    medianSalary: row.medianSalary,
    currency: row.currency,
    shortageRating: row.shortageRating,
    employment: row.employment,
    field: row.field,
    codeLabel: row.codeLabel,
  }))
}

function loadGermany(): RawMapOccupation[] {
  type Row = {
    kldb_code: string
    occupation_de: string
    occupation_en: string
    median_salary_eur: number | null
    shortage_rating: number | null
    employment_thousands: number | null
    related_broad_field: string | null
  }

  return Object.values(deOccupationsRaw as Record<string, Row>).map((row) => ({
    code: row.kldb_code,
    name: row.occupation_en,
    localName: row.occupation_de,
    medianSalary: row.median_salary_eur,
    currency: "EUR" as const,
    shortageRating: row.shortage_rating,
    employment: row.employment_thousands,
    field: row.related_broad_field,
    codeLabel: "KldB",
  }))
}

function loadNetherlands(): RawMapOccupation[] {
  type Row = {
    sbc_code: string
    occupation_nl: string
    occupation_en: string
    median_salary_eur: number | null
    shortage_rating: number | null
    employment_thousands: number | null
    related_broad_field: string | null
  }

  return Object.values(nlOccupationsRaw as Record<string, Row>).map((row) => ({
    code: row.sbc_code,
    name: row.occupation_en,
    localName: row.occupation_nl,
    medianSalary: row.median_salary_eur,
    currency: "EUR" as const,
    shortageRating: row.shortage_rating,
    employment: row.employment_thousands,
    field: row.related_broad_field,
    codeLabel: "SBC",
  }))
}

function loadBelgium(): RawMapOccupation[] {
  return getBelgiumOccupations().map((row) => ({
    code: row.code,
    name: row.name,
    localName: row.localName,
    medianSalary: row.medianSalary,
    currency: row.currency,
    shortageRating: row.shortageRating,
    employment: row.employment,
    field: row.field,
    codeLabel: row.codeLabel,
  }))
}

export const getMapOccupations = cache(async (country: MapCountry): Promise<MapOccupation[]> => {
  const raw =
    country === "au" ? await loadAustralia() :
    country === "ca" ? await loadCanada() :
    country === "us" ? loadUnitedStates() :
    country === "ie" ? loadIreland() :
    country === "uk" ? loadUnitedKingdom() :
    country === "de" ? loadGermany() :
    country === "nl" ? loadNetherlands() :
    loadBelgium()

  return withCanonicalSlugs(country, raw)
})

export async function resolveMapOccupation(country: MapCountry, slugOrCode: string): Promise<MapOccupation | null> {
  const occupations = await getMapOccupations(country)
  const normalized = slugifyMapTerm(slugOrCode)
  return occupations.find((occ) => occ.slug === normalized || occ.code.toLowerCase() === slugOrCode.toLowerCase()) ?? null
}

export async function getMapOccupationStaticParams() {
  const countries: MapCountry[] = ["us", "ie", "uk", "de", "nl", "be"]
  const params: Array<{ country: MapCountry; slug: string }> = []

  for (const country of countries) {
    const occupations = await getMapOccupations(country)
    params.push(...occupations.map((occ) => ({ country, slug: occ.slug })))
  }

  return params
}

// Sitemap only includes pages with enough distinct facts to answer a specific
// career query. The route stays available for exploration when a thin row is
// intentionally excluded from indexing.
export function isMapOccupationIndexable(occupation: MapOccupation): boolean {
  const facts = [
    occupation.code,
    occupation.medianSalary,
    occupation.shortageRating ?? occupation.shortageScore,
    occupation.employment,
    occupation.field,
  ].filter((value) => value !== null && value !== undefined && value !== "")

  return occupation.dataSource.reviewStatus === "approved" && facts.length >= 3
}

export async function getIndexableMapOccupations(country: MapCountry): Promise<MapOccupation[]> {
  return (await getMapOccupations(country)).filter(isMapOccupationIndexable)
}
