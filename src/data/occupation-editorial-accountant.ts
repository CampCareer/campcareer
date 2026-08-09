import type { OccupationEditorial } from "./occupation-editorial-base"

export const ACCOUNTANT_OCCUPATION_EDITORIAL = [
  {
    id: "accountant",
    overview:
      "Accountants prepare and interpret financial information, maintain accounting systems and controls, advise on compliance and business structure, and support reporting, budgeting, taxation, insolvency and decision-making. For CampCareer Australia, the canonical Accountant maps to current OSCA 211131 Accountant (General), not to the broader accountant family that also includes Management Accountant and Taxation Accountant.",
    tasks: [
      "Prepare and review financial statements, management reports and supporting accounting records",
      "Analyse income, expenditure, cash flow, costs and financial performance to support business decisions",
      "Maintain accounting systems, internal controls, reconciliations and records that support statutory and management reporting",
      "Advise on business structures, accounting policies, reporting obligations and financial processes",
      "Conduct financial investigations and support insolvency, due diligence, compliance or assurance-related work where relevant",
      "Work with management, auditors, tax specialists, finance teams and external advisers to improve the accuracy and usefulness of financial information",
    ],
    countries: {
      AU: {
        headline:
          "A CSOL-listed Skill Level 1 profession with clear accredited accounting degrees, but a 2025 national No Shortage result and a legacy labour profile that is broader than current OSCA Accountant (General)",
        entryPathway:
          "OSCA assigns Accountant (General) Skill Level 1, corresponding to a bachelor degree or higher qualification, or at least five years of relevant experience. A direct Australian undergraduate route is Macquarie University's three-year Bachelor of Professional Accounting, which is accredited by CPA Australia, Chartered Accountants Australia and New Zealand (CA ANZ), the Institute of Public Accountants (IPA) and ACCA. Macquarie also offers a two-year Master of Professional Accounting for graduates entering accounting from another discipline. Core study normally includes financial reporting, management accounting, finance, economics, business law, taxation, audit and accounting information systems.",
        registration:
          "Australia does not require every employee accountant to hold one universal licence, but ABS notes that registration or licensing may be required for certain services such as auditing. Tax-agent, company-auditor and public-practice work can have separate statutory or professional requirements. For migration, legacy ANZSCO 221111 Accountant (General) remains used and CPA Australia, CA ANZ and IPA are approved assessing authorities for accounting migration assessments.",
        jobMarketNote:
          "The exact current occupation is OSCA 211131 Accountant (General). Legacy ANZSCO 221111 is not an exact current-observation proxy because it corresponds to both current OSCA 211131 Accountant (General) and 211133 Forensic Accountant. JSA's legacy 221111 profile reports about 139,100 workers, 22% part time, 54% female share, median age 40 and average full-time hours of 43 per week, but CampCareer keeps these values contextual rather than displaying them as exact current Accountant (General) metrics. The broader ANZSCO 2211 Accountants group reports median full-time earnings of about A$2,003 per week and A$53 per hour. The reviewed 2025 Occupation Shortage List records current OSCA 211131 Accountant (General) as No Shortage nationally and in every state and territory.",
        scoreCaveat:
          "The opportunity score gives no shortage credit because current OSCA 211131 is No Shortage nationally in the 2025 OSL. Exact employment, demographics and earnings are not scored because legacy 221111 also contains current Forensic Accountant and broader 2211 data include Management and Taxation Accountants. Broader 2211 vacancies fell about 4.46% year on year to May 2026, so vacancy-trend credit is zero; broader employment projections of about +8.44% to 2030 and +16.63% to 2035 receive partial growth credit. Accredited bachelor and professional-accounting pathways support entry-level credit, while current skilled-occupation-list coverage supports visa credit. Licensing requirements for particular accounting services add some entry burden.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
