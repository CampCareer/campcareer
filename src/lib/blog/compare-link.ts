import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { resolveDecisionCareer } from "@/lib/comparison/public-contract"

const DEFAULT_COUNTRIES = ["AU", "CA", "US", "UK"]
const ISO_CODE = /^[A-Z]{2}$/
const ISO_CURRENCY = /^[A-Z]{3}$/

export type CompareLinkInput = {
  /** A single destination code, slug, or display name. */
  country?: string
  /** One to four destinations, separated by commas or supplied as an array. */
  countries?: string | readonly string[]
  /** A study-major slug that has an approved public-career mapping. */
  major?: string
  /** A canonical career id (or a readable career label). */
  career?: string
  /** Optional current country or citizenship, stored as a two-letter code. */
  origin?: string
  /** Optional ISO 4217 display currency. */
  currency?: string
}

const COUNTRY_CODES = new Map(
  LAUNCH_COUNTRIES.flatMap((country) => [
    [country.code.toLowerCase(), country.code],
    [country.slug.toLowerCase(), country.code],
    [country.name.toLowerCase(), country.code],
  ]),
)

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeCountry(value: string) {
  const cleaned = value.trim().toLowerCase()
  return COUNTRY_CODES.get(cleaned) ?? (ISO_CODE.test(cleaned.toUpperCase()) ? cleaned.toUpperCase() : null)
}

export function normalizeCompareCountries(input?: CompareLinkInput["countries"] | string) {
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : []

  const countries: string[] = []
  for (const value of values) {
    const country = normalizeCountry(value)
    if (country && LAUNCH_COUNTRIES.some((item) => item.code === country) && !countries.includes(country)) {
      countries.push(country)
    }
    if (countries.length === 4) break
  }
  return countries
}

function resolveCareer(career?: string, major?: string) {
  const normalizedCareer = career ? toSlug(career) : null
  const normalizedMajor = major ? toSlug(major) : null

  return (
    resolveDecisionCareer(career ?? null, null) ??
    resolveDecisionCareer(normalizedCareer, null) ??
    resolveDecisionCareer(null, major ?? null) ??
    resolveDecisionCareer(null, normalizedMajor)
  )
}

/**
 * Creates a stable Compare URL using only public, supported query values.
 * Unknown major/career/country values are intentionally omitted rather than
 * leaking an invalid parameter into the comparison screen.
 */
export function buildCompareHref(input: CompareLinkInput = {}) {
  const params = new URLSearchParams()
  const career = resolveCareer(input.career, input.major)
  const countries = normalizeCompareCountries(input.countries ?? input.country)
  const origin = input.origin?.trim().toUpperCase()
  const currency = input.currency?.trim().toUpperCase()

  if (career) params.set("career", career.id)
  params.set("countries", (countries.length ? countries : DEFAULT_COUNTRIES).join(","))
  if (origin && ISO_CODE.test(origin)) params.set("origin", origin)
  if (currency && ISO_CURRENCY.test(currency)) params.set("currency", currency)

  return `/compare?${params.toString()}`
}

/**
 * Prefer the canonical Career Page whenever a blog post gives us both a
 * supported Career and one destination. Compare remains the safe fallback for
 * multi-country or generic articles.
 */
export function buildCareerFirstHref(input: CompareLinkInput = {}) {
  const career = resolveCareer(input.career, input.major)
  const countries = normalizeCompareCountries(input.countries ?? input.country)

  if (career && countries.length === 1) {
    const country = LAUNCH_COUNTRIES.find((item) => item.code === countries[0])
    if (country) return `/career/${country.slug}/${career.id}`
  }

  return buildCompareHref(input)
}

const LEGACY_PRODUCT_PATHS = new Set([
  "/checklist",
  "/timeline",
  "/degree-risk",
  "/maps",
  "/study",
  "/study-options",
  "/majors",
  "/fields",
  "/universities",
  "/roi-explorer",
])

const LEGACY_COUNTRY_PRODUCT_RE = /^\/(?:au|ca|us|uk|de|nl|ie|be|sg|kr|jp|fr|es|nz|no|se|dk|fi|ch|ae)(?:\/|$)/

function internalPath(href: string) {
  return href.split(/[?#]/, 1)[0]
}

export function isLegacyBlogJourneyHref(href: string) {
  const path = internalPath(href)
  if (LEGACY_PRODUCT_PATHS.has(path)) return true
  if (LEGACY_COUNTRY_PRODUCT_RE.test(path)) return true
  return [...LEGACY_PRODUCT_PATHS].some((prefix) => path.startsWith(`${prefix}/`))
}

function comparisonInputFromHref(href: string, input: CompareLinkInput) {
  const url = new URL(href, "https://www.campcareer.com")
  const hasDestination = Boolean(input.country || input.countries)

  return {
    country: input.country,
    countries: hasDestination ? input.countries : (url.searchParams.get("countries") ?? url.searchParams.get("country") ?? undefined),
    major: input.major ?? url.searchParams.get("major") ?? undefined,
    career: input.career ?? url.searchParams.get("career") ?? undefined,
    origin: input.origin ?? url.searchParams.get("origin") ?? undefined,
    currency: input.currency ?? url.searchParams.get("currency") ?? undefined,
  }
}

/**
 * Keeps external/editorial links intact while preventing old blog CTAs from
 * sending readers into retired CampCareer surfaces. When enough context exists,
 * those links now land on the canonical Career Page.
 */
export function resolveBlogCtaHref(href: string, input: CompareLinkInput = {}) {
  if (isLegacyBlogJourneyHref(href)) return buildCareerFirstHref(input)
  if (internalPath(href) === "/compare") return buildCareerFirstHref(comparisonInputFromHref(href, input))
  return href
}
