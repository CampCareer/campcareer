export const CANONICAL_PROGRAM_COUNTRY_CODES = ["AU", "GB", "US", "CA", "IE"] as const
export type CanonicalCountryCode = (typeof CANONICAL_PROGRAM_COUNTRY_CODES)[number]

const COUNTRY_ALIASES: Readonly<Record<string, CanonicalCountryCode>> = {
  au: "AU",
  australia: "AU",
  gb: "GB",
  uk: "GB",
  "united-kingdom": "GB",
  "united kingdom": "GB",
  us: "US",
  usa: "US",
  "united-states": "US",
  "united states": "US",
  ca: "CA",
  canada: "CA",
  ie: "IE",
  ireland: "IE",
}

export function toCanonicalProgramCountryCode(value: string | null | undefined): CanonicalCountryCode | null {
  if (!value) return null
  return COUNTRY_ALIASES[value.trim().toLowerCase().replaceAll("_", "-")] ?? null
}

export function toProductCountryDisplayName(value: string | null | undefined): string | null {
  const code = toCanonicalProgramCountryCode(value)
  if (!code) return null
  return code === "GB" ? "United Kingdom" : ({ AU: "Australia", US: "United States", CA: "Canada", IE: "Ireland" } as const)[code]
}
