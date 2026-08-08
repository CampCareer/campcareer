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
  {
    id: "data-engineer",
    overview:
      "Data Engineers design, build, operationalise and maintain the pipelines, storage systems and processing infrastructure that move and transform data for analytics, reporting, machine learning and other data products. The role focuses on reliable data platforms and scalable data delivery rather than primarily interpreting business results.",
    tasks: [
      "Build, test and maintain batch and streaming data pipelines that move information between source, storage and analytics systems",
      "Develop and optimise extraction, transformation and loading processes and reusable data-processing workflows",
      "Design and operate data warehouses, lakehouses, cloud storage and related data-platform infrastructure",
      "Automate data delivery, monitoring, validation and recovery processes to improve reliability and scalability",
      "Implement access controls, secure handling, privacy protections and governance requirements across data systems",
      "Work with analysts, data scientists, software engineers and platform teams to make trusted datasets available for downstream use",
    ],
    countries: {
      AU: {
        headline: "A newly distinct OSCA data-platform occupation with direct study pathways and strong broader tech growth, but limited occupation-specific labour data",
        entryPathway:
          "OSCA assigns Data Engineer Skill Level 1. A direct Australian pathway is available through programs such as TAFE NSW's Bachelor of Information Technology (Data Engineering), while postgraduate routes include Western Sydney University's Master of Data Engineering. Computer Science, Software Engineering, Information Technology, Data Science and related degrees can also lead into the field when combined with database, SQL, programming, cloud and data-platform skills. Compared with general analyst roles, many employers expect stronger production engineering experience, so graduate entry exists but is less universal.",
        registration:
          "There is no single statutory national occupational registration or licence required to work as a Data Engineer in Australia. Data Engineer did not have its own legacy ANZSCO 2022 occupation code. For migration, CampCareer's reviewed Australian correspondence maps OSCA 223233 to legacy ANZSCO 261313 Software Engineer, for which ACS is the assessing authority. That correspondence is not a domestic licence and applicants must ensure their actual duties fit the nominated occupation under current ACS and Home Affairs rules.",
        jobMarketNote:
          "The exact current occupation is OSCA 223233 Data Engineer. JSA's current labour-market series remain ANZSCO-based, so CampCareer uses broader 2613 Software and Applications Programmers only as contextual evidence and does not present its employment or earnings as Data Engineer figures. No exact current OSCA 223233 shortage rating has been verified, so shortage remains unscored. The broader 2613 market still shows strong five- and ten-year projected growth, while its May 2026 vacancy level was lower than a year earlier.",
        scoreCaveat:
          "The opportunity score is deliberately conservative. Exact Data Engineer employment, earnings, shortage and vacancy intensity are not reconstructed from legacy 2613 or 261313 data. Broader 2613 vacancies fell about 9.86% year on year to May 2026 and therefore add no trend points; broader five- and ten-year growth receives only partial credit. Entry-level access receives moderated credit because direct degrees exist but many roles expect prior software, database, cloud or analytics engineering experience. Visa credit reflects only the reviewed OSCA-to-ANZSCO CSOL correspondence, not a direct Data Engineer title in the current legal list.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
