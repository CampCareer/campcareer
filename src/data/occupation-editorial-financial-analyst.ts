import type { OccupationEditorial } from "./occupation-editorial-base"

export const FINANCIAL_ANALYST_OCCUPATION_EDITORIAL = [
  {
    id: "financial-analyst",
    overview:
      "Financial Analysts interpret financial and operating data, build forecasts and valuation models, assess business performance and investment choices, and communicate decision-ready insights to managers, investors and finance teams. In Australia's current OSCA, Financial Analyst is an official specialisation of 211131 Accountant (General), not a separate six-digit occupation. That classification detail matters because labour-market and migration data published under legacy ANZSCO 221111 cannot be treated as exact Financial Analyst observations.",
    tasks: [
      "Analyse financial statements, budgets, cash flows and operating metrics to explain business performance and key drivers",
      "Build and maintain forecasting, scenario, valuation and financial models for planning, investment or transaction decisions",
      "Compare actual results with budgets or forecasts and investigate material variances, risks and opportunities",
      "Prepare management reports, dashboards, investment papers and presentations that translate financial analysis into decisions",
      "Assess capital expenditure, pricing, funding, acquisition or portfolio choices using financial and commercial evidence",
      "Work with accounting, strategy, operations, treasury, investment and data teams to improve financial information and decision processes",
    ],
    countries: {
      AU: {
        headline: "A Skill Level 1 finance-analysis pathway recognised as an Accountant (General) specialisation, with strong direct finance study routes but no exact standalone labour-market series",
        entryPathway:
          "Financial Analyst is an official specialisation of OSCA 211131 Accountant (General), which is Skill Level 1. A direct finance route is Macquarie University's three-year Bachelor of Applied Finance, CRICOS 027342M, which develops financial-data analysis, modelling, markets, investments, corporate finance and risk skills. For graduates or experienced professionals, Macquarie's Master of Applied Finance, CRICOS 083777G, provides advanced work in financial strategy, markets, instruments, valuation, pricing and risk. Accounting, economics, statistics, Excel, financial modelling, SQL or Python, presentation skills and commercial judgement are useful complements depending on the analyst role.",
        registration:
          "There is no single universal licence for ordinary employee Financial Analyst roles. However, OSCA places Financial Analyst under Accountant (General), where registration or licensing can be required for particular regulated services, and roles that provide personal financial advice can fall under separate financial-services regulation. For migration, a Financial Analyst would need to satisfy the duties and education requirements of the nominated legacy occupation rather than relying on the job title alone.",
        jobMarketNote:
          "Current OSCA does not publish Financial Analyst as a standalone six-digit occupation: it is a specialisation of 211131 Accountant (General). Legacy ANZSCO 221111 reports about 139,100 workers, but it is broader than current Financial Analyst and also maps to current Forensic Accountant, so CampCareer does not display that employment figure as exact Financial Analyst employment. Broader ANZSCO 2211 Accountants reports median weekly earnings of A$2,003 and median hourly earnings of A$53, while broader vacancies fell about 4.46% year on year to May 2026. The reviewed 2025 OSL records parent OSCA 211131 Accountant (General) as No Shortage nationally and in every state and territory.",
        scoreCaveat:
          "The opportunity score is deliberately conservative because Financial Analyst is a specialisation rather than a standalone current occupation. Exact employment, earnings and vacancy intensity are not inferred from legacy ANZSCO 221111 or broader 2211 data. Parent 211131 has no 2025 national shortage signal and broader 2211 vacancies declined year on year, so shortage and vacancy-trend receive no credit. Broader 2211 employment projections of about +8.44% to 2030 and +16.63% to 2035 receive partial growth credit. Direct finance degrees support entry-level credit. Skilled-occupation-list credit is partial because the current lists name legacy Accountant (General) 221111, and a Financial Analyst must still satisfy that nominated occupation's accounting skills-assessment requirements rather than qualifying by title alone.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
