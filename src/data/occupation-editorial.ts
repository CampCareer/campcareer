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
import { ACCOUNTANT_OCCUPATION_EDITORIAL } from "./occupation-editorial-accountant"
import { FINANCIAL_ANALYST_OCCUPATION_EDITORIAL } from "./occupation-editorial-financial-analyst"
import { BUSINESS_ANALYST_OCCUPATION_EDITORIAL } from "./occupation-editorial-business-analyst"
import { SUPPLY_CHAIN_ANALYST_OCCUPATION_EDITORIAL } from "./occupation-editorial-supply-chain-analyst"
import { HUMAN_RESOURCES_SPECIALIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-human-resources-specialist"
import { MARKETING_SPECIALIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-marketing-specialist"
import { AUDITOR_OCCUPATION_EDITORIAL } from "./occupation-editorial-auditor"

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
  ...ACCOUNTANT_OCCUPATION_EDITORIAL,
  ...FINANCIAL_ANALYST_OCCUPATION_EDITORIAL,
  ...BUSINESS_ANALYST_OCCUPATION_EDITORIAL,
  ...SUPPLY_CHAIN_ANALYST_OCCUPATION_EDITORIAL,
  ...HUMAN_RESOURCES_SPECIALIST_OCCUPATION_EDITORIAL,
  ...MARKETING_SPECIALIST_OCCUPATION_EDITORIAL,
  ...AUDITOR_OCCUPATION_EDITORIAL,
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}
