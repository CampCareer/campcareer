import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzEnvironmentOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzEnvironmentOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "NZ",
    editorial: {
      headline: "A Green List Tier 1 environmental-science route anchored to ANZSCO 234313 Environmental Research Scientist",
      entryPathway:
        "The canonical profile uses ANZSCO 234313 Environmental Research Scientist. Current Green List eligibility requires an NZQCF Level 8 or higher qualification in environmental studies, environmental management or environmental engineering, with the specified credit and underpinning-degree conditions.",
      registration:
        "Environmental Scientist is not a universally statutorily registered profession in New Zealand. Professional certification such as Certified Environmental Practitioner may be useful, but it is not the Green List registration gate for this occupation.",
      jobMarketNote:
        "Environmental Research Scientist 234313 is on the current Green List Tier 1 and can support Straight to Residence when the qualification and other immigration requirements are met.",
      scoreCaveat:
        "Tier 1 supplies the policy-demand and visa signal. Salary uses Tahatū's current most-common Environmental Scientist range; posting-derived demand and growth components remain zero.",
    },
  },
  {
    id: "agronomist",
    countryCode: "NZ",
    editorial: {
      headline: "An agricultural-science occupation kept on the ANZSCO 1.3 Agronomist specialisation without borrowing later Australia-only codes",
      entryPathway:
        "For the New Zealand ANZSCO 1.3 layer, Agronomist is represented through 234112 Agricultural Scientist with Agronomist as a specialisation. Tahatū's Soil and Plant Scientist pathway provides the closest current New Zealand study and salary evidence.",
      registration:
        "Agronomy is not a universally statutorily registered profession in New Zealand. Employers may value relevant science, agriculture, soil or crop qualifications and practical sector experience.",
      jobMarketNote:
        "Agronomist is not listed on the current Green List. The later ANZSCO 2021 code 234115 is an Australian update and is not promoted into the New Zealand ANZSCO 1.3 profile.",
      scoreCaveat:
        "No Green List or shortage credit is assigned. Salary uses Tahatū Soil and Plant Scientist as a transparent agronomy-aligned proxy.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "NZ",
    editorial: {
      headline: "A broad farm-management career that deliberately does not inherit the Dairy Cattle Farmer Tier 2 pathway",
      entryPathway:
        "Tahatū describes Farmer and Farm Manager as an experience-led occupation with agriculture, agribusiness and management study useful rather than one universal qualification. The canonical profile covers broader livestock farm management rather than only dairy.",
      registration:
        "There is no single statutory occupational register for generic Farm Managers. Driver licensing and activity-specific animal, chemical, machinery, food-safety or land-management requirements can apply.",
      jobMarketNote:
        "The current Green List Tier 2 includes ANZSCO 121313 Dairy Cattle Farmer, explicitly including Dairy Cattle Farm Manager and related dairy titles. That dairy-only pathway is not applied to this broader Farm Manager profile.",
      scoreCaveat:
        "No Green List shortage or visa premium is borrowed from the dairy subset. Salary uses Tahatū's current Farmer and Farm Manager range and immigration classification is kept conservative for a generic role.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "NZ",
    editorial: {
      headline: "A direct ANZSCO 1.3 Life Science Technician specialisation for practical forest and conservation technical work",
      entryPathway:
        "Forestry Technician is a named specialisation under ANZSCO 1.3 occupation 311413 Life Science Technician. Tahatū's Forest and Conservation Technician route covers field sampling, forest monitoring, conservation support and technical data work.",
      registration:
        "There is no universal statutory professional registration for Forestry Technicians. Particular field, machinery, chemical-use and health-and-safety tasks can require employer or activity-specific competency evidence.",
      jobMarketNote:
        "The reviewed occupation is not on the current Green List. Professional Forest Scientist roles are kept separate from this technician scope.",
      scoreCaveat:
        "No shortage points are inferred from wider forestry-sector demand. Salary and entry evidence use the direct Tahatū Forest and Conservation Technician profile.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "NZ",
    editorial: {
      headline: "A Green List Tier 1 food-science profession with an exact ANZSCO 234212 mapping",
      entryPathway:
        "Food Technologist maps directly to ANZSCO 234212. Current Green List requirements accept the specified Bachelor of Food Technology with Honours routes or qualifying NZQCF Level 7 or higher study in nutrition, food science, food technology or food engineering.",
      registration:
        "Food Technologist is not a universally statutorily registered profession. Professional membership can be useful, while food businesses and particular roles remain subject to food-safety and quality regulation.",
      jobMarketNote:
        "ANZSCO 234212 Food Technologist is on the current Green List Tier 1 and can support Straight to Residence when the listed qualification and other immigration requirements are satisfied.",
      scoreCaveat:
        "Tier 1 supplies the policy-demand and visa signal. Salary uses Tahatū's current Food Scientist and Technologist range without adding posting-derived shortage points.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "NZ",
    editorial: {
      headline: "A recognised New Zealand sustainability career with no forced ANZSCO 1.3 code and no borrowed Chief Sustainability Officer treatment",
      entryPathway:
        "Tahatū describes Sustainability Specialist as a tertiary-entry occupation in environmental studies, engineering, building and construction or a related field, with Carbon and Energy Professionals New Zealand credentials potentially useful for some roles.",
      registration:
        "Sustainability Specialist is not a universally statutorily registered profession. CEP certification may be useful or requested for particular roles but is not a universal legal licence.",
      jobMarketNote:
        "The canonical specialist role has no exact ANZSCO 1.3 occupation. The 2026 NOL includes Chief Sustainability Officer 132418 for AEWV classification, but that senior executive occupation is not treated as equivalent to a general Sustainability Specialist.",
      scoreCaveat:
        "Classification ambiguity receives conservative visa credit. Salary uses Tahatū's direct Sustainability Specialist range and no Green List shortage credit is assigned.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "NZ",
    editorial: {
      headline: "A broad horticulture career kept classification-neutral rather than forcing one nursery, crop or gardening occupation",
      entryPathway:
        "New Zealand horticulture spans nursery growing, crop production, gardens and related production work. Tahatū Nursery Grower is used as the closest conservative entry and pay proxy because the canonical Horticulturist scope is broader than one ANZSCO 1.3 occupation.",
      registration:
        "There is no universal statutory registration for Horticulturists. Chemical handling, machinery operation and other specialised activities can require relevant certificates, endorsements or employer controls.",
      jobMarketNote:
        "No generic Horticulturist occupation is listed on the current Green List. Nursery, crop, viticulture and gardening roles are kept distinct rather than collapsed into a fabricated single migration code.",
      scoreCaveat:
        "No shortage credit is assigned and visa treatment is conservative because a specific job must be classified by its duties. Salary transparently uses Tahatū Nursery Grower as a proxy.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "NZ",
    editorial: {
      headline: "An ANZSCO 1.3 Agricultural Technician scope focused on animal research, breeding and husbandry support",
      entryPathway:
        "The New Zealand ANZSCO 1.3 layer uses 311111 Agricultural Technician, whose specialisations include Artificial Insemination Technical Officer, Dairy Technician and Herd Tester. Tahatū Agricultural Technician is used for the direct technical entry and salary evidence.",
      registration:
        "There is no universal statutory registration for the generic Animal Science Technician scope. Particular animal procedures, biosecurity activities or employer settings can impose additional competency requirements.",
      jobMarketNote:
        "The current Green List does not list this canonical technician role. The later Australia-only ANZSCO update created 311113 Animal Husbandry Technician, but that code is not forced into the New Zealand ANZSCO 1.3 layer.",
      scoreCaveat:
        "No Green List shortage credit is assigned. Salary uses Tahatū Agricultural Technician as the closest direct New Zealand technical proxy.",
    },
  },
] as const
