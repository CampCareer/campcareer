import { OCCUPATION_EDITORIAL as BASE_OCCUPATION_EDITORIAL } from "./occupation-editorial-base"
import { TECHNOLOGY_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology"

export type { CountryOccupationEditorial, OccupationEditorial } from "./occupation-editorial-base"

export const OCCUPATION_EDITORIAL = [
  ...BASE_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_OCCUPATION_EDITORIAL,
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}
