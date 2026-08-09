import { OCCUPATION_EDITORIAL as BASE_OCCUPATION_EDITORIAL } from "./occupation-editorial-base"
import type { CountryOccupationEditorial, OccupationEditorial as OccupationEditorialType } from "./occupation-editorial-base"
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
import { PROJECT_MANAGER_OCCUPATION_EDITORIAL } from "./occupation-editorial-project-manager"
import { EARLY_CHILDHOOD_TEACHER_OCCUPATION_EDITORIAL } from "./occupation-editorial-early-childhood-teacher"
import { PRIMARY_SCHOOL_TEACHER_OCCUPATION_EDITORIAL } from "./occupation-editorial-primary-school-teacher"
import { SECONDARY_SCHOOL_TEACHER_OCCUPATION_EDITORIAL } from "./occupation-editorial-secondary-school-teacher"
import { SPECIAL_EDUCATION_TEACHER_OCCUPATION_EDITORIAL } from "./occupation-editorial-special-education-teacher"
import { SOCIAL_WORKER_OCCUPATION_EDITORIAL } from "./occupation-editorial-social-worker"
import { YOUTH_WORKER_OCCUPATION_EDITORIAL } from "./occupation-editorial-youth-worker"
import { COMMUNITY_WORKER_OCCUPATION_EDITORIAL } from "./occupation-editorial-community-worker"
import { COUNSELLOR_OCCUPATION_EDITORIAL } from "./occupation-editorial-counsellor"
import { ENVIRONMENTAL_SCIENTIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-environmental-scientist"
import { AGRONOMIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-agronomist"
import { FARM_MANAGER_OCCUPATION_EDITORIAL } from "./occupation-editorial-farm-manager"
import { FORESTRY_TECHNICIAN_OCCUPATION_EDITORIAL } from "./occupation-editorial-forestry-technician"
import { FOOD_TECHNOLOGIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-food-technologist"
import { SUSTAINABILITY_SPECIALIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-sustainability-specialist"
import { HORTICULTURIST_OCCUPATION_EDITORIAL } from "./occupation-editorial-horticulturist"
import { ANIMAL_SCIENCE_TECHNICIAN_OCCUPATION_EDITORIAL } from "./occupation-editorial-animal-science-technician"
import { GRAPHIC_DESIGNER_OCCUPATION_EDITORIAL } from "./occupation-editorial-graphic-designer"
import { UX_DESIGNER_OCCUPATION_EDITORIAL } from "./occupation-editorial-ux-designer"
import { MULTIMEDIA_DESIGNER_OCCUPATION_EDITORIAL } from "./occupation-editorial-multimedia-designer"
import { ANIMATOR_OCCUPATION_EDITORIAL } from "./occupation-editorial-animator"
import { INTERIOR_DESIGNER_OCCUPATION_EDITORIAL } from "./occupation-editorial-interior-designer"
import { FILM_EDITOR_OCCUPATION_EDITORIAL } from "./occupation-editorial-film-editor"
import { ARCHITECT_OCCUPATION_EDITORIAL } from "./occupation-editorial-architect"
import { WEB_DESIGNER_OCCUPATION_EDITORIAL } from "./occupation-editorial-web-designer"
import { CHEF_OCCUPATION_EDITORIAL } from "./occupation-editorial-chef"
import { COOK_OCCUPATION_EDITORIAL } from "./occupation-editorial-cook"
import { HOTEL_MANAGER_OCCUPATION_EDITORIAL } from "./occupation-editorial-hotel-manager"
import { RESTAURANT_MANAGER_OCCUPATION_EDITORIAL } from "./occupation-editorial-restaurant-manager"
import { BAKER_OCCUPATION_EDITORIAL } from "./occupation-editorial-baker"
import { TOURISM_MANAGER_OCCUPATION_EDITORIAL } from "./occupation-editorial-tourism-manager"
import { EVENT_PLANNER_OCCUPATION_EDITORIAL } from "./occupation-editorial-event-planner"
import { HOSPITALITY_SUPERVISOR_OCCUPATION_EDITORIAL } from "./occupation-editorial-hospitality-supervisor"
import { TRUCK_DRIVER_OCCUPATION_EDITORIAL } from "./occupation-editorial-truck-driver"
import { LOGISTICS_COORDINATOR_OCCUPATION_EDITORIAL } from "./occupation-editorial-logistics-coordinator"
import { AIRCRAFT_MAINTENANCE_TECHNICIAN_OCCUPATION_EDITORIAL } from "./occupation-editorial-aircraft-maintenance-technician"
import { COMMERCIAL_PILOT_OCCUPATION_EDITORIAL } from "./occupation-editorial-commercial-pilot"
import { MARINE_ENGINEER_OCCUPATION_EDITORIAL } from "./occupation-editorial-marine-engineer"
import { DECK_OFFICER_OCCUPATION_EDITORIAL } from "./occupation-editorial-deck-officer"
import { WAREHOUSE_MANAGER_OCCUPATION_EDITORIAL } from "./occupation-editorial-warehouse-manager"
import { AUTOMOTIVE_SERVICE_TECHNICIAN_OCCUPATION_EDITORIAL } from "./occupation-editorial-automotive-service-technician"
import { CARPENTER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-carpenter"

export type { CountryOccupationEditorial, OccupationEditorial } from "./occupation-editorial-base"

type CountryEditorialOverride = {
  id: string
  countryCode: string
  editorial: CountryOccupationEditorial
}

const RAW_OCCUPATION_EDITORIAL: readonly OccupationEditorialType[] = [
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
  ...PROJECT_MANAGER_OCCUPATION_EDITORIAL,
  ...EARLY_CHILDHOOD_TEACHER_OCCUPATION_EDITORIAL,
  ...PRIMARY_SCHOOL_TEACHER_OCCUPATION_EDITORIAL,
  ...SECONDARY_SCHOOL_TEACHER_OCCUPATION_EDITORIAL,
  ...SPECIAL_EDUCATION_TEACHER_OCCUPATION_EDITORIAL,
  ...SOCIAL_WORKER_OCCUPATION_EDITORIAL,
  ...YOUTH_WORKER_OCCUPATION_EDITORIAL,
  ...COMMUNITY_WORKER_OCCUPATION_EDITORIAL,
  ...COUNSELLOR_OCCUPATION_EDITORIAL,
  ...ENVIRONMENTAL_SCIENTIST_OCCUPATION_EDITORIAL,
  ...AGRONOMIST_OCCUPATION_EDITORIAL,
  ...FARM_MANAGER_OCCUPATION_EDITORIAL,
  ...FORESTRY_TECHNICIAN_OCCUPATION_EDITORIAL,
  ...FOOD_TECHNOLOGIST_OCCUPATION_EDITORIAL,
  ...SUSTAINABILITY_SPECIALIST_OCCUPATION_EDITORIAL,
  ...HORTICULTURIST_OCCUPATION_EDITORIAL,
  ...ANIMAL_SCIENCE_TECHNICIAN_OCCUPATION_EDITORIAL,
  ...GRAPHIC_DESIGNER_OCCUPATION_EDITORIAL,
  ...UX_DESIGNER_OCCUPATION_EDITORIAL,
  ...MULTIMEDIA_DESIGNER_OCCUPATION_EDITORIAL,
  ...ANIMATOR_OCCUPATION_EDITORIAL,
  ...INTERIOR_DESIGNER_OCCUPATION_EDITORIAL,
  ...FILM_EDITOR_OCCUPATION_EDITORIAL,
  ...ARCHITECT_OCCUPATION_EDITORIAL,
  ...WEB_DESIGNER_OCCUPATION_EDITORIAL,
  ...CHEF_OCCUPATION_EDITORIAL,
  ...COOK_OCCUPATION_EDITORIAL,
  ...HOTEL_MANAGER_OCCUPATION_EDITORIAL,
  ...RESTAURANT_MANAGER_OCCUPATION_EDITORIAL,
  ...BAKER_OCCUPATION_EDITORIAL,
  ...TOURISM_MANAGER_OCCUPATION_EDITORIAL,
  ...EVENT_PLANNER_OCCUPATION_EDITORIAL,
  ...HOSPITALITY_SUPERVISOR_OCCUPATION_EDITORIAL,
  ...TRUCK_DRIVER_OCCUPATION_EDITORIAL,
  ...LOGISTICS_COORDINATOR_OCCUPATION_EDITORIAL,
  ...AIRCRAFT_MAINTENANCE_TECHNICIAN_OCCUPATION_EDITORIAL,
  ...COMMERCIAL_PILOT_OCCUPATION_EDITORIAL,
  ...MARINE_ENGINEER_OCCUPATION_EDITORIAL,
  ...DECK_OFFICER_OCCUPATION_EDITORIAL,
  ...WAREHOUSE_MANAGER_OCCUPATION_EDITORIAL,
  ...AUTOMOTIVE_SERVICE_TECHNICIAN_OCCUPATION_EDITORIAL,
]

const COUNTRY_EDITORIAL_OVERRIDES: readonly CountryEditorialOverride[] = [
  CARPENTER_CA_OCCUPATION_EDITORIAL,
]

export const OCCUPATION_EDITORIAL: readonly OccupationEditorialType[] = RAW_OCCUPATION_EDITORIAL.map((item) => {
  let countries = item.countries

  for (const override of COUNTRY_EDITORIAL_OVERRIDES) {
    if (override.id === item.id) {
      countries = { ...countries, [override.countryCode]: override.editorial }
    }
  }

  return countries === item.countries ? item : { ...item, countries }
})

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id) ?? null
}
