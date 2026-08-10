import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "UK",
    editorial: {
      headline: "A higher-skilled software profession with broad Skilled Worker access and persistent demand for fast-changing technical skills",
      entryPathway:
        "Software Developer maps to SOC 2134 Programmers and software development professionals. Skills England's Level 4 Software Developer apprenticeship is approved for delivery and provides a work-based route alongside computer science and software engineering degrees.",
      registration:
        "Software development is not a statutorily regulated UK profession. Employers commonly assess practical programming, software-engineering and platform skills rather than requiring a single occupational licence.",
      jobMarketNote:
        "SOC 2134 is a higher-skilled occupation eligible for the standard Skilled Worker route. The MAC's 2025 IT review found that IT professional shortages were not broadly acute, but identified software engineering and development skills among roles that employers can find particularly difficult to recruit domestically.",
      scoreCaveat:
        "Shortage credit is intentionally modest because the MAC did not find an occupation-wide acute shortage. The profile recognises specific technical-skill pressure without converting general digital-sector growth into a full shortage score.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "UK",
    editorial: {
      headline: "A Level 4 data occupation with current Temporary Shortage List access and a July 2026 recommendation for continued time-limited access",
      entryPathway:
        "Data Analyst maps directly to SOC 3544 Data analysts. Skills England's Level 4 Data Analyst standard is approved for delivery, with Level 3 Data Technician routes also providing an earlier technical entry point.",
      registration:
        "Data Analyst is not a statutorily regulated occupation. Employers typically require evidence of analytical, spreadsheet, SQL, visualisation and statistical capability appropriate to the role.",
      jobMarketNote:
        "SOC 3544 is on the current Temporary Shortage List. The MAC's July 2026 Stage 2 report recommends 18-month access, citing mixed quantitative evidence but stronger stakeholder evidence of emerging skills-based recruitment pressure and the need to strengthen training pipelines.",
      scoreCaveat:
        "The shortage component is moderate rather than maximum because the MAC describes the quantitative evidence as mixed. Current TSL access receives targeted visa credit separately from shortage scoring.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A Level 5 data-engineering occupation within the higher-skilled SOC 2133 group, with strong salary levels but no targeted shortage-list treatment",
      entryPathway:
        "Data Engineer maps to the Data engineers sub-unit within SOC 2133 IT business analysts, architects and systems designers. Skills England's Level 5 Data Engineer apprenticeship is approved for delivery and focuses on data pipelines, data architecture and reliable data platforms.",
      registration:
        "Data engineering is not a statutorily regulated UK profession. Employers may expect cloud, database, pipeline and programming competence, but there is no universal licence to practise.",
      jobMarketNote:
        "SOC 2133 is eligible for the standard higher-skilled Skilled Worker route. The MAC's IT review highlights rapidly changing digital skills needs, but did not identify broad acute shortages across professional IT occupations as a whole.",
      scoreCaveat:
        "The profile gives limited shortage credit for specific digital-skill pressure, not for occupation-wide shortage. Visa credit reflects standard higher-skilled eligibility rather than TSL or ISL access.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "UK",
    editorial: {
      headline: "A higher-skilled cyber security profession with structured Level 3-to-6 training routes and standard Skilled Worker eligibility",
      entryPathway:
        "Cybersecurity Analyst maps to SOC 2135 Cyber security professionals. Skills England offers a Level 3 Cyber Security Technician route for first-line security work and a Level 6 Cyber Security Technical Professional route for advanced professional practice.",
      registration:
        "Cyber security is not governed by one statutory occupational register. Employers can require security clearance, professional certifications or role-specific assurance credentials depending on sector and responsibility.",
      jobMarketNote:
        "SOC 2135 is a higher-skilled Skilled Worker occupation. The MAC's IT review found that professional IT shortages are generally less acute than in some other sectors, while recognising fast-changing skills needs and globally scarce specialist capabilities.",
      scoreCaveat:
        "Shortage credit is kept limited because the reviewed evidence supports specialist skill pressure rather than a clear occupation-wide shortage. No targeted TSL or ISL visa bonus is applied.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "UK",
    editorial: {
      headline: "A network and systems administration profile scoped to SOC 3131, with current TSL access but no final MAC shortage recommendation identified",
      entryPathway:
        "Network Administrator is constrained to the Network and systems administrators job-title scope within SOC 3131 IT operations technicians. Skills England's Level 4 Network Engineer standard explicitly includes Network administrator among typical job titles and provides a structured route into network operations.",
      registration:
        "Network administration is not a statutorily regulated occupation. Vendor certifications and employer-specific security or infrastructure requirements can still be important for particular jobs.",
      jobMarketNote:
        "SOC 3131 remains on the current Temporary Shortage List through the interim arrangements. It progressed into the MAC Stage 2 review, but the final report does not publish an occupation-specific recommendation for 3131, so this profile does not infer shortage from current list membership alone.",
      scoreCaveat:
        "Visa and shortage are deliberately separated: current TSL access receives visa credit, while shortage remains zero pending direct final-review evidence for SOC 3131.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A cloud-infrastructure and DevOps profile within higher-skilled SOC 2139, where changing cloud skills drive demand more clearly than occupation-wide shortage",
      entryPathway:
        "Cloud Engineer is scoped to DevOps and cloud-infrastructure work within SOC 2139 Information technology professionals n.e.c. Skills England's Level 4 DevOps Engineer standard explicitly takes a cloud-infrastructure-focused perspective and is approved for delivery.",
      registration:
        "Cloud engineering is not a statutorily regulated profession. Employers commonly value cloud-platform certifications, infrastructure-as-code, container, networking and operational security skills.",
      jobMarketNote:
        "SOC 2139 is eligible for the standard higher-skilled Skilled Worker route. The MAC's IT review notes strong growth in DevOps job-title demand and the emergence of cloud technologies, while concluding that IT professional shortages overall are not exceptionally acute.",
      scoreCaveat:
        "The score recognises specific cloud and DevOps skills pressure but avoids treating rapid technology adoption as proof of a broad occupation-wide shortage. Visa credit is for the standard higher-skilled route only.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "UK",
    editorial: {
      headline: "A database administration occupation with current TSL access and an 18-month continuation recommendation from the July 2026 MAC review",
      entryPathway:
        "Database Administrator maps to the Database administrators job-title scope within SOC 3133 Database administrators and web content technicians. Skills England's Data Technician pathway includes database administrator work at Level 3, while higher-level data and information-management study can support progression.",
      registration:
        "Database administration is not a statutorily regulated occupation. Employers may require product-specific database, cloud, security or availability expertise rather than a universal licence.",
      jobMarketNote:
        "SOC 3133 is on the current Temporary Shortage List. The MAC's July 2026 report recommends 18-month access, citing mixed historical evidence but stronger evidence of specific recruitment difficulty and rising demand linked to technological change, AI and emerging technologies.",
      scoreCaveat:
        "Shortage credit is moderate because the MAC describes historical evidence as mixed and the Jobs Plan as insufficiently granular. Targeted current TSL visa access is scored separately.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3 IT support occupation with current Temporary Shortage List access and a comparatively accessible technical entry route",
      entryPathway:
        "ICT Support Technician maps to SOC 3132 IT user support technicians. Skills England's Level 3 Digital Support Technician and Information Communications Technician standards provide structured routes into user support, service desk and technical support work.",
      registration:
        "IT user support is not a statutorily regulated occupation. Employers may request vendor certifications or practical support experience, but there is no single statutory licence to practise.",
      jobMarketNote:
        "SOC 3132 is on the current Temporary Shortage List under the interim arrangements. It progressed to Stage 2 of the MAC review, but no occupation-specific final recommendation is published for 3132, so current visa access is not treated as independent proof of shortage.",
      scoreCaveat:
        "The profile gives strong entry-access and current TSL visa credit while leaving shortage at zero until direct occupation-specific final evidence is available.",
    },
  },
]
