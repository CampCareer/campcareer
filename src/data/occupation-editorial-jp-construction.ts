import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "JP",
    editorial: {
      headline: "A direct building-carpentry trade under the 2022 MHLW occupation classification, with practical apprenticeship and skills-training entry",
      entryPathway:
        "Carpenter maps to 091-01 大工 in the 2022 厚生労働省編職業分類. The group explicitly includes 建築大工 and apprentices. Entry is primarily practical through vocational training, employer training and supervised site experience rather than a university-only pathway.",
      registration:
        "There is no universal personal licence that every carpenter must hold before working in Japan. Trade-skill certifications can support progression, while site safety and project-specific requirements apply separately.",
      jobMarketNote:
        "The current classification provides a clean direct occupation anchor, but CampCareer does not yet publish a normalised recurring 091-01 shortage, vacancy, salary or growth series for cross-country ranking.",
      scoreCaveat:
        "JP v1 credits accessible practical entry and low universal licensing burden only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "electrician",
    countryCode: "JP",
    editorial: {
      headline: "A regulated building electrical trade mapped directly to 094-05 電気工事作業員",
      entryPathway:
        "Electrician maps to 094-05 電気工事作業員. The occupation covers building wiring, distribution boards, lighting and electrical-equipment installation. Vocational electrical training and supervised practical experience are common preparation routes.",
      registration:
        "Electrical work within the statutory scope of the Electrician Act requires the applicable 電気工事士 qualification. Japan distinguishes first-class and second-class electrician licences and related authorised scopes, so a degree alone is not a substitute for the required licence.",
      jobMarketNote:
        "Official job-tag material confirms the occupation and qualification boundary, but current exact-code comparable market metrics have not yet been normalised into CampCareer JP v1.",
      scoreCaveat:
        "The score recognises a structured trade pathway but applies a high entry-burden discount for statutory licensing. Market and visa components remain zero until exact comparable evidence is ingested.",
    },
  },
  {
    id: "plumber",
    countryCode: "JP",
    editorial: {
      headline: "A direct piping trade mapped to 091-06 配管工, with water-supply and gas work kept behind their separate legal boundaries",
      entryPathway:
        "Plumber maps directly to 091-06 配管工, which includes water, gas, steam and air-conditioning piping. Entry commonly combines vocational training with supervised work experience.",
      registration:
        "There is no single universal personal plumber licence covering every 091-06 job. For regulated water-supply installation, designated contractors must appoint a national 給水装置工事主任技術者; gas and other systems can have separate requirements. Those role-specific rules are not attributed to every plumber.",
      jobMarketNote:
        "Because 091-06 spans several piping systems, CampCareer does not convert broad construction or utility demand into plumber-only market points without a normalised exact-code series.",
      scoreCaveat:
        "JP v1 credits practical entry and only a modest burden allowance because regulated sub-scopes exist. Shortage, vacancy, salary, growth and visa components remain unscored.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "JP",
    editorial: {
      headline: "A direct tile-setting scope inside 091-02 ブロック積工、タイル張工",
      entryPathway:
        "Wall and Floor Tiler is represented through 091-02 ブロック積工、タイル張工, restricted to タイル張工 and tile floor/wall work. The official classification explicitly includes タイル壁張工 and タイル床張工. Entry is strongly practical and portfolio-of-work based.",
      registration:
        "There is no universal personal licence for every tile-setting job. National trade-skill credentials such as タイル張り技能士 can demonstrate competence but are not treated as mandatory occupational registration for the whole canonical role.",
      jobMarketNote:
        "The official group also contains block and brick masonry, so whole-group observations are not presented as tile-only labour-market evidence.",
      scoreCaveat:
        "The mapping is scope-limited. JP v1 scores practical accessibility and low licensing burden only; market and visa components remain unscored.",
    },
  },
  {
    id: "welder",
    countryCode: "JP",
    editorial: {
      headline: "A skilled welding trade mapped to 071-13 金属溶接・溶断工, with process-specific safety training requirements",
      entryPathway:
        "Welder maps to 071-13 金属溶接・溶断工, covering arc, gas and other metal welding and cutting work. Practical process competence and employer or vocational training are central to entry.",
      registration:
        "There is no one universal personal welder licence across the entire occupation. However, gas welding requires the prescribed 技能講習 and arc-welding work requires statutory 特別教育. CampCareer records these as process-specific legal training requirements rather than a universal occupation licence.",
      jobMarketNote:
        "The classification spans construction and manufacturing contexts, so sector-wide demand is not converted into an exact welder shortage or salary signal.",
      scoreCaveat:
        "JP v1 gives practical-entry credit but reduces the burden score for mandatory process-specific safety training. Shortage, vacancy, salary, growth and visa remain zero.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "JP",
    editorial: {
      headline: "A brick and block masonry scope inside 091-02 ブロック積工、タイル張工",
      entryPathway:
        "Bricklayer is represented through 091-02 ブロック積工、タイル張工, restricted to れんが積工 and block masonry rather than tile setting. The official classification explicitly includes brick and block laying, including apprentices.",
      registration:
        "There is no universal personal bricklayer licence for ordinary employment. Skills certification and construction-site competency requirements can apply without creating one national occupational registration regime.",
      jobMarketNote:
        "Because 091-02 combines masonry and tile work, CampCareer does not use the whole classification as bricklayer-only demand evidence.",
      scoreCaveat:
        "JP v1 scores the practical entry route and low universal licensing burden only. Labour-market and visa components remain unscored.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "JP",
    editorial: {
      headline: "A cross-code refrigeration and air-conditioning technician umbrella spanning repair, piping and electrical installation work",
      entryPathway:
        "Japan does not provide one single 2022 MHLW small classification that cleanly covers the full CampCareer HVAC Technician scope. Commercial refrigeration and air-conditioning repair sits in 075-01, household air-conditioner repair in 075-02, air-conditioning piping in 091-06 and household air-conditioner electrical installation in 094-05. The profile therefore keeps HVAC as an explicit multi-code umbrella.",
      registration:
        "There is no single universal personal HVAC licence covering the whole umbrella. Electrical installation can require 電気工事士, while equipment, refrigerant, piping and facility work can carry separate role-specific qualifications or legal duties.",
      jobMarketNote:
        "Because installation, repair and piping are split across multiple classifications, CampCareer does not manufacture one aggregate HVAC vacancy, salary or shortage series from incompatible source groups.",
      scoreCaveat:
        "The absence of a one-to-one classification keeps the profile provisional. Only structured technical entry and moderate regulatory burden are scored; all market and visa components remain zero.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "JP",
    editorial: {
      headline: "A direct construction-site management occupation mapped to 008-02 建築施工管理技術者",
      entryPathway:
        "Construction Manager maps to 008-02 建築施工管理技術者, covering construction planning, schedule and quality control, site supervision and related building-project management. Architecture and civil-engineering degrees are relevant academic pathways, but progression into management normally also depends on construction experience.",
      registration:
        "The broad occupation is not universally licensed at entry: MHLW job-tag guidance states that no particular qualification is required simply to enter the occupation. However, 建築施工管理技士 and other recognised qualifications can be required to serve as legally designated 主任技術者 or 監理技術者 on applicable projects.",
      jobMarketNote:
        "Five approved Japanese civil and construction-related university programmes are retained as related study pathways. Programme study does not itself confer site-manager appointment rights or a construction-management qualification.",
      scoreCaveat:
        "JP v1 gives moderate entry credit because management is experience-sensitive and regulated appointments have additional qualification requirements. Market and occupation-specific visa components remain unscored.",
    },
  },
]
