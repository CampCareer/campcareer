import type { CountryOccupationEditorial } from "./occupation-editorial-base"
import { ELECTRICIAN_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-electrician"
import { PLUMBER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-plumber"
import { WALL_FLOOR_TILER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-wall-floor-tiler"
import { WELDER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-welder"
import { BRICKLAYER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-bricklayer"
import { HVAC_TECHNICIAN_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-hvac-technician"
import { CONSTRUCTION_MANAGER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-construction-manager"
import { REGISTERED_NURSE_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-registered-nurse"
import { MIDWIFE_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-midwife"
import { CARE_WORKER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-care-worker"
import { PHYSIOTHERAPIST_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-physiotherapist"
import { MEDICAL_LABORATORY_TECHNICIAN_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-medical-laboratory-technician"
import { RADIOGRAPHER_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-radiographer"
import { PHARMACIST_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-pharmacist"
import { OCCUPATIONAL_THERAPIST_CA_OCCUPATION_EDITORIAL } from "./occupation-editorial-ca-occupational-therapist"
import { CANADA_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES } from "./occupation-editorial-ca-technology"
import { CANADA_ENGINEERING_MANUFACTURING_OCCUPATION_EDITORIAL_OVERRIDES } from "./occupation-editorial-ca-engineering-manufacturing"
import { CANADA_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES } from "./occupation-editorial-ca-business"
import { CANADA_EDUCATION_SOCIAL_OCCUPATION_EDITORIAL_OVERRIDES } from "./occupation-editorial-ca-education-social"
import { CANADA_ENVIRONMENT_AGRICULTURE_OCCUPATION_EDITORIAL_OVERRIDES } from "./occupation-editorial-ca-environment-agriculture"
import { CANADA_DESIGN_CREATIVE_OCCUPATION_EDITORIAL_OVERRIDES } from "./occupation-editorial-ca-design-creative"

export type CanadaOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CARPENTER_CA_OCCUPATION_EDITORIAL: CanadaOccupationEditorialOverride = {
  id: "carpenter",
  countryCode: "CA",
  editorial: {
    headline: "A Red Seal carpenter trade with a strong national shortage risk and a current Express Entry trade-category pathway",
    entryPathway:
      "The standard route is provincial or territorial apprenticeship training leading to trade certification. NOC 72310 includes apprentices, and qualified carpenters can pursue the Red Seal endorsement after meeting the applicable jurisdictional certification requirements.",
    registration:
      "Trade certification is administered by provinces and territories rather than one national regulator. Carpenter certification is compulsory in Quebec and available voluntarily elsewhere; the Red Seal endorsement supports interprovincial recognition for qualified tradespeople.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 32.12 per hour and COPS reports 132,000 workers in 2023. COPS classifies Carpenters as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 72310 national wage and COPS employment/shortage evidence. Current Job Bank posting counts are point-in-time rather than a three-month vacancy series, so vacancy intensity and trend are not scored, and the current Canada course catalogue has no verified carpenter programme link.",
  },
}

export const CANADA_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaOccupationEditorialOverride[] = [
  CARPENTER_CA_OCCUPATION_EDITORIAL,
  ELECTRICIAN_CA_OCCUPATION_EDITORIAL,
  PLUMBER_CA_OCCUPATION_EDITORIAL,
  WALL_FLOOR_TILER_CA_OCCUPATION_EDITORIAL,
  WELDER_CA_OCCUPATION_EDITORIAL,
  BRICKLAYER_CA_OCCUPATION_EDITORIAL,
  HVAC_TECHNICIAN_CA_OCCUPATION_EDITORIAL,
  CONSTRUCTION_MANAGER_CA_OCCUPATION_EDITORIAL,
  REGISTERED_NURSE_CA_OCCUPATION_EDITORIAL,
  MIDWIFE_CA_OCCUPATION_EDITORIAL,
  CARE_WORKER_CA_OCCUPATION_EDITORIAL,
  PHYSIOTHERAPIST_CA_OCCUPATION_EDITORIAL,
  MEDICAL_LABORATORY_TECHNICIAN_CA_OCCUPATION_EDITORIAL,
  RADIOGRAPHER_CA_OCCUPATION_EDITORIAL,
  PHARMACIST_CA_OCCUPATION_EDITORIAL,
  OCCUPATIONAL_THERAPIST_CA_OCCUPATION_EDITORIAL,
  ...CANADA_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES,
  ...CANADA_ENGINEERING_MANUFACTURING_OCCUPATION_EDITORIAL_OVERRIDES,
  ...CANADA_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES,
  ...CANADA_EDUCATION_SOCIAL_OCCUPATION_EDITORIAL_OVERRIDES,
  ...CANADA_ENVIRONMENT_AGRICULTURE_OCCUPATION_EDITORIAL_OVERRIDES,
  ...CANADA_DESIGN_CREATIVE_OCCUPATION_EDITORIAL_OVERRIDES,
]
