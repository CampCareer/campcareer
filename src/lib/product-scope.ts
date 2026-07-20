import type { LaunchCountryCode } from "@/data/launch-countries"

/**
 * Countries that have a complete enough experience to be reachable from the
 * public product. Keep this deliberately separate from the data registry:
 * background research can continue without looking like a launched feature.
 */
export const PUBLIC_PRODUCT_COUNTRY_CODES: readonly LaunchCountryCode[] = ["AU"]

export function isPublicProductCountry(code: string): boolean {
  return PUBLIC_PRODUCT_COUNTRY_CODES.includes(code.toUpperCase() as LaunchCountryCode)
}
