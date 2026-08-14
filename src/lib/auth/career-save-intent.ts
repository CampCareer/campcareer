import { withoutLocalePrefix } from "@/lib/i18n/config"
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
 */
export function getCareerSaveIntentFromNext(
  requestedNext: string | null | undefined,
): CareerSaveIntent | null {
  const next = getSafeNextPath(requestedNext)
  const url = new URL(next, "https://campcareer.local")

  if (withoutLocalePrefix(url.pathname) !== "/career") return null
  if (url.searchParams.get("save") !== "1") return null

  const countryCode = (url.searchParams.get("country") ?? "").trim().toUpperCase()
  const careerId = (url.searchParams.get("occupation") ?? "").trim()

  if (!/^[A-Z]{2}$/.test(countryCode)) return null
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(careerId)) return null

  url.searchParams.delete("save")
  const returnPath = `${url.pathname}${url.search}${url.hash}`

  return { countryCode, careerId, returnPath }
}
