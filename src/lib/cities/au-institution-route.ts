const INSTITUTION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function auInstitutionPathFromProviderId(providerId: string | null | undefined) {
  if (!providerId) return null
  const slug = providerId.trim().toLowerCase().replace(/^the-/, "")
  if (!INSTITUTION_SLUG_PATTERN.test(slug)) return null
  return `/institutions/au/${slug}`
}
