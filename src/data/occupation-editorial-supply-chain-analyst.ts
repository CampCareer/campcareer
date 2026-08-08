import type { OccupationEditorial } from "./occupation-editorial-base"

export const SUPPLY_CHAIN_ANALYST_OCCUPATION_EDITORIAL = [
  {
    id: "supply-chain-analyst",
    overview:
      "Supply Chain Analysts analyse product delivery and supply chain processes to identify or recommend improvements. Australia's current OSCA 223434 Supply Chain Analyst is a standalone Skill Level 1 occupation and explicitly includes Logistics Analyst as an alternative title while excluding Logistics Officers. The work commonly covers supply chain data, inventory analysis, process improvement, disruption risk and implementation of approved recommendations.",
    tasks: [
      "Collect and analyse supply chain, inventory, transport and service data to identify inefficiencies and improvement opportunities",
      "Monitor inventory levels, stock discrepancies, replenishment patterns and demand signals and prepare analytical reports",
      "Model or evaluate sourcing, warehousing, freight, distribution and delivery processes to improve cost, resilience and service outcomes",
      "Assess supply chain risks and develop contingency or mitigation options for disruptions, capacity constraints and supplier issues",
      "Prepare recommendations to revise workflows, methods, procedures and operating policies across supply chain functions",
      "Work with procurement, logistics, operations, finance, suppliers and technology teams to implement and monitor approved improvements",
    ],
    countries: {
      AU: {
        headline:
          "A standalone Skill Level 1 supply-chain analytics occupation with a current VETASSESS/CSOL pathway, strong long-run broader growth, but no 2025 national shortage signal",
        entryPathway:
          "OSCA 223434 Supply Chain Analyst is Skill Level 1. A directly relevant undergraduate route is the University of Tasmania's three-year Bachelor of Global Logistics and Maritime Management, CRICOS 095526F, with a Logistics and Supply Chain Management major and analytical study in logistics decision-making. A postgraduate route is RMIT University's two-year Master of Supply Chain and Logistics Management, CRICOS 077513E, covering supply chain modelling and design, sourcing and procurement, international logistics, risk and project management. VETASSESS classifies Supply Chain Analyst 224714 as a Group B occupation and requires an AQF bachelor degree or higher plus relevant employment evidence under the applicable assessment pathway.",
        registration:
          "There is no general occupational registration requirement for Supply Chain Analysts. For migration, current ANZSCO 224714 Supply Chain Analyst is assessed by VETASSESS. VETASSESS skills assessment is separate from employer sponsorship or visa eligibility and considers both qualification level/content and relevant employment.",
        jobMarketNote:
          "The exact current occupation is OSCA 223434 Supply Chain Analyst, corresponding to ANZSCO 2022 code 224714. JSA does not currently publish a standalone six-digit labour-market profile for 224714 in CampCareer's reviewed dataset, so exact employment, demographics and earnings are not shown. Broader ANZSCO 2247 Management and Organisation Analysts reports about 105,800 workers and median full-time earnings of A$2,444 per week, but those figures cover multiple occupations and are retained only as context. The reviewed 2025 Occupation Shortage List records Supply Chain Analyst as No Shortage nationally and across all eight states and territories.",
        scoreCaveat:
          "The opportunity score is conservative despite the exact classification match. The 2025 shortage component is zero because Supply Chain Analyst is No Shortage nationally. Exact employment and salary are unavailable, and broader ANZSCO 2247 vacancy counts cannot support an occupation-specific vacancy-intensity or salary score. Broader vacancies declined about 1.56% year on year to May 2026, while broader employment projections are about +16.15% to 2030 and +27.31% to 2035, so only long-run growth receives partial credit. Direct bachelor/postgraduate study routes and the verified VETASSESS/CSOL pathway support entry and visa credit.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
