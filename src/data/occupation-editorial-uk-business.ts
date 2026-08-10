import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "UK",
    editorial: {
      headline: "A degree/professional-qualification finance career with standard Skilled Worker eligibility but no current targeted shortage treatment",
      entryPathway:
        "Accountant is scoped to financial-accounting work within SOC 2421 Chartered and certified accountants, especially 2421/02 Financial accountants (qualified). UK routes include accounting degrees, Level 6 accounting-finance apprenticeships and professional pathways through recognised accountancy bodies.",
      registration:
        "The generic job title accountant is not subject to one statutory UK licence, although protected professional titles and regulated activities have separate requirements. Professional qualifications such as ACA, ACCA, CIMA or equivalent are commonly valued for qualified-accountant roles.",
      jobMarketNote:
        "SOC 2421 is a higher-skilled occupation on the standard Skilled Worker route. The current evidence set does not provide a sufficiently direct occupation-wide shortage finding to award UK v1 shortage points, and knowledge-sector hiring remains comparatively competitive.",
      scoreCaveat:
        "The score rewards a strong salary floor and structured training routes but does not infer shortage from professional-services demand alone. Visa credit reflects standard RQF 6+ Skilled Worker eligibility rather than TSL or ISL access.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "UK",
    editorial: {
      headline: "A higher-skilled finance profession with strong salary evidence and standard Skilled Worker access",
      entryPathway:
        "Financial Analyst maps to SOC 2422 Finance and investment analysts and advisers, with the canonical scope centred on financial analysts rather than mortgage-advice roles. Degree routes in finance, economics or quantitative disciplines and Level 6 financial-services pathways are common entry routes.",
      registration:
        "There is no single statutory licence for every financial-analyst role. Regulated investment advice or controlled functions can require employer, FCA or professional requirements that are separate from the generic analyst occupation.",
      jobMarketNote:
        "The role remains eligible through the higher-skilled Skilled Worker table, but no current targeted shortage-list status or occupation-specific MAC shortage finding is used for the UK v1 score.",
      scoreCaveat:
        "Salary receives strong credit, while shortage remains unscored and visa credit is partial because SOC 2422 uses the standard RQF 6+ Skilled Worker route.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "UK",
    editorial: {
      headline: "A professional business-change and consulting role deliberately separated from the lower-skilled TSL business-systems-analyst code",
      entryPathway:
        "Business Analyst is constrained to SOC 2431/01 Business analysts and consultants. Skills England's Business Analyst occupation spans several SOC sub-units and provides a Level 4 work-based route, but this CampCareer profile uses the professional 2431 scope rather than SOC 3549/02 Business systems analysts.",
      registration:
        "Business analysis is not a statutorily licensed profession. Employers commonly value analytical, process-improvement, stakeholder-management and domain credentials, but there is no universal registration requirement.",
      jobMarketNote:
        "SOC 2431 is eligible on the standard RQF 6+ Skilled Worker route. The current Temporary Shortage List separately covers selected jobs within SOC 3549, including Business systems analysts; that targeted treatment is not transferred to this professional 2431 profile.",
      scoreCaveat:
        "The score avoids visa-score inflation from a neighbouring lower-skilled SOC code. Shortage remains 0 until comparable occupation-specific UK evidence supports a positive signal.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "UK",
    editorial: {
      headline: "A procurement and supply-chain analysis role with accessible training routes but limited new-overseas Skilled Worker access under current rules",
      entryPathway:
        "Supply Chain Analyst is scoped to procurement and supply-chain analysis within SOC 3551 Buyers and procurement officers. Skills England provides Level 3 and Level 4 procurement-and-supply routes covering supplier analysis, sourcing, commercial decisions and supply-chain operations.",
      registration:
        "The generic supply-chain analyst occupation is not statutorily licensed. Procurement qualifications such as CIPS credentials may be valued by employers but are not a universal legal requirement.",
      jobMarketNote:
        "SOC 3551 appears in the additional RQF 3-5 occupation table but is not on the current Temporary Shortage List. Under the post-22 July 2025 rules, it is therefore not normally available for a new overseas Skilled Worker sponsorship application, outside applicable transitional or other rule exceptions.",
      scoreCaveat:
        "Visa credit is deliberately low despite a current Home Office going rate because the most important constraint is route eligibility, not salary. No occupation-specific shortage points are inferred from general supply-chain importance.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "UK",
    editorial: {
      headline: "An accessible people-profession pathway with current time-limited TSL sponsorship access but no positive shortage score",
      entryPathway:
        "Human Resources Specialist maps to SOC 3571 Human resources and industrial relations officers. Skills England provides Level 3 HR Support and Level 5 People Professional routes covering HR advice, employee relations, recruitment and people practice.",
      registration:
        "HR practice is not statutorily licensed as one profession. CIPD membership and qualifications are widely recognised by employers but are not a universal legal condition for working in HR.",
      jobMarketNote:
        "SOC 3571 is on the current Temporary Shortage List for qualifying certificates of sponsorship issued before 31 December 2026. That current immigration access is treated separately from shortage evidence; no positive occupation-specific final MAC shortage recommendation is used here.",
      scoreCaveat:
        "The profile receives targeted visa credit because current TSL access is real and time-limited, while shortage remains 0 to avoid treating interim immigration access itself as proof of labour shortage.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3-4 marketing occupation with current TSL access, but recent MAC evidence points away from shortage",
      entryPathway:
        "Marketing Specialist maps to SOC 3554 Advertising and marketing associate professionals. Skills England's Marketing Executive and Multi-channel Marketer routes provide Level 4 and Level 3 entry pathways across campaigns, digital channels, research and marketing communications.",
      registration:
        "Marketing is not a statutorily licensed profession. CIM and other professional credentials may improve employability, but there is no universal registration requirement.",
      jobMarketNote:
        "SOC 3554 is currently on the Temporary Shortage List, but the July 2026 MAC Stage 2 report recommends no future TSL access and states that historical evidence points away from shortage, including a large decline in job adverts per 100 employee jobs since 2022.",
      scoreCaveat:
        "Current targeted visa access receives credit because it remains in force through the present TSL window, while shortage is scored 0 in line with the MAC's negative shortage finding.",
    },
  },
  {
    id: "auditor",
    countryCode: "UK",
    editorial: {
      headline: "A qualified-accounting audit career where statutory audit rights are regulated, with standard Skilled Worker eligibility",
      entryPathway:
        "Auditor is scoped to qualified-accountant audit work within SOC 2421 Chartered and certified accountants. Skills England maintains a Level 7 Internal Audit Professional route, while statutory external-audit careers normally progress through recognised accountancy qualifications plus supervised audit experience.",
      registration:
        "Statutory company audit is a reserved regulated activity. To sign statutory audit reports, the individual and audit firm must satisfy recognised supervisory-body requirements; the Financial Reporting Council is the UK competent authority. Internal audit roles do not all require statutory-auditor registration.",
      jobMarketNote:
        "SOC 2421 is eligible through the standard higher-skilled Skilled Worker route. No current targeted shortage-list status or sufficiently direct occupation-wide shortage finding is used for the UK v1 score.",
      scoreCaveat:
        "The entry-burden score is conservative because statutory audit rights require professional qualification, supervised experience and registration. Visa credit is standard rather than targeted.",
    },
  },
  {
    id: "project-manager",
    countryCode: "UK",
    editorial: {
      headline: "A higher-skilled cross-sector project profession with strong salary evidence and structured Level 4-to-6 entry routes",
      entryPathway:
        "Project Manager maps to SOC 2440 Business and financial project management professionals. Skills England provides a Level 4 Associate Project Manager pathway and a Level 6 integrated-degree Project Manager route, with employment across finance, infrastructure, government, technology and services.",
      registration:
        "Project management is not statutorily licensed as one profession. APM, PRINCE2, Agile and sector-specific credentials may be requested by employers but are not a universal legal requirement.",
      jobMarketNote:
        "SOC 2440 is an RQF 6+ occupation eligible on the standard Skilled Worker route. The current evidence set does not support a separate occupation-wide shortage score, so general project demand is not converted into shortage points.",
      scoreCaveat:
        "The score reflects strong salary and multiple structured entry routes, while visa credit remains partial and shortage is held at 0 pending stronger comparable UK evidence.",
    },
  },
]
