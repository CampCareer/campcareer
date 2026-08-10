import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "CA",
    editorial: {
      headline: "A broad accounting pathway with strong programme availability and high median pay, but a balanced national labour outlook",
      entryPathway:
        "Accountant maps to NOC 11100 Financial auditors and accountants. University or college accounting study is a common entry route, while the CPA pathway adds approved professional education, practical experience and provincial or territorial certification for candidates pursuing the protected CPA designation or public-accounting practice.",
      registration:
        "Generic accounting work is not treated here as universally licensed, but the CPA designation is regulated and public-accounting practice usually requires licensing by the applicable provincial or territorial body. Applicants should distinguish an accounting job from use of a protected professional designation.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.36 per hour for Accountant. The reviewed COPS evidence for NOC 11100 indicates national labour demand and supply are expected to remain broadly balanced over 2024–2033.",
      scoreCaveat:
        "Accountant shares NOC 11100 with financial auditors, so the broader employment total is not presented as an accountant-only count. No shortage or Express Entry occupation-category credit is awarded, and vacancy components remain unscored without a comparable reviewed time series.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "CA",
    editorial: {
      headline: "A high-paying finance career with established study pathways, balanced national outlook and significant credential expectations",
      entryPathway:
        "Financial Analyst maps to NOC 11101 Financial and investment analysts. A bachelor's degree in finance, accounting, commerce, economics or business is normally expected, and Job Bank notes that CFA or other recognized financial designations are commonly required or preferred for many roles.",
      registration:
        "There is no single national occupational licence for every financial analyst role. Employer and securities-industry requirements can vary by duties, and professional designations such as CFA are separate from a universal government licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 43.27 per hour and COPS reports about 77,000 workers across NOC 11101 in 2023. The national 2024–2033 outlook is balance.",
      scoreCaveat:
        "The score uses exact Financial Analyst wage evidence but does not award shortage or occupation-category immigration points. Entry credit is conservative because the role is university-heavy and professional financial designations are commonly expected.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "CA",
    editorial: {
      headline: "A business-analysis career within management consulting, with high median pay and direct international study routes but balanced national supply",
      entryPathway:
        "Business Analyst is represented by the business-management analyst titles within NOC 11201 Professional occupations in business management consulting. University study in business, commerce, management, information systems or analytics is common, with direct business analytics and business analysis programmes in the reviewed Canada catalogue.",
      registration:
        "Business Analyst is not a nationally licensed occupation. Employers generally assess post-secondary education, analytical and process-improvement skills, domain knowledge and project experience rather than a mandatory occupational licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 44.10 per hour for business-management analyst titles. COPS projects the broader NOC 11201 group to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "The canonical title is narrower than all of NOC 11201, so the broader employment total is not treated as a Business Analyst-only count. The broader group is balanced and the occupation is not in a current Express Entry occupation category.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "CA",
    editorial: {
      headline: "A supply-chain analysis pathway with strong programme choice and high median pay, using a narrower title inside the management-consulting NOC",
      entryPathway:
        "Supply Chain Analyst is represented by the Job Bank title Supply Chain Process Analyst within NOC 11201 Professional occupations in business management consulting. Business, supply-chain, logistics, operations or analytics study provides a common route, with multiple current international programmes in the verified catalogue.",
      registration:
        "There is no single national occupational licence for supply-chain analysts. Industry certifications can strengthen employability, but they are not treated here as a universal statutory requirement.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 44.10 per hour for Supply Chain Process Analyst. The broader NOC 11201 group is projected to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "Because the title is narrower than NOC 11201, no broader employment total is presented as a supply-chain analyst-only count. The verified programme link is a common pathway rather than an occupation-specific licence route, so it is published as related.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "CA",
    editorial: {
      headline: "A well-supported HR pathway with high median pay and many international programmes, while long-term national labour supply remains balanced",
      entryPathway:
        "Human Resources Specialist maps directly to NOC 11200 Human resources professionals. University or college study in human resources, business administration, industrial relations, commerce or psychology is common, and the verified Canada catalogue contains many direct HR programmes.",
      registration:
        "There is no single national HR licence. Job Bank notes that some employers may require a CHRP or related professional designation, with designation structures varying by province and professional association.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.87 per hour. COPS reports about 126,700 workers in NOC 11200 in 2023 and projects national labour demand and supply to remain balanced over 2024–2033.",
      scoreCaveat:
        "No shortage or Express Entry occupation-category points are awarded. The score retains strong salary and study-route components while leaving vacancy intensity, trend and growth unscored under the current evidence standard.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "CA",
    editorial: {
      headline: "An accessible marketing career with extensive international study routes and mid-to-high pay, but a balanced national long-term outlook",
      entryPathway:
        "Marketing Specialist maps to NOC 11202 Professional occupations in advertising, marketing and public relations. Business, marketing, communications and digital-marketing programmes are common entry routes, with extensive direct international options in the verified Canada catalogue.",
      registration:
        "Marketing Specialist is not a nationally licensed occupation. Employers generally assess education, portfolio or campaign experience, digital tools, communication skills and sector knowledge rather than a statutory professional licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 35.58 per hour. The reviewed national evidence for NOC 11202 indicates labour demand and supply are expected to remain broadly balanced over 2024–2033.",
      scoreCaveat:
        "The occupation receives no shortage or occupation-category immigration credit. Its salary score follows the current Canada hourly-wage bands, while point-in-time posting counts are not converted into vacancy or trend points.",
    },
  },
  {
    id: "auditor",
    countryCode: "CA",
    editorial: {
      headline: "A regulated-leaning financial audit pathway sharing NOC 11100 with accountants, with high median pay but a balanced national outlook",
      entryPathway:
        "Auditor is represented by financial-auditor titles within NOC 11100 Financial auditors and accountants. Job Bank states that auditors normally require the education, professional training and recognition used for Chartered Professional Accountants, plus accounting experience.",
      registration:
        "Auditing has a higher credential burden than generic accounting. CPA certification is regulated by provincial and territorial bodies, public-accounting practice usually requires licensing, and some internal-audit roles may also value or require separate professional recognition.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 40.36 per hour for Auditor - Finance. The NOC 11100 national 2024–2033 outlook is balance.",
      scoreCaveat:
        "Auditor shares NOC 11100 with accountants, so the broader employment total is not treated as auditor-only. Entry credit is lower and burden is higher than generic Accountant because Job Bank identifies professional recognition and experience requirements for auditors.",
    },
  },
  {
    id: "project-manager",
    countryCode: "CA",
    editorial: {
      headline: "A cross-sector project-management career with many study routes but no single Canadian NOC, so labour and pay evidence are deliberately not blended",
      entryPathway:
        "Project Manager is a broad global title rather than one Canadian NOC. This profile uses a business/non-technical scope spanning NOC 11201 management-consulting project titles and NOC 13100 non-technical administrative project-manager titles, while sector-specific construction, IT and engineering project roles remain outside this rollup.",
      registration:
        "Project management is not a single nationally licensed occupation. Credentials such as PMP can be valuable to employers, but requirements vary by sector, seniority and project type.",
      jobMarketNote:
        "Both reviewed business/non-technical component NOCs are nationally balanced over 2024–2033. Job Bank shows materially different median wages across project-manager titles, so this profile does not publish a synthetic national project-manager wage.",
      scoreCaveat:
        "Because no single NOC cleanly represents the canonical Project Manager, employment and salary are left unscored rather than averaging incompatible occupations. The profile also receives no current Express Entry occupation-category credit.",
    },
  },
]
