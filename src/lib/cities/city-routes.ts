export const PUBLISHED_AU_CITY_SLUGS = ["sydney", "melbourne", "brisbane", "perth", "adelaide"] as const
export type PublishedAuCitySlug = (typeof PUBLISHED_AU_CITY_SLUGS)[number]

export const PUBLISHED_US_CITY_SLUGS = [
  "new-york", "boston", "los-angeles", "chicago", "seattle", "san-diego", "philadelphia", "tempe",
] as const
export type PublishedUsCitySlug = (typeof PUBLISHED_US_CITY_SLUGS)[number]

export const PUBLISHED_UK_CITY_SLUGS = [
  "london", "manchester", "birmingham", "edinburgh", "glasgow", "cardiff", "belfast", "oxford", "cambridge", "bristol",
] as const
export type PublishedUkCitySlug = (typeof PUBLISHED_UK_CITY_SLUGS)[number]

export const PUBLISHED_NZ_CITY_SLUGS = ["auckland", "christchurch", "hamilton", "wellington", "dunedin"] as const
export type PublishedNzCitySlug = (typeof PUBLISHED_NZ_CITY_SLUGS)[number]

export const PUBLISHED_FI_CITY_SLUGS = [
  "helsinki", "espoo", "tampere", "turku", "oulu", "jyvaskyla", "lappeenranta", "joensuu",
] as const
export type PublishedFiCitySlug = (typeof PUBLISHED_FI_CITY_SLUGS)[number]
export const SUPPORTED_FI_CITY_SLUGS = PUBLISHED_FI_CITY_SLUGS
export type SupportedFiCitySlug = PublishedFiCitySlug

const CITY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export function normalizeCitySlug(value: string | null | undefined) { if (!value) return null; const slug = value.trim().toLowerCase(); return CITY_SLUG_PATTERN.test(slug) ? slug : null }
export function isPublishedAuCitySlug(value: string): value is PublishedAuCitySlug { return PUBLISHED_AU_CITY_SLUGS.includes(value as PublishedAuCitySlug) }
export function isPublishedUsCitySlug(value: string): value is PublishedUsCitySlug { return PUBLISHED_US_CITY_SLUGS.includes(value as PublishedUsCitySlug) }
export function isPublishedUkCitySlug(value: string): value is PublishedUkCitySlug { return PUBLISHED_UK_CITY_SLUGS.includes(value as PublishedUkCitySlug) }
export function isPublishedNzCitySlug(value: string): value is PublishedNzCitySlug { return PUBLISHED_NZ_CITY_SLUGS.includes(value as PublishedNzCitySlug) }
export function isPublishedFiCitySlug(value: string): value is PublishedFiCitySlug { return PUBLISHED_FI_CITY_SLUGS.includes(value as PublishedFiCitySlug) }
export function isSupportedFiCitySlug(value: string): value is SupportedFiCitySlug { return isPublishedFiCitySlug(value) }

export function auCityPath(value: string | null | undefined) { const slug = normalizeCitySlug(value); return slug && isPublishedAuCitySlug(slug) ? `/cities/au/${slug}` : null }
export function usCityPath(value: string | null | undefined) { const slug = normalizeCitySlug(value); return slug && isPublishedUsCitySlug(slug) ? `/cities/us/${slug}` : null }
export function ukCityPath(value: string | null | undefined) { const slug = normalizeCitySlug(value); return slug && isPublishedUkCitySlug(slug) ? `/cities/uk/${slug}` : null }
export function nzCityPath(value: string | null | undefined) { const slug = normalizeCitySlug(value); return slug && isPublishedNzCitySlug(slug) ? `/cities/nz/${slug}` : null }
export function fiCityPath(value: string | null | undefined) { const slug = normalizeCitySlug(value); return slug && isPublishedFiCitySlug(slug) ? `/cities/fi/${slug}` : null }
