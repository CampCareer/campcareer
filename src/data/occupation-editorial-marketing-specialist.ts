import type { OccupationEditorial } from "./occupation-editorial-base"

export const MARKETING_SPECIALIST_OCCUPATION_EDITORIAL = [
  {
    id: "marketing-specialist",
    overview:
      "Marketing Specialists identify market opportunities and develop, coordinate and evaluate plans for pricing and promoting an organisation's goods and services. Australia's current OSCA 221534 Marketing Specialist is a standalone Skill Level 1 occupation covering roles such as Marketing Consultant, Marketing Coordinator and Marketing Officer, with specialisations including Brand Manager, Category Manager, Pricing Analyst, Product Manager and Sales Analyst.",
    tasks: [
      "Research consumer demand, market characteristics, competitors and commercial opportunities for new and existing products and services",
      "Collect, analyse and interpret marketing, customer, sales and pricing data to support commercial decisions",
      "Develop and execute marketing objectives, policies, campaigns and go-to-market plans",
      "Advise on product mix, pricing, promotion, sales activity and distribution-channel strategy",
      "Monitor campaign, brand and product performance and recommend changes based on evidence and business objectives",
      "Coordinate with sales, product, finance, agencies and other stakeholders to implement approved marketing initiatives",
    ],
    countries: {
      AU: {
        headline:
          "A standalone Skill Level 1 marketing occupation with a current VETASSESS/CSOL pathway and positive broader long-run growth, but no 2025 shortage signal and no clean standalone current labour-market series",
        entryPathway:
          "OSCA 221534 Marketing Specialist is Skill Level 1. A directly relevant undergraduate route is Deakin University's three-year Bachelor of Marketing (Psychology), CRICOS 0100820, an AQF Level 7 degree combining marketing, consumer behaviour, analytics and psychology. A postgraduate route is RMIT University's two-year Master of Marketing, CRICOS 077512F, covering marketing strategy, analytics, brand strategy, customer experience and industry projects. VETASSESS classifies ANZSCO 225113 Marketing Specialist as a Group B occupation and assesses qualification and relevant employment evidence.",
        registration:
          "There is no general statutory registration requirement for Marketing Specialists. For migration, ANZSCO 225113 Marketing Specialist is currently on the Core Skills Occupation List with VETASSESS as assessing authority. A positive skills assessment and occupation-list inclusion do not guarantee a visa outcome, and applicable CSOL circumstances still need to be checked.",
        jobMarketNote:
          "The exact current occupation is OSCA 221534 Marketing Specialist and its current ANZSCO 2022 counterpart remains 225113. JSA's February 2026 occupation profile, however, is still published on ANZSCO 2013 v1.3. That older 225113 scope predates the separate Content Creator (Marketing) occupation, and CampCareer's OSCA correspondence maps both current 221531 Content Creator (Marketing) and 221534 Marketing Specialist back to legacy 225113. The legacy 71,700 employment figure and demographics are therefore contextual rather than exact current 221534 observations. Broader ANZSCO 2251 earnings and vacancy/projection data are also contextual. The reviewed 2025 OSL records Marketing Specialist as No Shortage nationally, with no state or territory shortage rows in the reviewed data.",
        scoreCaveat:
          "The opportunity score is deliberately conservative. Marketing Specialist receives no shortage, salary or vacancy-intensity points because the clean current six-digit labour-market series is unavailable. Broader ANZSCO 2251 vacancies fell about 10.22% year on year to May 2026, so vacancy trend receives no credit. Broader employment projections remain positive at about +12.56% to 2030 and +22.08% to 2035, earning only partial growth credit. Direct undergraduate/postgraduate study and the current ANZSCO 225113 VETASSESS/CSOL pathway support entry and visa credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
