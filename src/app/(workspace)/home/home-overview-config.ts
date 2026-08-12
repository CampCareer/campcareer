import { CANONICAL_CAREERS } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"

export type OverviewOption = { value: string; label: string; searchTerms?: string[] }
export type CareerCheckLocale = "en" | "ko"

export type OverviewSearchValues = {
  country: string
  occupation: string
}

export type OverviewSearchErrors = Partial<Record<keyof OverviewSearchValues, string>>
export type OverviewOpenMenu = keyof OverviewSearchValues | null
export type SearchParamsLike = Pick<URLSearchParams, "get">

export const NOT_SURE_COUNTRY: OverviewOption = { value: "not-sure", label: "아직 모르겠어요" }

// The default arrays also validate URL values. Visible labels come from the
// locale-aware factories below, so switching the global language changes the
// whole two-question flow without changing its URL contract.
export const COUNTRY_OPTIONS: readonly OverviewOption[] = [
  NOT_SURE_COUNTRY,
  ...LAUNCH_COUNTRIES.map((country) => ({ value: country.code, label: country.name })),
]

export const OCCUPATION_OPTIONS: readonly OverviewOption[] = [
  ...CANONICAL_CAREERS.map((career) => ({
    value: career.id,
    label: career.labelKo,
    searchTerms: [career.label, ...career.aliases, ...career.aliasesKo],
  })),
]

export function getCountryOptions(locale: CareerCheckLocale): readonly OverviewOption[] {
  return [
    { value: NOT_SURE_COUNTRY.value, label: locale === "ko" ? "아직 모르겠어요" : "I'm not sure yet" },
    ...LAUNCH_COUNTRIES.map((country) => ({ value: country.code, label: country.name })),
  ]
}

export function getOccupationOptions(locale: CareerCheckLocale): readonly OverviewOption[] {
  return CANONICAL_CAREERS.map((career) => ({
    value: career.id,
    label: locale === "ko" ? career.labelKo : career.label,
    searchTerms: [career.label, career.labelKo, ...career.aliases, ...career.aliasesKo],
  }))
}

export function hasOverviewOption(options: readonly OverviewOption[], value: string | null) {
  return Boolean(value && options.some((option) => option.value === value))
}

export function getOverviewOptionLabel(options: readonly OverviewOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? ""
}

export function readOverviewSearchValues(searchParams: SearchParamsLike): OverviewSearchValues {
  const rawCountry = searchParams.get("country") ?? ""
  const country = rawCountry === NOT_SURE_COUNTRY.value ? rawCountry : rawCountry.toUpperCase()
  const occupation = searchParams.get("occupation") ?? ""

  return {
    country: hasOverviewOption(COUNTRY_OPTIONS, country) ? country : "",
    occupation: hasOverviewOption(OCCUPATION_OPTIONS, occupation) ? occupation : "",
  }
}

export function validateOverviewSearch(values: OverviewSearchValues, locale: CareerCheckLocale = "ko"): OverviewSearchErrors {
  const errors: OverviewSearchErrors = {}
  if (!values.country) errors.country = locale === "ko" ? "가고 싶은 나라를 선택해 주세요" : "Choose a destination."
  if (!values.occupation) errors.occupation = locale === "ko" ? "하고 싶은 일을 선택해 주세요" : "Choose an occupation."
  return errors
}

export function getOverviewSearchQuery(searchParams: SearchParamsLike): OverviewSearchValues | null {
  const values = readOverviewSearchValues(searchParams)
  return Object.keys(validateOverviewSearch(values)).length === 0 ? values : null
}

export function toOverviewSearchQuery(values: OverviewSearchValues) {
  const params = new URLSearchParams()
  params.set("country", values.country)
  params.set("occupation", values.occupation)
  return params
}

export function isCanonicalOverviewQuery(searchParams: SearchParamsLike) {
  return searchParams.get("country") !== null && searchParams.get("occupation") !== null
}
