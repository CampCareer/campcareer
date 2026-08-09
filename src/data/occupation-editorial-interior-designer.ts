import type { OccupationEditorial } from "./occupation-editorial-base"

export const INTERIOR_DESIGNER_OCCUPATION_EDITORIAL = [
  {
    id: "interior-designer",
    overview:
      "Interior designers plan, design, detail and coordinate interior spaces for residential, commercial, institutional and other environments. Australia classifies this work directly as OSCA 242431 Interior Designer and keeps Interior Decorator separate under OSCA 391931.",
    tasks: [
      "Consult with clients, users and specialist consultants on project objectives and constraints",
      "Analyse spatial, functional, ergonomic, safety, sustainability and aesthetic requirements",
      "Develop interior concepts, layouts, renderings and 3D visualisations",
      "Prepare CAD documentation and detailed construction information",
      "Select materials, finishes, fixtures, furnishings and lighting",
      "Coordinate with architects, contractors, vendors and suppliers through delivery",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 242431 Interior Designer occupation with a current VETASSESS Group B migration pathway",
        entryPathway:
          "RMIT's Bachelor of Interior Design (Honours), CRICOS 083945G, is a four-year direct interior-design route. UTS's Bachelor of Design in Interior Architecture, CRICOS 071631C, is a three-year direct route focused on interior environments and spatial design.",
        registration:
          "There is no universal national registration for Interior Designers, although licensing or registration may apply to particular work or jurisdictions. VETASSESS assesses ANZSCO 232511 Interior Designer as Group B and requires an AQF Bachelor degree or higher plus relevant employment under the applicable pathway.",
        jobMarketNote:
          "The current ingest does not contain a six-digit 232511 labour profile, so primary employment and earnings remain null. Broader ANZSCO 2325 vacancies and projections are contextual only. The 2025 OSL records current OSCA 242431 as No Shortage nationally.",
        scoreCaveat:
          "Vacancy intensity, vacancy trend and salary remain unscored because exact six-digit inputs are unavailable. Broader 2325 projections receive partial growth credit, while the exact current skilled-migration pathway receives full visa credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
