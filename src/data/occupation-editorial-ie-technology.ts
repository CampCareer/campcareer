import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "IE",
    editorial: {
      headline: "A direct SOLAS shortage occupation with explicit Critical Skills permit access",
      entryPathway:
        "Software Developer maps directly to SOC 2010 2136 Programmers and software development professionals. Degree, conversion and work-based ICT routes can all lead into the occupation, and no single statutory qualification is mandatory across every software-development role.",
      registration:
        "Software development is not a statutorily registered profession in Ireland. Employer requirements focus on demonstrable programming, systems and product-development capability rather than a protected professional title.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 directly identifies software developers/engineers as a current shortage. SOC 2136 is also explicitly listed on the current Critical Skills Occupations List.",
      scoreCaveat:
        "The shortage and CSEP signals are strong, but the broad ICT 9.8% annual average employment growth figure is not copied into this exact occupation. Salary, recurring vacancies and exact growth remain unscored until comparable occupation-level Irish series are normalised.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "IE",
    editorial: {
      headline: "A cross-SOC analytics occupation with targeted Critical Skills access for big-data specialist work",
      entryPathway:
        "Data Analyst does not receive a single universal SOC 2010 code in this profile. The current Critical Skills list explicitly recognises SOC 2423 management consultants and business analysts when specialising in big-data analytics, while generic data-analysis roles can sit in other classification contexts.",
      registration:
        "Data analysis is not a statutorily registered profession. The exact SOC and employment-permit treatment depends on the duties, skills and level of the specific role rather than the job title alone.",
      jobMarketNote:
        "SOLAS identifies IT analysts/engineers as a shortage, but generic Data Analyst is broader than that exact wording. The profile therefore does not claim an occupation-wide shortage and treats CSEP access as conditional on an eligible specialist scope.",
      scoreCaveat:
        "The profile deliberately leaves the primary SOC code null rather than forcing a false one-to-one mapping. Big-data specialist CSEP access is scored conditionally, while shortage, salary and exact occupation growth remain unscored.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A professional data-infrastructure role within Ireland's Critical Skills ICT scope",
      entryPathway:
        "Data Engineer is constrained to SOC 2010 2135 IT business analysts, architects and systems designers in data-engineering and data-architecture work. Typical entry is degree-level computing/data education or equivalent technical experience rather than a protected licence pathway.",
      registration:
        "There is no universal statutory registration for data engineers in Ireland.",
      jobMarketNote:
        "SOLAS identifies IT analysts/engineers as a shortage and the current Critical Skills list explicitly includes SOC 2135. Because the SOLAS shortage wording is broader than the exact Data Engineer title, the shortage score is strong but not maximum.",
      scoreCaveat:
        "CSEP eligibility and shortage evidence are kept separate. The broad ICT group growth rate is disclosed contextually but not reused as an exact Data Engineer growth input, and no salary median is fabricated.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "IE",
    editorial: {
      headline: "A Critical Skills cyber role with a national Level 6 apprenticeship route",
      entryPathway:
        "Cybersecurity Analyst is modelled within SOC 2010 2139 Information technology and telecommunications professionals n.e.c., the SOC 2010 group from which cyber-security professionals were later split in SOC 2020. Ireland also has a national Cybersecurity Associate Level 6 apprenticeship as a structured work-based route.",
      registration:
        "Cybersecurity analysts are not subject to one universal statutory professional register. Employer and sector requirements can include security clearance, certifications and role-specific controls.",
      jobMarketNote:
        "SOC 2139 is explicitly listed on the current Critical Skills Occupations List. SOLAS identifies IT analysts/engineers as a shortage, supporting a strong but not title-specific shortage signal for professional cyber analysis.",
      scoreCaveat:
        "No separate exact cyber shortage count or median salary is asserted. Broad ICT growth is not duplicated into the occupation-level growth component.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "IE",
    editorial: {
      headline: "A technical network-operations role with a national apprenticeship pathway and general-permit access",
      entryPathway:
        "Network Administrator is constrained to SOC 2010 3131 IT operations technicians rather than professional network-engineering roles. The national Computer Networking Associate Level 6 apprenticeship provides a direct structured work-based pathway.",
      registration:
        "Network administration is not a universally registered profession in Ireland.",
      jobMarketNote:
        "The SOLAS 2025 ICT shortage summary does not name network administrators separately. SOC 3131 is not on the current Critical Skills list and was not identified on the current Ineligible list, so General Employment Permit access may apply subject to the normal permit conditions.",
      scoreCaveat:
        "The accessible apprenticeship and GEP route are scored, but no shortage, salary or exact growth signal is inferred from broad ICT demand.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A professional cloud and DevOps infrastructure scope with Critical Skills access",
      entryPathway:
        "Cloud Engineer is constrained to professional cloud/DevOps infrastructure engineering within SOC 2010 2139 Information technology and telecommunications professionals n.e.c. Entry commonly combines computing education with systems, automation and cloud-platform experience.",
      registration:
        "Cloud engineering is not a statutorily registered profession in Ireland.",
      jobMarketNote:
        "SOC 2139 is explicitly on the current Critical Skills Occupations List. SOLAS identifies IT analysts/engineers as a shortage, supporting a strong but broader-than-title shortage signal for cloud engineering.",
      scoreCaveat:
        "The score does not treat the ICT group's 9.8% growth rate as an exact Cloud Engineer growth rate and does not invent an occupation median salary.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "IE",
    editorial: {
      headline: "A database-operations technical scope kept separate from professional ICT architecture roles",
      entryPathway:
        "Database Administrator is mapped to the database-administration scope within SOC 2010 3131 IT operations technicians. ONS SOC 2020 later created a separate Database administrators unit group from this SOC 2010 operations group.",
      registration:
        "Database administration is not a statutorily registered profession in Ireland.",
      jobMarketNote:
        "The SOLAS 2025 ICT shortage summary does not name database administrators separately. SOC 3131 is outside the current Critical Skills list and was not identified on the Ineligible list, so ordinary GEP access may apply where the role meets the permit conditions.",
      scoreCaveat:
        "No shortage points are borrowed from professional software or IT analyst roles. Salary, vacancy and exact occupation growth stay unscored.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "IE",
    editorial: {
      headline: "An accessible IT user-support occupation with general-permit rather than Critical Skills treatment",
      entryPathway:
        "ICT Support Technician maps directly to SOC 2010 3132 IT user support technicians. Technical education, support experience and work-based ICT pathways can provide entry without a universal statutory qualification requirement.",
      registration:
        "ICT user support is not a statutorily registered profession in Ireland.",
      jobMarketNote:
        "SOLAS reports strong overall ICT growth but does not list IT user-support technicians among its two named current ICT shortage groups. SOC 3132 is not on the current Critical Skills list and was not identified on the Ineligible list, so ordinary GEP access may apply subject to permit conditions.",
      scoreCaveat:
        "Broad ICT growth and demand are not converted into an exact support-technician shortage or growth score. Salary and recurring vacancy inputs remain unscored.",
    },
  },
]
