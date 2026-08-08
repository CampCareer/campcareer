export const PUBLISHED_AU_CITY_SLUGS = ["sydney", "melbourne", "brisbane", "perth", "adelaide"] as const
export type PublishedAuCitySlug = (typeof PUBLISHED_AU_CITY_SLUGS)[number]

export const PUBLISHED_US_CITY_SLUGS = [
  "new-york",
  "boston",
  "los-angeles",
  "chicago",
  "seattle",
  "san-diego",
  "philadelphia",
  "tempe",
] as const
export type PublishedUsCitySlug = (typeof PUBLISHED_US_CITY_SLUGS)[number]

const CITY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function normalizeCitySlug(value: string | null | undefined) {
  if (!value) return null
  const slug = value.trim().toLowerCase()
  return CITY_SLUG_PATTERN.test(slug) ? slug : null
}

export function isPublishedAuCitySlug(value: string): value is PublishedAuCitySlug {
  return PUBLISHED_AU_CITY_SLUGS.includes(value as PublishedAuCitySlug)
}

export function isPublishedUsCitySlug(value: string): value is PublishedUsCitySlug {
  return PUBLISHED_US_CITY_SLUGS.includes(value as PublishedUsCitySlug)
}

export function auCityPath(value: string | null | undefined) {
  const slug = normalizeCitySlug(value)
  if (!slug || !isPublishedAuCitySlug(slug)) return null
  return `/cities/au/${slug}`
}

export function usCityPath(value: string | null | undefined) {
  const slug = normalizeCitySlug(value)
  if (!slug || !isPublishedUsCitySlug(slug)) return null
  return `/cities/us/${slug}`
}
