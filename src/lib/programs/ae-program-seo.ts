export const INDEXABLE_AE_PROGRAM_SLUGS = [
  "ajman-bsc-physiotherapy",
  "aue-bsc-digital-animation",
  "aus-barch",
  "aus-bsc-data-science",
  "aus-bsc-electrical-engineering",
  "dct-advanced-diploma-culinary-management",
  "dct-certificate-culinary-operations",
  "eau-higher-diploma-aircraft-maintenance",
  "ecae-pgde-early-years-primary",
  "ecae-pgde-secondary",
  "efta-integrated-atpl",
  "fakeeh-bsc-occupational-therapy",
  "ku-bsc-computer-engineering",
  "ku-bsc-computer-science",
  "ku-bsc-energy-engineering",
  "ku-meng-hse-environmental-engineering",
  "lesroches-bsc-global-hospitality-management",
  "nyuad-ba-art-art-history",
  "nyuad-ba-economics",
  "nyuad-ba-film-new-media",
  "nyuad-bs-computer-engineering",
  "nyuad-mba",
  "sma-b-maritime-transport",
  "uaeu-b-accounting",
  "uaeu-ba-geography",
  "uaeu-ba-mass-communication",
  "uaeu-bba-marketing",
  "uaeu-bba-supply-chain-logistics",
  "uaeu-bed-early-childhood",
  "uaeu-bed-special-education",
  "uaeu-bsc-aerospace-engineering",
  "uaeu-bsc-food-science",
  "uaeu-bsc-geosciences",
  "uaeu-bsc-horticulture",
  "uaeu-bsc-marine-fisheries-animal-science",
  "uaeu-bsc-petroleum-engineering",
  "uaeu-master-education",
] as const

export const INDEXABLE_AE_PROGRAM_PATHS = INDEXABLE_AE_PROGRAM_SLUGS.map(
  (slug) => `/programs/ae/${slug}`,
)

export function aeProgramDetailPath(slug: string) {
  return `/programs/ae/${slug}`
}

export function isIndexableAeProgramSlug(slug: string) {
  return (INDEXABLE_AE_PROGRAM_SLUGS as readonly string[]).includes(slug)
}
