import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 34341 general-chef occupation with mandatory food-handler compliance kept separate from occupational licensing",
      entryPathway:
        "Chef maps primarily to SSOC 34341 Chef (excluding pastry chef). Pastry chef 34343 remains a separate specialist reference rather than being silently merged. Culinary training and supervised kitchen experience are practical entry routes; there is no approved Singapore programme mapping in the current staging set.",
      registration:
        "There is no universal Chef occupational licence. However, anyone handling or preparing food in an SFA-licensed food establishment must meet the applicable WSQ Food Safety Course Level 1 training and retraining requirements and be registered as a Food Handler. CampCareer treats that as mandatory task/setting compliance rather than a universal professional-registration scheme.",
      jobMarketNote:
        "The SSOC mapping is direct, but food-safety regulation is not demand evidence and no exact recurring 34341 shortage, vacancy, salary or growth series is yet normalised in CampCareer SG v1.",
      scoreCaveat:
        "Foundation scoring credits practical entry while applying a modest burden adjustment for mandatory food-handler compliance. Market and occupation-specific visa components remain zero until the later enrichment phase.",
    },
  },
  {
    id: "cook",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 51201 Cook occupation, distinct from Senior Cook and from Chef classifications",
      entryPathway:
        "Cook maps directly to SSOC 51201. Senior cook 51202 is retained as a separate seniority reference, while Chefs remain in SSOC 3434. Practical vocational training and supervised kitchen experience are common routes; no approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal Cook occupational licence. Food handlers in SFA-licensed establishments must nevertheless complete the required food-safety training/retraining and be registered with SFA before handling or preparing food.",
      jobMarketNote:
        "CampCareer keeps Cook separate from Chef and Senior Cook and does not infer demand from SFA food-safety obligations.",
      scoreCaveat:
        "SG v1 credits accessible practical entry and applies only a modest food-handler compliance burden. Shortage, vacancy, salary, growth and visa components remain unscored.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 14110 hotel-operations management occupation with establishment licensing kept separate from personal occupational registration",
      entryPathway:
        "Hotel Manager maps directly to SSOC 14110 Hotel operations/Lodging services manager. One approved Hospitality and Tourism Management programme is retained as a related pathway because management responsibility normally depends on substantial operating experience as well as study.",
      registration:
        "There is no universal personal occupational registration for Hotel Managers. Singapore regulates hotel operations and premises through sector licensing; those operator and establishment obligations are not converted into a personal manager licence.",
      jobMarketNote:
        "The classification anchor is direct, but CampCareer has not yet normalised an exact 14110 shortage, vacancy, salary or growth series into the common Singapore scoring model.",
      scoreCaveat:
        "Foundation scoring reflects the experience-heavy nature of management entry. Market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 14121 restaurant-management occupation with food-business and Food Hygiene Officer duties kept role-specific",
      entryPathway:
        "Restaurant Manager maps directly to SSOC 14121. One approved Hospitality and Tourism Management programme is retained as a related pathway; practical food-service operations, staff supervision and commercial responsibility remain central to entry.",
      registration:
        "Food Shop licences attach to the food business or operator rather than every Restaurant Manager personally. Managers who handle food must meet Food Handler rules, and managers appointed as Food Hygiene Officers in establishments that require one must satisfy the separate SFA FHO certification requirements. The broad Restaurant Manager role is therefore not marked as universally licensed.",
      jobMarketNote:
        "Regulatory obligations are kept separate from labour-demand evidence, and no exact 14121 market series is scored at foundation stage.",
      scoreCaveat:
        "SG v1 gives moderated entry credit for an experience-heavy management role and reflects setting-specific food-safety obligations in entry burden only. Market and visa components remain zero.",
    },
  },
  {
    id: "baker",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 75121 Baker trade occupation with pastry/confectionery work kept separately classified",
      entryPathway:
        "Baker maps directly to SSOC 75121. SSOC 75122 Pastry/Confectionery maker is retained separately. Baking is accessible through practical vocational preparation and supervised production experience; no approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal Baker occupational licence. Bakers working as Food Handlers in SFA-licensed bakeries, food manufacturers or other licensed food businesses must comply with mandatory food-safety training/retraining and registration requirements.",
      jobMarketNote:
        "CampCareer does not treat food-establishment licensing or Food Handler registration as shortage, vacancy or salary evidence.",
      scoreCaveat:
        "The foundation score recognises practical trade entry and a modest food-handler compliance burden. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "SG",
    editorial: {
      headline: "A tourism-management umbrella using travel-agency and attractions management references rather than inventing one SSOC code",
      entryPathway:
        "Singapore has no single five-digit SSOC occupation titled Tourism Manager. CampCareer retains 14392 Travel agency manager and 14322 Attractions manager as non-rollup references for travel-product, visitor-experience and tourism-operations management. One approved Hospitality and Tourism Management programme is related.",
      registration:
        "Travel Agent licensing applies to persons or businesses carrying on regulated travel-agent activities, while Tourist Guide licensing applies to individuals personally providing remunerated in-person guiding services. Neither regime is treated as a universal personal licence for every Tourism Manager.",
      jobMarketNote:
        "The official reference occupations are preserved separately and are not aggregated into a fabricated exact Tourism Manager labour-market series.",
      scoreCaveat:
        "The multi-code mapping and experience-heavy management entry keep the score provisional. Market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "event-planner",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 33320 event-planning occupation, distinct from the managerial 14391 Event manager role",
      entryPathway:
        "Event Planner maps directly to SSOC 33320 Exhibition/Conference/Event planner. SSOC 14391 Event manager is retained as a separate managerial-seniority reference. One approved Hospitality and Tourism Management programme is a related rather than direct occupational pathway.",
      registration:
        "There is no universal personal occupational registration for Event Planners. Venue, public-space, liquor, entertainment, road-closure or other event-specific permits can apply depending on the event, but those are not an occupational licence for the planner.",
      jobMarketNote:
        "Event permitting and venue regulation are not converted into labour-market evidence in the foundation phase.",
      scoreCaveat:
        "SG v1 credits relatively accessible professional entry and low universal licensing burden. Shortage, vacancy, salary, growth and visa components remain zero.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "SG",
    editorial: {
      headline: "A cross-venue hospitality-supervision umbrella across kitchen, table-service, gaming and housekeeping supervisory codes",
      entryPathway:
        "Singapore does not provide one five-digit Hospitality Supervisor occupation. CampCareer retains SSOC 34342 Kitchen operations head/supervisor, 51311 Captain waiter/Waiter supervisor, 51701 Gaming supervisor and 51503 Housekeeping matron as non-rollup references. One approved Hospitality and Tourism Management programme is related.",
      registration:
        "There is no universal Hospitality Supervisor occupational licence. A supervisor who handles food must satisfy Food Handler requirements, and a supervisor appointed as a Food Hygiene Officer in an establishment that requires one must hold the applicable SFA certification. Gaming and other venue-specific duties can also have narrower controls.",
      jobMarketNote:
        "The distinct supervisory occupations are not collapsed into unsupported exact employment, salary, vacancy or shortage metrics.",
      scoreCaveat:
        "The foundation score recognises practical progression into supervision while retaining a modest setting-specific compliance burden. Market and visa components remain unscored.",
    },
  },
]
