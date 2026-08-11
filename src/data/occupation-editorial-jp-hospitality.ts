import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "JP",
    editorial: {
      headline: "A skilled restaurant-cooking career represented across Japan's cuisine-specific MHLW classifications rather than one universal Chef code",
      entryPathway:
        "Japan classifies skilled restaurant cooking mainly by cuisine: 055-01 日本料理調理人, 055-02 西洋料理調理人, 055-03 中華料理調理人 and 055-04 other national cuisines. MHLW explicitly lists シェフ under 055-02, but CampCareer does not treat Western cuisine as the whole Chef career. Culinary school or workplace apprenticeship can lead into the field, while senior kitchen responsibility normally follows substantial practical experience.",
      registration:
        "There is no universal statutory Chef licence required to perform the broad occupation. 調理師 is a prefectural licensed and protected title, but MHLW job tag states that entry to professional cooking itself does not universally require the qualification. Particular food-safety or specialist preparation duties can impose separate requirements.",
      jobMarketNote:
        "Because Japan divides skilled cooks by cuisine rather than seniority, CampCareer preserves 055-01 to 055-04 as non-rollup scopes and does not fabricate one exact Chef labour series.",
      scoreCaveat:
        "The foundation score reflects the practical training pathway and experience burden only. Shortage, vacancies, earnings, growth and visa signals remain unscored until the common market-enrichment phase.",
    },
  },
  {
    id: "cook",
    countryCode: "JP",
    editorial: {
      headline: "A broad cooking occupation spanning chain, school, institutional and other general cooking classifications",
      entryPathway:
        "The canonical Cook role is represented across 055-05 飲食チェーン店等調理員, 055-06 学校給食調理員, 055-07 給食等調理員 and 055-99 other cooking. Workplace training and culinary study are common routes, and the reviewed Japanese culinary programmes are retained as direct academic pathways.",
      registration:
        "No universal statutory Cook licence applies. The 調理師 title requires prefectural licensure and is protected by law, but holding that title is not universal permission required for every cooking job. Establishments can also have separate food-hygiene staffing duties.",
      jobMarketNote:
        "Chain restaurants, school meals, institutional catering and other cooking are separate official classifications. Their market data are not merged into one artificial Cook series.",
      scoreCaveat:
        "The provisional score recognises accessible workplace and training routes with low universal licensing burden. Market and visa components remain intentionally unscored.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "JP",
    editorial: {
      headline: "A hotel-management umbrella split between corporate management and frontline hotel-service management",
      entryPathway:
        "Japan separates hotel managers by the work actually performed. A company hotel manager whose work is primarily organisational management can fall under 002-01 会社管理職員, while a manager primarily directing hotel or ryokan hospitality operations can fall under 056-02 旅館・ホテル支配人. MHLW job tag describes progression through hotel departments and management experience as the common route.",
      registration:
        "There is no universal statutory Hotel Manager licence. Accommodation, food, liquor, safety and other venue-specific activities can create separate compliance or designated-person requirements.",
      jobMarketNote:
        "Corporate management and frontline hospitality management are distinct official scopes, so CampCareer does not merge them into one unsupported exact Hotel Manager market series.",
      scoreCaveat:
        "The foundation score reflects the management-experience entry burden only. Demand, salary, growth and visa evidence will be added later using comparable country-wide methodology.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "JP",
    editorial: {
      headline: "A restaurant-management career divided by whether corporate management, owner-management or frontline service is the primary work",
      entryPathway:
        "MHLW can classify a company restaurant manager under 002-01 when management is primary, an owner-manager under 003-99 in relevant cases, or a manager mainly engaged in restaurant service and operations under 056-01 飲食店店長. Hospitality study can help, but practical responsibility for staff, service, purchasing and commercial operations is central.",
      registration:
        "There is no universal statutory Restaurant Manager licence. Food-hygiene, liquor and other venue responsibilities can require separate designated persons, permissions or credentials without licensing the broad manager occupation itself.",
      jobMarketNote:
        "The three management/service scopes are preserved separately rather than collapsed into one exact restaurant-manager labour series.",
      scoreCaveat:
        "Only entry accessibility and burden are scored now. Market demand, earnings, growth and visa components are deferred to the later enrichment phase.",
    },
  },
  {
    id: "baker",
    countryCode: "JP",
    editorial: {
      headline: "A direct MHLW 072-01 bread-production occupation, kept separate from automated food-production operators",
      entryPathway:
        "MHLW 072-01 パン・菓子製造工 explicitly includes bread dough preparation, shaping, fermentation and baking. Workplace training is a common route, while the reviewed advanced bread programme is retained as direct and the confectionery programme as related. Automated production-equipment operators belong separately to 068-01.",
      registration:
        "No universal statutory Baker licence applies. パン製造技能士 can support professional progression but is not universal permission to enter bakery work. Independent food businesses have separate food-hygiene and operating obligations.",
      jobMarketNote:
        "The primary classification is 072-01 for hands-on bread production; automated food-production operators are not rolled into the Baker profile.",
      scoreCaveat:
        "The provisional score reflects accessible vocational entry and low universal licensing burden only. Market and visa evidence remains unscored.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "JP",
    editorial: {
      headline: "A tourism-management umbrella spanning organisational management and tour or travel-product planning rather than one standalone code",
      entryPathway:
        "MHLW has no standalone Tourism Manager small-classification code. Management responsibility can sit under 002-01, while 033-03 explicitly includes ツアープランナー and 旅行商品企画事務員. Tourism and hospitality study plus operating, supplier, commercial and destination experience provide the most relevant foundation.",
      registration:
        "No universal Tourism Manager licence applies. Narrow travel functions can have separate statutory or training requirements, including itinerary-management responsibilities, but these are not promoted into a blanket licence for the canonical role.",
      jobMarketNote:
        "Management, travel-product planning, travel sales and guiding are separate official occupations. CampCareer does not aggregate them into a fabricated Tourism Manager labour series.",
      scoreCaveat:
        "The current score covers entry and burden only. Shortage, vacancy, salary, growth and visa components await the common market-data phase.",
    },
  },
  {
    id: "event-planner",
    countryCode: "JP",
    editorial: {
      headline: "A direct MHLW 033-03 planning occupation with イベントプランナー explicitly listed",
      entryPathway:
        "MHLW 033-03 企画・調査事務員 explicitly includes イベントプランナー. Event, hospitality, tourism, marketing and communications study can support entry, but the reviewed Japanese programmes remain related pathways rather than occupational qualifications.",
      registration:
        "There is no universal statutory Event Planner licence. Venue, public-space, alcohol, entertainment, safety and crowd-management permissions depend on the event and organiser rather than licensing the occupation as a whole.",
      jobMarketNote:
        "033-03 contains many planning and research jobs in addition to events, so its labour statistics are not treated as exact Event Planner observations.",
      scoreCaveat:
        "The provisional score reflects broad academic and practical entry only. Market and visa components are deferred.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "JP",
    editorial: {
      headline: "A frontline hospitality-supervision umbrella distributed across restaurant, hotel, service, front-office and housekeeping classifications",
      entryPathway:
        "Japan has no single generic Hospitality Supervisor code. Relevant frontline supervisory work is distributed across 056-01 restaurant management, 056-02 hotel management, 056-03 food service, 056-04 hotel front office, 056-05 hotel guest service and housekeeping work such as 096-03. Hospitality study plus frontline experience commonly leads to shift-lead or supervisory responsibility.",
      registration:
        "No universal statutory Hospitality Supervisor licence applies. Food, alcohol, accommodation, gaming and safety duties may create venue-specific credentials or designated-person requirements.",
      jobMarketNote:
        "Distinct restaurant, hotel, service and housekeeping classifications are preserved as non-rollup references rather than aggregated into one exact supervisor market series.",
      scoreCaveat:
        "The foundation score recognises a practical progression route and low universal licensing burden. Market, salary, shortage, growth and visa evidence remains unscored until later enrichment.",
    },
  },
]
