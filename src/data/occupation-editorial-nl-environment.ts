import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlEnvironmentOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_ENVIRONMENT_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlEnvironmentOccupationEditorialOverride[] = [
  {
    id: "environmental-scientist",
    countryCode: "NL",
    editorial: {
      headline: "A directly supported Dutch environmental-professional pathway with strong current UWV demand and unusually strong study-to-level matching",
      entryPathway:
        "Milieukunde is the main higher-education proxy for the canonical Environmental Scientist profile. The Netherlands also has a level-4 MBO Onderzoeker Leefomgeving route for field sampling, soil/water/air analysis and environmental reporting, but the canonical professional scope remains ISCO-08 2133 rather than an MBO-only field-worker occupation.",
      registration:
        "Environmental-science practice is not one universally registered Dutch profession. Specific projects can require permits, recognised methods or specialist competence, but these activity-level rules are not converted into a personal registration requirement for every environmental scientist.",
      jobMarketNote:
        "UWV explicitly reports strong demand for sustainability, environment and energy-management specialists and many vacancies for milieukundigen in government. SBB's current Onderzoeker Leefomgeving route has baankans 8/10, while Studiekeuze123 reports good employment expectations for Milieukunde, a six-month median to a substantial job, 62% permanent contracts, 77% field match and 95% level match.",
      scoreCaveat:
        "Shortage credit is strong because multiple direct Dutch sources line up, but sector-wide climate-job growth and vacancy totals are retained only as context. No vacancy-intensity, trend or growth points are manufactured without an occupation-level recurring series.",
    },
  },
  {
    id: "agronomist",
    countryCode: "NL",
    editorial: {
      headline: "A crop and agricultural-advisory profession with strong graduate outcomes, green-transition demand and a task-specific crop-protection licensing boundary",
      entryPathway:
        "Tuinbouw en Akkerbouw is a direct higher-education pathway into crop science, agronomy, farming advisory and plant-production work. The profile is constrained to the advisory/scientific scope within ISCO-08 2132 and does not absorb farm labour or generic horticultural production roles.",
      registration:
        "Agronomy itself is not universally registered. However, a professional who sells, buys, uses, stores or advises on professional chemical crop-protection products needs the applicable RVO/Bureau Erkenningen proof of competence (spuitlicentie). That task-specific rule reduces accessibility slightly without making the whole occupation registration-required.",
      jobMarketNote:
        "UWV says the labour market for occupations needed for future-proof agriculture is tight to very tight and reports a large rise in vacancies for light-green occupations such as agricultural/environmental policy and soil expertise. Studiekeuze123 reports that Tuinbouw en Akkerbouw graduates find a substantial job in a median two months, 72% obtain a permanent contract and 83% work in-field.",
      scoreCaveat:
        "The shortage score stays below the maximum because UWV's strongest quantified green-vacancy trend covers a wider occupational basket than Agronomist alone. The strong study outcomes are stored separately so they can be audited rather than silently converted into vacancy points.",
    },
  },
  {
    id: "farm-manager",
    countryCode: "NL",
    editorial: {
      headline: "A management-level agricultural occupation with accessible vocational leadership routes but a labour market shaped heavily by self-employment and sector uncertainty",
      entryPathway:
        "The canonical Farm Manager maps to ISCO-08 1311 Agricultural and Forestry Production Managers. SBB's level-4 Vakexpert teelt en groene technologie explicitly prepares learners to run or lead part of a crop-production business, while higher-education Tuinbouw en Akkerbouw adds agronomic, technical, economic and entrepreneurship depth.",
      registration:
        "Farm management is not one statutorily registered occupation. Role-specific obligations can still apply, including proof of competence for professional chemical crop-protection use or advice and business-level permits or registrations depending on the activity.",
      jobMarketNote:
        "SBB gives the level-4 crop-production leadership route baankans 10/10, but the broader agricultural labour market is seasonal and structurally exposed to regulation, energy costs and self-employment. Studiekeuze123 reports 36% self-employment after Tuinbouw en Akkerbouw, so employee-vacancy signals cannot be treated as a clean Farm Manager shortage series.",
      scoreCaveat:
        "The profile receives only moderate shortage credit despite strong vocational job-chance data. The score deliberately discounts the high self-employment share and the lack of a recurring manager-only vacancy series.",
    },
  },
  {
    id: "forestry-technician",
    countryCode: "NL",
    editorial: {
      headline: "A practical nature and forestry technical role with positive MBO job-chance data but weaker higher-education contract and time-to-job outcomes",
      entryPathway:
        "Forestry Technician maps to ISCO-08 3143. Relevant Dutch routes include level-4 Opzichter/uitvoerder groene ruimte and Beheerder/uitvoerder natuur, water en natuurrecreatie, which cover nature management, field measurements, ecology, planning and supervision. Bos- en Natuurbeheer provides a higher-education progression route.",
      registration:
        "The generic forestry-technician role is not a universally registered profession. Specific chainsaw, machine, ecological survey or protected-species work can impose employer, safety or permit requirements, but these are activity-specific.",
      jobMarketNote:
        "SBB currently reports baankans 7/10 for level-4 green-space supervision and nature-management routes. Studiekeuze123 still rates Bos- en Natuurbeheer employment prospects as good, but the median time to a substantial job is eleven months and only 40% of employed graduates hold a permanent contract; this is materially weaker than the horticulture and food-technology pathways.",
      scoreCaveat:
        "The score combines the positive vocational signal with the weaker graduate-stability evidence instead of inheriting the much stronger shortage signal for gardeners, tree workers or general green-maintenance staff.",
    },
  },
  {
    id: "food-technologist",
    countryCode: "NL",
    editorial: {
      headline: "A food-process and quality-technology career with very strong current vocational job-chance evidence and direct industrial process-technology demand",
      entryPathway:
        "Food Technologist is constrained to food/process technology within ISCO-08 2145. The level-4 Vakexpert voeding, technologie en techniek route covers food development, quality analysis, food safety and production optimisation, while the hbo Voedingsmiddelentechnologie bachelor provides the professional product/process-development route.",
      registration:
        "Food Technologist is not a personal licensed profession, but food businesses must comply with HACCP-based food-safety systems and NVWA registration/recognition rules. Those business and process obligations are preserved as regulatory context rather than converted into a personal register requirement.",
      jobMarketNote:
        "SBB gives Vakexpert voeding, technologie en techniek the maximum current baankans 10/10; 88% of BOL graduates are in work after 1.5 years. UWV also identifies higher-level procestechnoloog vacancies as difficult to fill in industry. The hbo route reports 81% field match, 92% level match and good employment expectations, although the wider industrial sector has cooled since its 2021-2022 peak.",
      scoreCaveat:
        "Strong shortage credit requires both the food-specific SBB signal and UWV process-technology evidence. Industry-wide vacancy totals are stored as context only and do not create vacancy-intensity points for Food Technologist.",
    },
  },
  {
    id: "sustainability-specialist",
    countryCode: "NL",
    editorial: {
      headline: "A modern cross-sector sustainability role driven by climate, energy and reporting requirements but intentionally left outside a false legacy ISCO unit group",
      entryPathway:
        "Sustainability Specialist remains an explicit Netherlands career scope because sustainability strategy, ESG/CSRD reporting, energy management and transition work cut across environmental science, business operations and engineering. Milieukunde is used as a transparent environmental-study salary and entry proxy rather than as proof that every sustainability role is an environmental scientist.",
      registration:
        "Sustainability work is not one statutorily registered profession. Organisations can be subject to CSRD/ESRS and other environmental or energy obligations, but compliance responsibility does not create a universal personal licence for a sustainability specialist.",
      jobMarketNote:
        "UWV explicitly names sustainability, environment and energy-management specialists as highly sought after because of climate and sustainability policy. RVO's current CSRD and ESRS guidance confirms a continuing organisational need for structured sustainability data and reporting, while national energy and climate-adaptation policy adds durable policy demand.",
      scoreCaveat:
        "The shortage score is strong but below Environmental Scientist because the modern job title spans multiple legacy occupational families. Policy-driven demand and CBS sustainability context are retained in evidence without pretending they are occupation-level vacancy counts.",
    },
  },
  {
    id: "horticulturist",
    countryCode: "NL",
    editorial: {
      headline: "A strongly demanded Dutch horticulture and crop-production occupation with maximum SBB job-chance evidence and persistent UWV green-sector shortages",
      entryPathway:
        "Horticulturist maps to ISCO-08 6113 Gardeners, Horticultural and Nursery Growers, with the canonical scope centred on skilled crop/nursery production rather than landscape architecture. SBB's level-4 Vakexpert teelt en groene technologie provides a direct route and can lead to supervisory production responsibility.",
      registration:
        "Horticulture is not universally registered. Professional chemical crop-protection use, storage, purchase, sale or advice requires the relevant proof of competence; this task-specific rule is recorded separately and slightly reduces entry accessibility.",
      jobMarketNote:
        "SBB gives Vakexpert teelt en groene technologie baankans 10/10. UWV describes the labour market for future-proof agricultural occupations as tight to very tight and reports major recruitment problems among horticulture/green employers, alongside rising demand for technical, ICT, water and energy skills in modern greenhouse and crop production.",
      scoreCaveat:
        "Maximum shortage credit is supported by both current vocational job-chance data and UWV's direct green-sector shortage evidence. The score still keeps recurring vacancy and growth components at zero because the published sector totals are broader than this occupation.",
    },
  },
  {
    id: "animal-science-technician",
    countryCode: "NL",
    editorial: {
      headline: "A deliberately narrow laboratory-animal and life-science technical profile where direct job-chance evidence is weak despite broader agricultural staffing pressure",
      entryPathway:
        "Animal Science Technician maps to ISCO-08 3141 Life Science Technicians (except medical), constrained to laboratory-animal/life-science technical support rather than generic livestock work or veterinary practice. SBB's Proefdierverzorger level-3 route is the closest direct Dutch vocational pathway for the laboratory-animal part of this canonical profile.",
      registration:
        "The generic life-science technician title is not registered, but work with laboratory animals is legally competence-gated: the NVWA states that only specially trained employees may carry out animal experiments or work with laboratory animals. Separately, veterinary diagnosis/treatment is reserved to registered veterinary professionals and is excluded from this profile.",
      jobMarketNote:
        "The direct SBB Proefdierverzorger pathway has baankans only 4/10 and a EUR 15/hour starting-pay indicator, indicating few matching vacancies. This direct evidence outweighs broad claims that the whole agricultural or animal sector is short of staff; therefore the profile receives no generic shortage points.",
      scoreCaveat:
        "The low score is intentional. Broader livestock or green-sector demand is not borrowed by a narrow laboratory-animal technician profile, and the statutory training boundary under the Wet op de dierproeven is reflected in entry burden rather than mislabelled as professional registration.",
    },
  },
]
