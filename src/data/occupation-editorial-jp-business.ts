import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanBusinessOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_BUSINESS_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanBusinessOccupationEditorialOverride[] = [
  {
    id: "accountant",
    countryCode: "JP",
    editorial: {
      headline: "A general employee-accounting career anchored to MHLW 038-03, explicitly separated from Japan's licensed CPA profession",
      entryPathway:
        "MHLW 038-03 経理事務員 covers employee accounting work such as journal entries, ledgers, monthly and annual financial statements, receivables, payables and tax-document preparation. Accounting, commerce and business study are strong entry foundations. CampCareer keeps the reviewed Takasaki business-accounting programme as a direct academic pathway, not as a professional licence.",
      registration:
        "There is no universal personal licence required to work as a general employee accountant in Japan. MHLW explicitly separates 038-03 from 013-01 公認会計士 and 013-02 税理士. Statutory audit, tax representation and other protected professional work have their own qualification rules.",
      jobMarketNote:
        "This profile uses 038-03 for general employee-accounting work and does not blend licensed CPA or tax-accountant markets into the Accountant career.",
      scoreCaveat:
        "The Japan foundation score reflects accessible accounting entry and low universal licensing burden only. Shortage, vacancy, salary, growth and visa signals remain unscored until the later all-country market-data enrichment phase.",
    },
  },
  {
    id: "financial-analyst",
    countryCode: "JP",
    editorial: {
      headline: "A professional finance-analysis pathway anchored to MHLW 013-99, which explicitly includes securities analysts",
      entryPathway:
        "MHLW 013-99 covers professional management, finance and insurance work and explicitly includes 証券アナリスト, together with investment-value analysis based on corporate financial information. Finance, economics, accounting, mathematics and quantitative business study are common foundations. The five reviewed Japanese programmes remain related pathways rather than occupational qualification.",
      registration:
        "There is no single statutory personal licence required for every Financial Analyst role. Particular investment, securities, advisory or regulated-business functions can carry employer, industry or legal requirements that are narrower than the canonical occupation.",
      jobMarketNote:
        "CampCareer restricts 013-99 to the financial and securities-analysis scope and does not treat the whole management/finance/insurance professional group as exact Financial Analyst market data.",
      scoreCaveat:
        "Only entry accessibility and general burden are scored in the foundation phase. Exact shortage, vacancies, earnings, growth and visa evidence will be added later through the common market enrichment process.",
    },
  },
  {
    id: "business-analyst",
    countryCode: "JP",
    editorial: {
      headline: "A non-ICT business-improvement role spanning management consulting and corporate planning rather than one standalone Japanese code",
      entryPathway:
        "Japan's MHLW classification does not publish one standalone non-ICT Business Analyst code. Organisational diagnosis and management recommendations sit within 013-99 経営コンサルタント, while internal business planning, research and analysis sit within 033-03 企画・調査事務員. Business, economics, analytics and management study can lead into the field; the three reviewed programmes remain related pathways.",
      registration:
        "There is no universal statutory occupational licence for non-ICT Business Analysts in Japan. Voluntary credentials or consulting qualifications may be useful but are not treated as a general licence to practise the canonical role.",
      jobMarketNote:
        "The 013-99 consulting scope and 033-03 internal planning scope are retained as separate references. Their labour data must not be merged into a fabricated exact Business Analyst series.",
      scoreCaveat:
        "The provisional foundation score does not infer demand from consulting or planning groups. Market, salary, growth, shortage and visa components remain zero pending later enrichment.",
    },
  },
  {
    id: "supply-chain-analyst",
    countryCode: "JP",
    editorial: {
      headline: "A cross-functional supply-chain analytics role without a standalone MHLW small-class code",
      entryPathway:
        "Supply Chain Analyst spans planning and analysis that Japan classifies across several operational groups. Relevant references include 033-03 planning/research, 039-01 production and materials planning, and 039-02 logistics, inventory and shipping administration. Industrial engineering, logistics, operations, economics and business study are relevant; the two reviewed programmes remain related pathways.",
      registration:
        "There is no universal statutory Supply Chain Analyst licence in Japan. Specific customs, transport, procurement, dangerous-goods or regulated-industry responsibilities can have separate requirements that do not apply to the whole analytical occupation.",
      jobMarketNote:
        "Production planning, logistics administration and strategic analysis are different MHLW scopes. CampCareer keeps them as non-rollup references and does not substitute operational logistics employment for analyst-specific evidence.",
      scoreCaveat:
        "The foundation score covers entry and burden only. Market demand, wages, vacancies, growth and visa evidence are intentionally deferred to the all-country enrichment phase.",
    },
  },
  {
    id: "human-resources-specialist",
    countryCode: "JP",
    editorial: {
      headline: "A direct MHLW 033-02 HR pathway covering recruitment, evaluation, pay, training, welfare and labour administration",
      entryPathway:
        "MHLW 033-02 人事事務員 directly covers recruitment, evaluation, payroll, education and training, employee welfare and labour-management administration. Business, human resources, psychology, labour studies and related degrees can support entry, alongside employer-based development. The current reviewed MBA link remains related rather than a direct professional qualification.",
      registration:
        "There is no universal statutory Human Resources Specialist licence. Japan separately classifies the licensed 社会保険労務士 profession under 013-03; ordinary in-house HR work does not require that credential merely because it involves personnel administration.",
      jobMarketNote:
        "The profile uses 033-02 for in-house HR specialist work and does not substitute the separate licensed labour-and-social-security consultant profession.",
      scoreCaveat:
        "The provisional score recognises accessible entry and low universal licensing burden. Exact market and visa components will be populated later with comparable evidence.",
    },
  },
  {
    id: "marketing-specialist",
    countryCode: "JP",
    editorial: {
      headline: "A direct marketing-planning and research pathway within MHLW 033-03 企画・調査事務員",
      entryPathway:
        "MHLW 033-03 explicitly includes マーケター, マーケティングリサーチャー, マーケティング企画事務員, web marketing and sales-promotion planning roles. Marketing, communications, business, consumer research and analytics study are relevant, with project and campaign evidence often important for entry. The two reviewed programmes remain related.",
      registration:
        "There is no universal statutory Marketing Specialist licence in Japan. Advertising sales and direct sales are separate MHLW occupations and are not treated as equivalent merely because they involve commercial activity.",
      jobMarketNote:
        "033-03 is restricted here to marketing planning, research and promotion-planning scope. General sales occupations are excluded from the canonical market boundary.",
      scoreCaveat:
        "Only entry accessibility and burden are scored at this stage. Shortage, vacancy, salary, growth and visa signals await the common market enrichment phase.",
    },
  },
  {
    id: "auditor",
    countryCode: "JP",
    editorial: {
      headline: "An audit umbrella deliberately separating licensed external financial audit from in-house internal audit",
      entryPathway:
        "Japan's classification splits the canonical Auditor career. Statutory external financial audit is represented by 013-01 公認会計士, while 033-01 explicitly includes 内部監査員 for in-house audit. Accounting, finance, risk and business study can support both directions, but the reviewed accounting programme is only a related pathway and does not confer CPA status.",
      registration:
        "There is no one universal registration across the entire Auditor umbrella. External statutory CPA audit work follows Japan's 公認会計士 qualification and registration framework; the Financial Services Agency and CPAAOB describe the examination, practical experience, practical training and registration path. Internal auditors do not have an equivalent universal statutory CPA registration requirement.",
      jobMarketNote:
        "External CPA audit and internal audit are materially different official scopes. CampCareer stores 013-01 and 033-01 as non-rollup references instead of merging them into one exact labour-market series.",
      scoreCaveat:
        "The lower foundation score reflects the mixed qualification burden across the umbrella, not weak market demand. Shortage, vacancy, earnings, growth and visa components are deferred to later enrichment.",
    },
  },
  {
    id: "project-manager",
    countryCode: "JP",
    editorial: {
      headline: "A cross-industry project-management career without one exact MHLW code; IT project management is only one sector-specific branch",
      entryPathway:
        "MHLW 010-03 directly covers IT project managers, while 035-99 includes PMO support work. CampCareer's Project Manager is deliberately broader than IT and separate from the Construction Manager canonical career, so neither code is promoted as a universal match. Entry normally combines sector knowledge with planning, budgeting, risk, stakeholder and delivery experience; the five reviewed programmes remain related pathways.",
      registration:
        "There is no universal statutory cross-industry Project Manager licence in Japan. Particular sectors, construction appointments, regulated engineering work or employer governance frameworks can impose narrower requirements.",
      jobMarketNote:
        "IT Project Manager and PMO support are retained only as reference scopes. Their employment and wage data must not be presented as the exact market for generic cross-industry Project Managers.",
      scoreCaveat:
        "The current foundation score reflects experience-sensitive entry and modest burden only. Market, salary, growth, shortage and visa components remain intentionally unscored until the later enrichment phase.",
    },
  },
]
