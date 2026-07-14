/**
 * The one release registry for the public CampCareer product.
 *
 * Do not derive a launch-country list from map data, a sitemap, or an SEO
 * configuration. Those consumers must use this registry so a country cannot
 * accidentally appear in one surface before its publication gate allows it.
 */
export type LaunchCountryCode =
  | "AU" | "CA" | "US" | "IE" | "UK" | "DE" | "NL" | "BE" | "FR" | "ES"
  | "SG" | "KR" | "JP" | "NZ" | "NO" | "SE" | "DK" | "FI" | "CH" | "AE"

export type CountryPublicationStage = "REVIEW_REQUIRED" | "PROFILE_READY" | "DECISION_READY"

export type LaunchCountry = {
  code: LaunchCountryCode
  slug: string
  name: string
  currency: string
  publicationStage: CountryPublicationStage
  /** A Map v2 bundle is available and has passed country-level validation. */
  mapReady: boolean
}

const profile = (
  code: LaunchCountryCode,
  slug: string,
  name: string,
  currency: string,
): LaunchCountry => ({ code, slug, name, currency, publicationStage: "PROFILE_READY", mapReady: true })

const reviewRequired = (
  code: LaunchCountryCode,
  slug: string,
  name: string,
  currency: string,
): LaunchCountry => ({ code, slug, name, currency, publicationStage: "REVIEW_REQUIRED", mapReady: false })

/** Fixed 20-country launch perimeter, in the agreed release order. */
export const LAUNCH_COUNTRIES: readonly LaunchCountry[] = [
  profile("AU", "australia", "Australia", "AUD"),
  profile("CA", "canada", "Canada", "CAD"),
  profile("US", "united-states", "United States", "USD"),
  profile("UK", "united-kingdom", "United Kingdom", "GBP"),
  profile("IE", "ireland", "Ireland", "EUR"),
  profile("DE", "germany", "Germany", "EUR"),
  profile("NL", "netherlands", "Netherlands", "EUR"),
  profile("BE", "belgium", "Belgium", "EUR"),
  profile("FR", "france", "France", "EUR"),
  profile("ES", "spain", "Spain", "EUR"),
  profile("SG", "singapore", "Singapore", "SGD"),
  profile("KR", "south-korea", "South Korea", "KRW"),
  profile("JP", "japan", "Japan", "JPY"),
  // Map discovery is safe before career comparison: this bundle deliberately
  // contains no unverified wage or shortage numbers.
  { ...reviewRequired("NZ", "new-zealand", "New Zealand", "NZD"), mapReady: true },
  { ...reviewRequired("NO", "norway", "Norway", "NOK"), mapReady: true },
  { ...reviewRequired("SE", "sweden", "Sweden", "SEK"), mapReady: true },
  { ...reviewRequired("DK", "denmark", "Denmark", "DKK"), mapReady: true },
  { ...reviewRequired("FI", "finland", "Finland", "EUR"), mapReady: true },
  { ...reviewRequired("CH", "switzerland", "Switzerland", "CHF"), mapReady: true },
  { ...reviewRequired("AE", "united-arab-emirates", "United Arab Emirates", "AED"), mapReady: true },
] as const

export const LAUNCH_COUNTRY_CODES = LAUNCH_COUNTRIES.map((country) => country.code) as readonly LaunchCountryCode[]

const byCode = new Map(LAUNCH_COUNTRIES.map((country) => [country.code, country]))
const bySlug = new Map(LAUNCH_COUNTRIES.map((country) => [country.slug, country]))

export function getLaunchCountry(code: string) {
  return byCode.get(code.toUpperCase() as LaunchCountryCode) ?? null
}

export function getLaunchCountryBySlug(slug: string) {
  return bySlug.get(slug) ?? null
}

export function isLaunchCountry(code: string): code is LaunchCountryCode {
  return Boolean(getLaunchCountry(code))
}
