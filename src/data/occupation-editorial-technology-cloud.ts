import type { OccupationEditorial } from "./occupation-editorial-base"

export const TECHNOLOGY_CLOUD_OCCUPATION_EDITORIAL = [
  {
    id: "cloud-engineer",
    overview:
      "Cloud Engineers build, support, automate, secure and operate cloud-based infrastructure, applications and services. The current Australian OSCA occupation covers cloud deployment, configuration, performance, security, compliance and migration, and is distinct from DevOps Engineer and ICT Network and Systems Engineer.",
    tasks: [
      "Deploy, configure and automate cloud infrastructure, services and platform resources",
      "Build and maintain cloud-based functions, applications, storage, networking and supporting services",
      "Monitor cloud capacity, reliability, availability and performance and resolve production issues",
      "Use infrastructure-as-code, scripting and automation to make cloud environments repeatable and maintainable",
      "Implement identity, access, security controls, monitoring and compliance requirements across cloud environments",
      "Plan and execute migrations of applications, data and infrastructure from on-premises or legacy environments to cloud platforms",
    ],
    countries: {
      AU: {
        headline: "A nationally shortage-rated cloud occupation with strong demand signals, but limited exact occupation-level labour statistics",
        entryPathway:
          "OSCA assigns Cloud Engineer Skill Level 1. Australian study routes include Deakin's Bachelor of Information Technology with cloud-focused pathways, Swinburne's Master of Information Technology Mobile and Cloud Computing specialisation and Torrens University's Master of Software Engineering (Cloud Computing, Advanced). Employers commonly expect practical AWS, Microsoft Azure or Google Cloud capability alongside networking, Linux, scripting, infrastructure-as-code, security and production operations. Because many Cloud Engineer roles are reached after software, systems, networking or platform experience, graduate entry exists but is less universal than for general software roles.",
        registration:
          "There is no single statutory national occupational registration or licence required to work as a Cloud Engineer in Australia. Cloud Engineer did not have a dedicated legacy ANZSCO occupation. CampCareer's reviewed Australian correspondence maps OSCA 273331 to legacy ANZSCO 261313 Software Engineer for migration-list continuity, for which ACS is the assessing authority. That correspondence is an immigration classification bridge, not a domestic licence, and applicants need to ensure their actual duties fit the nominated occupation under current ACS and Home Affairs rules.",
        jobMarketNote:
          "The exact current occupation is OSCA 273331 Cloud Engineer. JSA's 2025 Occupation Shortage List records Cloud Engineer as Shortage nationally, with shortage rows in ACT, NSW, Queensland, South Australia, Tasmania, Victoria and Western Australia. JSA labour-market statistics are still ANZSCO-based, so CampCareer uses broader 2613 Software and Applications Programmers only as contextual evidence and does not present that group's employment or earnings as exact Cloud Engineer figures. The broader 2613 market retains strong long-term projected growth even though May 2026 vacancies were lower than a year earlier.",
        scoreCaveat:
          "The opportunity score is higher than the other completed Technology profiles because Cloud Engineer has an exact 2025 national shortage signal. It is still conservative: exact Cloud Engineer employment, earnings and vacancy intensity are not reconstructed from legacy ANZSCO 2613, broader vacancies fell about 9.86% year on year to May 2026, and broader growth receives only partial credit. Entry-level access is moderated because many cloud roles expect production infrastructure experience, while visa credit reflects the reviewed OSCA-to-ANZSCO correspondence rather than a separate Cloud Engineer title in the legal CSOL.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
