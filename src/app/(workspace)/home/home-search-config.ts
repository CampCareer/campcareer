import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { FIELDS } from "@/lib/fields"

export type SelectOption = {
  value: string
  label: string
}

export type FormValues = {
  country: string
  field: string
  status: string
}

export type FormErrors = Partial<Record<keyof FormValues, string>>
export type OpenMenu = keyof FormValues | null
export type HomeScreenMode = "search" | "results"
export type SearchParamsLike = Pick<URLSearchParams, "get">

export const NOT_SURE_FIELD: SelectOption = { value: "not-sure", label: "Not sure yet" }
export const DEFAULT_COUNTRY = "AU"
export const NO_FIELD_STATUS = "no-field"

export const COUNTRY_OPTIONS: readonly SelectOption[] = LAUNCH_COUNTRIES.map((country) => ({
  value: country.code,
  label: country.name,
}))

export const FIELD_OPTIONS: readonly SelectOption[] = [
  NOT_SURE_FIELD,
  ...FIELDS.map((field) => ({ value: field.slug, label: field.label })),
]

export const STATUS_OPTIONS: readonly SelectOption[] = [
  { value: NO_FIELD_STATUS, label: "I haven’t chosen a field" },
  { value: "choosing-school", label: "I’m choosing a school" },
  { value: "preparing-application", label: "I’m preparing my application" },
  { value: "preparing-visa", label: "I’m preparing my visa" },
]

export function hasOption(options: readonly SelectOption[], value: string | null) {
  return Boolean(value && options.some((option) => option.value === value))
}

export function getOptionLabel(options: readonly SelectOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? ""
}

export function readFormValues(searchParams: SearchParamsLike): FormValues {
  const country = searchParams.get("country")?.toUpperCase() ?? DEFAULT_COUNTRY
  const field = searchParams.get("field") ?? ""
  const status = searchParams.get("status") ?? ""

  return {
    country: hasOption(COUNTRY_OPTIONS, country) ? country : DEFAULT_COUNTRY,
    field: hasOption(FIELD_OPTIONS, field) ? field : "",
    status: hasOption(STATUS_OPTIONS, status) ? status : "",
  }
}

export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.country) errors.country = "Select a country"
  if (!values.status) errors.status = "Select your current status"
  if (values.status && values.status !== NO_FIELD_STATUS && (!values.field || values.field === NOT_SURE_FIELD.value)) {
    errors.field = "Select a field"
  }

  return errors
}

/** A normalized, result-safe query shared by the Home form and future result services. */
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

export function getHomeScreenMode(searchParams: SearchParamsLike): HomeScreenMode {
  return getHomeSearchQuery(searchParams) ? "results" : "search"
}

export function toHomeSearchQuery(values: FormValues) {
  return new URLSearchParams({
    country: values.country,
    field: values.status === NO_FIELD_STATUS ? NOT_SURE_FIELD.value : values.field,
    status: values.status,
  })
}
