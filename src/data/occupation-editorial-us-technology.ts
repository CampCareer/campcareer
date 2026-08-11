import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "US",
    editorial: {
      headline: "A large high-pay software profession with double-digit projected growth and job-specific H-1B potential",
      entryPathway:
        "Software Developer maps to SOC 2018 15-1252. BLS says a bachelor's degree in computer and information technology or a related field is typically needed, although employers determine the exact technical background for each role.",
      registration:
        "There is no universal federal or state occupational licence for software developers. Employer-specific technical requirements and security clearances can still apply.",
      jobMarketNote:
        "BLS reports 1,693,800 software-developer jobs in 2024, a May 2024 median annual wage of $133,080, and 15.8% projected employment growth for 2024–2034.",
      scoreCaveat:
        "Strong BLS growth is scored as demand evidence, not as a formal shortage designation. H-1B eligibility remains position-specific and requires the role to qualify as a specialty occupation tied to the relevant degree or equivalent background.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "US",
    editorial: {
      headline: "A broad analytics career represented by the BLS Data Scientists series, with explicit proxy treatment and very strong growth",
      entryPathway:
        "The canonical Data Analyst title is broader than one federal SOC. For this U.S. cohort, SOC 2018 15-2051 Data Scientists is used as the closest national quantitative analytics proxy because BLS defines it around extracting meaningful insights from data. The profile must not be read as saying every data analyst is a data scientist.",
      registration:
        "There is no universal occupational licence for data analysts or data scientists. Employers set role-specific requirements in statistics, mathematics, computing, business intelligence and domain knowledge.",
      jobMarketNote:
        "The BLS Data Scientists proxy reports 245,900 jobs in 2024, a May 2024 median annual wage of $112,590, and 33.5% projected growth for 2024–2034.",
      scoreCaveat:
        "Because the canonical title is broader than SOC 15-2051, all pay, employment and growth figures are explicitly proxy metrics. H-1B or permanent sponsorship remains specific to the actual job duties and degree requirements.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "US",
    editorial: {
      headline: "A data-infrastructure engineering career represented by Database Architects, with high pay and strong projected growth",
      entryPathway:
        "Data Engineer has no single BLS detailed occupation with that exact title. SOC 2018 15-1243 Database Architects is used as the closest infrastructure and data-architecture proxy because BLS describes architects as designing and building databases and integrating data infrastructure.",
      registration:
        "There is no universal occupational licence. Vendor cloud, database or data-platform certifications may matter to employers but are not statutory licences.",
      jobMarketNote:
        "The BLS Database Architects proxy reports 66,900 jobs in 2024, a May 2024 median annual wage of $135,980, and 8.7% projected growth for 2024–2034.",
      scoreCaveat:
        "The metrics are proxy values for the data-engineering/architecture boundary, not a claim that all data engineers are database architects. Professional immigration routes remain employer- and position-specific.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "US",
    editorial: {
      headline: "A high-pay security profession with one of the strongest national growth rates in the technology cohort",
      entryPathway:
        "Cybersecurity Analyst maps to SOC 2018 15-1212 Information Security Analysts. BLS says a bachelor's degree in a computer-related field is typical and employers often value related IT experience and security certifications.",
      registration:
        "There is no universal government licence for information security analysts. Industry certifications and security-clearance requirements may be important for particular employers or government work.",
      jobMarketNote:
        "BLS reports 182,800 information-security-analyst jobs in 2024, a May 2024 median annual wage of $124,910, and 28.5% projected employment growth for 2024–2034.",
      scoreCaveat:
        "Rapid growth is not relabeled as a federal shortage occupation. H-1B treatment depends on the specific specialty-occupation filing and the relationship between the role and the worker's qualifying education or equivalent experience.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "US",
    editorial: {
      headline: "A mature infrastructure-administration role with high pay but declining projected headcount",
      entryPathway:
        "Network Administrator maps to SOC 2018 15-1244 Network and Computer Systems Administrators. BLS says a bachelor's degree in a computer or information-science related field is typical, although some employers accept other education plus relevant experience.",
      registration:
        "There is no universal occupational licence. Vendor networking certifications can support employability but are employer credentials rather than statutory registration.",
      jobMarketNote:
        "BLS reports 331,500 network and computer systems administrator jobs in 2024, a May 2024 median annual wage of $96,800, and a 4.2% projected decline from 2024 to 2034.",
      scoreCaveat:
        "Replacement openings do not override the negative net-growth score. H-1B may be possible only when the particular administrator position independently satisfies specialty-occupation requirements.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "US",
    editorial: {
      headline: "A cloud-infrastructure engineering career represented by Computer Network Architects, with high pay and double-digit growth",
      entryPathway:
        "Cloud Engineer has no single exact BLS detailed occupation. SOC 2018 15-1241 Computer Network Architects is used as the closest infrastructure-design proxy because BLS explicitly describes cloud infrastructure within the occupation and projects demand from continued cloud-computing expansion.",
      registration:
        "There is no universal statutory cloud-engineer licence. Cloud-platform and networking certifications may be valued by employers but are not government registration requirements.",
      jobMarketNote:
        "The BLS Computer Network Architects proxy reports 179,200 jobs in 2024, a May 2024 median annual wage of $130,390, and 11.9% projected growth for 2024–2034.",
      scoreCaveat:
        "The metrics represent the cloud/network-infrastructure architecture boundary and must not be presented as an exact cloud-engineer census. BLS also describes substantial related work experience for network architects, so entry accessibility is scored below a simple bachelor-only role.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "US",
    editorial: {
      headline: "A high-pay database operations role facing slight projected contraction as cloud platforms consolidate administration",
      entryPathway:
        "Database Administrator maps to SOC 2018 15-1242. BLS says database administrators typically need a bachelor's degree in computer and information technology or a related field.",
      registration:
        "There is no universal statutory licence. Employers may require vendor or platform certifications for the database products they use.",
      jobMarketNote:
        "BLS reports 78,000 database-administrator jobs in 2024, a May 2024 median annual wage of $104,620, and a 0.7% projected decline from 2024 to 2034.",
      scoreCaveat:
        "The profile keeps database administrators separate from faster-growing Database Architects. H-1B or permanent sponsorship is possible only where the specific position and filing satisfy federal requirements.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "US",
    editorial: {
      headline: "An accessible user-support pathway with moderate pay and declining projected employment as routine support automates",
      entryPathway:
        "ICT Support Technician maps to SOC 2018 15-1232 Computer User Support Specialists. BLS says some college coursework is typical and candidates may also qualify with a high school diploma plus relevant IT certifications.",
      registration:
        "There is no universal occupational licence. Product, operating-system and support certifications are employer credentials rather than statutory registration.",
      jobMarketNote:
        "BLS reports 729,500 computer-user-support-specialist jobs in 2024, a May 2024 median annual wage of $60,340, and a 3.7% projected decline from 2024 to 2034.",
      scoreCaveat:
        "The occupation has a comparatively accessible entry route but generally does not fit the degree-specific H-1B model. Ordinary permanent employer sponsorship is possible only through the applicable case-specific labor-certification process.",
    },
  },
]
