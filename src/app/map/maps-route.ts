export type MapSearchParams = Record<string, string | string[] | undefined>

/** Preserve legacy deep-link state while moving the interactive map to /maps. */
import { toProductCountryCode } from "@/lib/data-foundation/entity-aliases"

export function buildMapsHref(
  searchParams: MapSearchParams,
  countryCode?: string,
): string {
  const target = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) target.append(key, item)
    } else if (value !== undefined) {
      target.append(key, value)
    }
  }

  if (countryCode) {
    const normalizedCountryCode = toProductCountryCode(countryCode)
    if (normalizedCountryCode) target.set("country", normalizedCountryCode.toLowerCase())
  }
  const query = target.toString()
  return query ? `/maps?${query}` : "/maps"
}
