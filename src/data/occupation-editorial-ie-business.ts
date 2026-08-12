import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "IE",
    editorial: {
      headline: "A broad accountancy career with conditional Critical Skills access for specified qualified specialist work",
      entryPathway:
        "Accountant is centred on SOC 2010 2421 Chartered and certified accountants. Common routes include degree study, professional accountancy qualifications and structured work-based progression such as Accounting Technician, but the profile does not assume one universal route for every accountant role.",
      registration:
        "Generic accountancy is not treated as one universally licensed occupation. For employment-permit purposes, however, certain non-EEA accountants must be registered with or have qualifications recognised by an accountancy body specified in the Employment Permit Regulations; statutory audit has a separate, stricter authorisation framework.",
      jobMarketNote:
        "SOLAS 2025 reports continuing demand for sophisticated business and financial technical skills, especially in financial services, but the reviewed public summary does not publish an accountant-specific current shortage finding. Current Critical Skills treatment for SOC 2421 is limited to specified qualified and specialist employments rather than every accountant job.",
      scoreCaveat:
        "No shortage points are inferred from broad financial-services demand or permit eligibility. CSEP access is conditional, while exact occupation-level salary, vacancy and growth series remain unscored until comparable Irish inputs are normalised.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "IE",
    editorial: {
      headline: "A finance-analysis career with broad financial-services demand context but no borrowed Critical Skills specialist scope",
      entryPathway:
        "Financial Analyst maps to SOC 2010 3534 Finance and investment analysts and advisers. Degree-level finance, economics, accounting, business or quantitative study is common, alongside employer-specific analytical experience and professional credentials.",
      registration:
        "The generic Financial Analyst occupation has no universal statutory professional registration requirement. Regulated financial activities can create role- or firm-specific authorisation requirements that are outside this broad occupational profile.",
      jobMarketNote:
        "SOLAS describes persistent demand for sophisticated technical skills in financial services, including regulatory and sustainable-finance capability, but does not publish an exact Financial Analyst shortage finding in the reviewed public summary. The specialist finance/investment analytics CSEP wording under SOC 2424 is not borrowed by generic SOC 3534 Financial Analyst.",
      scoreCaveat:
        "The profile receives ordinary employment-permit accessibility rather than specialist CSEP credit. Broad financial-sector demand is context only; salary, recurring vacancy and growth components stay unscored without exact comparable evidence.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "IE",
    editorial: {
      headline: "A broad business-analysis occupation where Critical Skills access is limited to the explicit big-data specialist scope",
      entryPathway:
        "Business Analyst maps to SOC 2010 2423 Management consultants and business analysts. Entry can come through business, information systems, analytics or conversion study plus practical process, change, data or requirements-analysis experience.",
      registration:
        "No universal statutory professional registration is required for generic Business Analyst work in Ireland.",
      jobMarketNote:
        "The current Critical Skills list covers SOC 2423 only for management consultants and business analysts specialising in big-data analytics with the specified IT, data-mining, modelling and advanced-mathematics capabilities or related relevant specialist skills. Generic process or change analysts are not automatically Critical Skills occupations.",
      scoreCaveat:
        "Conditional CSEP access earns visa credit, but the broad title receives no inferred shortage points. Exact salary, vacancy and growth series remain unscored until a comparable occupation-level Irish source is normalised.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "IE",
    editorial: {
      headline: "A procurement and supply-chain analysis scope with a structured apprenticeship route and ordinary permit access",
      entryPathway:
        "Supply Chain Analyst is constrained to SOC 2010 3541 Buyers and procurement officers where duties centre on supply-chain, sourcing, procurement and supplier analysis. Ireland also offers a national Supply Chain Specialist apprenticeship as a structured work-based route.",
      registration:
        "No universal statutory registration is required. Professional procurement or supply-chain credentials can be valuable but are not treated as a legal licence for the whole occupation.",
      jobMarketNote:
        "The reviewed SOLAS business and financial summary does not publish an exact Supply Chain Analyst shortage finding. SOC 3541 is not treated here as a Critical Skills occupation; ordinary General Employment Permit access may apply subject to the current permit conditions.",
      scoreCaveat:
        "The structured apprenticeship improves entry accessibility, but no shortage, salary or growth points are inferred. Warehouse managers, logistics managers and generic data analysts remain separate canonical occupations.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "IE",
    editorial: {
      headline: "A non-licensed HR professional scope with ordinary employment-permit access rather than targeted shortage treatment",
      entryPathway:
        "Human Resources Specialist maps to SOC 2010 3562 Human resources and industrial relations officers. Typical routes combine business or HR study, professional HR development and progressively responsible employee-relations, recruitment, reward or people-operations experience.",
      registration:
        "No universal statutory professional registration is required for the generic HR occupation. Professional-body membership or qualifications are not promoted into a legal licence requirement.",
      jobMarketNote:
        "The reviewed SOLAS 2025 business and financial summary does not publish an exact HR Specialist shortage finding. SOC 3562 is therefore modelled with ordinary employment-permit accessibility rather than targeted Critical Skills credit.",
      scoreCaveat:
        "Broad business-sector hiring context is not converted into occupation-specific shortage or growth. Exact salary and recurring vacancy inputs remain unscored until normalised.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "IE",
    editorial: {
      headline: "A broad marketing occupation with a verified Digital Marketing apprenticeship and ordinary permit access",
      entryPathway:
        "Marketing Specialist maps to SOC 2010 3543 Marketing associate professionals. Entry routes include marketing, communications, business or digital study, and Ireland's national Digital Marketing Level 6 apprenticeship provides a verified work-based pathway.",
      registration:
        "No universal statutory professional registration is required for the generic marketing occupation.",
      jobMarketNote:
        "The reviewed SOLAS business and financial summary does not publish an exact Marketing Specialist shortage finding. SOC 3543 is not promoted to Critical Skills status; ordinary General Employment Permit access may apply subject to current rules.",
      scoreCaveat:
        "The apprenticeship supports a higher entry-access score, but broad digital-economy demand is not converted into shortage or growth points. Salary and recurring vacancy series remain unscored.",
    },
  },
  {
    id: "auditor",
    countryCode: "IE",
    editorial: {
      headline: "A deliberately regulated statutory-audit scope with professional authorisation and conditional Critical Skills access",
      entryPathway:
        "Auditor is centred on SOC 2010 2421 but deliberately constrained to statutory financial audit. The statutory route requires recognised professional accountancy formation, supervised audit experience and the applicable audit qualification and authorisation through a recognised accountancy body.",
      registration:
        "Registration and authorisation are required for statutory company audit. IAASA oversees the statutory-audit framework, while recognised accountancy bodies qualify and register eligible statutory auditors. Internal audit, operational audit and other non-statutory assurance work can have different requirements and must not be assumed to require statutory-auditor authorisation.",
      jobMarketNote:
        "The current Critical Skills list includes specified qualified-accountant and audit-specialist employments within SOC 2421, including defined multinational global-audit cases. The reviewed SOLAS summary does not provide a separate auditor-specific shortage finding, so permit eligibility is not counted as shortage evidence.",
      scoreCaveat:
        "The profile's lower entry score reflects the statutory-audit professional pathway. It receives conditional visa credit but zero shortage credit, and exact salary, vacancy and growth components remain unscored.",
    },
  },
  {
    id: "project-manager",
    countryCode: "IE",
    editorial: {
      headline: "A business and financial project-management scope with specialist-only Critical Skills treatment",
      entryPathway:
        "Project Manager is constrained to SOC 2010 2424 Business and financial project management professionals. Entry can come through business or finance study, professional project-management training and substantial delivery experience; IT and construction project-management occupations are kept separate.",
      registration:
        "No universal statutory professional registration is required for generic business and financial project-management work.",
      jobMarketNote:
        "Current Critical Skills treatment under SOC 2424 is limited to specified finance/investment analytics, risk analytics, credit, fraud analytics and related relevant specialist skills. Generic project management is not automatically a Critical Skills occupation, and IT project managers and construction project managers have separate SOC treatment.",
      scoreCaveat:
        "The profile receives conditional CSEP visa credit but no inferred shortage points. Exact salary, vacancy intensity and growth remain unscored until comparable occupation-level Irish evidence is normalised.",
    },
  },
]
