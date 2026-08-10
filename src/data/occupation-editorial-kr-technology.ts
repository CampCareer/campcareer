import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export type KoreaTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

const sourceCaveat =
  "KR v1 does not yet score exact-code salary, recurring vacancy, shortage, growth or occupation-specific visa evidence. The profile is therefore provisional and should not be read as a completed cross-country ranking."

export const KOREA_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "KR",
    editorial: {
      headline: "A large Korean software career family represented conservatively through KECO 2025 application-software development",
      entryPathway:
        "CampCareer maps the canonical Software Developer profile to KECO 2025 1332 응용 소프트웨어 개발자. Computer science, software and computing degrees are common pathways, but demonstrable programming skills and project experience can also be important entry evidence. The global canonical title is broader than this one Korean unit group, so system-software and web-only roles are not silently rolled into the profile.",
      registration:
        "There is no universal statutory personal licence required to work as an application software developer in Korea. Vendor or national technical certifications can support employability but are not treated as mandatory entry-to-practice licences.",
      jobMarketNote:
        "Korea has an active software-development labour market and KEIS continues to publish sector research, but KR v1 does not convert industry-wide software signals into an exact KECO 1332 shortage or salary score.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "data-analyst",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 2025 data-analysis mapping with multiple verified Korean data-science and statistics study pathways",
      entryPathway:
        "The canonical Data Analyst profile maps directly to KECO 2025 1352 데이터 분석가. Data science, statistics, mathematics, computer science and related quantitative degrees are common pathways, while practical SQL, Python, statistical modelling and visualization skills are also relevant.",
      registration:
        "Data analysis is not a universally licensed profession in Korea. Qualifications such as data-analysis or information-processing certifications may support hiring but do not create a statutory right to practise.",
      jobMarketNote:
        "The classification now separates data analysis from data-system work. CampCareer preserves that distinction and does not use broader data-professional employment as a Data Analyst-only total.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "data-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A data-platform engineering profile represented within the broader KECO 2025 data-systems profession",
      entryPathway:
        "KECO 2025 does not provide a standalone Data Engineer unit group. CampCareer uses 1351 데이터 시스템 전문가 and restricts the canonical scope to data-pipeline, data-platform and data-infrastructure engineering rather than treating every database or data-system role as a Data Engineer. Computing and data-science degrees are common pathways.",
      registration:
        "There is no universal statutory Data Engineer licence in Korea. Technical certifications may be useful evidence of capability but are not mandatory professional registration.",
      jobMarketNote:
        "Because 1351 is broader than the canonical role, broader-group salary, vacancy and employment evidence is not presented as Data Engineer-only evidence in KR v1.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 2025 information-security profession with a verified Korean cyber-security degree pathway",
      entryPathway:
        "The canonical Cybersecurity Analyst maps directly to KECO 2025 1342 정보 보안 전문가. Cybersecurity, computer science, information security and related computing degrees are common pathways, alongside practical security operations, network security, vulnerability assessment and incident-response experience.",
      registration:
        "There is no single universal personal licence required for private-sector information-security work. Specific public, regulated or assurance duties can require separate credentials or employer-defined qualifications.",
      jobMarketNote:
        "The direct classification mapping is strong, but CampCareer does not infer an occupation-wide shortage or visa advantage from the strategic importance of cybersecurity without exact evidence.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "network-administrator",
    countryCode: "KR",
    editorial: {
      headline: "A network-operations profile kept inside the broader KECO 2025 information-system operations group",
      entryPathway:
        "Network Administrator is not a standalone KECO 2025 unit group. CampCareer uses 1361 정보 시스템 운영자 and restricts the profile to network administration, infrastructure operations and closely related system-operation duties. Computer engineering, networking and information-systems study are relevant pathways.",
      registration:
        "There is no universal statutory Network Administrator licence in Korea. Network, Linux and information-processing certifications can support employability but are not treated as mandatory registration.",
      jobMarketNote:
        "KECO 1361 also includes wider information-system operations, so broader group market evidence is not treated as network-administrator-only evidence.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A cloud architecture and engineering profile mapped to the system-software profession rather than generic IT operations",
      entryPathway:
        "CampCareer maps Cloud Engineer to KECO 2025 1331 시스템 소프트웨어 개발자 because the official occupation scope includes cloud-environment design and cloud-system engineering. Software, computer science and computing degrees are common pathways, while infrastructure-as-code, Linux, networking and cloud-platform skills are important practical evidence.",
      registration:
        "Cloud engineering is not a universally licensed profession in Korea. Cloud-vendor certifications can be useful hiring signals but are not statutory professional registration.",
      jobMarketNote:
        "The mapping targets cloud architecture and engineering work. Pure cloud operations or help-desk work may sit closer to 1361 and is not silently included in the canonical profile.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "database-administrator",
    countryCode: "KR",
    editorial: {
      headline: "A database administration profile represented as a narrower scope inside KECO 2025 data-systems work",
      entryPathway:
        "The canonical Database Administrator profile maps to KECO 2025 1351 데이터 시스템 전문가, whose official scope includes database design, operation, control, support, management and backup. CampCareer restricts the profile to DBA work rather than treating all data-system professionals as database administrators.",
      registration:
        "There is no universal statutory DBA licence in Korea. Database-vendor and information-processing certifications may support employment but are not mandatory registration.",
      jobMarketNote:
        "Because 1351 also includes other data-system roles, broader-group employment or salary values are not labelled as DBA-only evidence.",
      scoreCaveat: sourceCaveat,
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "KR",
    editorial: {
      headline: "An IT user-support and systems-support profile kept within KECO 2025 information-system operations",
      entryPathway:
        "ICT Support Technician is represented within KECO 2025 1361 정보 시스템 운영자, which includes technical support for system users and troubleshooting of system operation. Information systems, computer engineering and applied IT study can support entry, while practical troubleshooting and support experience are especially important.",
      registration:
        "There is no universal statutory ICT Support Technician licence in Korea. Information-processing and vendor certifications can strengthen employability but are not mandatory professional registration.",
      jobMarketNote:
        "The official group is broader than user support alone, so CampCareer does not use 1361-wide market values as an ICT-support-only measure.",
      scoreCaveat: sourceCaveat,
    },
  },
]
