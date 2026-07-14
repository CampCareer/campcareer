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
  /** Thumbnail image URL (Unsplash, free to use). */
  image: string
}

const profile = (
  code: LaunchCountryCode,
  slug: string,
  name: string,
  currency: string,
  image: string,
): LaunchCountry => ({ code, slug, name, currency, publicationStage: "PROFILE_READY", mapReady: true, image })

const reviewRequired = (
  code: LaunchCountryCode,
  slug: string,
  name: string,
  currency: string,
  image: string,
): LaunchCountry => ({ code, slug, name, currency, publicationStage: "REVIEW_REQUIRED", mapReady: false, image })

/** Fixed 20-country launch perimeter, in the agreed release order. */
export const LAUNCH_COUNTRIES: readonly LaunchCountry[] = [
  profile("AU", "australia", "Australia", "AUD", "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=250&fit=crop&auto=format"),
  profile("CA", "canada", "Canada", "CAD", "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=250&fit=crop&auto=format"),
  profile("US", "united-states", "United States", "USD", "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop&auto=format"),
  profile("UK", "united-kingdom", "United Kingdom", "GBP", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop&auto=format"),
  profile("IE", "ireland", "Ireland", "EUR", "https://images.unsplash.com/photo-1549888834-3ec93abae044?w=400&h=250&fit=crop&auto=format"),
  profile("DE", "germany", "Germany", "EUR", "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=250&fit=crop&auto=format"),
  profile("NL", "netherlands", "Netherlands", "EUR", "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=250&fit=crop&auto=format"),
  profile("BE", "belgium", "Belgium", "EUR", "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=250&fit=crop&auto=format"),
  profile("FR", "france", "France", "EUR", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop&auto=format"),
  profile("ES", "spain", "Spain", "EUR", "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&fit=crop&auto=format"),
  profile("SG", "singapore", "Singapore", "SGD", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop&auto=format"),
  profile("KR", "south-korea", "South Korea", "KRW", "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=250&fit=crop&auto=format"),
  profile("JP", "japan", "Japan", "JPY", "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=250&fit=crop&auto=format"),
  // Map discovery is safe before career comparison: this bundle deliberately
  // contains no unverified wage or shortage numbers.
  { ...reviewRequired("NZ", "new-zealand", "New Zealand", "NZD", "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=250&fit=crop&auto=format"), mapReady: true },
  { ...reviewRequired("NO", "norway", "Norway", "NOK", "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop&auto=format"), mapReady: true },
  { ...reviewRequired("SE", "sweden", "Sweden", "SEK", "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=250&fit=crop&auto=format"), mapReady: true },
  { ...reviewRequired("DK", "denmark", "Denmark", "DKK", "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=250&fit=crop&auto=format"), mapReady: true },
  { ...reviewRequired("FI", "finland", "Finland", "EUR", "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=250&fit=crop&auto=format"), mapReady: true },
  profile("CH", "switzerland", "Switzerland", "CHF", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&auto=format"),
  profile("AE", "united-arab-emirates", "United Arab Emirates", "AED", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&auto=format"),
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
