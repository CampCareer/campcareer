import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzTechnologyOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzTechnologyOverride[] = [
  {
    id: "software-developer",
    countryCode: "NZ",
    editorial: {
      headline: "A high-paying software role with a current conditional Green List pathway",
      entryPathway:
        "Tahatū describes software development as accessible through relevant software-engineering or computer-science study, including advanced certificate or diploma routes, with practical coding experience valued by employers.",
      registration:
        "There is no statutory occupational registration for software developers in New Zealand. Employer requirements focus on technical capability, relevant study, portfolio evidence and experience.",
      jobMarketNote:
        "The current Green List includes ANZSCO 261312 Developer Programmer, whose specialisation includes Software Developer. Straight to Residence is conditional on the current ICT remuneration threshold, so a typical software-developer salary does not by itself establish residence eligibility.",
      scoreCaveat:
        "Green List demand and visa credit are deliberately reduced from an unconditional Tier 1 role because the current NZD 72.80/hour threshold is materially above Tahatū's most-common salary midpoint. Posting-level vacancy and employer-diversity components remain zero.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "NZ",
    editorial: {
      headline: "A broad analytics career with strong pay but no clean current ICT immigration-code match",
      entryPathway:
        "Tahatū describes data analysts as typically entering through tertiary study in computer science, economics, econometrics, mathematics or a similar quantitative field, supported by practical analytics and reporting skills.",
      registration:
        "Data analysts are not a statutorily registered profession in New Zealand.",
      jobMarketNote:
        "The canonical technology Data Analyst is not forced into ANZSCO 224114, which was added in an Australian-only ANZSCO update and is not part of the ANZSCO 1.3 scope used by current NZ residence instructions. The NOL occupation 224118 is explicitly Data Analyst (Non-ICT), so it is not treated as an exact technology mapping either.",
      scoreCaveat:
        "No Green List or shortage credit is borrowed from ICT Business Analyst, programmer or data-science occupations. Immigration credit is conservative because the actual visa code must be matched to the duties of the specific job.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "Modern data-platform work with good pay but classification friction",
      entryPathway:
        "Tahatū's closest current career scope is Data Warehousing Specialist, covering data-storage systems, software, processes and data-management procedures. Computer science, data, information-systems and software study are common foundations.",
      registration:
        "There is no statutory occupational registration for data engineers. Vendor and cloud-platform certifications can be useful but are not legal practising licences.",
      jobMarketNote:
        "Data Engineer does not have an exact ANZSCO 1.3 occupation. A specific job may map to a programmer, database or systems occupation according to its duties, but this profile does not borrow another occupation's Green List status.",
      scoreCaveat:
        "Salary uses Tahatū's Data Warehousing Specialist range as the closest transparent pay proxy. Shortage is zero and visa credit is conservative until an exact current NZ immigration classification is established for the individual role.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "NZ",
    editorial: {
      headline: "Strong cyber-security pay with a conditional Tier 1 immigration route",
      entryPathway:
        "Tahatū's Information Security Analyst pathway points to computing and cybersecurity study plus practical security skills. Bachelor-level cybersecurity and computer-science study is a common direct route.",
      registration:
        "Cybersecurity analysts do not require statutory occupational registration in New Zealand. Industry certifications may be important to employers but are not practising licences.",
      jobMarketNote:
        "The canonical analyst scope is conservatively mapped to ANZSCO 262112 ICT Security Specialist. That occupation is on the current Green List, subject to the NZD 72.80/hour ICT remuneration threshold.",
      scoreCaveat:
        "Green List demand and visa credit are reduced because Tahatū's most-common Information Security Analyst midpoint is below the current Tier 1 pay threshold. No posting-derived vacancy or growth signal is added.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "NZ",
    editorial: {
      headline: "A clear network-operations occupation without current Green List credit",
      entryPathway:
        "Tahatū says network support specialists commonly enter with relevant computer-science or information-systems study, network knowledge, experience and industry certification.",
      registration:
        "There is no statutory registration requirement for network administrators in New Zealand.",
      jobMarketNote:
        "ANZSCO 263112 Network Administrator is the exact current mapping. It is not on the 9 March 2026 Green List, so historic long-term-shortage-list treatment is not carried forward.",
      scoreCaveat:
        "The score uses standard work-visa access rather than Green List credit and leaves shortage, vacancy intensity, employer diversity, vacancy trend and growth at zero pending contemporary recurring evidence.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "Cloud infrastructure skills are valuable, but the canonical title has no exact current NZ immigration code",
      entryPathway:
        "Cloud engineers commonly build from systems, networking, software and infrastructure study plus practical AWS, Azure or Google Cloud skills. Tahatū's Systems Administrator pathway is used only as a related infrastructure entry reference.",
      registration:
        "Cloud engineering has no statutory professional registration in New Zealand. Cloud-vendor certifications are optional employer credentials rather than legal licences.",
      jobMarketNote:
        "Cloud Engineer is not forced into ANZSCO 262113 Systems Administrator or 263111 Computer Network and Systems Engineer. A specific cloud job can map differently by duties, and this canonical profile therefore receives no borrowed Green List status.",
      scoreCaveat:
        "Salary uses Tahatū Systems Administrator as a conservative infrastructure proxy. Visa credit is reduced for classification ambiguity and all shortage/posting-derived components remain zero.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "NZ",
    editorial: {
      headline: "A precise database occupation with a conditional Green List route",
      entryPathway:
        "Tahatū describes database administration as usually requiring relevant tertiary study plus experience with database administration systems and software. NZQA also maintains a Level 6 Database Administration qualification route.",
      registration:
        "Database administrators are not a statutorily registered profession in New Zealand.",
      jobMarketNote:
        "ANZSCO 262111 Database Administrator is an exact match and is on the current Green List, but Straight to Residence requires remuneration of at least NZD 70.00/hour under the current instructions.",
      scoreCaveat:
        "Green List demand and visa credit are reduced because Tahatū's most-common DBA midpoint is well below the current residence remuneration threshold. Posting and growth components remain zero.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "NZ",
    editorial: {
      headline: "An accessible technical-support route with a clear occupational scope",
      entryPathway:
        "Tahatū says helpdesk and support technicians can enter through practical IT experience and relevant computer-science or information-systems study. The current NOL also identifies ICT Support Technician and Service Desk Analyst as a distinct skill-level-2 occupation.",
      registration:
        "There is no statutory occupational registration for ICT support technicians in New Zealand.",
      jobMarketNote:
        "The profile uses code 313112, aligned to the established ICT customer-support/helpdesk scope and the current NOL title ICT Support Technician and Service Desk Analyst. It is not on the current Green List.",
      scoreCaveat:
        "The score reflects relatively accessible entry and standard work-visa treatment, but does not infer shortage from historic ICT shortage lists or generic technology hiring narratives.",
    },
  },
] as const
