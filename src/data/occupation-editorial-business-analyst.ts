import type { OccupationEditorial } from "./occupation-editorial-base"

export const BUSINESS_ANALYST_OCCUPATION_EDITORIAL = [
  {
    id: "business-analyst",
    overview:
      "Business Analysts examine organisational problems, processes, capabilities and performance, then turn evidence into practical recommendations for improving how a business operates. In Australia's current OSCA, the non-ICT Business Analyst title is an official specialisation of 223432 Management Consultant. ICT Business Analyst is a separate occupation and is intentionally excluded from this profile.",
    tasks: [
      "Interview stakeholders and analyse business needs, operating problems, objectives and constraints",
      "Map current processes, workflows, roles and capabilities to identify gaps, inefficiencies and improvement opportunities",
      "Analyse qualitative and quantitative evidence to compare options and support business decisions",
      "Develop recommendations, business cases, target processes and implementation plans for organisational improvements",
      "Facilitate workshops and communicate findings, requirements and change impacts to managers and delivery teams",
      "Support implementation, monitor outcomes and refine processes, procedures or operating models after changes are introduced",
    ],
    countries: {
      AU: {
        headline:
          "A Skill Level 1 non-ICT business-improvement pathway with current Management Consultant CSOL coverage, strong long-run broader growth and direct business-analysis study options, but no 2025 shortage signal",
        entryPathway:
          "OSCA classifies Management Consultant, including the Business Analyst (non-ICT) specialisation, at Skill Level 1. A bachelor degree or higher qualification is the standard academic foundation. Macquarie University's three-year Bachelor of Business Analytics develops business-process, quantitative and organisational problem-solving skills and offers an Information Systems and Business Analysis study option. Its Master of Business Analytics provides a postgraduate route focused on solving complex business problems. For migration assessment as Management Consultant, VETASSESS separately assesses the relevance of qualifications and employment, so completing a degree does not by itself guarantee a positive skills assessment.",
        registration:
          "There is no general occupational registration requirement for non-ICT Business Analysts. For skilled migration, the relevant current occupation is Management Consultant under ANZSCO 2022 code 224713, with VETASSESS as the assessing authority on the current Core Skills Occupation List. VETASSESS also explicitly recognises Business Analyst as suitable under the Management Consultant occupation, subject to its qualification and employment criteria. ICT Business Analyst follows a different occupation and assessing pathway.",
        jobMarketNote:
          "Business Analyst is not published as a standalone six-digit labour-market occupation in the current data used by CampCareer. JSA's legacy ANZSCO 224711 Management Consultant profile reports about 64,900 workers, 21% part-time employment, 41% female share, median age 42 and average full-time hours of 43 per week, but that profile covers all Management Consultants rather than Business Analysts alone. The broader ANZSCO 2247 Management and Organisation Analysts group reports about 105,800 workers and median full-time earnings of A$2,444 per week. The reviewed 2025 OSL records current Management Consultant as No Shortage nationally and in every state and territory.",
        scoreCaveat:
          "The opportunity score is conservative because Business Analyst is an official specialisation rather than a standalone occupation. Management Consultant and broader 2247 employment, earnings, vacancies and projections are retained as context but are not presented as exact Business Analyst observations. Broader 2247 vacancies declined about 1.56% year on year to May 2026, so vacancy trend receives no credit, while projections of about +16.15% to 2030 and +27.31% to 2035 receive partial growth credit. Current Management Consultant CSOL coverage and VETASSESS recognition support visa credit, but individual duties must fit the non-ICT management-consulting occupation.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
