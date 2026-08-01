import type { LocaleOption } from "@/lib/i18n/config"

type LegacySearchParams = Record<string, string | string[] | undefined>

const SAFE_COMPARE_PARAMETERS = [
  "career",
  "major",
  "countries",
  "origin",
  "city",
  "currency",
  "degreeYears",
  "annualTuition",
  "studentHousing",
  "graduateHousing",
] as const

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Retire legacy Compare routes without dropping old links. Only the new v1
 * planner can publish evidence-backed decision results; pass through the
 * inputs it understands and discard old opaque IDs and fixed-score settings.
 */
export function buildLegacyCompareRedirect(
  searchParams: LegacySearchParams,
  _locale: LocaleOption,
) {
  const params = new URLSearchParams()
  for (const key of SAFE_COMPARE_PARAMETERS) {
    const value = first(searchParams[key])
    if (value) params.set(key, value)
  }
  const path = "/compare"
  return params.size ? `${path}?${params.toString()}` : path
}
