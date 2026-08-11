import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "NL",
    editorial: {
      headline: "A high-skill ICT role with persistent employer demand, strong higher-education routes and no occupation-specific immigration fast track",
      entryPathway:
        "Software Developer maps directly to ISCO-08 2512 Software Developers. Dutch entry routes include HBO Informatica, HBO-ICT and associate-degree Software Development programmes, with employers also valuing demonstrable programming portfolios and language/framework specialisation.",
      registration:
        "Software development is not a statutorily registered profession in the Netherlands. Employer-specific security screening, sector compliance or certifications can apply, but there is no universal professional register.",
      jobMarketNote:
        "UWV continues to identify software developers as a high-demand ICT occupation, although the overall ICT labour market has cooled from its earlier peak and ICT unemployment has risen since 2023.",
      scoreCaveat:
        "Shortage credit uses current UWV occupation evidence, not the broader historical ICT boom. Salary uses Studiekeuze123 Informatica graduate pay as an early-career proxy. IND Highly Skilled Migrant eligibility remains sponsor- and salary-dependent rather than occupation-specific.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "NL",
    editorial: {
      headline: "A sought-after analytics role with strong data-study pathways but no single exact ISCO-08 unit group forced into the canonical profile",
      entryPathway:
        "Data Analyst is kept as a Netherlands career scope because the modern BI/data-analytics role spans statistical, systems-analysis and business-information work in ISCO-08. Relevant Dutch routes include Applied Data Science & Artificial Intelligence, Data Science and HBO-ICT data-management/BI study.",
      registration:
        "Data analysis is not a statutorily registered profession. Employers may require sector-specific data-governance, privacy or tooling expertise depending on the role.",
      jobMarketNote:
        "UWV's current higher-education opportunity guidance explicitly identifies data analysts as substantially demanded, while also noting that overall ICT labour-market tightness has moderated.",
      scoreCaveat:
        "No artificial ISCO code is assigned solely to make the profile look more precise. Salary uses a broad HBO-ICT/Informatica early-career proxy and immigration access remains conditional on the applicable IND route.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A specialised data-platform engineering role supported by strong ICT demand but conservatively left without a forced legacy ISCO-08 code",
      entryPathway:
        "Data Engineer spans software engineering, database architecture, pipelines and cloud infrastructure. Because ISCO-08 predates the modern role and has no clean one-to-one unit group, the NL profile uses a transparent career scope rather than pretending one legacy code is exact.",
      registration:
        "Data engineering is not a regulated Dutch profession. Cloud-platform, database and security certifications may be useful but are employer- or technology-specific.",
      jobMarketNote:
        "UWV continues to report strong demand for higher-skilled ICT specialists, database specialists and analysts. The score uses this broader specialist demand conservatively rather than claiming a data-engineer-specific statutory shortage list.",
      scoreCaveat:
        "The shortage score is proxy-based within the current UWV ICT evidence. Salary uses the Informatica/HBO-ICT graduate starting-pay layer, and no occupation-specific migration shortcut is assumed.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "NL",
    editorial: {
      headline: "One of the strongest current Dutch ICT shortage roles, mapped to the ISCO-08 database/network professional residual scope",
      entryPathway:
        "Cybersecurity Analyst is mapped conservatively to ISCO-08 2529 Database and Network Professionals Not Elsewhere Classified for the security-analysis scope. HBO-ICT programmes increasingly include dedicated Cyber Security & Cloud variants, alongside security-focused informatics routes.",
      registration:
        "Cybersecurity analysis is not a universally statutorily registered occupation. Roles in government, critical infrastructure or regulated sectors can impose screening, clearance or sector-specific security controls.",
      jobMarketNote:
        "UWV explicitly lists cybersecurity experts among significantly demanded higher-education occupations and repeatedly identifies security specialists as structurally promising ICT work.",
      scoreCaveat:
        "The score gives the strongest Technology shortage credit to cybersecurity, while keeping vacancy-series and growth components at zero until a recurring comparable NL dataset is integrated.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "NL",
    editorial: {
      headline: "A structurally promising network-infrastructure role mapped to ISCO-08 2523, with demand stronger for current specialist skills than for generic legacy administration",
      entryPathway:
        "Network Administrator maps to ISCO-08 2523 Computer Network Professionals in the professional network-administration scope. Dutch entry can come through HBO-ICT, Informatica or ICT associate-degree study, with vendor networking and security credentials useful in practice.",
      registration:
        "Network administration is not a regulated profession. Employer-specific access controls, security vetting and vendor certifications may apply.",
      jobMarketNote:
        "UWV identifies network administrators, technical-infrastructure specialists and network engineers among structurally promising ICT occupations, even as overall ICT market tightness has eased.",
      scoreCaveat:
        "The score recognises durable network demand but does not treat the role as immune from ICT-market cooling. Salary uses the ICT associate-degree early-career layer as a conservative infrastructure proxy.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "NL",
    editorial: {
      headline: "A modern cloud/DevOps infrastructure role with strong specialist demand but no exact legacy ISCO-08 unit group forced into the profile",
      entryPathway:
        "Cloud Engineer spans systems, network, automation and platform engineering. ISCO-08 does not provide a clean cloud-engineer unit group, so the NL profile keeps a transparent career scope and uses HBO-ICT Cyber Security & Cloud / infrastructure study as the main education reference.",
      registration:
        "Cloud engineering is not statutorily registered. Platform certifications such as major cloud-vendor credentials are voluntary and employer-specific.",
      jobMarketNote:
        "UWV's current evidence continues to favour high-skill ICT infrastructure and specialist knowledge, including network and security expertise. The cloud score therefore uses a conservative specialist-infrastructure demand proxy.",
      scoreCaveat:
        "No ISCO precision is fabricated for a job title that post-dates the classification. Immigration credit remains generic because the Highly Skilled Migrant route depends on a recognised sponsor and salary threshold.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "NL",
    editorial: {
      headline: "A directly classified ISCO-08 2521 database profession with continuing specialist demand and strong informatics study routes",
      entryPathway:
        "Database Administrator maps directly to ISCO-08 2521 Database Designers and Administrators. Informatica, HBO-ICT and Business IT & Management provide relevant routes into database design, administration, data management and related platform roles.",
      registration:
        "Database administration is not a statutorily registered profession. Sector-specific access, privacy and security controls can apply where sensitive data is handled.",
      jobMarketNote:
        "UWV continues to identify database administrators and analysts among ICT roles for which employers seek specific current expertise, although broad ICT vacancy levels have declined from their earlier peak.",
      scoreCaveat:
        "Shortage credit reflects specialist database demand without assuming permanent market tightness. Salary is a higher-education early-career proxy and IND eligibility remains employer/salary dependent.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "NL",
    editorial: {
      headline: "An accessible ICT support route with direct associate-degree pathways but weaker shortage evidence than high-skill software, data and cyber roles",
      entryPathway:
        "ICT Support Technician maps to ISCO-08 3512 ICT User Support Technicians. Dutch pathways include ICT associate-degree and vocational ICT routes, with helpdesk, endpoint, workplace and user-support skills developed through practical study and employer training.",
      registration:
        "ICT user support is not a regulated profession. Employer-specific product certifications and access/security checks may apply.",
      jobMarketNote:
        "UWV notes that lower- and middle-educated ICT workers have a comparatively weaker position than highly specialised ICT professionals, while ICT unemployment has risen since 2023. The profile therefore receives only limited current shortage credit.",
      scoreCaveat:
        "The score deliberately avoids transferring high-skill cybersecurity/software demand to generic support work. Salary uses the Studiekeuze123 ICT associate-degree starting-pay proxy and visa credit stays conservative.",
    },
  },
]
