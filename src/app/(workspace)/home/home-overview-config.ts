import { CITIZENSHIP_OPTIONS as CITIZENSHIP_REGISTRY_OPTIONS } from "@/data/citizenship-countries"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"

export type OverviewOption = { value: string; label: string }

export type OverviewSearchValues = {
  citizenship: string
  country: string
  category: string
}

export type OverviewSearchErrors = Partial<Record<keyof OverviewSearchValues, string>>
export type OverviewOpenMenu = keyof OverviewSearchValues | null
export type SearchParamsLike = Pick<URLSearchParams, "get">

export const OTHER_CITIZENSHIP_VALUE = "OTHER"
export const EXPLORING_CATEGORY: OverviewOption = { value: "not-sure", label: "I’m not sure yet" }
export const DEFAULT_OVERVIEW_COUNTRY = "AU"

export const CITIZENSHIP_OPTIONS: readonly OverviewOption[] = CITIZENSHIP_REGISTRY_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

export const COUNTRY_OPTIONS: readonly OverviewOption[] = LAUNCH_COUNTRIES.map((country) => ({
  value: country.code,
  label: country.name,
}))

export const CATEGORY_OPTIONS: readonly OverviewOption[] = [
  EXPLORING_CATEGORY,
  ...STUDY_CATEGORIES.map((category) => ({ value: category.id, label: category.label })),
]

const legacyCategoryByField = new Map(
  STUDY_CONCEPTS.map((concept) => [concept.slug, concept.category]),
)

export function hasOverviewOption(options: readonly OverviewOption[], value: string | null) {
  return Boolean(value && options.some((option) => option.value === value))
}

export function getOverviewOptionLabel(options: readonly OverviewOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? ""
}

function readLegacyCategory(value: string | null) {
  if (!value) return ""
  if (hasOverviewOption(CATEGORY_OPTIONS, value)) return value
  return legacyCategoryByField.get(value) ?? ""
}

/** Reads the new canonical query and, temporarily, prior origin/field URLs. */
export function readOverviewSearchValues(searchParams: SearchParamsLike): OverviewSearchValues {
  const citizenship = (searchParams.get("citizenship") ?? searchParams.get("origin") ?? "").toUpperCase()
  const country = (searchParams.get("country") ?? "").toUpperCase()
  const category = readLegacyCategory(searchParams.get("category") ?? searchParams.get("field"))

  return {
    citizenship: hasOverviewOption(CITIZENSHIP_OPTIONS, citizenship) ? citizenship : "",
    country: hasOverviewOption(COUNTRY_OPTIONS, country) ? country : "",
    category,
  }
}

export function validateOverviewSearch(values: OverviewSearchValues): OverviewSearchErrors {
  const errors: OverviewSearchErrors = {}
  if (!values.citizenship) errors.citizenship = "Select your passport"
  if (!values.country) errors.country = "Select a destination"
  if (!values.category) errors.category = "Select a career"
  return errors
}

export function getOverviewSearchQuery(searchParams: SearchParamsLike): OverviewSearchValues | null {
  const values = readOverviewSearchValues(searchParams)
  return Object.keys(validateOverviewSearch(values)).length === 0 ? values : null
}

export function toOverviewSearchQuery(values: OverviewSearchValues) {
  const params = new URLSearchParams()
  params.set("citizenship", values.citizenship)
  params.set("country", values.country)
  params.set("category", values.category)
  return params
}

export function isCanonicalOverviewQuery(searchParams: SearchParamsLike) {
  return searchParams.get("citizenship") !== null
    && searchParams.get("country") !== null
    && searchParams.get("category") !== null
}
