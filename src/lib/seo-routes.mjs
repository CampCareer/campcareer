export const SITE_URL = "https://www.campcareer.com"
export const HOME_CANONICAL_PATH = "/"

export const CANONICAL_COUNTRY_SLUGS = Object.freeze([
  "au",
  "ca",
  "us",
  "uk",
  "ie",
  "de",
  "nl",
  "be",
  "fr",
  "es",
  "sg",
  "kr",
  "jp",
  "nz",
  "no",
  "se",
  "dk",
  "fi",
  "ch",
  "ae",
])

export function countryCanonicalPath(slug) {
  const normalized = String(slug).toLowerCase()
  if (!CANONICAL_COUNTRY_SLUGS.includes(normalized)) {
    throw new Error(`Unsupported canonical country slug: ${slug}`)
  }
  return `/countries/${normalized}`
}

export function programsCanonicalPath(countryCode = "AU") {
  const normalized = String(countryCode).toUpperCase()
  return normalized === "AU" ? "/programs" : `/programs?country=${encodeURIComponent(normalized)}`
}

// Exact legacy routes with a verified replacement. Keep these separate from
// broad retired funnels so permanent SEO redirects never swallow active child routes.
export const LEGACY_SEO_REDIRECTS = Object.freeze([
  { source: "/home", destination: HOME_CANONICAL_PATH, permanent: true },
  ...CANONICAL_COUNTRY_SLUGS.map((slug) => ({
    source: `/${slug}`,
    destination: countryCanonicalPath(slug),
    permanent: true,
  })),
])

// Verified URL families that have no replacement. Do not add a pattern here
// unless the matching URLs are known to be permanently retired.
export const LEGACY_GONE_PATTERNS = Object.freeze([
  /^\/\d{4}\/\d{2}(\/|$)/,
  /^\/category(\/|$)/,
  /^\/tag(\/|$)/,
  /^\/author(\/|$)/,
  /^\/page\/\d+(\/|$)/,
  /^\/feed(\/|$)/,
  /^\/comments\/feed(\/|$)/,
  /^\/sample-page(\/|$)/,
  /^\/jobs?(\/|$)/,
])

export function isLegacyGonePath(pathname) {
  return LEGACY_GONE_PATTERNS.some((pattern) => pattern.test(pathname))
}
