export const CA_PROGRAM_PUBLISHED_CITY_ROUTES = {
  toronto: "/cities/ca/toronto",
  vancouver: "/cities/ca/vancouver",
  montreal: "/cities/ca/montreal",
  ottawa: "/cities/ca/ottawa",
  calgary: "/cities/ca/calgary",
  waterloo: "/cities/ca/waterloo",
  edmonton: "/cities/ca/edmonton",
} as const

export function caProgramCityPath(city: string | null | undefined) {
  const slug = city?.trim().toLowerCase()
  if (!slug) return null
  return CA_PROGRAM_PUBLISHED_CITY_ROUTES[slug as keyof typeof CA_PROGRAM_PUBLISHED_CITY_ROUTES] ?? null
}
