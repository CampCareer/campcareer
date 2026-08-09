import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_ES_INSTITUTION_ROUTES = [
  ["ES", "euskal-herriko-unibertsitatea"],
  ["ES", "universidad-autonoma-de-madrid"],
  ["ES", "universidad-complutense-de-madrid"],
  ["ES", "universidad-de-cadiz"],
  ["ES", "universidad-de-castilla-la-mancha"],
  ["ES", "universidad-de-malaga"],
  ["ES", "universidad-de-sevilla"],
  ["ES", "universitat-autonoma-de-barcelona"],
  ["ES", "universitat-de-barcelona"],
  ["ES", "universitat-politecnica-de-catalunya"],
] as const

export const INDEXABLE_ES_INSTITUTION_PATHS = INDEXABLE_ES_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
