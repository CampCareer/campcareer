import type { OccupationEditorial } from "./occupation-editorial-base"

export const ARCHITECT_OCCUPATION_EDITORIAL = [
  {
    id: "architect",
    overview:
      "Architects design buildings and built environments, coordinate technical disciplines and guide projects through approvals, documentation and construction. Australia classifies this work directly as OSCA 241131 Architect, and professional registration is required to practise under the protected architect title.",
    tasks: [
      "Consult with clients and stakeholders to establish project requirements and constraints",
      "Develop functional, sustainable and context-responsive architectural concepts",
      "Prepare drawings, models, specifications and BIM documentation",
      "Apply planning controls, building codes and technical standards to design work",
      "Coordinate structural, services and other specialist consultants",
      "Support approvals, tendering, contract administration and construction delivery",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 241131 Architect occupation with mandatory professional registration and a current skilled-migration pathway",
        entryPathway:
          "RMIT's Master of Architecture, CRICOS 060829B, and UNSW's Master of Architecture, CRICOS 061906G, are current two-year professional postgraduate routes for students with appropriate prior architecture study. Registration normally follows an accredited professional qualification, practical experience and the Architectural Practice Examination.",
        registration:
          "Architect registration is administered by state and territory Architects Registration Boards. AACA supports national accreditation and assessment functions and provides migration skills assessment for the occupation. Registration and migration assessment are separate requirements.",
        jobMarketNote:
          "The current ingest contains a legacy ANZSCO 232111 Architect labour profile with 19,300 workers, 19% part-time share, 34% female share, median age 40 and 44 average full-time hours; reviewed median earnings are unavailable. Broader ANZSCO 2321 vacancy and projection data remain contextual. The 2025 OSL records current OSCA 241131 as No Shortage nationally.",
        scoreCaveat:
          "The exact occupation receives full current migration credit but no shortage or salary credit. Broader 2321 vacancies are not used for intensity or trend scoring, broader projections receive partial growth credit, and entry credit is moderated because the professional pathway requires prior architecture study and registration.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
