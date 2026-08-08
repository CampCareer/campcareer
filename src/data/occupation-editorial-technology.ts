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
] as const satisfies readonly OccupationEditorial[]
