import { SG_MAP_AREAS } from "@/data/sg-map-data"

export function sgMapSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export const SG_AREA_MAP_PAGES = SG_MAP_AREAS.map((area) => ({
  ...area,
  slug: sgMapSlug(area.nameEn),
  path: `/maps/sg/areas/${sgMapSlug(area.nameEn)}`,
}))
