import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "UK",
    editorial: {
      headline: "A skilled culinary trade in SOC 5434 with strong work-based entry routes but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Chef maps to SOC 5434 Chefs. Skills England provides approved routes from Level 2 Commis Chef through Level 3 Chef de Partie and Level 4 Senior Culinary Chef, supporting progression from junior kitchen work into section and senior chef responsibility.",
      registration:
        "Chef is not a statutorily registered UK profession. Food businesses and workers must comply with food-safety, allergen, hygiene and health-and-safety requirements, but there is no universal individual chef licence.",
      jobMarketNote:
        "SOC 5434 remains an RQF 3-5 occupation in the additional Skilled Worker table but is not on the current Temporary Shortage List. The current evidence set does not justify an occupation-specific shortage score.",
      scoreCaveat:
        "Entry accessibility is strong because approved Level 2-4 culinary routes exist. Visa credit is low because new overseas sponsorship is generally restricted for non-TSL RQF 3-5 occupations, while qualifying transitional cases can remain.",
    },
  },
  {
    id: "cook",
    countryCode: "UK",
    editorial: {
      headline: "A practical cooking occupation in SOC 5435 with a direct Level 2 route but no current Skilled Worker eligibility",
      entryPathway:
        "Cook maps to SOC 5435 Cooks. Skills England's approved Level 2 Production Chef route directly covers high-volume and standardised food production in restaurants, pubs, schools, hospitals, care settings and other catering environments.",
      registration:
        "Cook is not a statutorily registered profession. Food-safety, hygiene, allergen and workplace requirements apply to the work, but there is no universal occupational licence.",
      jobMarketNote:
        "SOC 5435 is listed in the Home Office table of occupations that are not eligible for Skilled Worker, Global Business Mobility or Scale-up sponsorship. Current v1 evidence does not provide a recurring occupation-specific shortage series.",
      scoreCaveat:
        "The direct Level 2 pathway receives strong entry credit, but visa credit is zero because SOC 5435 is currently ineligible for Skilled Worker sponsorship. Salary uses the stored ONS ASHE 2025 occupation median rather than a Skilled Worker going rate.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "UK",
    editorial: {
      headline: "A hotel and accommodation management occupation in SOC 1221 with Level 4 hospitality-management progression and restricted new-overseas sponsorship",
      entryPathway:
        "Hotel Manager maps to SOC 1221 Hotel and accommodation managers and proprietors. Skills England's Level 4 Hospitality Manager standard provides closely aligned Front Office, Revenue, Housekeeping and Multi-functional Management options for hotel operations and management progression.",
      registration:
        "Hotel management is not a statutorily registered profession. Individual premises and activities can be subject to licensing, food-safety, fire-safety and alcohol rules, but these do not create one universal hotel-manager register.",
      jobMarketNote:
        "SOC 1221 is an RQF 3-5 occupation in the additional Skilled Worker table and is not on the current Temporary Shortage List. No direct hotel-manager shortage series is used for v1 scoring.",
      scoreCaveat:
        "The score reflects a Level 4 management pathway and the current Home Office going rate, but visa credit remains low under the post-22 July 2025 rules for non-TSL RQF 3-5 occupations.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "UK",
    editorial: {
      headline: "A restaurant-management occupation in SOC 1222 with an approved Level 4 food-and-beverage management route but restricted new-overseas sponsorship",
      entryPathway:
        "Restaurant Manager maps to SOC 1222 Restaurant and catering establishment managers and proprietors, centred on café and restaurant management. Skills England's Level 4 Hospitality Manager — Food & Beverage Service Management route explicitly includes SOC 1222 restaurant and catering sub-units.",
      registration:
        "Restaurant management is not a statutorily registered profession. Premises and food-service operations must meet food-safety, allergen, alcohol-licensing and health-and-safety rules where applicable.",
      jobMarketNote:
        "SOC 1222 is an RQF 3-5 occupation in the additional Skilled Worker table and is not on the current Temporary Shortage List. General hospitality recruitment pressure is not converted into an occupation-specific shortage score.",
      scoreCaveat:
        "Entry benefits from an approved Level 4 route, while salary uses the current Home Office going rate. Visa credit remains low because new overseas sponsorship is generally restricted for non-TSL RQF 3-5 occupations.",
    },
  },
  {
    id: "baker",
    countryCode: "UK",
    editorial: {
      headline: "A skilled bakery trade in SOC 5432/01 with a direct Level 2 craft-baker route but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Baker maps to SOC 5432/01 Bakers. Skills England's approved Level 2 Baker routes cover craft, plant and retail bakery work, with progression to Level 3 Lead Baker and related pastry pathways.",
      registration:
        "Baker is not a statutorily registered profession. Food businesses and workers must comply with food-safety, hygiene, allergen and workplace requirements, but there is no universal individual baker licence.",
      jobMarketNote:
        "SOC 5432 is an RQF 3-5 occupation in the additional Skilled Worker table and is not on the current Temporary Shortage List. No occupation-specific shortage score is inferred from wider food-sector labour pressure.",
      scoreCaveat:
        "The direct Level 2 route receives strong entry credit. Visa credit is low because new overseas sponsorship is generally restricted for this non-TSL RQF 3-5 occupation.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "UK",
    editorial: {
      headline: "A conservative travel-and-tourism management scope mapped to SOC 1225, with management progression but restricted new-overseas sponsorship",
      entryPathway:
        "The canonical Tourism Manager profile is conservatively scoped to SOC 1225 Travel agency managers and proprietors. Skills England's Level 3 Travel Consultant route provides an industry entry pathway, while tourism-management degrees and workplace progression can lead into management responsibility.",
      registration:
        "Tourism management is not a statutorily registered profession. Travel businesses can face organisation-level consumer-protection and licensing requirements such as ATOL depending on their activities, but these are not a universal personal licence for tourism managers.",
      jobMarketNote:
        "SOC 1225 is an RQF 3-5 occupation in the additional Skilled Worker table and is not on the current Temporary Shortage List. The role is kept narrower than general tourism and leisure services so lower-skilled travel-agent or tour-guide occupations are not rolled into the manager profile.",
      scoreCaveat:
        "Entry credit is moderate because the official Level 3 route is a feeder rather than a manager-equivalent qualification. Visa credit is low under the current non-TSL RQF 3-5 rules.",
    },
  },
  {
    id: "event-planner",
    countryCode: "UK",
    editorial: {
      headline: "An event-management occupation in SOC 3557 with approved Level 3-4 routes but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Event Planner maps to SOC 3557 Events managers and organisers. Skills England's approved Level 3 Event Assistant route supports entry into event planning, while the Level 4 Hospitality Manager — Conference & Events Management route covers higher-responsibility planning and delivery.",
      registration:
        "Event planning is not a statutorily registered profession. Specific venues and activities can require event, alcohol, entertainment, safety or local-authority permissions, but there is no universal planner register.",
      jobMarketNote:
        "SOC 3557 is an RQF 3-5 occupation in the additional Skilled Worker table and is not on the current Temporary Shortage List. No recurring event-planner-specific shortage series is used in UK v1.",
      scoreCaveat:
        "Entry benefits from approved Level 3-4 routes. Visa credit remains low because new overseas sponsorship is generally restricted for non-TSL RQF 3-5 occupations.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "UK",
    editorial: {
      headline: "A direct Level 3 hospitality-supervision occupation in SOC 9261 with no current Skilled Worker eligibility",
      entryPathway:
        "Hospitality Supervisor maps directly to SOC 9261/00 Bar and catering supervisors. Skills England's approved Level 3 Hospitality Supervisor standard covers food and beverage, bar, events, front-office and other shift-supervision functions across hospitality businesses.",
      registration:
        "Hospitality supervision is not a statutorily registered profession. Supervisors must operate within food-safety, alcohol-licensing, health-and-safety and other premises rules relevant to their function.",
      jobMarketNote:
        "SOC 9261 is listed in the Home Office table of occupations that are not eligible for Skilled Worker, Global Business Mobility or Scale-up routes. Current v1 evidence does not provide an occupation-specific shortage series that would alter that immigration constraint.",
      scoreCaveat:
        "The direct Level 3 apprenticeship receives strong entry credit, but visa credit is zero because SOC 9261 is currently ineligible for Skilled Worker sponsorship. Salary uses ONS/Skills England occupation pay evidence rather than a Skilled Worker going rate.",
    },
  },
]
