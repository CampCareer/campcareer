import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "KR",
    editorial: {
      headline: "A direct Korean chef mapping under KECO 5311, distinct from ordinary line-cook classifications",
      entryPathway:
        "Chef maps to KECO 2025 code 5311 주방장 및 요리 연구가. The scope is the kitchen-leadership role that plans menus and coordinates kitchen staff, not every worker whose main task is cooking. One reviewed Cooking & Food Design degree remains a related pathway rather than a guaranteed chef appointment because chef roles usually require substantial practical progression.",
      registration:
        "There is no universal personal licence required for every Chef role in Korea. Separate Food Sanitation Act rules can require a licensed 조리사 in specified institutional food-service settings, so those establishment-specific duties must be checked independently.",
      jobMarketNote:
        "The direct 5311 classification is preserved, but CampCareer does not yet publish exact recurring Korean chef vacancy, comparable salary, shortage or growth evidence. General food-service demand is not substituted for chef-only market evidence.",
      scoreCaveat:
        "KR v1 credits a recognisable progression pathway and low universal licensing burden only. Labour-market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "cook",
    countryCode: "KR",
    editorial: {
      headline: "A broad cook umbrella spanning multiple KECO cuisine and institutional-cooking codes rather than a fabricated single code",
      entryPathway:
        "Korea does not provide one generic KECO 2025 unit group titled Cook. CampCareer therefore preserves the main cooking families—5312 한식, 5313 중식, 5314 양식, 5315 일식, 5318 단체급식 and 5319 기타 조리사—as non-rollup specialisations. One reviewed Cooking & Food Design degree remains related study; practical kitchen training and employer experience remain central.",
      registration:
        "The broad Cook occupation is not universally licensed. However, the Food Sanitation Act requires specified institutional food-service operators and certain food-service businesses to have a licensed 조리사 unless a statutory exception applies, so role and workplace context matters.",
      jobMarketNote:
        "Because the canonical Cook spans several distinct KECO codes, CampCareer does not aggregate them into a fabricated exact labour-market series. Exact salary, vacancy, shortage and growth evidence stays unscored for KR v1.",
      scoreCaveat:
        "Entry is relatively accessible, but the score reserves some burden because regulated institutional-catering roles can require a cook licence. No market or visa points are inferred.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "KR",
    editorial: {
      headline: "A hotel-management scope within KECO 0141, separated from frontline hotel service occupations",
      entryPathway:
        "Hotel Manager is represented within KECO 2025 code 0141 숙박·여행·오락 및 스포츠 관련 관리자, restricted to lodging-management work such as hotel general management, rooms operations and department management. One reviewed Hospitality Management degree is retained as a direct study link, while management appointment still normally depends on operational experience.",
      registration:
        "There is no universal statutory personal licence for Hotel Managers in Korea. Property-specific safety, food-service, liquor or facility obligations may require separate responsible persons or credentials, but these are not attributed to every hotel manager.",
      jobMarketNote:
        "KECO 0141 is broader than hotel management alone, so broad group observations are not presented as hotel-manager-only vacancy, salary or shortage evidence.",
      scoreCaveat:
        "KR v1 scores structured entry and low universal licensing burden only, with all market and occupation-specific visa components left at zero.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "KR",
    editorial: {
      headline: "A direct food-service management family under KECO 0142 with experience-led progression",
      entryPathway:
        "Restaurant Manager maps to KECO 2025 code 0142 음식 서비스 관련 관리자. The occupation covers planning and coordinating restaurant, cafe, bar and related food-service operations rather than primarily cooking or serving customers. The reviewed Hospitality Management programme is retained as a related pathway because management roles normally also require operational experience.",
      registration:
        "There is no universal personal occupational licence for Restaurant Managers. Food business licensing, hygiene, liquor and safety obligations attach to the establishment or specified responsible roles and should not be misrepresented as a universal manager licence.",
      jobMarketNote:
        "CampCareer keeps the direct management classification but does not yet normalise exact recurring 0142 vacancy, salary, shortage or growth evidence.",
      scoreCaveat:
        "KR v1 credits the established progression route and low universal licensing burden only; market and visa components remain unscored.",
    },
  },
  {
    id: "baker",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 8711 baker and pastry occupation with vocational or workplace entry and no universal personal licence",
      entryPathway:
        "Baker maps directly to KECO 2025 code 8711 제과원 및 제빵사. The reviewed Cooking & Food Design degree remains related rather than direct because bakery entry can also occur through vocational qualifications, apprenticeships and workplace training.",
      registration:
        "There is no universal statutory personal licence for Bakers. National technical qualifications for baking and pastry can support employability but are not treated as mandatory registration for every baker job.",
      jobMarketNote:
        "The classification is direct, but exact recurring KECO 8711 vacancy, comparable salary, shortage and growth evidence is not yet normalised for KR v1.",
      scoreCaveat:
        "Accessible vocational entry and low licensing burden receive credit; market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "KR",
    editorial: {
      headline: "A tourism-management scope within broader KECO 0141, with tourism and convention study pathways kept distinct from frontline travel-service roles",
      entryPathway:
        "Tourism Manager is represented conservatively within KECO 2025 code 0141 숙박·여행·오락 및 스포츠 관련 관리자. One Tourism & Convention programme remains direct and two hospitality/tourism programmes remain related. KECO 5211 여행 상품 개발자 is a useful adjacent operational occupation but is not substituted for the management-level canonical career.",
      registration:
        "There is no universal statutory occupational licence for Tourism Managers. Specific travel-business, guiding or facility activities can carry separate legal requirements, which are role- or business-specific rather than universal manager registration.",
      jobMarketNote:
        "Because 0141 covers multiple hospitality, travel and recreation managers, CampCareer does not treat broad 0141 labour observations as tourism-manager-only evidence.",
      scoreCaveat:
        "KR v1 keeps the broader mapping provisional and scores only entry structure and low licensing burden, not market or visa signals.",
    },
  },
  {
    id: "event-planner",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 0244 event, exhibition and conference planning occupation",
      entryPathway:
        "Event Planner maps directly to KECO 2025 code 0244 행사·전시 및 회의 기획자. One reviewed Tourism & Convention degree is retained as direct; Hospitality Management and other tourism/culture programmes remain related pathways. Portfolio evidence, project delivery and supplier coordination experience remain important hiring signals.",
      registration:
        "There is no universal statutory personal licence for Event Planners. Venue, safety, alcohol, tourism or public-event permits may apply to a particular event, but these are not personal occupation registration.",
      jobMarketNote:
        "The classification is direct, but exact recurring 0244 vacancy, salary, shortage and growth evidence has not yet been normalised for KR v1.",
      scoreCaveat:
        "KR v1 credits relatively accessible graduate/project entry and low licensing burden. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "KR",
    editorial: {
      headline: "A cross-venue hospitality supervision umbrella with no single Korean KECO code",
      entryPathway:
        "Hospitality Supervisor spans frontline supervisory work across accommodation, restaurants and guest services. Korea does not publish one KECO 2025 unit group that matches the full canonical umbrella, so CampCareer keeps 0141 lodging-related management, 0142 food-service management, 5230 accommodation service and 5322 food-and-beverage service only as non-rollup reference specialisations. One reviewed Hospitality Management programme remains a direct pathway.",
      registration:
        "There is no universal statutory personal licence for Hospitality Supervisors. Venue-specific food, liquor, gaming, safety or facility rules may impose credentials on particular responsibilities, but these are not universal to the canonical occupation.",
      jobMarketNote:
        "No incompatible hotel, restaurant and frontline-service series are combined into a synthetic hospitality-supervisor market figure. Exact labour-market metrics therefore remain unscored.",
      scoreCaveat:
        "KR v1 gives moderate entry credit and low universal licensing burden while leaving shortage, vacancy, salary, growth and occupation-specific visa components at zero.",
    },
  },
]
