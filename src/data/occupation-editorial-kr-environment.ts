import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "KR",
    editorial: {
      headline: "An environmental-science and ecology research pathway mapped conservatively into Korea's broader life-science researcher group",
      entryPathway:
        "Environmental Scientist is mapped to KECO 2025 code 1221 생명과학 연구원, restricted to environmental science, ecology and environmental-research work. Korea does not publish a standalone Environmental Scientist unit group, so broader biology, medicine or other life-science roles inside 1221 are not treated as part of this canonical career. Environmental-science, atmospheric-environment and related university programmes provide the clearest graduate route.",
      registration:
        "There is no universal statutory personal licence for Environmental Scientists in Korea. Specific environmental-impact, laboratory, facility-management or regulated consulting duties may require separate credentials or legally designated responsible persons, but those requirements are role-specific rather than a licence for the occupation as a whole.",
      jobMarketNote:
        "Four reviewed Korean environmental-science or closely aligned programmes are linked as direct study evidence. KR v1 does not yet publish an Environmental Scientist-only recurring vacancy, comparable salary, shortage or growth series because KECO 1221 is substantially broader than this canonical scope.",
      scoreCaveat:
        "The score credits structured graduate entry and low universal licensing burden only. Market and occupation-specific visa components remain unscored until evidence can be isolated to the environmental-science scope rather than the full 1221 group.",
    },
  },
  {
    id: "agronomist",
    countryCode: "KR",
    editorial: {
      headline: "A crop-science and agronomy research career inside Korea's broader life-science researcher classification",
      entryPathway:
        "Agronomist maps to KECO 2025 code 1221 생명과학 연구원, restricted to 농학, crop science, soils, plant production and related applied agricultural research. The revised classification groups agronomy with other life-science research rather than publishing a standalone agronomist code. Agriculture, plant-science, smart-farm and horticultural science programmes can provide relevant academic preparation depending on the actual role.",
      registration:
        "There is no universal Agronomist occupational licence. National technical qualifications can be relevant to particular crop, seed, plant-protection, soil or agricultural-service duties, but CampCareer does not treat any one credential as mandatory across the entire canonical career.",
      jobMarketNote:
        "Two reviewed Korean programmes are linked as direct study evidence and two more as related pathways. Broader agriculture-sector hiring or farm-worker data are not reused as Agronomist-only labour evidence.",
      scoreCaveat:
        "KR v1 credits the graduate-entry route and low universal licensing burden. Exact shortage, vacancy, salary, growth and visa components remain zero until comparable evidence is available for the agronomy/crop-science scope.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "KR",
    editorial: {
      headline: "A production-management umbrella with no single Korean occupation code, so crop and livestock production groups remain separate rather than artificially aggregated",
      entryPathway:
        "Korea's KECO 2025 does not publish one generic Farm Manager unit group. Agricultural work is classified by production type, including grain, vegetable, specialty-crop, fruit, horticulture, dairy and livestock occupations. CampCareer therefore leaves the profile without a single roll-up code and treats agricultural study plus substantial practical production, operations and business experience as the usual pathway.",
      registration:
        "There is no universal Farm Manager personal licence. Pesticides, machinery, livestock disease control, food handling, land use, employment and other activities can have separate legal requirements, so compliance depends on the farm's actual production and responsibilities.",
      jobMarketNote:
        "Three reviewed Korean agriculture programmes are retained as related study evidence. Production-specific crop and livestock codes are stored as non-rollup specialisations and are not combined into a fabricated generic Farm Manager employment, salary or shortage figure.",
      scoreCaveat:
        "KR v1 gives higher entry-access credit because farm management can be reached through practical experience as well as formal study. All market and occupation-specific visa components remain unscored because there is no exact generic KECO occupation.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "KR",
    editorial: {
      headline: "A forestry technical-support pathway within KECO 1223, with additional statutory qualification requirements for specified forest-project duties",
      entryPathway:
        "Forestry Technician maps to KECO 2025 code 1223 농림어업 관련 시험원, restricted to forestry field support, testing, measurement and applied technical work. One reviewed Korean Forest Science programme is linked as direct study evidence. Practical and technical routes can also be relevant depending on the employer and duty set.",
      registration:
        "The broad forestry-technician occupation is not universally licensed. However, Korea's Forest Technology Promotion and Management Act establishes 산림기술자 qualifications for specified forest-project planning, survey, design, implementation, supervision and related statutory forest-technology duties. Applicants must therefore distinguish general technical support from legally designated forest-technology work.",
      jobMarketNote:
        "CampCareer keeps forestry research, forestry production workers and statutory forest-technology roles separate. Exact recurring KECO 1223 forestry-only vacancies, salary and shortage evidence are not yet normalised.",
      scoreCaveat:
        "Entry accessibility receives credit, but the burden component is reduced because some forest-project duties require a recognised 산림기술자 qualification. Broader forestry demand and visa assumptions are not scored.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO food-engineering pathway covering product development, processing and technical quality work",
      entryPathway:
        "Food Technologist maps directly to KECO 2025 code 1571 식품공학 기술자 및 연구원. Relevant work includes food research and development, processing technology, production improvement, quality systems, packaging and technical analysis. Four reviewed Korean food-engineering or food-science programmes are linked as direct study evidence, with three additional programmes kept at related strength.",
      registration:
        "There is no single universal personal licence required for all Food Technologists. Particular food-safety, laboratory, manufacturing or legally designated responsible-person duties can impose separate qualification requirements depending on the employer and product category.",
      jobMarketNote:
        "The direct classification is verified, but KR v1 does not yet publish a recurring exact-code 1571 vacancy series, comparable national salary, shortage signal or growth series. Broader food-manufacturing employment is not substituted for occupation-level evidence.",
      scoreCaveat:
        "KR v1 credits the structured graduate pathway and low universal licensing burden. Market and occupation-specific visa components remain provisional and unscored.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "KR",
    editorial: {
      headline: "A cross-industry sustainability career using environmental engineering and consulting only as a broader Korean proxy, not as a one-to-one occupation match",
      entryPathway:
        "KECO 2025 has no standalone Sustainability Specialist code. CampCareer uses 1555 환경공학 기술자 및 연구원 as a broader environmental-consulting and sustainability proxy where duties centre on environmental performance, impact management and organisational sustainability. Corporate ESG, reporting or strategy roles may instead sit in business functions, so the mapping must not be read as universal.",
      registration:
        "There is no universal Sustainability Specialist occupational licence. Environmental assessment, engineering, emissions, safety or other regulated duties can require separate qualifications, but broad sustainability and ESG roles do not share one statutory licence.",
      jobMarketNote:
        "Five reviewed Korean environmental programmes are linked only as related study evidence. Environmental-engineering employment or vacancies are not presented as Sustainability Specialist-only market evidence because the canonical career cuts across engineering, consulting and corporate functions.",
      scoreCaveat:
        "The broader mapping remains intentionally provisional. KR v1 credits general graduate accessibility and low universal licensing burden while leaving shortage, salary, vacancy, growth and visa components at zero.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "KR",
    editorial: {
      headline: "A practical horticultural-production pathway mapped to KECO 9014, kept separate from horticulture research and landscaping",
      entryPathway:
        "Horticulturist maps to KECO 2025 code 9014 원예작물 재배원 for practical horticultural production. Research-focused horticulture belongs within the broader life-science researcher group and landscaping belongs to a separate occupation, so CampCareer does not mix those scopes. Two reviewed horticulture programmes are direct study links and one smart-farm programme remains related.",
      registration:
        "There is no universal personal licence for horticultural production. Pesticide use, machinery, protected cultivation, plant-health activities and particular commercial operations may have separate compliance or qualification requirements.",
      jobMarketNote:
        "The occupation supports direct practical and academic entry routes, but KR v1 does not yet publish exact 9014 comparable wage, recurring vacancy, shortage or growth evidence suitable for cross-country scoring.",
      scoreCaveat:
        "Flexible vocational, practical and degree routes receive higher entry credit. Market and occupation-specific visa components remain unscored rather than inferred from the agriculture sector as a whole.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "KR",
    editorial: {
      headline: "A non-clinical livestock and animal-science technical pathway within Korea's broader agricultural testing classification",
      entryPathway:
        "Animal Science Technician maps to KECO 2025 code 1223 농림어업 관련 시험원, restricted to non-clinical livestock, breeding, nutrition, husbandry research support and agricultural technical work. Veterinary diagnosis and clinical animal care are excluded. One reviewed Animal Life Resources programme is linked as direct study evidence and one Food & Animal Biotechnology programme remains related.",
      registration:
        "There is no universal Animal Science Technician licence. Particular breeding procedures, laboratory work, animal disease control, veterinary-support activities or biosecurity duties can have separate statutory or employer requirements.",
      jobMarketNote:
        "KR v1 keeps veterinary, livestock-production and agricultural-research roles separate from this technician scope. No exact recurring animal-science-technician vacancy, comparable salary or shortage series is currently normalised.",
      scoreCaveat:
        "Technical entry accessibility receives higher credit, while market and occupation-specific visa components remain zero until exact evidence is available.",
    },
  },
]
