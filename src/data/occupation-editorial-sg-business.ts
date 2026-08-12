import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 24111 accounting occupation with public-accountancy work kept behind ACRA's separate statutory boundary",
      entryPathway:
        "Accountant maps directly to SSOC 2024 code 24111 Accountant (excluding tax accountant). Accountancy and accounting degrees provide the clearest academic route, and five approved Singapore programmes are retained as direct study pathways. Audit and tax occupations remain separately classified.",
      registration:
        "General accounting work does not require Public Accountant registration. ACRA separately requires Public Accountant registration for public accountancy services such as auditing and reporting on financial statements, so those reserved services are not attributed to every accountant.",
      jobMarketNote:
        "The SSOC mapping is direct, but CampCareer has not yet normalised an exact recurring 24111 shortage, vacancy, salary or growth series into the common Singapore scoring model.",
      scoreCaveat:
        "SG v1 credits the clear degree pathway and low broad-role licensing burden. Market and occupation-specific visa components remain unscored until the later enrichment phase.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 24131 finance-analysis occupation, distinct from financial advice, risk/compliance and portfolio management",
      entryPathway:
        "Financial Analyst maps directly to SSOC 24131. Finance, quantitative finance, economics, accountancy and related analytical degrees are common preparation routes. Fourteen approved Singapore programmes are retained as related study pathways rather than claims of occupational certification.",
      registration:
        "There is no universal statutory occupational registration for the broad Financial Analyst role. Particular regulated financial-services activities or representative functions can have separate licensing or appointment requirements.",
      jobMarketNote:
        "The exact classification anchor is clean, but current comparable occupation-level demand, earnings and growth inputs have not yet been normalised into CampCareer SG v1.",
      scoreCaveat:
        "Only structured graduate entry and low broad-role regulatory burden are scored. Shortage, vacancy, salary, growth and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "SG",
    editorial: {
      headline: "A non-ICT Business Analyst mapped directly through SSOC 24212 Business consultant",
      entryPathway:
        "SSOC 24212 Business consultant explicitly includes Business analyst and covers analysis of business position, structure and processes and recommendations for improvement. Six approved business-analytics and business-technology programmes are retained as related study pathways.",
      registration:
        "There is no universal statutory registration for non-ICT Business Analysts. ICT business analysis is separately classified under SSOC 25112 and is intentionally outside this canonical Business Analyst profile.",
      jobMarketNote:
        "CampCareer keeps the non-ICT scope distinct from ICT business analysis and does not use broader consulting or technology data as exact Business Analyst market evidence.",
      scoreCaveat:
        "SG v1 scores the academic entry route and low licensing burden only. Labour-market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "SG",
    editorial: {
      headline: "A cross-code supply-chain analytics umbrella spanning business consulting and logistics planning rather than one invented SSOC code",
      entryPathway:
        "Singapore has no single five-digit SSOC occupation titled Supply Chain Analyst. The canonical scope spans 24212 Business consultant, which explicitly includes Supply chain consultant, and 33461 Logistics/Production planner, which includes Logistics solutions analyst and inventory/production analysis. Four approved programmes are retained as related study pathways.",
      registration:
        "There is no universal statutory occupational registration for Supply Chain Analysts. Employer, procurement, trade, logistics-security or sector-specific compliance requirements can apply separately.",
      jobMarketNote:
        "The consulting and logistics-planning reference codes are preserved separately rather than merged into a fabricated exact salary, vacancy or shortage series.",
      scoreCaveat:
        "The multi-code mapping remains provisional. Entry accessibility is scored, while all market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "SG",
    editorial: {
      headline: "A broad HR specialist profile spanning SSOC 24231 specialist consulting and 24233 generalist HR work",
      entryPathway:
        "Human Resources Specialist spans SSOC 24231 Human resource consultant and 24233 Personnel/Human resource officer. The first explicitly includes compensation and benefits specialists and talent acquisition specialists, while the second covers recruitment, HR development, remuneration and general personnel administration. Two approved Singapore HR programmes are direct study pathways.",
      registration:
        "There is no universal statutory occupational registration for Human Resources Specialists. Recruitment-agency, industrial-relations and other specialised activities can carry separate organisational or role-specific requirements.",
      jobMarketNote:
        "Because specialist consulting and in-house generalist work are separated in SSOC, CampCareer does not manufacture one exact HR-specialist market series at foundation stage.",
      scoreCaveat:
        "SG v1 scores the clear academic route and low broad-role regulatory burden only. Market and visa components remain unscored.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "SG",
    editorial: {
      headline: "A marketing umbrella across SSOC market research, strategy/planning and digital marketing occupations",
      entryPathway:
        "The neutral Marketing Specialist role spans SSOC 24312 Market research professional, 24313 Marketing strategy/planning professional and 24314 Digital marketing professional. Three approved Singapore marketing and digital-media programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational registration for Marketing Specialists. Advertising, consumer-protection, financial-promotion or sector-specific compliance duties remain separate from occupational registration.",
      jobMarketNote:
        "Research, strategy and digital marketing are kept as separate official classifications and are not collapsed into unsupported exact occupation-level labour statistics.",
      scoreCaveat:
        "SG v1 credits degree-accessible entry and low licensing burden only. Shortage, vacancy, salary, growth and visa components remain zero.",
    },
  },
  {
    id: "auditor",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 24112 audit occupation containing both internal and external auditors, with statutory public audit kept behind ACRA registration",
      entryPathway:
        "Auditor maps directly to SSOC 24112 Auditor (accounting), which explicitly includes Audit senior, External auditor and Internal auditor. Accountancy degrees provide a common academic foundation; five approved Singapore programmes are retained as related pathways because study alone does not confer public-audit authority.",
      registration:
        "ACRA requires Public Accountant registration to provide public accountancy services such as auditing and reporting on financial statements. Because SSOC 24112 also includes Internal auditor, CampCareer does not mark every Auditor job as universally requiring PA registration.",
      jobMarketNote:
        "The direct classification covers materially different statutory and internal-audit scopes, so regulatory evidence is not converted into shortage or demand points.",
      scoreCaveat:
        "The foundation score recognises graduate entry but applies a regulatory-burden discount for the statutory external-audit branch. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "project-manager",
    countryCode: "SG",
    editorial: {
      headline: "A cross-industry Project Manager umbrella with SSOC 24213 retained only as the closest non-sector business-project reference",
      entryPathway:
        "Singapore does not provide one cross-industry five-digit SSOC occupation for generic Project Manager. SSOC 24213 Business/Financial project management professional is the closest non-sector business-project reference, while construction, ICT, logistics and other project managers are classified under their sectors. Four approved project, business and engineering programmes are related pathways.",
      registration:
        "There is no universal statutory registration for cross-industry Project Managers. Sector-specific appointments, professional engineering work, construction responsibilities or regulated financial activities can impose narrower requirements.",
      jobMarketNote:
        "CampCareer does not present 24213 or any one sector code as exact labour-market evidence for the broader canonical Project Manager career.",
      scoreCaveat:
        "Entry credit is moderated because dedicated project-management roles commonly depend on prior domain and delivery experience. Market and visa components remain unscored.",
    },
  },
]
