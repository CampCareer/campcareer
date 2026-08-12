import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "KR",
    editorial: {
      headline: "A broad accounting career anchored to KECO 0271, distinct from the separately regulated public-accountant profession",
      entryPathway:
        "CampCareer maps the broad Accountant career to KECO 2025 code 0271 회계 사무원 because the canonical scope includes company accounting and accounting-office work rather than only licensed public accountants. Accounting, business and finance study can provide entry, and one already-reviewed Korean Accounting master's programme is retained as direct study evidence.",
      registration:
        "There is no universal personal licence for ordinary corporate accounting or accounting-clerk work. The separate 공인회계사 profession is regulated through the national CPA examination and registration framework, so users seeking statutory public-accounting or external-audit authority must verify that separate route.",
      jobMarketNote:
        "KR v1 does not yet publish an exact recurring KECO 0271 vacancy series, comparable national salary series or occupation-specific shortage signal. The profile therefore keeps the classification and entry route separate from the regulated CPA profession and does not infer market strength from finance-sector headlines.",
      scoreCaveat:
        "Only entry accessibility and the lack of a universal licence are credited. Salary, shortage, vacancy trend, growth and occupation-specific visa components remain unscored until comparable exact-code evidence is normalised.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "KR",
    editorial: {
      headline: "A finance-analysis pathway anchored to KECO 0311, covering investment and credit analysis rather than every corporate-finance role",
      entryPathway:
        "Financial Analyst maps to KECO 2025 code 0311 투자 및 신용 분석가. Finance, economics, quantitative risk and related degrees are common entry routes; CampCareer retains two already-reviewed direct Korean programme mappings and six broader economics pathways as related study.",
      registration:
        "There is no single universal statutory personal licence for the canonical financial-analyst role. Specific securities, investment, risk or regulated financial functions may impose employer, industry or credential requirements that depend on the actual duties.",
      jobMarketNote:
        "KECO 0311 combines investment and credit-analysis work, so the profile does not treat narrower securities-market observations as a complete financial-analyst labour series. Exact recurring vacancies, comparable salary, shortage and growth measures remain unnormalised in KR v1.",
      scoreCaveat:
        "The score reflects structured graduate entry and low universal licensing burden only. Finance-sector demand or market activity is not converted into unsupported occupation-level points.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "KR",
    editorial: {
      headline: "A management-analysis career using broader KECO 0221, with information-systems study preserved as the strongest direct programme signal",
      entryPathway:
        "Business Analyst is anchored to KECO 2025 code 0221 경영 및 진단 전문가, whose scope includes management analysis, consulting and organisational diagnosis. One reviewed Information Systems programme remains direct, while eight business-administration or industrial-management programmes remain related pathways rather than guaranteed direct preparation.",
      registration:
        "No universal statutory licence is required for general business-analysis work. Regulated consulting, industry-specific advisory work or protected professional services can have additional requirements outside this canonical profile.",
      jobMarketNote:
        "Because KECO 0221 is broader than the modern business-analyst title, group-level employment or salary observations are not presented as business-analyst-only evidence. KR v1 currently publishes the reviewed classification and study pathway but leaves market components unscored.",
      scoreCaveat:
        "The broader classification keeps the profile provisional. Entry accessibility is credited conservatively; shortage, vacancy, salary, growth and occupation-specific visa evidence remain at zero until exact comparable evidence is available.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "KR",
    editorial: {
      headline: "A cross-functional supply-chain career using KECO 0284 as a materials and procurement anchor rather than claiming a one-to-one national occupation",
      entryPathway:
        "KECO 2025 has no standalone Supply Chain Analyst 세분류. CampCareer uses 0284 자재관리 사무원 as the closest operational anchor because it covers purchasing, materials, inventory and logistics-control work, while restricting the canonical scope to analytical supply-chain planning. Five reviewed industrial or systems-engineering programmes are retained as related study only.",
      registration:
        "There is no universal personal licence for supply-chain analysis. Individual logistics, customs, bonded-warehouse or regulated transport duties may involve separate credentials, but those are not assumed for every analyst role.",
      jobMarketNote:
        "The 0284 group includes operational materials and inventory work broader than analytics, and other supply-chain roles can sit in trade or transport classifications. KR v1 therefore does not reuse the broader group's wage or vacancy measures as supply-chain-analyst-only evidence.",
      scoreCaveat:
        "The broader mapping and related-only programme evidence keep market scoring conservative. Only general graduate accessibility and low universal licensing burden are credited.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "KR",
    editorial: {
      headline: "An HR and labour-relations profession anchored to KECO 0222, with ordinary HR practice separated from licensed labour-attorney work",
      entryPathway:
        "Human Resources Specialist maps to KECO 2025 code 0222 인사 및 노사 관련 전문가. Business, HR, labour relations and related study can support entry; the currently reviewed Korean catalogue contains one business-administration programme mapped only as related study.",
      registration:
        "General HR specialist work has no universal statutory personal licence. The same KECO group also contains 공인노무사 work, which is separately regulated; CampCareer does not imply that ordinary HR roles require or confer labour-attorney authority.",
      jobMarketNote:
        "The shared 0222 group spans HR specialists and regulated labour-relations professionals, so group-level market data are not treated as exact HR-specialist evidence. Exact recurring vacancies, salary and shortage measures remain unscored in KR v1.",
      scoreCaveat:
        "Entry and burden receive limited credit, but no market or visa points are inferred from the wider HR or labour-services market.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "KR",
    editorial: {
      headline: "A marketing-specialist pathway nested within KECO 0243 상품 기획 전문가 and supported by business and communications study",
      entryPathway:
        "Marketing Specialist maps to the marketing subset of KECO 2025 code 0243 상품 기획 전문가. Business, marketing, communications and media programmes can support entry; the three currently reviewed Korean programme mappings remain related because none is treated as a guaranteed occupation-specific qualification.",
      registration:
        "There is no universal statutory personal licence for marketing-specialist work. Employer expectations are typically portfolio, analytics, campaign, product and communication skills rather than a protected professional credential.",
      jobMarketNote:
        "KECO 0243 is broader than marketing alone and also covers product-planning work. KR v1 therefore does not convert group-level employment, wage or vacancy signals into marketing-specialist-only scores.",
      scoreCaveat:
        "The score remains provisional and credits only general graduate accessibility and low entry regulation. No salary, shortage, vacancy, growth or occupation-specific visa points are inferred.",
    },
  },
  {
    id: "auditor",
    countryCode: "KR",
    editorial: {
      headline: "An audit career with a regulated external-audit endpoint, while internal-audit roles remain broader and are not universally CPA-licensed",
      entryPathway:
        "CampCareer anchors Auditor to KECO 2025 code 0231 회계사 for the professional financial-audit scope, while explicitly recognising that internal audit and assurance roles can exist outside licensed public-accounting practice. The reviewed Korean Accounting master's programme is retained as related rather than direct audit qualification evidence.",
      registration:
        "There is no single universal licence for every job titled Auditor. Statutory public-accounting and external financial-audit work is tied to the regulated 공인회계사 and audit-firm framework, while internal corporate audit roles may follow employer-specific pathways. The profile therefore does not mark all auditors as licensed CPAs.",
      jobMarketNote:
        "KECO 0231 is a professional-accountant group rather than a clean internal-auditor-only classification. KR v1 does not use CPA examination volumes, accounting-sector demand or broader finance vacancies as an exact auditor labour-market series.",
      scoreCaveat:
        "Entry credit is moderated because professional external audit has a substantial regulated pathway even though not every audit role requires CPA status. Exact market and visa components remain unscored.",
    },
  },
  {
    id: "project-manager",
    countryCode: "KR",
    editorial: {
      headline: "A cross-industry project-management career using KECO 0261 as a business-planning anchor, with experience treated as central to entry",
      entryPathway:
        "KECO 2025 does not provide one universal Project Manager occupation across industries. CampCareer uses 0261 경영 기획 사무원 as the general business-project anchor and restricts the profile to planning, scope, schedule, cost, risk and stakeholder coordination. Four reviewed business or industrial-management programmes remain related pathways only.",
      registration:
        "There is no universal statutory personal licence for general project management. PMP and other credentials can be valued by employers, while construction, engineering, IT, public procurement or other regulated sectors may impose separate role-specific requirements.",
      jobMarketNote:
        "Project managers are distributed across industries and management levels, so a single KECO group cannot safely represent the whole canonical market. KR v1 does not synthesise cross-industry salaries or vacancies into one national PM score.",
      scoreCaveat:
        "Entry credit is moderated because many PM roles require prior domain or delivery experience. Market, growth and occupation-specific visa components remain unscored until a comparable methodology is available.",
    },
  },
]
