import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level environment profession mapped to SOC 2152/04 with standard Skilled Worker access",
      entryPathway:
        "Environmental Scientist is constrained to SOC 2152/04 Environmental scientists. Relevant UK routes include environmental-science degrees and Skills England Level 6 environmental-practice pathways covering monitoring, assessment, regulation and environmental management.",
      registration:
        "Environmental Scientist is not a statutorily protected UK title. Employers may value professional membership or chartered environmental/scientist status, while individual projects can require specialist competence.",
      jobMarketNote:
        "Environmental scientists sit within SOC 2152 Environment professionals. Current official evidence supports the occupation's role in environmental delivery but does not establish a direct occupation-specific UK shortage for v1 scoring.",
      scoreCaveat:
        "No shortage points are inferred from general climate or green-transition demand. SOC 2152 is an RQF 6+ occupation on the standard Skilled Worker route, so visa credit is partial rather than targeted.",
    },
  },
  {
    id: "agronomist",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level agricultural-science profession within SOC 2112/01, with time-limited Immigration Salary List access",
      entryPathway:
        "Agronomist is constrained to SOC 2112/01 Agricultural scientists. Skills England's Agronomy and Precision Farming Adviser occupation is Level 6 and maps directly to this sub-unit; agriculture, crop-science and soil-science degrees are also common routes.",
      registration:
        "Agronomy is not one statutorily licensed profession. Employers may require or value BASIS, FACTS or other sector qualifications for particular advisory activities, but these are not a universal legal registration requirement for the canonical occupation.",
      jobMarketNote:
        "SOC 2112 Biological scientists is currently on the Immigration Salary List for all jobs until 31 December 2026. That immigration treatment is kept separate from shortage scoring because the reviewed evidence does not isolate a current agronomist-specific shortage series.",
      scoreCaveat:
        "Agronomist receives targeted visa credit from current ISL membership but zero shortage points in UK v1. Salary uses the current Home Office SOC 2112 standard going rate rather than a broader agriculture-sector average.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "UK",
    editorial: {
      headline: "An agriculture-management occupation with accessible work-based progression but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Farm Manager maps to SOC 1211 Managers and proprietors in agriculture and horticulture. Entry can progress through practical farming experience, agriculture degrees and Level 4 assistant-farm-manager routes into operational and business responsibility.",
      registration:
        "There is no single statutory professional register for farm managers. Individual activities can require licences, certificates or compliance with animal-health, pesticide, machinery, environmental and food-safety rules.",
      jobMarketNote:
        "SOC 1211 is an RQF 3-5 occupation in the additional Skilled Worker table but is not on the current Temporary Shortage List. Current v1 evidence does not support an occupation-specific shortage score.",
      scoreCaveat:
        "Visa credit is low because new overseas sponsorship is generally unavailable for this non-TSL RQF 3-5 occupation under the post-22 July 2025 rules, while qualifying transitional cases can remain. No broad farming labour pressure is converted into Farm Manager shortage points.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "UK",
    editorial: {
      headline: "A practical forestry technical occupation conservatively scoped to SOC 9112/01, which is not Skilled Worker eligible",
      entryPathway:
        "The UK does not use a clean national SOC title 'Forestry Technician'. This profile is therefore constrained to practical forest-operations work in SOC 9112/01 Forest workers, aligned with Skills England's Level 3 Forest Craftsperson route. Professional forester and forest-manager roles are kept separate in SOC 1212/03.",
      registration:
        "Forestry work has no single statutory professional register, but chainsaw, felling, machinery, pesticide and site-safety work can require specific competence, certification or permissions.",
      jobMarketNote:
        "SOC 9112 Forestry and related workers is listed among occupations ineligible for Skilled Worker sponsorship. The current evidence set does not provide a recurring technician-specific shortage series suitable for v1 scoring.",
      scoreCaveat:
        "The mapping intentionally chooses the practical technician/craftsperson side of forestry rather than inflating the role to professional Forest Manager SOC 1212. Visa credit is therefore zero, and salary uses the official Skills England route's occupation-level pay context rather than a missing UK ASHE median.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "UK",
    editorial: {
      headline: "A professional food-development and process role mapped to SOC 2129/06 with a strong technician-to-professional entry pathway",
      entryPathway:
        "Food Technologist is constrained to SOC 2129/06 Food technologists. Skills England's Food Industry Technologist pathway explicitly spans food-technician and professional food-technologist sub-units, while food science and food technology degrees provide another common route.",
      registration:
        "Food Technologist is not a statutorily protected profession. Employers and food businesses must meet food-safety, quality and regulatory obligations, and role-specific certifications can be required.",
      jobMarketNote:
        "Home Office guidance explicitly lists Food technologists under SOC 2129 Engineering professionals n.e.c. Current official evidence reviewed for UK v1 does not establish an occupation-specific shortage, so demand is not converted into shortage points.",
      scoreCaveat:
        "The score benefits from an accessible Level 3 pathway that explicitly progresses into the professional title and from the current SOC 2129 salary level. Visa credit reflects standard RQF 6+ Skilled Worker access rather than shortage-list treatment.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "UK",
    editorial: {
      headline: "A sustainability profession mapped to SOC 2152/05 with standard Skilled Worker access and a higher-level entry route",
      entryPathway:
        "Sustainability Specialist is constrained to SOC 2152/05 Sustainability officers. Skills England's Level 7 Sustainability Business Specialist route maps directly to SOC 2152 and includes sustainability-officer work, alongside relevant environmental and sustainability degrees.",
      registration:
        "There is no universal statutory licence for sustainability specialists. Employers may value professional environmental, carbon, energy or ESG credentials depending on the role and sector.",
      jobMarketNote:
        "Sustainability work is explicitly recognised within SOC 2152 Environment professionals. General net-zero and reporting activity is not treated as evidence of an occupation-wide shortage without a recurring comparable series.",
      scoreCaveat:
        "Shortage remains zero. The Level 7 pathway is substantial, so entry accessibility is lower than the Level 3 routes in this cohort; visa credit is the standard RQF 6+ Skilled Worker credit.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "UK",
    editorial: {
      headline: "A skilled horticultural occupation with accessible Level 3 entry but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Horticulturist is mapped to SOC 5112 Horticultural trades. Skills England's Level 3 Crop Technician route maps directly to SOC 5112 and covers commercial horticulture, crop production, plant health and production systems.",
      registration:
        "Horticulture is not a statutorily licensed profession. Pesticide use and other specific activities can require certificates of competence or regulatory compliance.",
      jobMarketNote:
        "SOC 5112 is an RQF 3-5 occupation but is not on the current Temporary Shortage List. Current v1 evidence does not support translating general seasonal or sector labour pressures into a Horticulturist shortage score.",
      scoreCaveat:
        "Entry accessibility is strong because of the direct Level 3 pathway, but visa credit is low under the post-22 July 2025 Skilled Worker rules for non-TSL RQF 3-5 occupations.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "UK",
    editorial: {
      headline: "A laboratory animal-science technician scope within SOC 3111, with current temporary migration access but no positive shortage finding",
      entryPathway:
        "Animal Science Technician is conservatively scoped to laboratory animal-technologist work within SOC 3111 Laboratory technicians rather than general animal-care SOC 6129. Skills England's approved Level 3 Animal Technologist standard covers research-animal husbandry, welfare, data, scientific procedures and laboratory practice.",
      registration:
        "The occupation is not universally registered, but work involving regulated procedures on protected animals under the Animals (Scientific Procedures) Act 1986 can require Home Office licensing. The Level 3 pathway can support progression toward the relevant Personal Licence.",
      jobMarketNote:
        "SOC 3111 remains on the current Temporary Shortage List and is also on the Immigration Salary List for jobs requiring at least three years' related experience, both with 31 December 2026 removal/CoS conditions. However, the MAC's July 2026 Stage 2 review recommended no future TSL access because evidence of historical and future shortage was limited.",
      scoreCaveat:
        "Current targeted immigration access receives visa credit, but shortage remains 0/20 because the final MAC shortage test was negative. Entry burden is reduced because regulated scientific procedures can require a Home Office licence.",
    },
  },
]
