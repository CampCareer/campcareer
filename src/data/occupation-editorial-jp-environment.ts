import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "JP",
    editorial: {
      headline: "A science and environmental-investigation career spanning MHLW natural-science research and environmental measurement rather than one standalone code",
      entryPathway:
        "Japan's 2022 classification does not publish one exact Environmental Scientist small class. Research-focused work can sit in 004-01 自然科学系研究者, while environmental impact, air, water, soil, noise and vibration investigation is explicitly placed in 011-99 through 環境調査員. Environmental science, earth science and related natural-science study are therefore the clearest foundations.",
      registration:
        "There is no universal statutory licence for the whole Environmental Scientist occupation. Narrow measurement work can require separate protected credentials such as 作業環境測定士 or 環境計量士, but those requirements are not promoted into a licence for every environmental scientist.",
      jobMarketNote:
        "Research and environmental investigation are separate official scopes, so CampCareer preserves 004-01 and 011-99 as non-rollup references rather than fabricating one exact market series.",
      scoreCaveat:
        "The foundation score reflects entry structure only. Shortage, vacancies, salary, growth and visa evidence remain unscored until the later common market-enrichment phase.",
    },
  },
  {
    id: "agronomist",
    countryCode: "JP",
    editorial: {
      headline: "An agronomy and agricultural-advisory role directly anchored to MHLW 005-01 農林水産技術者",
      entryPathway:
        "MHLW 005-01 explicitly includes 農業技術者 and technical guidance on crop cultivation, soils, fertilisers, pests, production distribution and farm management. Agricultural science, agronomy, crop science and related bioscience programmes are the strongest academic routes.",
      registration:
        "No universal personal Agronomist licence applies across Japan. Public extension, plant-protection and other specialist posts can have separate appointment, examination or employer requirements.",
      jobMarketNote:
        "The same 005-01 group also contains forestry, livestock and fisheries technicians, so shared statistics cannot be treated as exact Agronomist observations.",
      scoreCaveat:
        "Programme availability is not treated as demand evidence. Market, salary, shortage, growth and visa components remain deferred.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "JP",
    editorial: {
      headline: "A production-type farm-management umbrella rather than one generic Japanese occupation code",
      entryPathway:
        "Japan classifies farm production by the work performed under the 064 agriculture family rather than publishing a single generic Farm Manager small class. CampCareer therefore retains crop and livestock production references such as 064-01, 064-02 and 064-03. Agricultural study can support entry, but practical production, staffing and business-management experience are central.",
      registration:
        "There is no universal Farm Manager licence. Particular pesticide, machinery, livestock, biosecurity or regulated production duties can carry their own qualifications or training requirements.",
      jobMarketNote:
        "Crop and livestock production occupations remain separate and are not aggregated into a fabricated exact Farm Manager labour market.",
      scoreCaveat:
        "The provisional score recognises broad practical entry only; later enrichment will add comparable market and migration evidence.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "JP",
    editorial: {
      headline: "A forestry technical occupation directly represented within MHLW 005-01 as 林業技術者",
      entryPathway:
        "MHLW 005-01 explicitly includes 林業技術者 covering forest seedlings, regeneration, protection, forest-product use and technical extension. Forestry, forest science and related agricultural study are common foundations, followed by field-based technical work.",
      registration:
        "There is no universal personal Forestry Technician licence. Depending on the role, forestry extension, 技術士, surveying, forestry-skills or public-service requirements can apply separately.",
      jobMarketNote:
        "005-01 combines several agriculture, forestry and fisheries technical occupations, so its group statistics are not presented as exact Forestry Technician figures.",
      scoreCaveat:
        "Only foundation entry accessibility is scored now; demand, earnings, growth and visa signals remain for the later enrichment phase.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "JP",
    editorial: {
      headline: "A food-technology umbrella spanning MHLW 006-01 product development and 007-01 manufacturing/process technology",
      entryPathway:
        "Food Technologist does not map to one Japanese small class. MHLW 006-01 covers development work such as ingredient analysis, formulation and prototypes, while 007-01 covers process design, technical guidance, quality control and manufacturing technology. Food science and applied bioscience are the clearest study routes.",
      registration:
        "There is no universal personal Food Technologist licence. Specific factories, statutory food-hygiene responsibilities and regulated inspection functions can impose narrower qualifications.",
      jobMarketNote:
        "Development and manufacturing technology are kept as separate reference scopes rather than being merged into one unsupported exact series.",
      scoreCaveat:
        "Market and migration scoring remains intentionally blank until comparable occupation-level evidence is normalised.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "JP",
    editorial: {
      headline: "A cross-functional sustainability role without one standalone MHLW small-classification code",
      entryPathway:
        "Corporate sustainability work can overlap environmental technical work, planning and analysis depending on the job. CampCareer therefore uses 011-99 environmental technical work and 033-03 planning/investigation only as non-rollup references. Environmental science, engineering, policy, economics and sustainability programmes can all provide relevant foundations.",
      registration:
        "No universal statutory Sustainability Specialist licence exists. Narrow environmental measurement, engineering or other regulated responsibilities can carry separate credentials.",
      jobMarketNote:
        "Environmental-investigation and corporate-planning statistics are not substituted for an exact sustainability-specialist labour series.",
      scoreCaveat:
        "The current score reflects entry structure only; demand, salary, growth, shortage and visa signals await the common enrichment phase.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "JP",
    editorial: {
      headline: "A broad horticulture career spanning crop production and nursery/landscape work rather than one exact Japanese code",
      entryPathway:
        "Horticulture spans crop cultivation under 064-02 and nursery, tree and landscaping work represented by 064-05. Entry can come through vocational horticulture, agricultural study or substantial practical production experience, so reviewed agriculture degrees are kept as related pathways rather than occupational qualifications.",
      registration:
        "No universal Horticulturist licence applies. Pesticide use, machinery, landscaping construction and supervisory work can have role-specific training or qualifications.",
      jobMarketNote:
        "Crop-production and landscaping occupations are preserved separately and are not aggregated into a fabricated horticulture market total.",
      scoreCaveat:
        "The foundation score recognises accessible entry and low universal licensing burden; market scoring remains deferred.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "JP",
    editorial: {
      headline: "An animal-science technical role directly anchored to the 畜産技術者 scope within MHLW 005-01",
      entryPathway:
        "MHLW 005-01 explicitly includes 畜産技術者 covering breeding, feeding, pasture and feed-crop production, livestock production methods and technical guidance. Animal science, agriculture and bioscience study are common academic foundations.",
      registration:
        "There is no universal Animal Science Technician licence across the broad role. Specific work such as 家畜人工授精 requires separate statutory qualification, while veterinary diagnosis and treatment remain outside this profile.",
      jobMarketNote:
        "Because 005-01 combines livestock with agricultural, forestry and fisheries technicians, shared statistics are not treated as exact Animal Science Technician values.",
      scoreCaveat:
        "The score currently reflects entry and the limited role-specific qualification burden only; market and visa evidence remains unscored.",
    },
  },
]
