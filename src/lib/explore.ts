import "server-only"
import { supabase } from "@/lib/supabase"
import {
  type MajorRow,
  type CountryCode,
  type RiskLevel,
  ALL_COUNTRIES,
} from "@/lib/degree-risk"

// The degree-risk verified majors (10) — the same set scored across the 5
// countries (≈50 rows in `majors`). Used for static params + the explore hub.
// Mirrors the keys in degreeRisk.options (minus the "other" sentinel).
export const EXPLORE_MAJORS = [
  "computer-science",
  "data-analytics",
  "software-engineering",
  "nursing",
  "civil-engineering",
  "business-management",
  "accounting",
  "ux-design",
  "psychology",
  "music",
] as const

export const EXPLORE_COUNTRIES = ALL_COUNTRIES

const RISK_ORDER: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 }

// Default "best fit" order: lower risk first, then higher employment, then
// shorter payback. Used as the initial (server) sort for every ranking.
export function fitSort(rows: MajorRow[]): MajorRow[] {
  return [...rows].sort((a, b) => {
    if (RISK_ORDER[a.overall_risk] !== RISK_ORDER[b.overall_risk]) {
      return RISK_ORDER[a.overall_risk] - RISK_ORDER[b.overall_risk]
    }
    if (a.employment_rate !== b.employment_rate) return b.employment_rate - a.employment_rate
    return a.payback_years - b.payback_years
  })
}

const CANONICAL_ORDER = (c: CountryCode) => ALL_COUNTRIES.indexOf(c)

// One major across the 5 countries — for "best country to study {major}".
export async function fetchMajorAcrossCountries(slug: string): Promise<MajorRow[]> {
  const { data, error } = await supabase.from("majors").select("*").eq("slug", slug)
  if (error) {
    console.error(`[explore] majors by slug "${slug}" failed:`, error.message)
    return []
  }
  const rows = (data ?? []) as unknown as MajorRow[]
  rows.sort((a, b) => CANONICAL_ORDER(a.country) - CANONICAL_ORDER(b.country))
  return rows
}

// All majors scored in one country — for "best degree to study in {country}".
export async function fetchCountryMajors(country: CountryCode): Promise<MajorRow[]> {
  const { data, error } = await supabase.from("majors").select("*").eq("country", country)
  if (error) {
    console.error(`[explore] majors by country "${country}" failed:`, error.message)
    return []
  }
  return (data ?? []) as unknown as MajorRow[]
}
