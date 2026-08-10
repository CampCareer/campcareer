/**
 * Citizenship is a user attribute, not a CampCareer destination release gate.
 * Keep this registry independent from `launch-countries` so we can accept the
 * passport nationalities that matter to the product without implying that each
 * country is a supported destination or has verified visa data yet.
 */
export type CitizenshipMarket = "launch-country" | "priority-source-country"

export type CitizenshipCountry = {
  /** Stable product code. Existing CampCareer launch-country codes are preserved. */
  code: string
  /** ISO 3166-1 alpha-2 code for external visa and migration sources. */
  isoCode: string
  name: string
  market: CitizenshipMarket
}

export const CITIZENSHIP_COUNTRIES = [
  { code: "AU", isoCode: "AU", name: "Australia", market: "launch-country" },
  { code: "CA", isoCode: "CA", name: "Canada", market: "launch-country" },
  { code: "US", isoCode: "US", name: "United States", market: "launch-country" },
  { code: "UK", isoCode: "GB", name: "United Kingdom", market: "launch-country" },
  { code: "IE", isoCode: "IE", name: "Ireland", market: "launch-country" },
  { code: "DE", isoCode: "DE", name: "Germany", market: "launch-country" },
  { code: "NL", isoCode: "NL", name: "Netherlands", market: "launch-country" },
  { code: "BE", isoCode: "BE", name: "Belgium", market: "launch-country" },
  { code: "FR", isoCode: "FR", name: "France", market: "launch-country" },
  { code: "ES", isoCode: "ES", name: "Spain", market: "launch-country" },
  { code: "SG", isoCode: "SG", name: "Singapore", market: "launch-country" },
  { code: "KR", isoCode: "KR", name: "South Korea", market: "launch-country" },
  { code: "JP", isoCode: "JP", name: "Japan", market: "launch-country" },
  { code: "NZ", isoCode: "NZ", name: "New Zealand", market: "launch-country" },
  { code: "NO", isoCode: "NO", name: "Norway", market: "launch-country" },
  { code: "SE", isoCode: "SE", name: "Sweden", market: "launch-country" },
  { code: "DK", isoCode: "DK", name: "Denmark", market: "launch-country" },
  { code: "FI", isoCode: "FI", name: "Finland", market: "launch-country" },
  { code: "CH", isoCode: "CH", name: "Switzerland", market: "launch-country" },
  { code: "AE", isoCode: "AE", name: "United Arab Emirates", market: "launch-country" },
  { code: "IN", isoCode: "IN", name: "India", market: "priority-source-country" },
  { code: "CN", isoCode: "CN", name: "China", market: "priority-source-country" },
  { code: "PH", isoCode: "PH", name: "Philippines", market: "priority-source-country" },
  { code: "VN", isoCode: "VN", name: "Vietnam", market: "priority-source-country" },
  { code: "ID", isoCode: "ID", name: "Indonesia", market: "priority-source-country" },
  { code: "NP", isoCode: "NP", name: "Nepal", market: "priority-source-country" },
  { code: "PK", isoCode: "PK", name: "Pakistan", market: "priority-source-country" },
  { code: "BD", isoCode: "BD", name: "Bangladesh", market: "priority-source-country" },
  { code: "NG", isoCode: "NG", name: "Nigeria", market: "priority-source-country" },
  { code: "BR", isoCode: "BR", name: "Brazil", market: "priority-source-country" },
] as const satisfies readonly CitizenshipCountry[]

export type CitizenshipCountryCode = (typeof CITIZENSHIP_COUNTRIES)[number]["code"]

/** A selection state, deliberately distinct from a country and its code. */
export const OTHER_CITIZENSHIP = {
  kind: "other",
  value: "OTHER",
  label: "My country isn’t listed",
} as const

export type CitizenshipSelection = CitizenshipCountryCode | typeof OTHER_CITIZENSHIP.value

export const CITIZENSHIP_OPTIONS = [
  ...CITIZENSHIP_COUNTRIES.map((country) => ({
    kind: "country" as const,
    value: country.code,
    label: country.name,
  })),
  OTHER_CITIZENSHIP,
] as const

const citizenshipByCode = new Map<string, CitizenshipCountry>(
  CITIZENSHIP_COUNTRIES.map((country) => [country.code, country]),
)

export function getCitizenshipCountry(code: string) {
  return citizenshipByCode.get(code.toUpperCase()) ?? null
}

export function isCitizenshipCountryCode(code: string): code is CitizenshipCountryCode {
  return Boolean(getCitizenshipCountry(code))
}

export function isCitizenshipSelection(value: string): value is CitizenshipSelection {
  return value === OTHER_CITIZENSHIP.value || isCitizenshipCountryCode(value)
}
