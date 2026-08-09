import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_NZ_INSTITUTION_ROUTES = [
  ["NZ", "auckland-university-of-technology"],
  ["NZ", "lincoln-university"],
  ["NZ", "massey-university"],
  ["NZ", "university-of-auckland"],
  ["NZ", "university-of-canterbury"],
  ["NZ", "university-of-otago"],
  ["NZ", "university-of-waikato"],
  ["NZ", "victoria-university-of-wellington"],
] as const

export const INDEXABLE_NZ_INSTITUTION_PATHS = INDEXABLE_NZ_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
