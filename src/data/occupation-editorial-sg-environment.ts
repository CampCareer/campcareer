import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21332 environment-research occupation with science-focused environmental investigation kept distinct from compliance analysis",
      entryPathway:
        "Environmental Scientist maps directly to SSOC 2024 code 21332 Environment research scientist, covering research and investigations into pollutants and environmental or public-health hazards. Environmental science, ecology and earth-systems study provide relevant preparation; two approved Singapore programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational registration for the broad Environment Research Scientist role. Laboratory, field, environmental-health or regulated-site work can impose narrower employer or activity-specific requirements.",
      jobMarketNote:
        "The classification anchor is exact, but CampCareer has not yet normalised an occupation-level recurring shortage, vacancy, salary or growth series for SSOC 21332 into the Singapore scoring model.",
      scoreCaveat:
        "SG v1 scores structured professional entry and low broad-role licensing burden only. Market and occupation-specific visa components remain zero until the later enrichment phase.",
    },
  },
  {
    id: "agronomist",
    countryCode: "SG",
    editorial: {
      headline: "An explicit SSOC 21329 Agronomist example within the farming, forestry and fishery adviser group",
      entryPathway:
        "SSOC 21329 Farming/Forestry/Fishery adviser n.e.c. explicitly lists Agronomist. The role is kept separate from 21323 Agriculturist, which is more directly concerned with daily farm operations. Agricultural, plant and soil-science study and applied field experience are common foundations; no approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal personal occupational licence for Agronomists. Farm operations, pesticides, biosecurity and food-production activities can have separate operational or competency requirements.",
      jobMarketNote:
        "CampCareer uses the explicit Agronomist example under 21329 without borrowing the whole adviser group's labour statistics as exact Agronomist evidence.",
      scoreCaveat:
        "The foundation score reflects professional-entry structure only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 13100 agricultural-production management occupation that explicitly includes Farm manager",
      entryPathway:
        "Farm Manager maps directly to SSOC 13100 Production manager in agriculture/fisheries, whose examples include Farm manager, Fishery manager and Plant nursery manager. Entry commonly combines production knowledge with substantial operational and people-management experience; no approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal personal Farm Manager occupational licence. Commercial farms, animal breeding, premises and particular production activities can require business or facility licences, which are kept separate from individual occupational registration.",
      jobMarketNote:
        "The SSOC classification is broad across crop and fish production, so CampCareer does not infer a single exact Farm Manager market series from sector or business-licensing evidence.",
      scoreCaveat:
        "SG v1 gives strong structural entry credit but leaves all market and occupation-specific visa components at zero.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "SG",
    editorial: {
      headline: "A forestry technical-support umbrella anchored to SSOC silvicultural and life-science technician references rather than an invented five-digit Forestry Technician code",
      entryPathway:
        "SSOC 2024 does not name a standalone Forestry Technician occupation. The closest technical field scope is 31421 Horticultural technician, which explicitly includes Silvicultural technician, while 31419 Life science technician n.e.c. provides a broader biological field and laboratory support reference. No approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal personal occupational registration for the broad forestry technical-support role. Specific tree-work, workplace-safety, machinery or site duties can have narrower competency requirements.",
      jobMarketNote:
        "The two reference codes are preserved separately and are not aggregated into a fabricated exact Forestry Technician salary, vacancy or shortage series.",
      scoreCaveat:
        "Technician-level entry accessibility is credited, while market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21454 Food/Drink technologist occupation spanning process development, emerging foods, testing and food-safety research",
      entryPathway:
        "Food Technologist maps directly to SSOC 21454 Food/Drink technologist. The official scope includes food and drink process research, alternative and cultivated proteins, product and process development, testing and food-safety risk work. Two approved Singapore Food Science/Food Technology programmes are retained as direct study pathways.",
      registration:
        "There is no universal personal Food Technologist occupational licence. Singapore regulates food businesses, facilities, products and food-safety activities separately, so those controls are not treated as individual occupation registration.",
      jobMarketNote:
        "The classification is exact, but CampCareer does not convert the importance of food regulation or the existence of direct programmes into shortage or demand evidence.",
      scoreCaveat:
        "SG v1 scores the clear academic pathway and low broad-role licensing burden only. Market and visa components remain zero.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "SG",
    editorial: {
      headline: "An explicit SSOC 21339 Sustainability specialist mapping, with sustainability project development kept as a separate related scope",
      entryPathway:
        "SSOC 21339 Environmental protection and related professional n.e.c. explicitly lists Sustainability specialist. SSOC 24214 Sustainability project development/management professional is retained separately for carbon-credit, renewable-energy and certification-project work. Six approved Singapore environmental, sustainability and built-environment programmes are related pathways.",
      registration:
        "There is no universal statutory occupational registration for Sustainability Specialists. Carbon standards, project certifications, environmental compliance and sector-specific professional obligations remain separate from broad occupational registration.",
      jobMarketNote:
        "CampCareer does not combine 21339 and 24214 into one fabricated exact labour series and does not infer demand from Singapore's sustainability-policy activity.",
      scoreCaveat:
        "The foundation score reflects graduate-accessible entry only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21321 Horticulturist/Arborist professional occupation, distinct from horticultural technicians and workers",
      entryPathway:
        "Horticulturist maps directly to SSOC 21321 Horticulturist/Arborist, covering horticultural crop research, improved production methods and advice to growers. SSOC 31421 Horticultural technician remains a separate technical occupation. No approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal statutory personal licence for the broad Horticulturist/Arborist occupation. Professional certifications and employer competency requirements may matter for particular arboriculture, landscape or tree-management roles.",
      jobMarketNote:
        "The professional and technician classifications remain separate and no broader landscape or nursery statistics are presented as exact Horticulturist market evidence.",
      scoreCaveat:
        "SG v1 credits the professional study/experience pathway while leaving market and visa components unscored.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "SG",
    editorial: {
      headline: "A direct non-clinical SSOC 31423 animal-production technician occupation kept separate from veterinary clinical support",
      entryPathway:
        "Animal Science Technician maps directly to SSOC 31423 Farming technician (animal production), which covers animal specimens, livestock-disease controls, hatchery and production programmes and examples such as aquaculture and artificial-breeding technicians. Veterinary technician/assistant 32400 is explicitly separate. No approved Singapore programme mapping is currently present.",
      registration:
        "AVS veterinary licensing applies to qualified veterinarians who treat animals and birds. The canonical Animal Science Technician scope is non-clinical animal-production support and is therefore not treated as universally requiring a veterinary licence.",
      jobMarketNote:
        "Animal-production and veterinary-clinical classifications remain separate, and animal-sector business or veterinary licensing is not converted into occupation demand evidence.",
      scoreCaveat:
        "Technician entry accessibility is credited while market and occupation-specific visa components remain zero.",
    },
  },
]
