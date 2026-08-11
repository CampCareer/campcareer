import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "US",
    editorial: {
      headline: "A large business profession with steady growth, solid pay and a CPA boundary that applies only to regulated public-accounting work",
      entryPathway:
        "Accountant uses the accountant scope of SOC 2018 13-2011 Accountants and Auditors. BLS identifies a bachelor's degree in accounting or a related field as the typical entry route.",
      registration:
        "Generic accounting employment does not require one nationwide personal licence. CPAs are licensed by state boards, and certain public-accounting or SEC-reporting responsibilities require CPA status.",
      jobMarketNote:
        "The combined BLS Accountants and Auditors series reports 1,579,800 jobs in 2024, a May 2024 median annual wage of $81,680, and 4.6% projected growth for 2024–2034.",
      scoreCaveat:
        "The national BLS series combines accountants and auditors, so the employment and pay figures are not an accountant-only census. Growth and openings are demand indicators, not a federal shortage designation, and H-1B/PERM remain job- and filing-specific.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "US",
    editorial: {
      headline: "A high-pay finance occupation with steady national growth and degree-specific professional pathways",
      entryPathway:
        "Financial Analyst maps to SOC 2018 13-2051 Financial and Investment Analysts. BLS lists a bachelor's degree as the typical entry credential.",
      registration:
        "There is no universal occupational licence for Financial Analysts. Particular investment, securities or advisory functions can trigger separate federal, state or employer registration requirements that are outside this generic occupation profile.",
      jobMarketNote:
        "BLS reports 368,500 Financial and Investment Analyst jobs in 2024, a 2024 median annual wage of $101,350, and 5.7% projected growth for 2024–2034.",
      scoreCaveat:
        "The profile does not roll Personal Financial Advisors or Financial Risk Specialists into this occupation. H-1B credit is conditional on the actual position independently requiring a degree in a specific specialty; PERM remains employer-led.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "US",
    editorial: {
      headline: "A strong-growth analytical business pathway using Management Analysts as an explicit national proxy",
      entryPathway:
        "Business Analyst has no single exact BLS detailed title. SOC 2018 13-1111 Management Analysts is used as the closest national business-process and organizational-analysis proxy; BLS lists bachelor's-level entry and commonly less than five years of related experience.",
      registration:
        "There is no universal statutory Business Analyst licence. Employer certifications or domain credentials may be preferred but are not a nationwide legal requirement.",
      jobMarketNote:
        "The Management Analysts proxy reports 1,075,100 jobs in 2024, a 2024 median annual wage of $101,190, and 8.8% projected growth for 2024–2034.",
      scoreCaveat:
        "Management Analyst metrics are a declared proxy and are not presented as an exact census of every Business Analyst title. Strong growth is not converted into shortage status, and immigration credit remains role-specific.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "US",
    editorial: {
      headline: "A fast-growing supply-chain pathway using the national Logisticians series as a transparent occupational proxy",
      entryPathway:
        "Supply Chain Analyst uses SOC 2018 13-1081 Logisticians as the closest national proxy because BLS defines Logisticians as workers who analyze and coordinate an organization's supply chain. Bachelor's-level entry is typical.",
      registration:
        "There is no universal statutory licence for Supply Chain Analysts or Logisticians. Voluntary logistics, procurement and supply-chain certifications may be employer-valued.",
      jobMarketNote:
        "BLS reports 241,000 Logisticians jobs in 2024, a 2024 median annual wage of $80,880, and 16.7% projected growth for 2024–2034.",
      scoreCaveat:
        "The Logisticians series is a declared supply-chain proxy and does not include every procurement, planning or operations-analytics title. The 16.7% projection receives growth credit but is not treated as a federal shortage designation.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "US",
    editorial: {
      headline: "A very large people-operations profession with steady growth and broad employer demand",
      entryPathway:
        "Human Resources Specialist maps directly to SOC 2018 13-1071 Human Resources Specialists. BLS lists a bachelor's degree as typical entry education.",
      registration:
        "No nationwide statutory HR licence is required. Voluntary professional credentials can help but are not universal legal prerequisites.",
      jobMarketNote:
        "BLS reports 944,300 Human Resources Specialist jobs in 2024, a May 2024 median annual wage of $72,910, and 6.2% projected growth for 2024–2034.",
      scoreCaveat:
        "Replacement openings and broad employer demand are not converted into shortage status. H-1B eligibility cannot be inferred from the title alone and depends on the specific position's degree-specialty requirements.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "US",
    editorial: {
      headline: "A large data-driven marketing occupation with healthy growth and broad cross-industry demand",
      entryPathway:
        "Marketing Specialist maps to SOC 2018 13-1161 Market Research Analysts and Marketing Specialists. BLS lists bachelor's-level entry, commonly in market research or a related business, communications or social-science field.",
      registration:
        "There is no universal statutory Marketing Specialist licence. Platform, analytics and professional marketing certifications are voluntary or employer-specific.",
      jobMarketNote:
        "BLS reports 941,700 jobs in the 13-1161 series in 2024, a May 2024 median annual wage of $76,950, and 6.7% projected growth for 2024–2034.",
      scoreCaveat:
        "The BLS series combines market-research analysts and marketing specialists. Growth is scored as labor-demand evidence rather than shortage, and H-1B/PERM access remains dependent on the actual role and filing.",
    },
  },
  {
    id: "auditor",
    countryCode: "US",
    editorial: {
      headline: "An accounting-control profession sharing the national Accountants and Auditors series, with CPA requirements limited to regulated public-accounting boundaries",
      entryPathway:
        "Auditor uses the auditor scope of SOC 2018 13-2011 Accountants and Auditors. Bachelor's-level accounting or related education is the typical entry pathway.",
      registration:
        "Auditing is not universally licensed across every internal, operational or private assurance role. CPAs are state-licensed, and specific public-accounting or SEC-reporting responsibilities can require CPA status.",
      jobMarketNote:
        "The combined BLS Accountants and Auditors series reports 1,579,800 jobs in 2024, a May 2024 median annual wage of $81,680, and 4.6% projected growth for 2024–2034.",
      scoreCaveat:
        "Because BLS does not publish a separate national auditor-only projection series, the metrics are shared with Accountants and Auditors and must not be interpreted as auditor-only employment. The public-accounting licence boundary is preserved separately.",
    },
  },
  {
    id: "project-manager",
    countryCode: "US",
    editorial: {
      headline: "A large project-delivery profession with six-figure median pay and steady national growth",
      entryPathway:
        "Project Manager maps to SOC 2018 13-1082 Project Management Specialists for the business-category scope. BLS lists a bachelor's degree as typical entry education.",
      registration:
        "There is no universal statutory Project Manager licence. PMP and similar credentials are voluntary professional qualifications rather than nationwide legal permission to practise.",
      jobMarketNote:
        "BLS reports 1,046,300 Project Management Specialist jobs in 2024, a May 2024 median annual wage of $100,750, and 5.6% projected growth for 2024–2034.",
      scoreCaveat:
        "This profile uses the cross-industry Project Management Specialists occupation and does not substitute construction managers or discipline-specific technical managers. H-1B credit remains conditional on the specific role independently meeting specialty-occupation requirements.",
    },
  },
]
