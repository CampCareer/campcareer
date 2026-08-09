import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_SG_INSTITUTION_ROUTES = [
  ["SG", "nanyang-technological-university"],
  ["SG", "national-university-of-singapore"],
  ["SG", "singapore-institute-of-technology"],
  ["SG", "singapore-management-university"],
  ["SG", "singapore-university-of-social-sciences"],
  ["SG", "singapore-university-of-technology-and-design"],
] as const

export const INDEXABLE_SG_INSTITUTION_PATHS = INDEXABLE_SG_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
