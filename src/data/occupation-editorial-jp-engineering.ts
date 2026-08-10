import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A professional infrastructure career represented across Japan's civil-design, construction-management and other civil-engineering classifications",
      entryPathway:
        "Japan's 2022 MHLW classification divides the canonical Civil Engineer scope across 008-04 土木設計技術者, 008-05 土木施工管理技術者 and 008-06 土木技術者（設計・施工管理を除く）. Civil-engineering study is the clearest academic route, followed by graduate or junior engineering work across design, infrastructure delivery and site coordination.",
      registration:
        "Civil Engineer is not treated as one universally licensed occupation in Japan. Construction projects can require legally designated 主任技術者 or 監理技術者 with specified qualifications or experience, but those project appointments are narrower than the whole canonical occupation.",
      jobMarketNote:
        "The official classification separates design, construction management and other civil engineering. CampCareer therefore preserves the three scopes rather than publishing any one of them as the entire Civil Engineer market.",
      scoreCaveat:
        "The Japan v1 score is provisional and currently reflects structured professional entry and role-specific qualification burden only. Shortage, vacancy, salary, growth and visa components remain unscored until comparable market evidence is normalised after country occupation foundations are complete.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A mechanical engineering pathway spanning MHLW 006-03 development/design and 007-04 manufacturing engineering",
      entryPathway:
        "Mechanical Engineer is intentionally represented as an umbrella. MHLW 006-03 covers machine and equipment development and design, while 007-04 covers manufacturing engineering, process design, technical guidance and quality or production management for machinery. Mechanical-engineering study and practical design or production experience are the strongest entry foundations.",
      registration:
        "There is no single personal licence required for every Mechanical Engineer role in Japan. Particular plants, equipment, safety functions or legally designated responsibilities can carry separate qualification requirements, which should not be promoted into a universal licence for the occupation.",
      jobMarketNote:
        "Development/design and manufacturing engineering are separate official groups, so CampCareer does not combine their labour-market observations into a fabricated exact Mechanical Engineer series.",
      scoreCaveat:
        "The provisional score currently recognises the structured engineering pathway and moderate entry burden only. Market, earnings, growth, shortage and visa points remain at zero pending the later occupation-market enrichment phase.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A broad electrical engineering career spanning development, manufacturing/facility engineering and selected electrical-construction engineering scopes",
      entryPathway:
        "The canonical Electrical Engineer scope spans MHLW 006-02 electrical/electronic development engineering, 007-02 electrical/electronic manufacturing and facility engineering, and selected professional engineering work within 007-03 electrical-construction engineering. Electrical or electronic engineering study is the clearest professional entry route.",
      registration:
        "Electrical Engineer is not universally licensed as one occupation. However, the Electricity Business Act requires specified business-use electrical installations to appoint a qualified 電気主任技術者 for safety supervision, and electrical-construction responsibilities can have separate statutory qualification requirements.",
      jobMarketNote:
        "Japan separates product development, production/facility engineering and electrical-construction engineering. These distinct groups are preserved instead of being merged into one unsupported exact market series.",
      scoreCaveat:
        "The current score reflects the professional entry route and additional role-specific qualification burden. Shortage, vacancies, salary, growth and occupation-specific visa signals are deferred to the later market-data enrichment phase.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A sector-spanning production-engineering umbrella represented through Japan's MHLW 007 manufacturing-engineer family",
      entryPathway:
        "Japan does not use one generic small-class code for Manufacturing Engineer. Production engineering is divided by industry across the 007 family, including food, electrical/electronic, machinery, automotive, transport equipment, materials, chemicals and other manufacturing. Mechanical, materials, electrical, chemical and related engineering programmes can lead into these roles, but the eleven reviewed Japanese study links are kept as related pathways rather than automatic occupational qualification.",
      registration:
        "There is no universal personal Manufacturing Engineer licence across the canonical role. Specific plants, equipment, quality systems, safety duties and legally designated functions can impose their own requirements.",
      jobMarketNote:
        "Because Japan classifies production engineers by manufacturing sector, CampCareer retains the sector codes as non-rollup references and does not invent a single generic manufacturing-engineer labour series.",
      scoreCaveat:
        "The foundation score uses entry accessibility and burden only. Sector demand, wage, vacancy, growth and visa evidence will be normalised later and are not inferred from programme availability or broad manufacturing conditions.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A process, productivity and systems-improvement engineering role without a standalone MHLW small-class code",
      entryPathway:
        "Industrial Engineer is broader than one Japanese classification item. Process design, labour and equipment utilisation, quality, productivity and continuous improvement are distributed through sector-specific MHLW manufacturing-engineering classifications. Industrial, systems and operations-oriented engineering study is relevant; the reviewed Japanese industrial-engineering programme is retained as a direct academic pathway.",
      registration:
        "No universal personal Industrial Engineer licence applies across Japan's canonical scope. Employer, plant, safety or project-specific qualifications can still matter for particular responsibilities.",
      jobMarketNote:
        "MHLW's production and quality-management engineering descriptions overlap materially with industrial-engineering duties but remain sector-specific. The profile therefore uses 007-02, 007-04 and 007-99 only as reviewed references rather than claiming an exact national occupation code.",
      scoreCaveat:
        "The provisional score does not treat manufacturing-sector statistics as exact Industrial Engineer evidence. Shortage, vacancy, salary, growth and visa components remain unscored until the common market-data phase.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A chemical engineering career represented across 006-07 product development and 007-08 chemical manufacturing engineering",
      entryPathway:
        "Chemical Engineer spans MHLW 006-07 化学製品開発技術者 and 007-08 化学製品製造技術者. Chemical engineering and applied chemistry degrees are direct academic foundations, with process, product-development, plant, production and quality experience shaping the eventual occupational scope.",
      registration:
        "There is no single personal licence required for every Chemical Engineer role. Plant safety, hazardous materials, environmental control and other legally designated duties can have separate qualifications depending on the workplace and responsibility.",
      jobMarketNote:
        "Development engineering and manufacturing engineering are separate official classifications. CampCareer preserves that distinction instead of combining the two into an unsupported exact Chemical Engineer market series.",
      scoreCaveat:
        "Only the entry pathway and general burden are scored in the foundation phase. No shortage, vacancy, earnings, growth or visa credit is inferred before role-level Japanese market evidence is normalised.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A broad environmental engineering role spanning environmental measurement and civil-infrastructure scopes rather than one standalone MHLW code",
      entryPathway:
        "Environmental Engineer does not have one exact MHLW small-class code. Environmental investigation and measurement can fall within 011-99, while water, wastewater and other environmental infrastructure can sit within civil-design and other civil-engineering scopes such as 008-04 and 008-06. Environmental, civil and related engineering programmes are therefore the relevant study base.",
      registration:
        "The occupation as a whole is not universally licensed. A narrower statutory boundary applies to designated workplace environmental measurements: specified measurements must be performed by registered 作業環境測定士 under the Working Environment Measurement framework.",
      jobMarketNote:
        "Environmental measurement and civil environmental infrastructure are different official source groups. CampCareer keeps them separate and does not merge their market data into a fabricated exact Environmental Engineer series.",
      scoreCaveat:
        "The current score reflects professional entry and the limited role-specific qualification burden only. Market, salary, shortage, growth and visa components await the later market-data enrichment phase.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "JP",
    editorial: {
      headline: "A cross-discipline engineering-support umbrella with no single Japanese small-class equivalent",
      entryPathway:
        "Japan's classification does not provide one generic Engineering Technician code equivalent to CampCareer's cross-discipline occupation. Technical-college, vocational and supervised engineering-support routes can lead into drafting, testing, production support, maintenance and discipline-specific technician work. The profile retains 080-04 and 080-05 drafting scopes only as references, not as the complete occupation.",
      registration:
        "There is no universal personal Engineering Technician licence covering the broad canonical role. Some discipline-specific technical or safety duties can require qualifications, training or employer authorisation.",
      jobMarketNote:
        "Because technician work is distributed across discipline, drafting, production and maintenance classifications, no one official group is presented as the complete Engineering Technician labour market.",
      scoreCaveat:
        "The provisional foundation score recognises accessible technical entry and low universal licensing burden. Market, salary, growth, shortage and visa signals remain intentionally unscored until the later enrichment phase.",
    },
  },
]
