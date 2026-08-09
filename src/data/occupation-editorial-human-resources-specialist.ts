import type { OccupationEditorial } from "./occupation-editorial-base"

export const HUMAN_RESOURCES_SPECIALIST_OCCUPATION_EDITORIAL = [
  {
    id: "human-resources-specialist",
    overview:
      "Human Resources Specialists support organisations through recruitment, workforce planning, employee relations, HR systems, inclusion, performance and people programs. In Australia, the closest current OSCA occupation is 222131 Human Resources Adviser, a Skill Level 1 role that includes HR Adviser and Human Resources Consultant as alternative titles and Diversity, Equity and Inclusion Specialist, Personnel Officer and Workforce Planning Analyst as specialisations. VETASSESS also notes that HR professionals who focus on one area are commonly referred to as HR specialists.",
    tasks: [
      "Support recruitment by preparing vacancies, screening or coordinating applicants, interviews and selection processes",
      "Maintain HR records and human resource information systems and produce workforce or people reports",
      "Advise managers and employees on HR policies, performance, conduct, employment conditions and workplace procedures",
      "Coordinate employee induction, onboarding, remuneration or benefits information and internal mobility processes",
      "Develop or support workforce planning, diversity and inclusion, employee engagement and organisational development initiatives",
      "Interpret employment legislation, awards, agreements and internal policy and contribute to HR projects and change programs",
    ],
    countries: {
      AU: {
        headline:
          "A Skill Level 1 HR profession with a current VETASSESS/CSOL pathway and direct AHRI-accredited study routes, but no 2025 national shortage signal",
        entryPathway:
          "OSCA 222131 Human Resources Adviser is Skill Level 1. A direct undergraduate route is Deakin University's three-year Bachelor of Human Resource Management (Psychology), CRICOS 0101801, an AQF Level 7 course accredited by the Australian Human Resources Institute (AHRI). RMIT University's Master of Human Resource Management, CRICOS 088784B, is a two-year postgraduate route for international students and also meets AHRI professional standards. VETASSESS classifies legacy ANZSCO 223111 Human Resource Adviser as a Group B occupation and requires an AQF bachelor degree or higher plus relevant employment evidence under the applicable assessment pathway.",
        registration:
          "There is no general occupational registration requirement for Human Resources Specialists or Human Resources Advisers. For migration, legacy ANZSCO 223111 Human Resource Adviser is assessed by VETASSESS. A skills assessment is separate from employer sponsorship or visa eligibility and considers qualification relevance, employment duration and the actual HR duties performed.",
        jobMarketNote:
          "CampCareer maps the neutral canonical Human Resources Specialist career to current OSCA 222131 Human Resources Adviser because the official scope and VETASSESS guidance cover specialist and generalist HR work. JSA's legacy ANZSCO 223111 profile reports about 33,500 Human Resource Advisers; six-digit earnings are not published. The broader ANZSCO 2231 Human Resource Professionals group reports about 84,700 workers and median full-time earnings of A$1,970 per week. The reviewed 2025 Occupation Shortage List records Human Resources Adviser as No Shortage nationally, with shortage signals in South Australia and the Northern Territory.",
        scoreCaveat:
          "The opportunity score is conservative. The national shortage component is zero because the 2025 OSL result is No Shortage nationally, despite SA and NT shortage signals. Six-digit salary is unavailable and broader ANZSCO 2231 vacancy counts are not used for occupation-specific vacancy intensity or salary scoring. Broader vacancies declined about 4.69% year on year to May 2026, while broader employment projections are about +7.39% to 2030 and +14.77% to 2035, so only long-run growth receives partial credit. Direct AHRI-accredited study routes and the verified VETASSESS/CSOL pathway support entry and visa credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
