import type { OccupationEditorial } from "./occupation-editorial-base"

export const TECHNOLOGY_DATABASE_OCCUPATION_EDITORIAL = [
  {
    id: "database-administrator",
    overview:
      "Database Administrators plan, design, configure, maintain and support database management systems so organisational data remains available, accurate, secure, recoverable and performant. The role centres on operating and protecting database platforms rather than developing application database code, which current OSCA places under Software Engineer.",
    tasks: [
      "Design and implement database structures, storage configurations and operational standards for reliable data management",
      "Monitor database performance and tune indexes, queries, memory, storage and other platform settings",
      "Implement database security, access controls, auditing and integrity safeguards",
      "Run backup, restore, replication and disaster-recovery processes and test recovery procedures",
      "Install, configure, patch, upgrade and migrate database software and database environments",
      "Troubleshoot database incidents, document procedures and coordinate changes with application, infrastructure, cloud and security teams",
    ],
    countries: {
      AU: {
        headline: "A directly mapped CSOL database occupation with an exact six-digit employment base, but no national shortage in 2025",
        entryPathway:
          "OSCA assigns Database Administrator Skill Level 1. Common Australian pathways include Bachelor degrees in Information Technology, Computer Science or Information Systems, with postgraduate Information Systems and IT programs available for eligible graduates. A degree provides the foundation, but employers commonly value hands-on SQL, relational database design, backup and recovery, Linux or Windows administration, cloud database services and experience with platforms such as Oracle, SQL Server, PostgreSQL or MySQL. Database administration is therefore accessible from graduate study, although many roles favour prior systems, support or data-platform experience.",
        registration:
          "There is no single statutory national occupational registration or licence required to work as a Database Administrator in Australia. The Australian Computer Society assesses ANZSCO 262111 Database Administrator for relevant migration pathways. An ACS skills assessment is an immigration and professional-assessment process rather than a domestic licence to practise.",
        jobMarketNote:
          "The exact current occupation is OSCA 271231 Database Administrator and its legacy migration occupation is directly aligned ANZSCO 262111 Database Administrator. JSA's six-digit profile provides an occupation-specific employment base of about 5,900, but six-digit earnings are not available in CampCareer's current source snapshot. Vacancy and projection series remain broader ANZSCO 2621 measures that also include systems administration and ICT-security occupations. The reviewed 2025 Occupation Shortage List records Database Administrator as No Shortage nationally, while the occupation remains on the current CSOL.",
        scoreCaveat:
          "The opportunity score remains conservative even though the classification mapping is cleaner than for several newer IT occupations. The exact six-digit employment base can be retained, but exact earnings are unavailable and broader ANZSCO 2621 vacancies cannot be divided by the narrower 262111 employment base for vacancy intensity. Broader vacancies fell about 6.56% year on year to May 2026, so vacancy trend scores zero; broader five- and ten-year projections receive only partial credit. The verified CSOL signal is retained while the 2025 national shortage component is zero.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
