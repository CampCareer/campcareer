import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "NZ",
    editorial: {
      headline: "A Level 4 trade with a direct apprenticeship route, standard AEWV access and conditional LBP licensing for restricted building work",
      entryPathway:
        "Carpenter maps to ANZSCO 331212. Tahatū lists a 3–4 year apprenticeship route through carpentry and joinery training, typically leading to the New Zealand Certificate in Carpentry (Level 4).",
      registration:
        "Carpentry is not universally licensed for every task, but restricted building work on homes must be carried out or supervised by an appropriately licensed building practitioner. The LBP Carpentry class is therefore an important scope-specific credential rather than a universal occupational register.",
      jobMarketNote:
        "Carpenter is not on the current Green List as at 10 August 2026. It remains an ANZSCO skill-level 3 trade that can use the normal AEWV route when the job and employer meet current requirements.",
      scoreCaveat:
        "No shortage points are inferred from general construction demand. Salary uses the midpoint of Tahatū's current most-common pay range, and visa credit reflects standard AEWV access rather than a fast-track residence pathway.",
    },
  },
  {
    id: "electrician",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Green List Tier 2 trade with strong pay and a direct Work to Residence pathway",
      entryPathway:
        "Electrician maps to ANZSCO 341111 Electrician (General). The standard local route is an electrical apprenticeship, while overseas-trained electricians must satisfy the Electrical Workers Registration Board's experience and assessment pathway.",
      registration:
        "Prescribed electrical work requires registration and a current practising licence from the Electrical Workers Registration Board. Overseas-trained electricians must first obtain the appropriate registration assessment and usually work under a Limited Certificate before a full practising licence is issued.",
      jobMarketNote:
        "Electrician (General) is on the current Green List Tier 2 Work to Residence pathway. Green List eligibility requires New Zealand electrician registration or an accepted Limited Certificate, excluding a Trainee Limited Certificate.",
      scoreCaveat:
        "Green List Tier 2 status provides direct policy evidence of demand and residence access, but vacancy, employer-diversity and growth components remain zero until a recurring comparable New Zealand series is ingested.",
    },
  },
  {
    id: "plumber",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Green List Tier 2 trade with compulsory licensing and a Work to Residence pathway",
      entryPathway:
        "Plumber maps to ANZSCO 334111 Plumber (General). New Zealand apprenticeship pathways typically lead to a Level 4 plumbing qualification, while overseas-qualified applicants use the Plumbers, Gasfitters and Drainlayers Board registration pathway.",
      registration:
        "Sanitary plumbing is restricted work. Practitioners must be registered and hold a current licence with the Plumbers, Gasfitters and Drainlayers Board; carrying out restricted plumbing work without the required New Zealand licence is unlawful.",
      jobMarketNote:
        "Plumber (General) is on Green List Tier 2. The residence pathway requires an accepted certifying, tradesman or journeyman plumber registration, with limited recognition of provisional licensing time under the current rules.",
      scoreCaveat:
        "The score treats Green List Tier 2 as direct shortage and residence evidence, while keeping posting-driven vacancy and growth dimensions at zero until recurring official series are available.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "NZ",
    editorial: {
      headline: "A Level 4 tiling trade with an apprenticeship pathway and standard AEWV access, but no current Green List fast track",
      entryPathway:
        "Wall and Floor Tiler maps to ANZSCO 333411. Tahatū identifies apprenticeship-based entry and the New Zealand Certificate in Trowel Trades (Level 4) as the main training route.",
      registration:
        "Wall and floor tiling is not a universally registered occupation. Some waterproofing or building-consent work can sit within regulated project scopes, but there is no national occupational licence equivalent to electrician or plumber registration.",
      jobMarketNote:
        "Wall and Floor Tiler is not on the current Green List as at 10 August 2026. It remains available through standard employer-sponsored work routes where AEWV requirements are met.",
      scoreCaveat:
        "No shortage credit is added solely because the role is a construction trade. Salary uses the midpoint of Tahatū's current most-common hourly range.",
    },
  },
  {
    id: "welder",
    countryCode: "NZ",
    editorial: {
      headline: "A Green List Tier 2 trade with a 24-month Work to Residence route for sufficiently highly paid welders",
      entryPathway:
        "Welder maps to ANZSCO 322313. Tahatū lists both entry welding training and a Level 4 Engineering Fabrication apprenticeship route covering welding and metal fabrication skills.",
      registration:
        "Welder is not a universally registered occupation. Employers may require coded-welding qualifications, procedure certifications or site-specific safety credentials depending on the work.",
      jobMarketNote:
        "Welder is on Green List Tier 2. Under the current 9 March 2026 settings, the occupation-specific Work to Residence wage threshold is 130% of the immigration median wage, or NZD 45.50 per hour.",
      scoreCaveat:
        "Green List status provides direct demand and residence evidence, but the residence wage threshold is not treated as the occupation's market salary. Salary scoring instead uses Tahatū's current most-common pay range.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "NZ",
    editorial: {
      headline: "A masonry trade with Level 4 training, standard AEWV access and conditional LBP licensing for restricted building work",
      entryPathway:
        "Bricklayer maps to ANZSCO 331111. Tahatū describes brick and blocklaying as a trade pathway, while the LBP scheme recognises the New Zealand Certificate in Trowel Trades (Level 4), Brick and Block Laying strand, among relevant qualifications.",
      registration:
        "Bricklaying is not universally licensed for every job, but restricted building work in brick or structural masonry must be carried out or supervised within the Licensed Building Practitioner scheme by someone holding the appropriate Bricklaying and Blocklaying class.",
      jobMarketNote:
        "Bricklayer is not on the current Green List as at 10 August 2026. The current pathway is standard AEWV access rather than a dedicated Green List residence fast track.",
      scoreCaveat:
        "No occupation-specific shortage points are inferred from the wider construction cycle. Salary is based on the midpoint of Tahatū's current most-common hourly range.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "NZ",
    editorial: {
      headline: "A Level 4 refrigeration and air-conditioning trade with strong pay but meaningful electrical and refrigerant licensing requirements",
      entryPathway:
        "HVAC Technician maps to ANZSCO 342111 Airconditioning and Refrigeration Mechanic. Tahatū lists a four-year Level 4 refrigeration and air-conditioning apprenticeship as a standard entry route.",
      registration:
        "Tahatū identifies both an Electrical Service Technician practising licence and a Refrigerant Handling Licence as requirements for the typical heat-pump, refrigeration and air-conditioning technician role. Electrical licensing is administered through the Electrical Workers Registration Board.",
      jobMarketNote:
        "The occupation is not on the current Green List on 10 August 2026, although it is listed for the new Skilled Migrant Category Trades and Technician pathway scheduled to take effect on 24 August 2026. That future setting is disclosed but not counted as current visa credit.",
      scoreCaveat:
        "The score uses only rules in force on 10 August 2026. The 24 August 2026 SMC change is not pre-scored, and no separate shortage points are assigned without current occupation-specific shortage evidence.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "NZ",
    editorial: {
      headline: "A high-paying Green List Tier 1 profession with Straight to Residence access and established construction-management study routes",
      entryPathway:
        "Construction Manager maps to ANZSCO 133111 Construction Project Manager. Tahatū lists construction management as a recognised career path, and the Green List accepts specified construction, engineering and related qualifications for the Tier 1 pathway.",
      registration:
        "Construction managers are not universally required to hold an LBP Site licence, although Site-class licensing is relevant to defined building-management and oversight scopes. Green List eligibility is driven primarily by the specified qualification or professional-recognition requirements.",
      jobMarketNote:
        "Construction Project Manager is on Green List Tier 1, providing a Straight to Residence pathway when the role and applicant meet the current Green List requirements.",
      scoreCaveat:
        "Tier 1 status receives the strongest visa and demand credit. Salary uses the midpoint of Tahatū's current most-common construction-manager pay range; recurring vacancy and growth components remain zero pending comparable official series.",
    },
  },
]
