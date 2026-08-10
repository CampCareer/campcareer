import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { CITIZENSHIP_OPTIONS as CITIZENSHIP_REGISTRY_OPTIONS } from "@/data/citizenship-countries"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import { FIELDS } from "@/lib/fields"

export type SelectOption = {
  value: string
  label: string
}

/** Existing result dimensions used by country, field and status fixtures. */
export type FormValues = {
  country: string
  field: string
  status: string
}

/** Canonical Home pathway input. `country` remains the destination for backwards compatibility. */
export type PathwaySearchValues = FormValues & {
  origin: string
}

export type FormErrors = Partial<Record<keyof PathwaySearchValues, string>>
export type OpenMenu = Exclude<keyof PathwaySearchValues, "status"> | null
export type HomeScreenMode = "search" | "results"
export type SearchParamsLike = Pick<URLSearchParams, "get">

export const NOT_SURE_FIELD: SelectOption = { value: "not-sure", label: "I’m still exploring" }
export const DEFAULT_COUNTRY = "AU"
export const NO_FIELD_STATUS = "no-field"
/** Transitional internal state for the pre-Overview Home result experience. */
export const DEFAULT_RESULT_STATUS = "choosing-school"

export const COUNTRY_OPTIONS: readonly SelectOption[] = LAUNCH_COUNTRIES.map((country) => ({
  value: country.code,
  label: country.name,
}))

/** Public Citizenship choices. `origin` remains the legacy URL/storage key for now. */
export const CITIZENSHIP_OPTIONS: readonly SelectOption[] = CITIZENSHIP_REGISTRY_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

/** @deprecated Use `CITIZENSHIP_OPTIONS` in new Home UI. */
export const ORIGIN_OPTIONS = CITIZENSHIP_OPTIONS

export const FIELD_OPTIONS: readonly SelectOption[] = [
  NOT_SURE_FIELD,
  ...STUDY_CATEGORIES.map((category) => ({ value: category.id, label: category.label })),
]

/**
 * Previous Home URLs and saved pathways used individual field slugs. They stay
 * readable while the public selector moves to the shared occupation taxonomy.
 */
const LEGACY_FIELD_OPTIONS: readonly SelectOption[] = FIELDS.map((field) => ({
  value: field.slug,
  label: field.label,
}))

export function isHomeField(value: string | null) {
  return hasOption(FIELD_OPTIONS, value) || hasOption(LEGACY_FIELD_OPTIONS, value)
}

export function getHomeFieldLabel(value: string) {
  return getOptionLabel(FIELD_OPTIONS, value) || getOptionLabel(LEGACY_FIELD_OPTIONS, value)
}

/** Displays a legacy choice only when reopening an existing legacy pathway. */
export function getHomeFieldOptions(value: string): readonly SelectOption[] {
  const legacyOption = LEGACY_FIELD_OPTIONS.find((option) => option.value === value)
  return legacyOption ? [legacyOption, ...FIELD_OPTIONS] : FIELD_OPTIONS
}

export const STATUS_OPTIONS: readonly SelectOption[] = [
  { value: NO_FIELD_STATUS, label: "I’m exploring my options" },
  { value: "choosing-school", label: "I’m choosing a program" },
  { value: "preparing-application", label: "I’m preparing my application" },
  { value: "already-qualified", label: "I’m already qualified" },
  { value: "looking-for-job", label: "I’m looking for a job or sponsor" },
  { value: "preparing-visa", label: "I’m preparing my visa" },
]

function getDefaultStatus(field: string) {
  return field === NOT_SURE_FIELD.value ? NO_FIELD_STATUS : DEFAULT_RESULT_STATUS
}

function getHomeStatus(field: string, requestedStatus: string | null) {
  return hasOption(STATUS_OPTIONS, requestedStatus) ? requestedStatus! : getDefaultStatus(field)
}

export function hasOption(options: readonly SelectOption[], value: string | null) {
  return Boolean(value && options.some((option) => option.value === value))
}

export function getOptionLabel(options: readonly SelectOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? ""
}

function readCoreValues(searchParams: SearchParamsLike): FormValues {
  const country = searchParams.get("country")?.toUpperCase() ?? DEFAULT_COUNTRY
  const field = searchParams.get("field") ?? ""
  const status = getHomeStatus(field, searchParams.get("status"))

  return {
    country: hasOption(COUNTRY_OPTIONS, country) ? country : DEFAULT_COUNTRY,
    field: isHomeField(field) ? field : "",
    status,
  }
}

export function readFormValues(searchParams: SearchParamsLike): PathwaySearchValues {
  const origin = searchParams.get("origin")?.toUpperCase() ?? ""
  return {
    origin: hasOption(ORIGIN_OPTIONS, origin) ? origin : "",
    ...readCoreValues(searchParams),
  }
}

export function validateForm(values: PathwaySearchValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.origin) errors.origin = "Select your citizenship"
  if (!values.country) errors.country = "Select a country"
  if (!values.field) {
    errors.field = "Select an occupation category"
  }

  return errors
}

/** A normalized, result-safe query retained for existing result fixtures and legacy URLs. */
export function getHomeSearchQuery(searchParams: SearchParamsLike): FormValues | null {
  const country = searchParams.get("country")?.toUpperCase() ?? null
  const field = searchParams.get("field")
  const requestedStatus = searchParams.get("status")

  if (!hasOption(COUNTRY_OPTIONS, country) || !isHomeField(field)) {
    return null
  }

  const status = getHomeStatus(field!, requestedStatus)

  if (status === NO_FIELD_STATUS && field !== NOT_SURE_FIELD.value) return null
  if (status !== NO_FIELD_STATUS && (!field || field === NOT_SURE_FIELD.value)) return null

  return { country: country!, field: field!, status }
}

/** Adds the optional starting country to a validated legacy result query. */
export function getPathwaySearchQuery(searchParams: SearchParamsLike): PathwaySearchValues | null {
  const core = getHomeSearchQuery(searchParams)
  if (!core) return null

  const origin = searchParams.get("origin")?.toUpperCase() ?? ""
  return {
    origin: hasOption(ORIGIN_OPTIONS, origin) ? origin : "",
    ...core,
  }
}

export function getHomeScreenMode(searchParams: SearchParamsLike): HomeScreenMode {
  return getHomeSearchQuery(searchParams) ? "results" : "search"
}

function getBrowserOrigin() {
  if (typeof window === "undefined") return ""
  const origin = new URLSearchParams(window.location.search).get("origin")?.toUpperCase() ?? ""
  return hasOption(ORIGIN_OPTIONS, origin) ? origin : ""
}

/**
 * Serializes the canonical pathway query. Older client-side result helpers pass
 * only the legacy dimensions, so the current URL origin is retained when safe.
 */
export function toHomeSearchQuery(values: FormValues | PathwaySearchValues, fallbackOrigin?: string) {
  const explicitOrigin = "origin" in values ? values.origin : ""
  const origin = explicitOrigin || fallbackOrigin || getBrowserOrigin()
  const params = new URLSearchParams()

  if (hasOption(ORIGIN_OPTIONS, origin)) params.set("origin", origin)
  params.set("country", values.country)
  const field = values.status === NO_FIELD_STATUS ? NOT_SURE_FIELD.value : values.field
  params.set("field", field)
  if (values.status !== getDefaultStatus(field)) params.set("status", values.status)
  return params
}
