import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
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
export type OpenMenu = keyof PathwaySearchValues | null
export type HomeScreenMode = "search" | "results"
export type SearchParamsLike = Pick<URLSearchParams, "get">

export const NOT_SURE_FIELD: SelectOption = { value: "not-sure", label: "Not sure yet" }
export const DEFAULT_COUNTRY = "AU"
export const NO_FIELD_STATUS = "no-field"

export const COUNTRY_OPTIONS: readonly SelectOption[] = LAUNCH_COUNTRIES.map((country) => ({
  value: country.code,
  label: country.name,
}))

export const ORIGIN_OPTIONS = COUNTRY_OPTIONS

export const FIELD_OPTIONS: readonly SelectOption[] = [
  NOT_SURE_FIELD,
  ...FIELDS.map((field) => ({ value: field.slug, label: field.label })),
]

export const STATUS_OPTIONS: readonly SelectOption[] = [
  { value: NO_FIELD_STATUS, label: "I’m exploring my options" },
  { value: "choosing-school", label: "I’m choosing a program" },
  { value: "preparing-application", label: "I’m preparing my application" },
  { value: "already-qualified", label: "I’m already qualified" },
  { value: "looking-for-job", label: "I’m looking for a job or sponsor" },
  { value: "preparing-visa", label: "I’m preparing my visa" },
]

export function hasOption(options: readonly SelectOption[], value: string | null) {
  return Boolean(value && options.some((option) => option.value === value))
}

export function getOptionLabel(options: readonly SelectOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? ""
}

function readCoreValues(searchParams: SearchParamsLike): FormValues {
  const country = searchParams.get("country")?.toUpperCase() ?? DEFAULT_COUNTRY
  const field = searchParams.get("field") ?? ""
  const status = searchParams.get("status") ?? ""

  return {
    country: hasOption(COUNTRY_OPTIONS, country) ? country : DEFAULT_COUNTRY,
    field: hasOption(FIELD_OPTIONS, field) ? field : "",
    status: hasOption(STATUS_OPTIONS, status) ? status : "",
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

  if (!values.origin) errors.origin = "Select your starting country"
  if (!values.country) errors.country = "Select a destination"
  if (!values.status) errors.status = "Select your current situation"
  if (values.status && values.status !== NO_FIELD_STATUS && (!values.field || values.field === NOT_SURE_FIELD.value)) {
    errors.field = "Select a target field"
  }

  return errors
}

/** A normalized, result-safe query retained for existing result fixtures and legacy URLs. */
export function getHomeSearchQuery(searchParams: SearchParamsLike): FormValues | null {
  const country = searchParams.get("country")?.toUpperCase() ?? null
  const field = searchParams.get("field")
  const status = searchParams.get("status")

  if (!hasOption(COUNTRY_OPTIONS, country) || !hasOption(STATUS_OPTIONS, status) || !hasOption(FIELD_OPTIONS, field)) {
    return null
  }

  if (status === NO_FIELD_STATUS && field !== NOT_SURE_FIELD.value) return null
  if (status !== NO_FIELD_STATUS && (!field || field === NOT_SURE_FIELD.value)) return null

  return { country: country!, field: field!, status: status! }
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
  params.set("field", values.status === NO_FIELD_STATUS ? NOT_SURE_FIELD.value : values.field)
  params.set("status", values.status)
  return params
}
