import { JP_CITIES, JP_PREFECTURE_SEO_DATA } from "@/data/jp-map-data"

export function jpMapSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export const JP_PREFECTURE_MAP_PAGES = JP_PREFECTURE_SEO_DATA.map((prefecture) => ({
  ...prefecture,
  slug: jpMapSlug(prefecture.en),
  path: `/maps/jp/prefectures/${jpMapSlug(prefecture.en)}`,
}))

export const JP_CITY_MAP_PAGES = JP_CITIES.map((city) => ({
  ...city,
  prefecture: JP_PREFECTURE_SEO_DATA.find((prefecture) => prefecture.code === city.prefectureCode)!,
  slug: jpMapSlug(city.nameEn),
  path: `/maps/jp/cities/${jpMapSlug(city.nameEn)}`,
}))
