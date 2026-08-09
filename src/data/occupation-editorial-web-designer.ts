import type { OccupationEditorial } from "./occupation-editorial-base"

export const WEB_DESIGNER_OCCUPATION_EDITORIAL = [
  {
    id: "web-designer",
    overview:
      "Web designers plan and create the visual structure, layout and interface presentation of websites and web-based experiences. Australia classifies this work directly as OSCA 242133 Web Designer and keeps UI / UX Designer, Multimedia Designer and Web Developer as separate occupations.",
    tasks: [
      "Interpret client, brand, audience and functional requirements for web projects",
      "Develop page structures, visual concepts, responsive layouts and design systems",
      "Create interface assets, prototypes and production-ready design specifications",
      "Apply accessibility, usability and responsive-design principles",
      "Collaborate with developers, content teams and stakeholders during implementation",
      "Review implemented pages and refine visual consistency across devices and browsers",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 242133 Web Designer occupation with a current VETASSESS Group B migration pathway",
        entryPathway:
          "Torrens University's Bachelor of UX and Web Design, CRICOS 103344H, is a direct three-year route covering web design, interaction and front-end practice. RMIT's Bachelor of Design (Digital Media), CRICOS 080226G, is a related three-year route combining digital design, interaction and media production.",
        registration:
          "There is no statutory occupational registration for Web Designers. VETASSESS assesses ANZSCO 232414 Web Designer as Group B and requires an AQF Bachelor degree or higher plus relevant employment under the applicable pathway.",
        jobMarketNote:
          "The current ingest contains a legacy ANZSCO 232414 Web Designer labour profile with 5,300 workers, 31% part-time share, 46% female share, median age 36 and 41 average full-time hours; reviewed median earnings are unavailable. Broader ANZSCO 2324 vacancy and projection data remain contextual. The 2025 OSL records current OSCA 242133 as No Shortage nationally.",
        scoreCaveat:
          "The exact occupation receives full current migration credit but no shortage or salary credit. Broader 2324 vacancy data are not used for intensity or trend scoring, while broader projections receive partial growth credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
