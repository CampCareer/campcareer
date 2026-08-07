import type { LocaleOption } from "@/lib/i18n/config"

const CANONICAL_WORKSPACE_PATHS = new Set([
  "/maps",
  "/compare",
  "/visas",
])

/**
 * Returns the canonical Workspace destination for retired locale-home URLs.
 * Detail content is intentionally excluded so reviewed locale SEO pages keep
 * their own stable URLs.
 */
export function getLegacyLocaleHomeRedirect(
  requestedPathname: string,
  routeLocale: LocaleOption | null,
) {
  if (requestedPathname === "/") return null
  if (requestedPathname === "/results" || requestedPathname === "/home") return "/"

  const isLegacyLocaleAlias = requestedPathname === "/en" || requestedPathname.startsWith("/en/")
  if (!routeLocale && !isLegacyLocaleAlias) return null

  const pathname = routeLocale
    ? requestedPathname.slice(`/${routeLocale === "es" ? "es-419" : routeLocale.toLowerCase()}`.length) || "/"
    : requestedPathname.slice("/en".length) || "/"

  if (pathname === "/" || pathname === "/results" || pathname === "/home") return "/"
  return CANONICAL_WORKSPACE_PATHS.has(pathname) ? pathname : null
}

export function getLocaleNavigationPath(pathname: string, locale: LocaleOption) {
  const barePathname = pathname.replace(/^\/(?:ko|zh-hans|vi|hi|es-419)(?=\/|$)/, "") || "/"
  if (barePathname === "/" || barePathname === "/home" || CANONICAL_WORKSPACE_PATHS.has(barePathname)) {
    return barePathname === "/home" ? "/" : barePathname
  }

  const prefix = locale === "en" ? "" : locale === "es" ? "/es-419" : `/${locale.toLowerCase()}`
  return `${prefix}${barePathname === "/" ? "" : barePathname}` || "/"
}
