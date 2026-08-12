import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "NL",
    editorial: {
      headline: "A structurally promising Dutch finance profession with a legally protected accountant title and NBA registration requirement",
      entryPathway:
        "The Accountancy hbo bachelor is a common academic starting point, followed by the professional education and practical-experience pathway required for the protected AA or RA accountant title. The canonical profile is scoped to professional accountant work rather than bookkeeping-only roles.",
      registration:
        "The terms accountant, Accountant-Administratieconsulent (AA) and Registeraccountant (RA) are legally protected in the Netherlands. Public use of the accountant title requires registration in the NBA accountantsregister.",
      jobMarketNote:
        "UWV lists accountants and controllers among higher-education occupations with strong current opportunities and also identifies (AA and assistant) accountants among structurally promising financial occupations.",
      scoreCaveat:
        "Shortage evidence is strong, but entry and burden scores reflect the additional professional education, practical experience and NBA registration needed to use the protected accountant title. Salary uses a Studiekeuze123 Accountancy graduate starting-pay proxy rather than an occupation median.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "NL",
    editorial: {
      headline: "A higher-education finance-analysis role supported by UWV demand for financial expertise but without occupation-specific immigration treatment",
      entryPathway:
        "Finance & Control, finance, economics and quantitative business degrees are common entry routes. The canonical scope is financial analysis and investment/finance analysis rather than regulated personal investment advice.",
      registration:
        "Financial analysis is not universally a statutorily registered profession. Specific regulated financial-services activities can trigger separate employer, conduct or competence requirements that are not applied to every analyst role.",
      jobMarketNote:
        "UWV reports strong opportunities for financial professionals and notes growing demand for financial experts as data analysis and digital transformation reshape higher-level finance work.",
      scoreCaveat:
        "The profile receives positive labour-market credit without treating financial-sector demand as an immigration fast track. Salary is a Finance & Control graduate starting-pay proxy.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "NL",
    editorial: {
      headline: "A business-change and organisation-analysis role aligned with structurally promising Dutch business-consulting work",
      entryPathway:
        "Bedrijfskunde, Business Administration and related programmes provide direct routes into business analysis, organisation consulting and process-improvement work. The canonical occupation maps to management and organisation analysis rather than ICT data analysis.",
      registration:
        "Business analysis is not a statutorily licensed profession in the Netherlands. Employers may value sector, process, Agile or analysis credentials, but no universal register applies.",
      jobMarketNote:
        "UWV includes business consultants and bedrijfskundigen among structurally promising occupations in the finance/administration, HR, organisation and strategy segment.",
      scoreCaveat:
        "The shortage component reflects this organisation/business-consulting evidence, while salary uses a Bedrijfskunde graduate proxy and migration credit stays conservative.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "NL",
    editorial: {
      headline: "A logistics-analysis role supported by persistent Dutch transport, planning and supply-chain demand",
      entryPathway:
        "Logistics Management and Logistics Engineering are direct higher-education routes covering planning, inventory, procurement, distribution and quantitative logistics improvement. The modern Supply Chain Analyst title is retained as a Netherlands career scope rather than forced into one legacy ISCO unit group.",
      registration:
        "Supply-chain analysis is not a statutorily licensed profession. Procurement or logistics credentials can be employer preferences but are not universal legal requirements.",
      jobMarketNote:
        "UWV identifies transport and logistics as a sector with durable opportunities and lists production and transport planners among structurally promising occupations.",
      scoreCaveat:
        "The score uses logistics/planning evidence without claiming that every supply-chain analyst vacancy is a shortage occupation. Salary is a Logistics Management graduate starting-pay proxy.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "NL",
    editorial: {
      headline: "A professional HR role with a clear education pathway but only limited direct shortage evidence in the current UWV set",
      entryPathway:
        "Human Resource Management hbo programmes cover recruitment, employee relations, remuneration, development, labour-market policy and organisational change and provide the main direct study pathway.",
      registration:
        "HR practice is not a statutorily registered profession. Professional memberships and specialist labour-law or payroll knowledge may be valued, but no universal personal register is required.",
      jobMarketNote:
        "UWV's broader organisation-and-strategy segment contains structurally promising occupations, but the current reviewed evidence does not directly identify generic HR specialists as a severe shortage occupation. Studiekeuze123 also reports weaker employment expectations for the broad HRM study than for shortage-heavy fields.",
      scoreCaveat:
        "Only limited shortage credit is used. The salary input is the current Human Resource Management graduate starting-pay proxy rather than a national HR salary measure.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "NL",
    editorial: {
      headline: "A digitalising marketing profession with broad entry routes but no current occupation-wide shortage score",
      entryPathway:
        "Commerciële Economie and related marketing programmes provide direct routes into campaign, market-research, digital-marketing and commercial-analysis work.",
      registration:
        "Marketing is not a statutorily licensed profession in the Netherlands. Professional marketing credentials may support employability but are not a universal legal condition.",
      jobMarketNote:
        "UWV notes growing value in digital marketing and content skills, but the reviewed current evidence does not establish generic marketing specialists as an occupation-wide shortage. Studiekeuze123 reports weaker employment expectations for the broad Commerciële Economie study.",
      scoreCaveat:
        "Shortage remains zero to avoid converting digital-skill demand into a broad shortage claim. Salary uses the Commerciële Economie graduate starting-pay proxy.",
    },
  },
  {
    id: "auditor",
    countryCode: "NL",
    editorial: {
      headline: "A regulated statutory-audit scope within the Dutch accountancy profession, with strong finance demand but a substantial qualification burden",
      entryPathway:
        "The canonical Auditor profile is scoped to external/statutory financial audit. Entry normally builds from Accountancy study into the RA/AA professional pathway, practical experience and the authorisations needed for statutory assurance work.",
      registration:
        "Statutory external audit is regulated. The responsible external accountant must be an eligible registered accountant and be entered in the AFM public register through a licensed accountantsorganisation; the broader accountant title itself is protected through NBA registration.",
      jobMarketNote:
        "Audit benefits from the same strong UWV market signal for accountants and controllers, but the profile does not assume that every internal-control or compliance role is a statutory auditor.",
      scoreCaveat:
        "The score deliberately applies a heavier entry and regulatory burden than the general Accountant profile because statutory audit signing rights require additional professional and AFM/NBA conditions.",
    },
  },
  {
    id: "project-manager",
    countryCode: "NL",
    editorial: {
      headline: "A cross-sector project profession with broad business-study routes but no generic occupation-wide Dutch shortage designation",
      entryPathway:
        "Bedrijfskunde, Business Administration, technical business and sector-specific degrees provide common routes into project coordination and project management. Because project managers span many industries, the canonical role remains an explicit Netherlands career scope rather than forcing one legacy ISCO-08 unit group.",
      registration:
        "Project management is not a statutorily licensed profession. PRINCE2, Agile, IPMA and sector-specific credentials may be requested by employers but are not universal legal requirements.",
      jobMarketNote:
        "UWV added event managers/project managers events to the 2026 promising list and reports strong project-manager demand in construction, but those sector-specific signals are not transferred wholesale to the generic cross-sector Project Manager profile.",
      scoreCaveat:
        "Only limited shortage credit is used. Salary and entry values use the broad Bedrijfskunde graduate pathway, and migration remains employer- and permit-dependent.",
    },
  },
]
