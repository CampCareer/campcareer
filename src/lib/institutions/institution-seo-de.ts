import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_DE_INSTITUTION_ROUTES = [
  ["DE", "freie-universitaet-berlin"],
  ["DE", "heidelberg-university"],
  ["DE", "humboldt-universitaet-zu-berlin"],
  ["DE", "karlsruhe-institute-of-technology"],
  ["DE", "ludwig-maximilians-universitaet-munich"],
  ["DE", "rwth-aachen-university"],
  ["DE", "technical-university-of-munich"],
  ["DE", "technische-universitaet-berlin"],
  ["DE", "technische-universitaet-dresden"],
  ["DE", "universitaet-hamburg"],
  ["DE", "university-of-bonn"],
  ["DE", "university-of-tuebingen"],
] as const

export const INDEXABLE_DE_INSTITUTION_PATHS = INDEXABLE_DE_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
