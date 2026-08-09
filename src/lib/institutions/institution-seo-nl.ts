import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_NL_INSTITUTION_ROUTES = [
  ["NL", "delft-university-of-technology"],
  ["NL", "eindhoven-university-of-technology"],
  ["NL", "erasmus-university-rotterdam"],
  ["NL", "leiden-university"],
  ["NL", "maastricht-university"],
  ["NL", "radboud-university"],
  ["NL", "tilburg-university"],
  ["NL", "university-of-amsterdam"],
  ["NL", "university-of-groningen"],
  ["NL", "university-of-twente"],
  ["NL", "utrecht-university"],
  ["NL", "vrije-universiteit-amsterdam"],
  ["NL", "wageningen-university-and-research"],
] as const

export const INDEXABLE_NL_INSTITUTION_PATHS = INDEXABLE_NL_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
