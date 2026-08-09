import type { OccupationEditorial } from "./occupation-editorial-base"

export const GRAPHIC_DESIGNER_OCCUPATION_EDITORIAL = [
  {
    id: "graphic-designer",
    overview:
      "Graphic designers develop visual communication for print and digital publication using typography, imagery, colour and layout. Australia has an exact current OSCA occupation, 242332 Graphic Designer. Its correspondence to ANZSCO 2022 code 232411 is partial rather than a clean one-to-one mapping, so older ANZSCO labour statistics are treated as context rather than exact current-OSCA metrics.",
    tasks: [
      "Consult with clients and stakeholders to define visual communication requirements",
      "Develop and present design concepts for approval",
      "Select typography, colour, imagery and layout appropriate to the audience",
      "Create and refine logos, illustrations, graphics and publication assets",
      "Collaborate with copywriters, developers and other creative specialists",
      "Prepare final artwork for print or digital publication and release",
    ],
    countries: {
      AU: {
        headline:
          "Exact current OSCA 242332 Graphic Designer, with conservative labour metrics because the current ANZSCO correspondence is partial",
        entryPathway:
          "RMIT's Bachelor of Graphic Design, CRICOS 117452M, is a current three-year on-campus degree with direct graphic-design preparation. Swinburne's Bachelor of Design (Communication Design) (Honours), CRICOS 079130D, is a current four-year on-campus route covering communication design, typography, visual systems and professional industry work.",
        registration:
          "Graphic design is not a statutorily registered occupation in Australia. VETASSESS assesses ANZSCO 232411 Graphic Designer as a Group B professional occupation for migration skills-assessment purposes, which is separate from occupational registration and does not by itself establish current CSOL eligibility.",
        jobMarketNote:
          "The legacy JSA ANZSCO 232411 profile records 27,500 workers, but the OSCA-to-ANZSCO 2022 correspondence is partial, so primary employment and earnings remain null. Broader ANZSCO 2324 vacancies were 441 in May 2026, about 7.68% lower than May 2025, and broader employment projections are +9.86% to 2030 and +18.96% to 2035. The 2025 OSL rates OSCA 242332 No Shortage nationally.",
        scoreCaveat:
          "No exact six-digit current-OSCA earnings or vacancy-intensity series is used. Broader 2324 demand data receives only partial growth credit, and no visa credit is awarded because current CSOL legislation does not list ANZSCO 232411 Graphic Designer even though VETASSESS offers a skills assessment for that occupation.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
