import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzBusinessOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzBusinessOverride[] = [
  {
    id: "accountant",
    countryCode: "NZ",
    editorial: {
      headline: "Strong professional pay, but no current Green List status for the generic accountant role",
      entryPathway:
        "Tahatū describes relevant accounting or business study as the normal foundation, with CA ANZ, CPA and accounting-technician pathways available for people who want professional credentials.",
      registration:
        "Generic accountant work does not require one universal New Zealand practising licence. Particular statutory, audit, insolvency or regulated financial services can impose separate professional or legal requirements.",
      jobMarketNote:
        "The profile is anchored to ANZSCO 221111 Accountant (General). Accountant 221111 is not on the current Green List. A new SMC occupational-registration rule for certain accountants is scheduled for 24 August 2026 but is not yet effective on this profile's evidence date.",
      scoreCaveat:
        "No shortage credit is awarded from the future SMC change. Salary uses Tahatū's Accountant and Auditor range, while vacancy, employer-diversity, trend and growth components remain zero.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "NZ",
    editorial: {
      headline: "Corporate finance analysis with solid pay and a conservative immigration treatment",
      entryPathway:
        "Tahatū lists finance, economics, accounting, law or similar bachelor-level study as common preparation, with relevant finance experience and CA or CPA credentials useful in some roles.",
      registration:
        "The canonical role is corporate finance and budget analysis, not regulated personal financial advice. It therefore does not carry a universal Financial Service Providers Register requirement.",
      jobMarketNote:
        "ANZSCO 221111 Accountant (General) includes Financial Analyst as a specialisation. This profile uses that corporate-finance scope and does not substitute the separately regulated Financial Investment Adviser occupation.",
      scoreCaveat:
        "No Green List or shortage credit is assigned. The score uses Tahatū Finance Analyst pay and standard skill-level-1 immigration treatment only.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "NZ",
    editorial: {
      headline: "A clear non-ICT business-analysis route without borrowed technology shortage status",
      entryPathway:
        "Tahatū says a relevant tertiary qualification in business, management, computer science, economics or a similar field is normally required, with experience useful for many analyst positions.",
      registration:
        "Business analysts are not a statutorily registered profession in New Zealand. Industry certifications can support employability but are not practising licences.",
      jobMarketNote:
        "The non-ICT canonical role is mapped to ANZSCO 224711 Management Consultant, whose Version 1.3 specialisations include Business Analyst. ICT Business Analyst 261111 is a separate occupation and its immigration settings are not borrowed here.",
      scoreCaveat:
        "Shortage remains zero and the score uses standard skilled-work access. Posting-level vacancy, employer-diversity, trend and growth signals remain unscored pending a recurring comparable series.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "NZ",
    editorial: {
      headline: "A useful supply-chain career whose modern analyst title does not map cleanly to ANZSCO 1.3",
      entryPathway:
        "Tahatū's closest transparent route is Logistics Specialist, where advanced certificate or diploma study, business or management qualifications and relevant logistics experience can all support entry.",
      registration:
        "There is no statutory occupational registration for supply-chain analysts in New Zealand.",
      jobMarketNote:
        "ANZSCO 224714 Supply Chain Analyst was introduced in a later Australian-only ANZSCO update and is not part of ANZSCO 1.3. The canonical NZ profile therefore remains uncoded until a specific job's duties can be matched to the classification used for that visa case.",
      scoreCaveat:
        "Salary uses Tahatū Logistics Specialist as the closest transparent proxy. No Green List status is borrowed from logistics-management or procurement occupations, and immigration credit is conservative because the exact code is duty-dependent.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "NZ",
    editorial: {
      headline: "A clear professional HR mapping with accessible entry and no special residence shortcut",
      entryPathway:
        "Tahatū describes business or human-resource study as useful and relevant experience as important. The career can be entered through several business and people-management study routes rather than one mandatory qualification.",
      registration:
        "Human-resource specialists do not require statutory occupational registration in New Zealand.",
      jobMarketNote:
        "The canonical HR specialist/adviser scope is mapped to ANZSCO 223111 Human Resource Adviser. It is not on the current Green List.",
      scoreCaveat:
        "The score reflects Tahatū pay, accessible entry and standard skilled-work treatment. Shortage and posting-derived components remain zero.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "NZ",
    editorial: {
      headline: "An accessible marketing profession with strong typical pay but no Green List premium",
      entryPathway:
        "Tahatū says experience is usually important and identifies business diplomas and digital-marketing study as useful routes, allowing entry without a single prescribed professional degree.",
      registration:
        "Marketing specialists are not a statutorily registered profession in New Zealand.",
      jobMarketNote:
        "ANZSCO 225113 Marketing Specialist is an exact canonical match. The occupation is not on the current Green List, so the profile uses standard skilled-work settings only.",
      scoreCaveat:
        "The relatively high score outside Green List occupations comes from Tahatū salary and accessible entry, not from an inferred shortage signal. Vacancy and growth components remain zero.",
    },
  },
  {
    id: "auditor",
    countryCode: "NZ",
    editorial: {
      headline: "The strongest Business pathway: current Tier 1 treatment for external and internal auditors",
      entryPathway:
        "Tahatū combines accountant and auditor preparation, including relevant accounting or business study and professional accounting pathways. Audit specialisation and professional development become more important as responsibility increases.",
      registration:
        "The generic profile rolls up both external and internal audit, so registration is not universal. However, auditors performing FMC audits must hold an auditor licence and affected audit firms must be registered under New Zealand's auditor-regulation framework.",
      jobMarketNote:
        "ANZSCO 221213 External Auditor and 221214 Internal Auditor are both on the current Green List Tier 1, subject to remuneration of at least NZD 45.50 per hour. Tahatū's current Accountant and Auditor midpoint sits above that threshold.",
      scoreCaveat:
        "Tier 1 status supplies the direct shortage and visa signal. The score does not add vacancy or employer-diversity points beyond that policy evidence.",
    },
  },
  {
    id: "project-manager",
    countryCode: "NZ",
    editorial: {
      headline: "Good project-management pay, but the generic title crosses too many industries for one immigration code",
      entryPathway:
        "Tahatū says project managers usually need relevant experience, while business or management study and PMI, PRINCE2, PMBOK or Agile credentials can strengthen progression into project responsibility.",
      registration:
        "There is no universal statutory project-management licence or register in New Zealand. Sector-specific engineering, construction or other regulated responsibilities can impose additional requirements.",
      jobMarketNote:
        "The generic career spans ICT, construction, engineering and other sectors. It is therefore not forced into Construction Project Manager 133111, ICT Project Manager 135112 or another sector code solely to gain that occupation's immigration treatment.",
      scoreCaveat:
        "Salary uses Tahatū's generic Project Manager range. Immigration credit is conservative until a specific role's duties and industry establish the correct occupation classification; no Green List status is borrowed.",
    },
  },
] as const
