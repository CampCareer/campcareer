import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 Software Developer occupation, kept separate from web/mobile, DevOps and AI/ML specialist codes",
      entryPathway:
        "SSOC 2024 maps the canonical role directly to 25121 Software developer. Computer science, software engineering and related computing degrees are common routes, but practical programming, projects, internships and production engineering skills remain important. Fifteen approved Singapore programmes are retained as related study pathways because their reviewed staging relation is common_pathway rather than a direct occupational qualification.",
      registration:
        "There is no universal statutory occupational licence required to work as a Software Developer in Singapore. Professional or vendor certifications can support employability but are not legal permission to practise the occupation.",
      jobMarketNote:
        "SSOC 2024 provides a clean occupation anchor, but CampCareer does not yet publish a normalised recurring 25121 shortage, vacancy, earnings or growth series for cross-country scoring.",
      scoreCaveat:
        "SG v1 scores accessible graduate entry and moderate practical-experience burden only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 Statistical Officer/Data Analyst occupation distinct from Data Scientist and ICT Business Analyst",
      entryPathway:
        "Data Analyst maps directly to 21231 Statistical officer/Data analyst. Analytics, statistics, data science, economics and quantitatively focused business programmes provide relevant preparation, while practical SQL, spreadsheet, visualisation and statistical skills remain central. Ten approved Singapore programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational licence required to work as a Data Analyst in Singapore.",
      jobMarketNote:
        "SSOC separates 21231 from 21222 Data scientist and 25112 ICT business process consultant/business analyst, so CampCareer does not mix those labour scopes into the canonical Data Analyst profile.",
      scoreCaveat:
        "Only entry accessibility and burden are scored in the foundation phase. Demand, salary, growth and visa evidence remain deferred.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 Data Engineer occupation separated from database administration and architecture",
      entryPathway:
        "SSOC 2024 provides 25213 Data engineer as a distinct occupation. Data, computing and engineering degrees can support entry, but production roles often expect database, SQL, programming, cloud and pipeline experience. Five approved Singapore programmes are retained as related study pathways.",
      registration:
        "There is no universal statutory occupational licence required to work as a Data Engineer in Singapore.",
      jobMarketNote:
        "The exact 25213 anchor avoids using database-administration or general software roles as false substitutes, while current comparable market enrichment remains deferred.",
      scoreCaveat:
        "SG v1 reflects a degree-accessible but experience-sensitive pathway. Shortage, vacancy, earnings, growth and visa components remain zero pending the common enrichment phase.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "SG",
    editorial: {
      headline: "A reviewed cybersecurity analyst umbrella across SSOC risk, security-operations, incident-investigation and threat-analysis specialties",
      entryPathway:
        "SSOC 2024 does not publish one generic Cybersecurity Analyst five-digit occupation. CampCareer therefore preserves 25241 Cyber risk specialist, 25243 Security operations specialist, 25246 Cyber incident investigation specialist, 25247 Threat analysis specialist and 25249 Cybersecurity professional n.e.c. as non-rollup references. Two approved Singapore Information Security programmes are retained as direct academic pathways.",
      registration:
        "There is no universal personal occupational licence for every Cybersecurity Analyst. Singapore's Cybersecurity Act separately licenses providers of specified services, currently penetration testing and managed security operations centre monitoring. That service-provider regime can apply to businesses or individuals providing those licensable services, but it is not attributed to every employee analyst role.",
      jobMarketNote:
        "Because analyst work is distributed across several SSOC cybersecurity specialties, CampCareer does not fabricate one exact analyst market series by aggregating the whole 2524 group.",
      scoreCaveat:
        "The provisional score reflects structured technical study and moderate practical-experience burden only. Market and visa components remain unscored.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 network and systems administration occupation with an operational infrastructure focus",
      entryPathway:
        "Network Administrator maps to 25220 Network/Server/Applications/Computer systems administrator. Computing, computer-engineering and information-systems study plus hands-on network, server and operating-system administration provide common routes; five approved Singapore programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational licence required to work as a Network Administrator in Singapore. Telecommunications and internet-service licensing applies to regulated service providers rather than creating a general personal licence for network administrators.",
      jobMarketNote:
        "The direct 25220 scope is kept separate from 2523 infrastructure/platform professionals and 35121 IT infrastructure technicians.",
      scoreCaveat:
        "SG v1 recognises accessible technical study but also the experience often expected for dedicated administrator roles. Market and visa components remain unscored.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 Cloud Specialist anchor, kept separate from the dedicated DevOps Engineer code",
      entryPathway:
        "Cloud Engineer is anchored to 25231 Cloud specialist. Computer science, software engineering and ICT degrees can lead toward cloud work, but production cloud roles commonly require networking, Linux, automation, security, infrastructure-as-code and platform experience. Ten approved Singapore computing programmes are retained as related pathways.",
      registration:
        "There is no universal statutory personal licence required for Cloud Engineers. Cloud-provider certifications and Singapore's MTCS cloud-security certification scheme concern skills or service-provider assurance and are not personal occupational licences to practise cloud engineering.",
      jobMarketNote:
        "SSOC 2024 separately identifies 25125 DevOps engineer, so CampCareer does not automatically merge DevOps into the canonical Cloud Engineer occupation.",
      scoreCaveat:
        "The score reflects an experience-sensitive technical route only. Shortage, vacancy, salary, growth and visa components remain deferred.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 Data/Database Administrator occupation separated from database architecture and data engineering",
      entryPathway:
        "Database Administrator maps directly to 25211 Data/Database administrator. Computer science, information systems and ICT study provide a foundation, while employers commonly value SQL, database operations, backup, recovery, security and systems experience. Eight approved Singapore programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational licence required to work as a Database Administrator in Singapore.",
      jobMarketNote:
        "SSOC 25211 is kept distinct from 25212 Data/Database architect and 25213 Data engineer, avoiding false roll-up of separate data-platform roles.",
      scoreCaveat:
        "SG v1 scores structured entry and moderate experience burden only. Comparable market and visa evidence remains unscored.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 2024 IT Support Technician occupation with accessible technical and workplace entry routes",
      entryPathway:
        "ICT Support Technician maps directly to 35123 IT support technician. ICT diplomas, computing qualifications, vendor training and hands-on troubleshooting experience are common routes. Five approved degree programmes are retained as related rather than direct technician qualifications.",
      registration:
        "There is no universal statutory occupational licence required to work as an IT Support Technician in Singapore.",
      jobMarketNote:
        "SSOC 35123 is distinct from 35121 IT infrastructure technician and 35122 IT security technician, so those adjacent technical occupations are not rolled into the canonical support profile.",
      scoreCaveat:
        "The foundation score recognises accessible entry and low universal licensing burden only. Market, earnings, growth and visa evidence remains deferred.",
    },
  },
]
