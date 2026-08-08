import { OCCUPATION_EDITORIAL as BASE_OCCUPATION_EDITORIAL } from "./occupation-editorial-base"
import { TECHNOLOGY_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology"
import { TECHNOLOGY_NETWORK_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-network"
import { TECHNOLOGY_CLOUD_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-cloud"
import { TECHNOLOGY_DATABASE_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-database"
import { TECHNOLOGY_SUPPORT_OCCUPATION_EDITORIAL } from "./occupation-editorial-technology-support"
import { ENGINEERING_OCCUPATION_EDITORIAL } from "./occupation-editorial-engineering"
import { INDUSTRIAL_ENGINEER_OCCUPATION_EDITORIAL } from "./occupation-editorial-industrial-engineer"
import { CHEMICAL_ENGINEER_OCCUPATION_EDITORIAL } from "./occupation-editorial-chemical-engineer"
import { ENVIRONMENTAL_ENGINEER_OCCUPATION_EDITORIAL } from "./occupation-editorial-environmental-engineer"
import { ENGINEERING_TECHNICIAN_OCCUPATION_EDITORIAL } from "./occupation-editorial-engineering-technician"

export type { CountryOccupationEditorial, OccupationEditorial } from "./occupation-editorial-base"

export const OCCUPATION_EDITORIAL = [
  ...BASE_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_NETWORK_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_CLOUD_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_DATABASE_OCCUPATION_EDITORIAL,
  ...TECHNOLOGY_SUPPORT_OCCUPATION_EDITORIAL,
  ...ENGINEERING_OCCUPATION_EDITORIAL,
  ...INDUSTRIAL_ENGINEER_OCCUPATION_EDITORIAL,
  ...CHEMICAL_ENGINEER_OCCUPATION_EDITORIAL,
  ...ENVIRONMENTAL_ENGINEER_OCCUPATION_EDITORIAL,
  ...ENGINEERING_TECHNICIAN_OCCUPATION_EDITORIAL,
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}