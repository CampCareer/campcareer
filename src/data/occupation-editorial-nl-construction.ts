import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "NL",
    editorial: {
      headline: "A structurally promising Dutch construction trade with a short MBO route, but no occupation-specific migration fast track",
      entryPathway:
        "Carpenter is mapped to ISCO-08 7115 Carpenters and joiners. KiesMBO's Timmerman pathway is a direct MBO level 2 route lasting about 1–2 years and is available through BOL or BBL work-study training.",
      registration:
        "Carpentry is not a universally regulated profession in the Netherlands. Project, site-safety and employer competence requirements still apply, but there is no single statutory carpenter register.",
      jobMarketNote:
        "UWV continues to identify construction as a strong employment direction and lists carpenter-related technical work among structurally promising occupations. Housing, renovation and energy-transition work continue to support demand.",
      scoreCaveat:
        "Dutch migration routes are not occupation-list based. The score therefore gives shortage credit from UWV labour-market evidence, while visa credit stays conservative and is not boosted simply because the occupation is in shortage.",
    },
  },
  {
    id: "electrician",
    countryCode: "NL",
    editorial: {
      headline: "A very tight Dutch installation trade with strong MBO entry routes and energy-transition demand",
      entryPathway:
        "Electrician is mapped to ISCO-08 7411 Building and related electricians. KiesMBO provides direct MBO electrical-installation pathways, including level 2 and level 3 routes with BBL options.",
      registration:
        "General electrician is not one universally regulated profession, although work must meet Dutch electrical safety standards and employers can require recognised competence or scheme certification for specific installations.",
      jobMarketNote:
        "UWV reports very favourable prospects for electricians and installation technicians, driven by persistent technical labour shortages, grid expansion and building electrification.",
      scoreCaveat:
        "Strong labour-market evidence receives high shortage credit, but there is no Dutch electrician-specific residence route. IND Highly Skilled Migrant and paid-employment rules still depend on employer, salary and permit conditions.",
    },
  },
  {
    id: "plumber",
    countryCode: "NL",
    editorial: {
      headline: "A very tight Dutch installation occupation with a direct MBO route and scope-specific gas-appliance certification rules",
      entryPathway:
        "Plumber is mapped to ISCO-08 7126 Plumbers and pipe fitters. KiesMBO's Monteur werktuigkundige installaties is a direct MBO level 2 route covering gas, water, heating, ventilation and sanitary installation work.",
      registration:
        "Plumber is not a universally registered profession. However, work on gas-combustion appliances is legally restricted to certified installation companies under the Dutch CO-stelsel; this is a task and company scope requirement rather than a universal plumber register.",
      jobMarketNote:
        "UWV's first-quarter 2026 labour-market indicator still identifies plumbers among occupations where shortages are particularly acute, and installation work remains a key shortage area.",
      scoreCaveat:
        "The score recognises strong shortage evidence but keeps immigration credit low because the Netherlands does not offer a plumber-specific work or residence fast track.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "NL",
    editorial: {
      headline: "A practical finishing trade with a short MBO route and good current Dutch job prospects",
      entryPathway:
        "Wall and Floor Tiler is mapped to ISCO-08 7122 Floor layers and tile setters. KiesMBO's Tegelzetter route is MBO level 2, normally 1–2 years, with both BOL and BBL pathways.",
      registration:
        "Tile setting is not a universally regulated profession in the Netherlands. Waterproofing, construction quality and site requirements can apply to individual projects without creating a national occupational licence.",
      jobMarketNote:
        "UWV identifies finishing and floor-related building work as part of the structurally promising technical labour market, while KiesMBO reports strong vacancy prospects for the direct tiling qualification.",
      scoreCaveat:
        "Shortage credit is deliberately below the most acute electrical, plumbing and HVAC occupations because the reviewed UWV evidence is broader than one national tiler-only shortage series.",
    },
  },
  {
    id: "welder",
    countryCode: "NL",
    editorial: {
      headline: "A high-demand metal trade with short MBO production routes and employer-specific welding certification requirements",
      entryPathway:
        "Welder is mapped to ISCO-08 7212 Welders and flame cutters. KiesMBO's Medewerker productietechniek level 2 route covers welding, metal fabrication and related production techniques in 1–2 years.",
      registration:
        "Welder is not a universally regulated profession. Employers and projects may require process-specific welder qualifications, procedure approvals or safety certificates depending on material and application.",
      jobMarketNote:
        "UWV identifies welders among promising industrial occupations and reports persistent shortages across technical and industrial work.",
      scoreCaveat:
        "The salary input uses the transparent KiesMBO production-technology starting-pay proxy because the reviewed official layer does not expose a clean national six-digit welder median.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "NL",
    editorial: {
      headline: "A newly highlighted 2026 promising Dutch construction trade with direct MBO entry",
      entryPathway:
        "Bricklayer is mapped to ISCO-08 7112 Bricklayers and related workers. KiesMBO's Metselaar route is a direct MBO level 2 programme lasting about 1–2 years, with progression to allround level 3.",
      registration:
        "Bricklaying is not a universally regulated profession in the Netherlands. Construction quality, site safety and employer competence rules apply without a single statutory bricklayer register.",
      jobMarketNote:
        "UWV explicitly added bricklayers and jointers to the national promising-occupations list in 2026 as new construction, grid expansion and infrastructure maintenance increased demand.",
      scoreCaveat:
        "The direct 2026 UWV occupation signal supports high shortage credit. Immigration credit remains conservative because shortage status itself does not create a special Dutch work-permit category.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "NL",
    editorial: {
      headline: "A very high-demand cooling and heat-pump trade with mandatory refrigerant certification for core regulated work",
      entryPathway:
        "HVAC Technician is mapped to ISCO-08 7127 Air conditioning and refrigeration mechanics. KiesMBO provides level 2 Airco/warmtepompmonteur and Monteur koude- en klimaatsystemen routes with strong current employment prospects.",
      registration:
        "For work within the refrigerant scope, personal certification is legally required under the revised F-gas regime implemented through BRL 200. From 29 March 2026 the new certification system applies to relevant stationary cooling, air-conditioning and heat-pump work.",
      jobMarketNote:
        "UWV identifies heat-pump, cooling and installation technicians among occupations with very favourable prospects, reflecting energy-transition investment and persistent installation-sector shortages.",
      scoreCaveat:
        "The occupation receives strong shortage credit but a reduced entry-burden score because regulated refrigerant work requires personal certification. No occupation-specific migration fast track is assumed.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "NL",
    editorial: {
      headline: "A high-demand Dutch construction-management profession with strong project and built-environment pathways",
      entryPathway:
        "Construction Manager is mapped to ISCO-08 1323 Construction managers. Entry can progress through MBO level 4 Middenkaderfunctionaris Bouw, higher professional Built Environment study, and substantial project-site experience.",
      registration:
        "Construction management is not a universally regulated profession in the Netherlands. Individual projects can require safety, quality, procurement or technical credentials, but there is no general statutory construction-manager register.",
      jobMarketNote:
        "UWV reports strong demand for higher-level construction professionals, project leaders and production leaders, with technical and construction shortages expected to remain significant.",
      scoreCaveat:
        "The salary input uses a transparent Studiekeuze123 Built Environment graduate-pay proxy rather than presenting it as an occupation-wide construction-manager median. Highly Skilled Migrant access remains salary- and sponsor-dependent.",
    },
  },
]
