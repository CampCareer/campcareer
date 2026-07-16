export type AuOccupationSlugInput = {
  anzsco_code: string
  occupation_en: string
}

export function slugifyAuOccupation(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * ANZSCO labels are currently unique, but retain the code suffix for future
 * duplicate labels so every published occupation has a stable, unambiguous URL.
 */
export function getAuOccupationSlug(
  occupation: AuOccupationSlugInput,
  occupations: readonly AuOccupationSlugInput[] = [],
): string {
  const base = slugifyAuOccupation(occupation.occupation_en) || occupation.anzsco_code.toLowerCase()
  const duplicates = occupations.filter((item) => slugifyAuOccupation(item.occupation_en) === base)
  return duplicates.length > 1 ? `${base}-${occupation.anzsco_code}` : base
}

export function getAuOccupationPath(
  occupation: AuOccupationSlugInput,
  occupations: readonly AuOccupationSlugInput[] = [],
): string {
  return `/au/jobs/${getAuOccupationSlug(occupation, occupations)}`
}
