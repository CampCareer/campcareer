import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaTransportOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 6223 truck-driving occupation with a statutory commercial-freight qualification pathway",
      entryPathway:
        "Truck Driver maps to KECO 2025 code 6223 화물차 및 특수차 운전원. Entry is primarily a driving-licence and occupational-qualification pathway rather than a university route. For business-use freight driving, the current system requires the appropriate road driving licence, driver-fitness requirements and the statutory 화물운송 종사자격 process administered through the Ministry of Land, Infrastructure and Transport and the Korea Transportation Safety Authority.",
      registration:
        "For driving in the commercial freight-transport business, a 화물운송 종사자격 is required under the Freight Trucking Transport Business Act. The requirement is specific to business-use freight driving; CampCareer does not imply that every private or non-business truck movement is governed by the same occupational qualification.",
      jobMarketNote:
        "The KECO mapping is direct, but CampCareer has not yet normalised a recurring exact-code national vacancy, comparable salary, shortage or growth series for KR v1. No reviewed Korean study programme is currently linked because this is primarily a licence-and-work pathway.",
      scoreCaveat:
        "KR v1 credits a comparatively direct work-entry route while applying a meaningful qualification burden. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "KR",
    editorial: {
      headline: "A cross-mode Korean logistics role kept as an umbrella across transport and inventory clerical families rather than forced into one KECO code",
      entryPathway:
        "Logistics Coordinator can span road and rail transport clerical work, water and air transport clerical work, inventory and warehouse administration, and other transport or trade clerical duties. CampCareer therefore retains KECO 0282, 0283, 0284 and 0289 as non-rollup reference scopes rather than presenting one of them as an exact national Logistics Coordinator code. Two reviewed industrial-engineering programmes remain related study pathways.",
      registration:
        "There is no universal statutory personal licence for the broad Logistics Coordinator occupation. Particular customs, dangerous-goods, bonded-warehouse or transport functions can carry separate role-specific requirements, but these are not attributed to every logistics coordinator.",
      jobMarketNote:
        "Because the canonical role crosses several KECO families, CampCareer does not aggregate their employment, earnings or vacancy series into a fabricated exact logistics-coordinator metric. Programme presence is not treated as demand or visa evidence.",
      scoreCaveat:
        "KR v1 credits related study accessibility and low universal licensing burden only. Market and occupation-specific visa components remain zero until a defensible comparable role-level series is available.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 8121 aircraft-maintenance occupation with mandatory aviation qualification for regulated maintenance duties",
      entryPathway:
        "Aircraft Maintenance Technician maps to KECO 2025 code 8121 항공기 정비원. Two reviewed Aerospace Engineering degrees remain related rather than direct occupational programmes. For regulated aircraft-maintenance duties, the Aviation Safety Act places 항공정비사 within the national aviation-personnel qualification system, with written and practical examination requirements and qualification limitations by aircraft or maintenance field.",
      registration:
        "An applicable 항공정비사 aviation-personnel qualification is required for the regulated aircraft-maintenance work covered by the statutory qualification scope. Assistant, trainee or narrowly delegated support duties can differ by employer and legal responsibility, so CampCareer does not equate an aerospace degree alone with maintenance certification.",
      jobMarketNote:
        "The direct KECO 8121 mapping is retained without importing demand from the broader aerospace-engineering industry. The two current Korean programme links are related academic routes only and do not guarantee licence eligibility or employment.",
      scoreCaveat:
        "The regulated examination and qualification pathway produces a high entry burden. No shortage, salary, vacancy, growth or occupation-specific visa points are assigned in KR v1.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "KR",
    editorial: {
      headline: "A regulated commercial-pilot pathway inside KECO 6211 with mandatory aviation-personnel certification and medical requirements",
      entryPathway:
        "Commercial Pilot is represented within KECO 2025 code 6211 항공기 조종사, restricted to paid commercial aeroplane operations rather than every aircraft-pilot role. The reviewed Flight Operation degree remains a related pathway under the existing programme review. Korean commercial flying requires the applicable 사업용조종사 or higher aviation-personnel qualification, required aeronautical experience, examinations and the relevant medical and operational qualifications.",
      registration:
        "A national aviation-personnel qualification is mandatory for commercial piloting. The Aviation Safety Act includes 사업용조종사 and 운송용조종사 among regulated qualifications, and the Korea Transportation Safety Authority administers the qualification examinations delegated under the aviation framework.",
      jobMarketNote:
        "CampCareer does not use general aviation-industry growth or airline hiring as exact Commercial Pilot demand. The current programme link is study-path evidence only, and licence, flight experience, medical fitness and employer selection remain separate gates.",
      scoreCaveat:
        "KR v1 gives limited entry credit because flight training and certification are lengthy and expensive, with a high regulatory burden. Exact labour-market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "KR",
    editorial: {
      headline: "A seagoing ship-engineer scope within KECO 6212 backed by the statutory engineer-officer maritime licence system",
      entryPathway:
        "Marine Engineer represents the seagoing 선박 기관사 occupation. The current KSCO-to-KECO crosswalk places ship engineers in KECO 6212, even though the KECO group label is 선장 및 항해사·도선사; CampCareer therefore labels the profile explicitly as the marine-engineer subset rather than treating the whole 6212 group as engineer data. One reviewed Marine System Engineering programme is retained as a direct study link.",
      registration:
        "A relevant 기관사 해기사 면허 is required for officer duties covered by the Ship Officers Act. The statutory pathway combines the applicable maritime examination, required sea service or recognised experience, medical fitness and required training, with licence class determining the duties and vessels for which the holder is eligible.",
      jobMarketNote:
        "Because KECO 6212 combines multiple shipboard professional roles, broad group employment or earnings are not presented as Marine Engineer-only metrics. The direct Korean maritime programme does not itself guarantee the required sea service, examination or licence.",
      scoreCaveat:
        "KR v1 gives conservative entry credit and a high regulatory burden for examination, sea service and medical requirements. Shortage, salary, vacancy, growth and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "KR",
    editorial: {
      headline: "A direct deck-officer scope within KECO 6212 with mandatory 항해사 maritime licensing and sea-service requirements",
      entryPathway:
        "Deck Officer maps within KECO 2025 code 6212 선장 및 항해사·도선사 and is restricted to merchant-vessel navigation and deck-officer duties. One reviewed Navigation Convergence Studies programme is retained as a direct study link. Professional entry still depends on the applicable 항해사 해기사 examination, sea service, medical fitness and required maritime training.",
      registration:
        "A relevant 항해사 해기사 면허 is mandatory for officer duties governed by the Ship Officers Act. Licence grades run from 1급 through 6급 and determine eligibility together with vessel, position and service requirements.",
      jobMarketNote:
        "The KECO group also contains captains, pilots and other navigation roles, so CampCareer does not reuse broad 6212 data as Deck Officer-only employment, salary or vacancy evidence. The direct programme link remains an education route rather than a licence guarantee.",
      scoreCaveat:
        "The examination, sea-service, medical and licence pathway creates a high entry burden. KR v1 leaves all labour-market and occupation-specific visa components unscored.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "KR",
    editorial: {
      headline: "A warehouse-operations management scope within KECO 0152, kept distinct from clerical inventory and warehouse-administration work",
      entryPathway:
        "Warehouse Manager maps to KECO 2025 code 0152 운송 관련 관리자, restricted to warehouse-operations management. The corresponding occupation family explicitly includes warehouse operations managers, while KECO 0284 is used for inventory and warehouse clerical work. One reviewed Industrial Engineering degree remains a related study pathway; many warehouse managers progress through operations and supervisory experience.",
      registration:
        "There is no universal statutory personal licence for Warehouse Managers. Forklift operation, bonded-warehouse functions, dangerous goods and other specialised activities can require separate qualifications or appointments, but these are role-specific rather than universal manager registration.",
      jobMarketNote:
        "KECO 0152 is broader than warehouse management, covering transport-related managers generally. CampCareer therefore does not present broader manager employment, salary or vacancy observations as exact Warehouse Manager evidence.",
      scoreCaveat:
        "KR v1 credits a realistic experience-based management pathway and low universal licensing burden. Market and occupation-specific visa components remain zero because the code is broader than the canonical role.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 8124 automotive-maintenance occupation with vocational entry and no universal personal mechanic licence",
      entryPathway:
        "Automotive Service Technician maps directly to KECO 2025 code 8124 자동차 정비원, covering engine, chassis, electrical, body and general vehicle maintenance scopes. One reviewed Future Automotive Engineering programme remains related study rather than a trade-qualification guarantee. Entry can also occur through vocational automotive training and employer-based practical progression.",
      registration:
        "There is no single universal personal occupational licence required for every automotive service technician. Automotive repair businesses and specific inspection or technical responsibilities are regulated separately, and national technical qualifications can support employment, but CampCareer does not make those requirements universal across all mechanic jobs.",
      jobMarketNote:
        "The KECO mapping is direct, but exact recurring 8124 national vacancy, comparable salary, shortage and growth evidence has not yet been normalised for KR v1. The related university programme is not treated as market demand evidence.",
      scoreCaveat:
        "KR v1 credits accessible vocational entry and low universal personal licensing burden only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
]
