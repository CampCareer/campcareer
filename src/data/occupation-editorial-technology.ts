import type { OccupationEditorial } from "./occupation-editorial-base"

export const TECHNOLOGY_OCCUPATION_EDITORIAL = [
  {
    id: "software-developer",
    overview:
      "Software Engineers design, develop, test, document and maintain software applications and systems. The current Australian OSCA occupation also uses Software Developer, Analyst Programmer and Developer Programmer as alternative titles while separating Cloud Engineer and DevOps Engineer into their own occupations.",
    tasks: [
      "Design software architectures and technical solutions that meet product, system and user requirements",
      "Write, test, debug and maintain program code using appropriate languages, frameworks and development tools",
      "Review code, improve algorithms and refactor systems to strengthen quality, security, performance and maintainability",
      "Implement and improve software-development processes, automated testing, source control and delivery workflows",
      "Identify technical risks, diagnose defects and resolve reliability, integration and production issues",
      "Collaborate with product, design, data, infrastructure and other engineering teams and document software designs and workflows",
    ],
    countries: {
      AU: {
        headline: "A CSOL-listed high-skill software occupation with strong long-term growth, but no national shortage rating in 2025",
        entryPathway:
          "A common Australian pathway is a Bachelor degree in Software Engineering, Computer Science, Information Technology or a closely related computing field, with graduate-entry Software Engineering and IT programs available for eligible degree holders. ACS accredits many Australian computing programs, but employers also place substantial weight on programming fundamentals, projects, internships, technical interviews and practical engineering experience. OSCA assigns Software Engineer Skill Level 1, corresponding to a Bachelor degree or higher qualification, or at least five years of relevant experience.",
        registration:
          "There is no single statutory national occupational registration or licence required to work as a Software Engineer in Australia. The Australian Computer Society is the relevant assessing authority for many ICT migration pathways. An ACS migration skills assessment is an immigration and professional-assessment process, not a domestic licence to practise software engineering.",
        jobMarketNote:
          "The exact current occupation is OSCA 273333 Software Engineer. JSA's currently available occupation-market pages remain on legacy ANZSCO, so the 2613 Software and Applications Programmers employment, earnings, vacancy and projection series are broader than the current OSCA career. The 2025 Skills in Demand report records legacy 261313 Software Engineer as Shortage in 2023, Shortage in 2024 and No Shortage in 2025. Major product companies, banks, telecommunications and digital businesses still maintain software-engineering and graduate recruitment pathways.",
        scoreCaveat:
          "The opportunity score is deliberately conservative. Exact current-OSCA employment and earnings are not reconstructed from legacy ANZSCO rows, so salary and vacancy-intensity components remain zero. Broader ANZSCO 2613 vacancies fell about 9.86% year on year to May 2026, so vacancy trend scores zero; the broader five- and ten-year growth projections receive only partial credit. The current CSOL signal is retained, while the 2025 national shortage component is zero.",
      },
    },
  },
  {
    id: "data-analyst",
    overview:
      "Data Analysts gather, process, validate, analyse and interpret data to answer business and policy questions, identify patterns and communicate findings through reports, dashboards and visualisations. The role sits between technical data handling and stakeholder-facing decision support rather than advanced machine-learning model development.",
    tasks: [
      "Collect, clean, validate and organise data from operational, customer, financial or other source systems",
      "Use SQL, spreadsheets, analytics tools and programming languages to explore and analyse datasets",
      "Apply statistical and analytical methods to identify trends, relationships, anomalies and performance drivers",
      "Build dashboards, charts, reports and other visualisations that make findings understandable to decision-makers",
      "Translate business questions into measurable analytical problems and explain insights, assumptions and limitations",
      "Follow data governance, privacy, quality and ethical-use requirements when handling and communicating data",
    ],
    countries: {
      AU: {
        headline: "A CSOL-listed analytics occupation with broad industry use and strong group growth, but no shortage rating in 2025",
        entryPathway:
          "A common route is a Bachelor degree in Data Analytics, Business Analytics, Data Science, Statistics, Mathematics, Computer Science, Information Technology or another quantitatively relevant field. Graduate-entry analytics programs are also available. Employers commonly expect practical SQL, spreadsheet and visualisation skills, statistical reasoning, clear stakeholder communication and project or internship evidence. OSCA assigns Data Analyst Skill Level 1, corresponding to a Bachelor degree or higher qualification, or at least five years of relevant experience.",
        registration:
          "There is no single statutory national occupational registration or licence required to work as a Data Analyst in Australia. The Australian Computer Society now assesses ANZSCO 224114 Data Analyst for relevant migration pathways. An ACS skills assessment is an immigration and professional-assessment process rather than a domestic licence to practise.",
        jobMarketNote:
          "The exact current occupation is OSCA 223231 Data Analyst, with legacy ANZSCO 224114 providing the current migration code. JSA labour-market statistics are still published at the broader ANZSCO 2241 Mathematical Science Professionals level, which also includes actuaries, mathematicians, data scientists and statisticians. The 2025 Occupation Shortage List records Data Analyst as No Shortage nationally and in all states and territories, while analytics roles remain spread across banking, technology, retail, telecommunications and government and the APS continues to run a dedicated graduate Data Stream.",
        scoreCaveat:
          "The opportunity score is deliberately conservative. Exact Data Analyst employment and earnings are not inferred from the broader ANZSCO 2241 group, so salary and vacancy-intensity components remain zero. Broader 2241 vacancies fell about 22.03% year on year to May 2026, so vacancy trend scores zero; broader five- and ten-year growth projections receive only partial credit. The current CSOL signal is retained while the 2025 shortage component is zero.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
