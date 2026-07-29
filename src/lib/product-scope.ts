import type { LaunchCountryCode } from "@/data/launch-countries"

/**
 * The product is a source-backed route from citizenship to work abroad. A new
 * surface is valid only when it makes one published route more actionable.
 */
export const PRODUCT_CORE = {
  question: "How can a person with citizenship A pursue occupation or industry C in destination B?",
  allowedSurfaces: ["route-search", "route-guide", "maps"] as const,
  requiredOutputs: ["visa", "work-conditions", "preparation", "jobs", "courses", "map"] as const,
} as const

// A country can remain research-only even when raw map data exists. The first
// published route currently targets Australia; new destinations require a full
// route evidence bundle before they become public product destinations.
export const PUBLIC_PRODUCT_COUNTRY_CODES: readonly LaunchCountryCode[] = ["AU"]

export function isPublicProductCountry(code: string): boolean {
  return PUBLIC_PRODUCT_COUNTRY_CODES.includes(code.toUpperCase() as LaunchCountryCode)
}
