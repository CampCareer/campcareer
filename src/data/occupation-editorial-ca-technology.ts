import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "CA",
    editorial: {
      headline: "A broad software-development occupation with high national median pay, balanced long-term labour supply and many international study routes",
      entryPathway:
        "The canonical occupation maps to NOC 21232 Software developers and programmers. A university degree or college program in computer science, software development or a related field is commonly required, while the verified Canada catalogue contains multiple direct programming and software-development routes open to international students.",
      registration:
        "Software Developer is not a nationally regulated occupation in Canada. Employer requirements focus on technical education, programming skills, portfolio or project experience and role-specific technologies rather than an occupational licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 48.08 per hour. COPS reports about 155,700 workers in NOC 21232 in 2023 and projects labour demand and supply to remain broadly balanced over 2024–2033.",
      scoreCaveat:
        "The score uses NOC 21232 unit-group labour evidence and exact Software Developer wage evidence. Current Job Bank postings are point-in-time, so vacancy intensity and trend are unscored. NOC 21232 is not in the current Express Entry STEM category, so no visa component is awarded.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "CA",
    editorial: {
      headline: "A data-analysis pathway with strong study-route availability and high median pay, but no current national shortage or STEM-category credit",
      entryPathway:
        "The Canada scope uses NOC 21223 Database analysts and data administrators, which includes IT data analyst and data analyst titles. Bachelor, diploma and graduate-certificate routes in analytics, data management and related computing fields are common, with direct international options in the verified catalogue.",
      registration:
        "NOC 21223 is not broadly regulated in Canada. Employers typically require relevant post-secondary study plus database, analytics, programming, reporting or business-intelligence skills appropriate to the role.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.87 per hour for the data-analyst title. COPS reports the broader NOC 21223 group as balanced nationally over 2024–2033.",
      scoreCaveat:
        "The canonical Data Analyst title shares NOC 21223 with database analysts and data administrators, so the broader employment total is not treated as a title-specific count. The current Express Entry STEM category does not include NOC 21223.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A higher-skill data-engineering pathway within the data-scientist NOC, with high median pay but balanced national outlook",
      entryPathway:
        "Data Engineer is an official title within NOC 21211 Data scientists. Entry commonly requires university-level study in computer science, mathematics, statistics, data science or a related quantitative field, with database, distributed-computing and programming skills developed through study and projects.",
      registration:
        "The occupation is not broadly subject to a national professional licence. Employer expectations are driven by technical capability, computing and quantitative education, and experience with data platforms and engineering tools.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 46.15 per hour for Data Engineer. COPS reports about 36,600 workers across the broader NOC 21211 Data scientists group in 2023 and projects a balanced national outlook over 2024–2033.",
      scoreCaveat:
        "Because Data Engineer is narrower than the full Data scientists unit group, the broader employment count is not used as a title-specific total. NOC 21211 is not in the current Express Entry STEM category, and point-in-time vacancies do not earn vacancy or trend points.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "CA",
    editorial: {
      headline: "The strongest Technology profile in this cohort, combining a moderate national shortage risk, high pay and current STEM-category eligibility",
      entryPathway:
        "Cybersecurity Analyst maps to NOC 21220 Cybersecurity specialists. Bachelor or college programs in cybersecurity, information technology, computer science or networking are common entry routes, and the verified Canada catalogue contains multiple direct cyber programs currently available to international students.",
      registration:
        "Cybersecurity specialists are not broadly regulated as a single occupation across Canada. Employers may require or prefer vendor, security or role-specific certifications in addition to formal education and practical security experience.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 49.52 per hour. COPS reports about 31,800 workers in 2023 and classifies NOC 21220 as facing a moderate risk of labour shortage over 2024–2033.",
      scoreCaveat:
        "Cybersecurity receives 15/20 shortage credit for the COPS moderate shortage signal and 10/10 visa credit because NOC 21220 is included in the current Express Entry STEM category. Vacancy and growth components remain unscored without a comparable reviewed time series.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "CA",
    editorial: {
      headline: "A practical network-administration pathway with accessible college routes and balanced national labour-market projections",
      entryPathway:
        "Network Administrator is an official title within NOC 22220 Computer network and web technicians. College programs in network administration, computer systems, information technology or related areas are common, and several verified direct international routes are currently available.",
      registration:
        "There is no single national Network Administrator licence. Job Bank notes that regulatory registration applies in Saskatchewan, while employers elsewhere may require vendor training, certifications or role-specific technical credentials.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 36.00 per hour. COPS reports about 40,800 workers across the broader NOC 22220 group in 2023 and projects national labour demand and supply to remain balanced over 2024–2033.",
      scoreCaveat:
        "Network Administrator is narrower than the full NOC 22220 group, so the broader employment count is not treated as a title-specific total. NOC 22220 is not included in the current Express Entry STEM category.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A high-paying cloud-infrastructure career within the software-engineering NOC, supported by direct international cloud programs",
      entryPathway:
        "Cloud Engineer is an official title within NOC 21231 Software engineers and designers. University computing or engineering study is common, while focused postgraduate and college cloud programs can support platform, architecture and administration skills for applicants with relevant foundations.",
      registration:
        "The canonical cloud role does not imply that every worker must hold a professional-engineer licence. Engineering-title and professional-practice rules vary by province and by the actual duties and title used, so applicants should check the jurisdiction where they intend to work.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 56.49 per hour for Cloud Engineer. COPS reports about 113,100 workers across NOC 21231 in 2023 and projects a balanced national outlook over 2024–2033.",
      scoreCaveat:
        "Cloud Engineer is a narrower title inside NOC 21231, so the broader employment total is not used as a cloud-only count. NOC 21231 is not in the current Express Entry STEM category, and no vacancy or trend points are inferred from point-in-time postings.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "CA",
    editorial: {
      headline: "A database-specialist pathway with high median pay and balanced national outlook, but limited currently open direct study options",
      entryPathway:
        "Database Administrator is an official title within NOC 21223 Database analysts and data administrators. Relevant computer science, information systems or database study plus practical database-platform skills are common entry requirements.",
      registration:
        "Database Administrator is not broadly regulated as a licensed occupation in Canada. Employers generally assess post-secondary computing education, database-platform knowledge, scripting, security and operational experience.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.87 per hour. COPS projects the broader NOC 21223 group to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "The shared NOC 21223 employment total is not used as a DBA-only count. The verified catalogue's direct IT Database Administration option is currently closed, so the profile links only a related BCIT Applied Computer Science Database Option rather than presenting a closed direct program as available.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "CA",
    editorial: {
      headline: "An accessible technical-support pathway with many international college routes, moderate pay and a balanced national outlook",
      entryPathway:
        "ICT Support Technician maps to NOC 22221 User support technicians, which includes Information technology support technician as an official title. College programs in computer systems, networking, programming or information technology provide common entry routes.",
      registration:
        "There is no single national occupational licence for NOC 22221. Employers typically assess technical training, troubleshooting ability, customer-support skills and familiarity with operating systems, networks and enterprise software.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 31.47 per hour. COPS reports about 119,200 workers in NOC 22221 in 2023 and projects national labour demand and supply to remain balanced over 2024–2033.",
      scoreCaveat:
        "The score uses the close NOC 22221 unit-group scope and exact IT Support Technician wage. NOC 22221 is not in the current Express Entry STEM category, while point-in-time job postings do not earn vacancy-intensity or trend credit.",
    },
  },
]
