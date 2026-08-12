import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export type KoreaEngineeringOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaEngineeringOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A KECO 2025 civil-engineering profession with direct Korean degree pathways and optional national technical qualifications",
      entryPathway:
        "KECO 2025 maps the canonical role directly to 1403 토목공학 기술자. Civil engineering, civil and environmental engineering, infrastructure systems and closely related university programmes are the standard academic routes, followed by design, construction, infrastructure or consulting experience.",
      registration:
        "There is no single universal personal licence required for every civil engineer position in Korea. Q-Net credentials such as 토목기사 and higher professional-engineer qualifications can be required or preferred for particular statutory duties, projects, bidding, supervision or career-grade recognition, so role-specific requirements must be checked separately.",
      jobMarketNote:
        "CampCareer uses the current KECO 2025 1403 classification and links only already-reviewed Korean civil-engineering study pathways. Work24 provides current recruitment access, but an exact recurring 1403 vacancy series, comparable national salary series and shortage series are not yet normalised for scoring.",
      scoreCaveat:
        "KR v1 credits the structured graduate-entry route and relatively low universal licensing burden only. Shortage, vacancy intensity, vacancy trend, salary, growth and occupation-specific visa components remain unscored until exact comparable evidence is normalised.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A broad KECO 2025 mechanical-engineering profession with strong direct degree coverage across Korean universities",
      entryPathway:
        "KECO 2025 1511 기계공학 기술자 및 연구원 covers the core mechanical-engineering profession and multiple discipline applications. A mechanical-engineering Bachelor degree is the standard direct pathway, with adjacent mechatronics, biomedical-mechanical and specialised mechanical programmes relevant according to duties.",
      registration:
        "There is no universal personal licence for all mechanical engineers in Korea. Q-Net credentials such as 일반기계기사, 공조냉동기계기사 and professional-engineer qualifications may be useful or required for regulated equipment, facilities or designated technical-responsibility roles, but they are not treated as a universal licence for the canonical career.",
      jobMarketNote:
        "The profile uses current KECO 2025 1511. The classification is broader than one industry because mechanical engineers work across machinery, automotive, plant, shipbuilding, aerospace and equipment sectors. Broader-sector demand is therefore not converted into an exact occupation shortage or salary score.",
      scoreCaveat:
        "KR v1 remains provisional. Entry accessibility is credited through direct engineering degrees, while exact-code shortage, recurring vacancies, salary, growth and occupation-specific visa signals remain unscored.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A KECO 2025 electrical-engineering profession with direct degree routes and role-dependent technical qualification requirements",
      entryPathway:
        "KECO 2025 maps the core role to 1531 전기공학 기술자 및 연구원. Electrical engineering and closely aligned electrical-electronic engineering degrees provide the principal graduate route into design, power, control, facilities and electrical-system roles.",
      registration:
        "The generic electrical-engineer occupation is not treated as universally licensed, but Korean electrical construction, safety, supervision and designated technical duties can require statutory qualifications or career-grade requirements. Q-Net 전기기사 and related credentials are therefore relevant but not assumed to be mandatory for every 1531 job.",
      jobMarketNote:
        "CampCareer preserves KECO 1531 as the occupational anchor and keeps mixed electrical-electronic study only at its reviewed relationship strength. Current job advertisements are not substituted for an exact recurring national vacancy series.",
      scoreCaveat:
        "KR v1 gives conservative credit for the structured degree pathway and slightly reduces burden credit because regulated electrical duties can impose additional qualification requirements. Market and visa components remain unscored pending exact evidence.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A cross-disciplinary manufacturing-engineering career represented conservatively through Korea's broader mechanical-engineering classification",
      entryPathway:
        "KECO 2025 does not publish a standalone Manufacturing Engineer 세분류. CampCareer uses 1511 기계공학 기술자 및 연구원 as a broader manufacturing-engineering anchor because production equipment, process engineering and plant/mechanical systems sit within that field, while industrial-engineering and automotive programmes remain related pathways rather than exact occupational matches.",
      registration:
        "There is no universal personal manufacturing-engineer licence. National technical qualifications can matter for specific machinery, quality, plant, safety or regulated facility duties, but the required credential depends on the actual job rather than the canonical title alone.",
      jobMarketNote:
        "Because the official 1511 group is broader than Manufacturing Engineer, CampCareer does not present group-wide employment, wage, vacancy or shortage signals as manufacturing-engineer-only evidence. Existing Korean programme mappings are retained only as related study.",
      scoreCaveat:
        "The mapping is intentionally broader and the score remains provisional. Only general graduate-entry accessibility and non-universal licensing burden are credited; market and visa components remain zero.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A Korean industrial-engineering career with excellent direct degree coverage but no one-to-one KECO 2025 occupation label",
      entryPathway:
        "Industrial Engineering is well established as a Korean university discipline, with direct programmes in industrial engineering, industrial management engineering and systems management engineering. KECO 2025 does not provide a dedicated 산업공학 기술자 세분류, so CampCareer uses 1599 기타 공학 관련 기술자 및 시험원 only as a broad classification anchor and restricts the canonical scope to process, systems, operations, productivity and optimisation engineering.",
      registration:
        "There is no universal personal licence for industrial engineers. Role-specific quality, safety, logistics, production or technical credentials may be preferred, but the canonical profession itself is not treated as statutorily licensed.",
      jobMarketNote:
        "The 1599 mapping is broader than the canonical career and is not suitable for title-specific labour-market scoring. The strong set of reviewed Korean industrial-engineering degree mappings is preserved as study evidence without converting broader official labour data into industrial-engineer-only metrics.",
      scoreCaveat:
        "KR v1 credits the direct academic pathway and low universal licensing burden. Because the KECO anchor is broad, shortage, vacancy, salary, growth and visa components remain unscored.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 2025 chemical-engineering profession with multiple verified Korean degree pathways",
      entryPathway:
        "KECO 2025 maps directly to 1541 화학공학 기술자 및 연구원. Chemical engineering and chemical/biomolecular or chemical/biological engineering degrees provide the standard graduate pathway into process, petrochemical, materials, pharmaceutical, energy and manufacturing roles.",
      registration:
        "There is no single universal personal licence for every chemical engineer position. Q-Net 화공기사, 화공기술사 and related safety or analysis qualifications can be relevant to particular process, plant and statutory duties, but they are not assumed mandatory across the whole occupation.",
      jobMarketNote:
        "The profile uses direct KECO 1541 and only reviewed Korean chemical-engineering programmes. Industry expansion or demand in individual chemical sectors is not treated as an exact national shortage signal without occupation-level evidence.",
      scoreCaveat:
        "KR v1 credits a clear degree-based entry pathway and low universal licensing burden. Exact salary, shortage, recurring vacancy, growth and visa evidence remains unscored.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 2025 environmental-engineering profession spanning air, water, waste and environmental-control work",
      entryPathway:
        "KECO 2025 maps directly to 1555 환경공학 기술자 및 연구원. Environmental engineering, environmental science and engineering, civil-environmental engineering, energy-environmental engineering and closely aligned programmes can provide direct or common academic pathways depending on curriculum and role.",
      registration:
        "The generic occupation is not universally licensed, but statutory environmental management, measurement, assessment and facility duties can require specific qualifications. Q-Net environmental 기사 and higher credentials are therefore role-dependent requirements rather than a universal licence for every 1555 position.",
      jobMarketNote:
        "CampCareer uses the direct 1555 classification but does not merge neighbouring energy, environmental testing or industrial-environment codes into the canonical market score. Existing programme mappings are retained at their reviewed strength.",
      scoreCaveat:
        "KR v1 gives conservative entry credit and a small burden adjustment for qualification-sensitive regulated duties. Exact-code shortage, salary, vacancy, growth and visa components remain unscored.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "KR",
    editorial: {
      headline: "An umbrella engineering-support career that must be resolved to a discipline-specific Korean technician or testing occupation",
      entryPathway:
        "Korea does not have one KECO 2025 세분류 equivalent to CampCareer's global Engineering Technician umbrella. Discipline-specific technical and testing roles are distributed across codes such as 1407 건설자재 시험원, 1513 기계 및 로봇공학 시험원, 1522 금속 및 재료공학 시험원, 1534 전기 및 전자공학 시험원, 1542 화학공학 시험원 and 1556 환경공학 시험원. CampCareer uses 1599 기타 공학 관련 기술자 및 시험원 as a broad profile anchor while preserving the discipline-specific codes as scope evidence.",
      registration:
        "There is no single universal licence for this umbrella career. Qualification requirements vary substantially by discipline, equipment, test method and statutory responsibility, so users must resolve the actual technician occupation before relying on any credential pathway.",
      jobMarketNote:
        "The umbrella profile must not aggregate unrelated technician labour-market data into a single Korean employment, wage or shortage figure. The two existing reviewed Korean study mappings remain related only and do not represent a complete technician-training catalogue.",
      scoreCaveat:
        "KR v1 gives higher entry accessibility because vocational, college and practical technical routes exist, but all market and visa components remain unscored and the profile stays provisional because the classification is intentionally broad.",
    },
  },
]
