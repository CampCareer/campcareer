export const PROGRAM_COMPARE_COUNTRY = "AU" as const
export const PROGRAM_COMPARE_FIELD = "nursing" as const
export const CITY_COMPARE_COUNTRY = "AU" as const
export const CAREER_COMPARE_COUNTRY = "AU" as const
export const CAREER_COMPARE_PROFILE = "starting-from-scratch" as const
export const COUNTRY_COMPARE_GOAL = "registered-nurse" as const
export const COUNTRY_COMPARE_PROFILE = "starting-from-scratch" as const

export type CanonicalCompareMode = "programs" | "countries" | "cities" | "careers"

export function compareModePath(mode: CanonicalCompareMode) {
  return `/compare/${mode}`
}

export function buildProgramCompareCanonicalHref(items: readonly string[] = []) {
  const base = `${compareModePath("programs")}?country=${PROGRAM_COMPARE_COUNTRY}&field=${PROGRAM_COMPARE_FIELD}`
  return items.length ? `${base}&items=${items.join(",")}` : base
}

export function buildCityCompareCanonicalHref({
  country = CITY_COMPARE_COUNTRY,
  left = "",
  right = "",
}: {
  country?: string
  left?: string
  right?: string
} = {}) {
  const params = new URLSearchParams({ country: country.toUpperCase() })
  if (left) params.set("left", left.toLowerCase())
  if (right) params.set("right", right.toLowerCase())
  return `${compareModePath("cities")}?${params.toString()}`
}

export function buildCareerCompareCanonicalHref({
  country = CAREER_COMPARE_COUNTRY,
  profile = CAREER_COMPARE_PROFILE,
  city = null,
  careers = [],
}: {
  country?: string
  profile?: string
  city?: string | null
  careers?: readonly string[]
} = {}) {
  const cityPart = city ? `&city=${city}` : ""
  const careerPart = careers.length ? `&careers=${careers.join(",")}` : ""
  return `${compareModePath("careers")}?country=${country}&profile=${profile}${cityPart}${careerPart}`
}

export function buildCountryCompareCanonicalHref({
  goal = COUNTRY_COMPARE_GOAL,
  profile = COUNTRY_COMPARE_PROFILE,
  locations = "",
}: {
  goal?: string
  profile?: string
  locations?: string
} = {}) {
  const locationPart = locations ? `&locations=${locations}` : ""
  return `${compareModePath("countries")}?goal=${goal}&profile=${profile}${locationPart}`
}

export function canonicalCompareModeFromLegacyType(rawType: string | null): CanonicalCompareMode | null {
  if (rawType === null || rawType === "program") return "programs"
  if (rawType === "country") return "countries"
  if (rawType === "city") return "cities"
  if (rawType === "career") return "careers"
  return null
}
