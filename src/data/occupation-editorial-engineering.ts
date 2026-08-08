import type { OccupationEditorial } from "./occupation-editorial-base"

export const ENGINEERING_OCCUPATION_EDITORIAL = [
  {
    id: "civil-engineer",
    overview:
      "Civil Engineers plan, design, organise and oversee the construction and operation of major infrastructure such as roads, bridges, pipelines, airports and other built-environment systems. Australia's current OSCA classification separates Civil Engineer from Rail Engineer and Water Engineer, making the current occupation narrower than the legacy migration code used for some labour-market series.",
    tasks: [
      "Assess sites, surveys and project constraints to determine the feasibility and engineering requirements of infrastructure projects",
      "Perform engineering calculations and prepare designs, specifications, drawings and technical solutions for civil works",
      "Select construction methods, materials and quality standards that meet engineering, safety and performance requirements",
      "Evaluate environmental, planning and regulatory implications and incorporate compliance requirements into project designs",
      "Coordinate with construction teams, architects, surveyors, government agencies and other engineering disciplines throughout delivery",
      "Inspect, monitor and review construction and infrastructure performance to identify defects, risks and required remedial work",
    ],
    countries: {
      AU: {
        headline: "A nationally shortage-rated, CSOL-listed professional engineering occupation with strong direct study pathways and broad infrastructure demand",
        entryPathway:
          "OSCA assigns Civil Engineer Skill Level 1. The most direct Australian pathway is a four-year professional engineering degree with a Civil Engineering major or an equivalent accredited qualification, followed by graduate engineering or infrastructure project experience. Professional placements, design projects and practical exposure to structures, geotechnical engineering, transport, construction and project delivery are especially valuable. Postgraduate professional Civil Engineering degrees are also available for suitable graduates.",
        registration:
          "There is no single national engineering licence that applies identically to every Civil Engineer role across Australia. However, ABS notes that registration or licensing may be required, and professional-engineer registration requirements vary by state, territory and the type of engineering service performed. For migration, legacy ANZSCO 233211 Civil Engineer is on the current Core Skills Occupation List and Engineers Australia is the relevant assessing authority. A migration skills assessment is separate from domestic professional registration.",
        jobMarketNote:
          "The exact current occupation is OSCA 243231 Civil Engineer. The 2025 Occupation Shortage List records it as Shortage nationally and in every state and territory. Legacy ANZSCO 233211 remains the migration occupation, but that legacy code also corresponds to the newly separate OSCA Water Engineer occupation, so CampCareer does not treat legacy 233211 employment as an exact current Civil Engineer figure. Broader ANZSCO 2332 vacancy and projection data are shown only as context.",
        scoreCaveat:
          "The opportunity score gives full credit to the verified current shortage signal and current CSOL inclusion. Exact current OSCA employment and salary are not inferred from legacy 233211 or broader 2332, so salary and vacancy-intensity components remain zero. Broader 2332 vacancies rose about 3.94% year on year to May 2026 and long-run employment projections are positive, so trend and growth receive partial credit. Entry-level access scores strongly because clear professional degree and graduate-engineer pathways exist, while possible state registration requirements add some entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
