import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "KR",
    editorial: {
      headline: "A practical building trade mapped to KECO 2025 7016 Architectural Carpenters, with vocational and site-based entry routes",
      entryPathway:
        "Carpenter is mapped to KECO 2025 7016 건축 목공. Entry can come through vocational high school, technical or vocational training, or supervised site experience. The profile does not assume that a university degree is required for ordinary trade entry.",
      registration:
        "There is no universal personal licence that every carpenter must hold before working in Korea. Q-Net administers relevant national technical qualifications including 건축목공기능사, while construction-site safety, employer and project requirements still apply separately.",
      jobMarketNote:
        "Korea Employment Information Service has highlighted a difficult construction cycle alongside structural workforce issues including ageing, youth avoidance and domestic skilled-labour shortages. This sector-wide evidence is useful context but is not treated as an exact 7016 shortage measure.",
      scoreCaveat:
        "The Korea v1 score is provisional. Exact-code current wage, recurring vacancy, employer-diversity and shortage series have not yet been normalised for KECO 7016, so those components and visa credit remain unscored rather than inferred from broad construction-sector conditions.",
    },
  },
  {
    id: "electrician",
    countryCode: "KR",
    editorial: {
      headline: "A building electrical trade mapped to KECO 2025 8312 Internal Electricians, with technical training and qualification pathways",
      entryPathway:
        "Electrician is mapped to KECO 2025 8312 내선 전기공, covering installation and maintenance of wiring and electrical equipment inside buildings. Vocational electrical training, practical site experience and relevant national technical qualifications are common preparation routes.",
      registration:
        "The canonical occupation profile does not treat all employment under KECO 8312 as requiring one universal personal licence. Q-Net qualifications such as 전기기능사 can support entry, while statutory electrical-construction roles, contractor registration, safety duties and project-specific requirements must be checked separately.",
      jobMarketNote:
        "Work24 provides current recruitment search by occupation, but the Korea occupation layer does not yet have a normalised recurring KECO 8312 vacancy series suitable for direct comparison with other countries.",
      scoreCaveat:
        "No shortage, vacancy-trend, salary or visa points are inferred from individual job advertisements. The provisional score recognises the structured technical entry route only until comparable KECO 8312 labour-market evidence is ingested.",
    },
  },
  {
    id: "plumber",
    countryCode: "KR",
    editorial: {
      headline: "A construction piping trade mapped directly to KECO 2025 7031 Construction Plumbers",
      entryPathway:
        "Plumber maps to KECO 2025 7031 건설 배관공. Typical entry routes include vocational or technical training and practical experience with water, sewage, gas and building-service piping. Employer recruitment can also value trade experience gained directly on site.",
      registration:
        "There is no single universal personal plumber licence covering every job in this KECO group. Q-Net administers 배관기능사 and other relevant technical qualifications, while gas, fire-protection, facility and construction work can carry separate legal or project requirements.",
      jobMarketNote:
        "Official career information describes recruitment through building-services, fire-protection and water or sewage contractors. The profile does not convert that qualitative evidence into a current national shortage rating without a comparable exact-code time series.",
      scoreCaveat:
        "Current exact-code wage and recurring vacancy inputs are not yet published in the CampCareer Korea occupation layer. Market, growth and visa components therefore stay at zero while the entry-pathway component remains provisional.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "KR",
    editorial: {
      headline: "A finishing trade represented through KECO 2025 7024 Floor Finishers, with the canonical scope restricted to tile work",
      entryPathway:
        "Wall and Floor Tiler is represented through KECO 2025 7024 바닥재 시공원. That official group is broader than tile setting, so this profile uses only the 타일공 scope. Entry is primarily practical, through vocational training, skills courses or supervised construction experience.",
      registration:
        "A universal personal licence is not required for every tile-setting job. Q-Net currently administers 타일기능사, which can strengthen evidence of trade competence, while site safety and contractor or project requirements remain separate.",
      jobMarketNote:
        "CareerNet identifies 타일공 as a related occupation within the 7024 group. Because the official group also includes other floor-finishing work, broad group statistics are not presented as tile-only market figures.",
      scoreCaveat:
        "The score deliberately avoids treating broader KECO 7024 demand as exact tile-setter demand. Shortage, vacancy, salary, growth and visa components remain unscored until tile-relevant evidence can be separated reliably.",
    },
  },
  {
    id: "welder",
    countryCode: "KR",
    editorial: {
      headline: "A skilled metal trade mapped to KECO 2025 8241 Welders across construction and industrial settings",
      entryPathway:
        "Welder maps to KECO 2025 8241 용접원. Practical training through vocational schools, technical programmes and workplace experience is central, with process-specific competence important for construction, fabrication, shipbuilding and industrial work.",
      registration:
        "There is no single universal welder licence for every job. Korea's current Q-Net qualification structure includes process-specific welding certificates such as 피복아크용접기능사, 가스텅스텐아크용접기능사 and 이산화탄소가스아크용접기능사, while employers and projects may impose additional standards.",
      jobMarketNote:
        "KECO 8241 covers a broad welding occupation across several industries. The Korea v1 profile therefore avoids assigning a construction-only demand signal to the full code without a normalised industry and vacancy breakdown.",
      scoreCaveat:
        "No market shortage, recurring vacancy, salary, growth or visa credit is awarded from anecdotal demand. The score is provisional and currently reflects the practical entry route rather than a completed labour-market ranking.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "KR",
    editorial: {
      headline: "A masonry trade represented within the broader KECO 2025 7017 Masonry and Stone Laying group",
      entryPathway:
        "Bricklayer is represented through KECO 2025 7017 조적공 및 석재 부설원, with the canonical scope restricted to 조적공 and 벽돌공 work rather than the whole stone-laying group. Practical training and supervised site experience are the normal foundation for entry.",
      registration:
        "A universal personal bricklayer licence is not required for every position. Q-Net administers 조적기능사 as a relevant national technical qualification, while construction safety and project-specific competency requirements remain separate.",
      jobMarketNote:
        "The official KECO code combines masonry with stone-laying work. CampCareer therefore does not publish the whole-group labour market as if it were bricklayer-only evidence.",
      scoreCaveat:
        "The mapping is intentionally scope-limited. Shortage, wage, vacancy, growth and visa components remain unscored until evidence can be attributed reliably to the bricklaying subset rather than the broader 7017 group.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "KR",
    editorial: {
      headline: "A refrigeration and air-conditioning trade mapped to KECO 2025 8115, with a verified related Korean study pathway",
      entryPathway:
        "HVAC Technician maps to KECO 2025 8115 냉동·냉장·공조기 설치 및 정비원. Entry commonly combines mechanical or refrigeration training with hands-on installation and maintenance experience. CampCareer's Korean programme catalogue already contains a verified related refrigeration and air-conditioning engineering pathway, but a university degree is not presented as the only trade-entry route.",
      registration:
        "There is no single universal personal HVAC licence for every job in the group. Q-Net administers 공조냉동기계기능사 and higher technical qualifications; equipment, facility, safety and employer requirements can vary by role.",
      jobMarketNote:
        "The KECO 8115 scope covers building and industrial refrigeration, cooling and air-conditioning installation and maintenance. Current Work24 recruitment can be searched, but an exact recurring national vacancy series has not yet been normalised for scoring.",
      scoreCaveat:
        "The verified Korean programme link is recorded only as related study, not as an automatic licence or direct employment guarantee. Shortage, vacancy, salary, growth and visa points remain unscored pending comparable exact-code evidence.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "KR",
    editorial: {
      headline: "A construction-management pathway represented conservatively inside the broader KECO 2025 0161 Construction and Mining Managers group",
      entryPathway:
        "Construction Manager is represented through KECO 2025 0161 건설 및 광업 관련 관리자, with the CampCareer scope restricted to construction management rather than mining. Relevant architecture, architectural-engineering and civil-engineering degrees are recorded as related pathways, while management roles normally depend on project experience and employer requirements as well as education.",
      registration:
        "KECO 0161 is not treated as one universally licensed profession. Individual construction projects and appointments may require or prefer specific engineering, architecture, safety or construction technical qualifications and legally designated personnel standards.",
      jobMarketNote:
        "Current Work24 advertisements use the 0161 management classification for construction and site-management roles, but requirements vary materially by project. Broad 0161 statistics are not treated as construction-manager-only evidence because the official group also includes mining management.",
      scoreCaveat:
        "The profile receives only limited entry-access credit because management progression is experience-sensitive. No shortage, salary, vacancy, growth or visa points are inferred until construction-only evidence can be isolated from the broader 0161 classification.",
    },
  },
]
