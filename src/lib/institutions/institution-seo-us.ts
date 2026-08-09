import { institutionDetailPath } from "./institution-search"

export const INDEXABLE_US_INSTITUTION_ROUTES = [
  ["US", "johns-hopkins-university"],
  ["US", "university-of-michigan-ann-arbor"],
  ["US", "university-of-washington-seattle-campus"],
  ["US", "university-of-california-san-diego"],
  ["US", "columbia-university-in-the-city-of-new-york"],
  ["US", "university-of-california-san-francisco"],
  ["US", "university-of-colorado-boulder"],
  ["US", "vanderbilt-university"],
  ["US", "university-of-pittsburgh-pittsburgh-campus"],
  ["US", "washington-university-in-st-louis"],
  ["US", "university-of-pennsylvania"],
  ["US", "stanford-university"],
  ["US", "duke-university"],
  ["US", "yale-university"],
  ["US", "university-of-california-los-angeles"],
  ["US", "new-york-university"],
  ["US", "cornell-university"],
  ["US", "university-of-north-carolina-at-chapel-hill"],
  ["US", "northwestern-university"],
  ["US", "university-of-minnesota-twin-cities"],
  ["US", "university-of-texas-at-austin"],
  ["US", "pennsylvania-state-university-main-campus"],
  ["US", "emory-university"],
  ["US", "university-of-wisconsin-madison"],
  ["US", "harvard-university"],
] as const

export const INDEXABLE_US_INSTITUTION_PATHS = INDEXABLE_US_INSTITUTION_ROUTES.map(
  ([countryCode, slug]) => institutionDetailPath(countryCode, slug),
)
