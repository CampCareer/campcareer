import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_FR_INSTITUTION_ROUTES = [
  ["FR", "aix-marseille-universite"],
  ["FR", "sorbonne-universite"],
  ["FR", "universite-cote-dazur"],
  ["FR", "universite-de-bordeaux"],
  ["FR", "universite-de-strasbourg"],
  ["FR", "universite-grenoble-alpes"],
  ["FR", "universite-paris-cite"],
  ["FR", "universite-paris-saclay"],
  ["FR", "universite-psl"],
] as const

export const INDEXABLE_FR_INSTITUTION_PATHS = INDEXABLE_FR_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
