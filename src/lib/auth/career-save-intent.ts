import { localeFromPathname, localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { getCareerRoute } from "@/lib/workspace/occupation-routes"
import { getSafeNextPath } from "./safe-next"

export type CareerSaveIntent = {
  countryCode: string
  careerId: string
  returnPath: string
}

/**
 * Parse the one-time Save intent that is carried through authentication.
 * The marker is accepted only on a valid internal Career Page URL and is
 * removed before returning to the product so ordinary page loads stay read-only.
 * Legacy query-style Career URLs remain accepted during canonical migration.
 */
export function getCareerSaveIntentFromNext(
  requestedNext: string | null | undefined,
): CareerSaveIntent | null {
  const next = getSafeNextPath(requestedNext)
  const url = new URL(next, "https://campcareer.local")
  if (url.searchParams.get("save") !== "1") return null

  const barePath = withoutLocalePrefix(url.pathname)
  let route = null

  if (barePath === "/career") {
    const countryCode = (url.searchParams.get("country") ?? "").trim()
    const careerId = (url.searchParams.get("occupation") ?? "").trim()
    route = getCareerRoute(countryCode, careerId)
    url.searchParams.delete("country")
    url.searchParams.delete("occupation")
  } else {
    const match = barePath.match(/^\/career\/([^/]+)\/([^/]+)$/)
    if (!match) return null
    route = getCareerRoute(match[1], match[2])
  }

  if (!route) return null

  url.searchParams.delete("save")
  const routeLocale = localeFromPathname(url.pathname) ?? "en"
  url.pathname = localizePath(route.path, routeLocale)
  const returnPath = `${url.pathname}${url.search}${url.hash}`

  return {
    countryCode: route.country.code,
    careerId: route.career.id,
    returnPath,
  }
}
