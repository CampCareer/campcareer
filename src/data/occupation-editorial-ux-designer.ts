import type { OccupationEditorial } from "./occupation-editorial-base"

export const UX_DESIGNER_OCCUPATION_EDITORIAL = [
  {
    id: "ux-designer",
    overview:
      "UX designers research user needs and design, test and refine digital experiences, interfaces and interaction flows. Australia now has an exact current OSCA occupation, 242132 UI / UX Designer, and UX Designer is an explicit alternative title. The current ANZSCO 2022 counterpart is 261113 User Experience Designer, but legacy JSA labour profiles predate that six-digit occupation, so primary labour metrics remain null.",
    tasks: [
      "Research user needs through interviews, workshops and quantitative or qualitative analysis",
      "Create user flows, journey maps, personas and task analyses",
      "Develop wireframes, prototypes and visual interface designs",
      "Plan and run usability testing and translate findings into design improvements",
      "Align customer needs, accessibility requirements and business goals",
      "Collaborate with product, engineering and research teams through discovery and delivery",
    ],
    countries: {
      AU: {
        headline:
          "Exact current OSCA 242132 UI / UX Designer and ANZSCO 2022 261113 User Experience Designer, but no exact legacy JSA labour series or current CSOL listing",
        entryPathway:
          "The University of Canberra's current Bachelor of Design, CRICOS 113900B, offers a Specialist Major in Interaction Design with human factors, front-end web design and Designing for UX. UQ's Master of Interaction Design, CRICOS 080726K, is a current two-year postgraduate route centred on studio-based interaction design and real-world design projects.",
        registration:
          "UX design is not a statutorily registered occupation in Australia. Migration skills assessment and occupational registration are separate questions; no direct current CSOL and assessing-authority route for ANZSCO 261113 is scored here.",
        jobMarketNote:
          "The current JSA labour dataset is based on legacy ANZSCO profiles and does not provide an exact six-digit 261113 User Experience Designer profile, so primary employment and earnings remain null. Broader ANZSCO 2611 vacancies were 1,863 in May 2026, about 8.05% lower than May 2025, while broader projections are +15.07% to 2030 and +25.88% to 2035. The 2025 OSL rates OSCA 242132 No Shortage nationally.",
        scoreCaveat:
          "Broader 2611 vacancies and projections are context only, so vacancy intensity and trend receive no exact-occupation credit and growth receives only partial credit. No visa credit is awarded because the current Core Skills Occupation List uses ANZSCO 2022 and does not list 261113 User Experience Designer.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
