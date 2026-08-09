import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_AE_INSTITUTION_ROUTES = [
  ["AE", "american-university-of-sharjah"],
  ["AE", "khalifa-university"],
  ["AE", "mohammed-bin-rashid-university-of-medicine-and-health-sciences"],
  ["AE", "new-york-university-abu-dhabi"],
  ["AE", "united-arab-emirates-university"],
] as const

export const INDEXABLE_AE_INSTITUTION_PATHS = INDEXABLE_AE_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
