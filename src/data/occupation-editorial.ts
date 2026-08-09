import { OCCUPATION_EDITORIAL as BASE_OCCUPATION_EDITORIAL } from "./occupation-editorial-base"
import { TECHNOLOGY_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology"
import { TECHNOLOGY_NETWORK_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-network"
import { TECHNOLOGY_CLOUD_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-cloud"
import { TECHNOLOGY_DATABASE_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-database"
import { TECHNOLOGY_SUPPORT_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-support"
import { ENGINEERING_OCCUPATION_EDITORIAL } from "./occupation-editorial-engineering"
import type { OccupationEditorial } from "./occupation-editorial-base"

export type { CountryOccupationEditorial, OccupationEditorial } from "./occupation-editorial-base"

export const OCCUPATION_EDITORIAL = [
  ...BASE_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_NETWORK_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_CLOUD_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_DATABASE_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_SUPPORT_OCCUPATION_EDITORIAL,
  ...ENGINEERING_OCCUPATION_EDITORIAL,
] as const

const BY_ID = new Map<string, OccupationEditorial>(
  OCCUPATION_EDITORIAL.map((item) => [item.id, item]),
)

export function getOccupationEditorial(id: string): OccupationEditorial | undefined {
  return BY_ID.get(id)
}
