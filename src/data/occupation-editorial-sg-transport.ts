import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeTransportOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "SG",
    editorial: {
      headline:
        "A heavy-truck driving umbrella across SSOC 8332 occupations, with the appropriate Singapore heavy-vehicle driving licence required for the vehicle driven",
      entryPathway:
        "Singapore does not use one five-digit occupation for every Truck Driver. CampCareer preserves SSOC 83321 Lorry driver, 83322 Trailer-truck driver, 83323 Concrete mix truck driver, 83324 Waste truck driver and 83329 Heavy truck/Lorry driver n.e.c. as non-rollup references. Entry is primarily practical and licence-based rather than degree-based; there is no approved Singapore programme mapping in the current staging set.",
      registration:
        "Driving the relevant heavy vehicle requires the appropriate Singapore driving-licence class administered by Traffic Police. CampCareer therefore marks the broad Truck Driver role as registration-required, while keeping vehicle class and automatic/manual transmission entitlements separate rather than implying that one licence covers every heavy vehicle.",
      jobMarketNote:
        "The five SSOC heavy-truck occupations are not collapsed into a fabricated exact labour-market series, and driving-licence requirements are not treated as evidence of shortage or employer demand.",
      scoreCaveat:
        "Foundation scoring credits practical entry but applies a meaningful licensing burden. Shortage, vacancy, salary, growth and occupation-specific visa components remain zero until market enrichment.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "SG",
    editorial: {
      headline:
        "A logistics-planning and shipment-coordination umbrella using SSOC 33461, 43231 and 43239 instead of inventing one exact code",
      entryPathway:
        "Logistics Coordinator has no single five-digit SSOC title. Planning-heavy work aligns with 33461 Logistics/Production planner, while shipment-documentation and transport coordination overlap 43231 Shipping clerk and 43239 Transport clerk n.e.c. Three approved maritime and supply-chain programmes are retained as related pathways; operations experience can also provide entry.",
      registration:
        "There is no universal statutory personal occupational licence for Logistics Coordinators. Customs, dangerous-goods, port, freight-forwarding or other task-specific controls may apply to narrower duties or businesses.",
      jobMarketNote:
        "CampCareer preserves the three reference occupations separately and does not combine them into unsupported exact employment, vacancy, salary or shortage metrics.",
      scoreCaveat:
        "The foundation score reflects broad entry routes and low universal licensing burden. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "SG",
    editorial: {
      headline:
        "An aircraft-maintenance umbrella across aeronautical technical and aircraft-engine repair work, with CAAS AML requirements treated as a real licensing boundary",
      entryPathway:
        "CampCareer spans SSOC 31211 Aeronautical engineering technician and 72320 Aircraft engine mechanic/repairer rather than forcing the career into one code. Two approved Aerospace Engineering and Aircraft Systems Engineering programmes are related educational pathways; they do not by themselves confer CAAS maintenance-licence privileges.",
      registration:
        "CAAS requires an Aircraft Maintenance (Personnel) Licence for the regulated maintenance privileges described for Singapore-registered aircraft, including performing or supervising maintenance work and certifying maintenance work on the applicable aircraft type. SAR-66 examinations, experience, ratings and organisational authorisation requirements remain separate from degree completion.",
      jobMarketNote:
        "The two SSOC technical occupations are not combined into a fabricated exact market series, and aviation licensing requirements are not scored as labour demand.",
      scoreCaveat:
        "Foundation scoring recognises a technical pathway but applies a high entry burden for the regulated CAAS licensing route. Market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "SG",
    editorial: {
      headline:
        "A commercial-pilot umbrella across airline and other civilian pilot classifications, with CAAS professional flight licensing mandatory",
      entryPathway:
        "SSOC separates 21721 Commercial airline pilot from 21722 Aircraft pilot excluding commercial airline and air force. CampCareer keeps both as non-rollup references because the canonical Commercial Pilot role spans more than airline flying. Entry requires approved flight training, theoretical examinations, flight tests, flying experience and the applicable medical standard; no approved Singapore programme mapping is currently present.",
      registration:
        "Commercial flight on Singapore-registered aircraft requires the applicable CAAS professional pilot licence. A CPL covers specified commercial capacities, while MPL or ATPL requirements apply to other multi-crew and airline capacities. The broad career is therefore marked registration-required rather than treating all commercial flying as one licence category.",
      jobMarketNote:
        "Airline activity and licence scarcity are not converted into shortage or vacancy evidence, and the airline/non-airline SSOC codes are not aggregated into unsupported exact metrics.",
      scoreCaveat:
        "Flight training, medical fitness, examinations and licensing create a very high entry burden, so the foundation score is intentionally conservative. Market and visa components remain zero.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "SG",
    editorial: {
      headline:
        "A direct SSOC 31510 seagoing Marine Engineering Officer occupation with mandatory MPA/STCW competency certification",
      entryPathway:
        "Marine Engineer maps directly to SSOC 31510 Marine engineering officer for the canonical seagoing operational role. SSOC 21711 Chief/Second engineer is retained as senior progression rather than merged into entry-level scope. One approved Naval Architecture and Marine Engineering programme is a direct educational pathway, but education alone does not confer an MPA Certificate of Competency.",
      registration:
        "Seagoing officers must hold the valid MPA-issued or recognised STCW-compliant Certificate of Competency or endorsement applicable to their service. Sea service, approved training, medical and competency-assessment requirements form part of the professional pathway.",
      jobMarketNote:
        "The direct classification anchor and certification regime are retained without inferring shortage, salary or vacancy intensity from Singapore's maritime sector activity.",
      scoreCaveat:
        "The foundation score reflects substantial sea-service and certification barriers. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "SG",
    editorial: {
      headline:
        "A direct SSOC 31521 navigating-officer occupation with mandatory MPA/STCW competency certification",
      entryPathway:
        "Deck Officer maps directly to SSOC 31521 Ship's deck navigating officer. SSOC 21713 Ship captain/Chief mate is retained as senior progression, while Harbour pilot 31522 remains a separate occupation. One approved Maritime Studies programme is related rather than treated as a Certificate-of-Competency pathway.",
      registration:
        "Deck officers serving onboard ships require the valid MPA-issued or recognised STCW-compliant Certificate of Competency or endorsement applicable to their duties. Nautical training, sea service, safety courses and competency assessment remain part of the regulated pathway.",
      jobMarketNote:
        "CampCareer does not treat mandatory maritime certification or port activity as labour-demand evidence and does not merge senior captain or harbour-pilot series into the Deck Officer profile.",
      scoreCaveat:
        "Sea-service and certification requirements create a high entry burden. Market and occupation-specific visa components remain zero at foundation stage.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "SG",
    editorial: {
      headline:
        "A direct SSOC 13241 logistics and warehousing management occupation with management experience kept central to entry",
      entryPathway:
        "Warehouse Manager maps directly to SSOC 13241 Supply and distribution/Logistics/Warehousing manager. Two approved supply-chain programmes are related pathways, while progression through warehouse, inventory, distribution and supervisory operations remains a common route to management responsibility.",
      registration:
        "There is no universal personal occupational licence for Warehouse Managers. Premises approvals, dangerous-goods controls, forklift operation, fire safety and workplace-safety responsibilities can apply to narrower activities or facilities without converting the broad manager role into a licensed profession.",
      jobMarketNote:
        "The direct SSOC classification is not used to infer shortage, vacancy or salary evidence before the dedicated market-enrichment phase.",
      scoreCaveat:
        "Foundation scoring reflects experience-heavy management entry and low universal licensing burden. Market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "SG",
    editorial: {
      headline:
        "A direct SSOC 72310 Automotive Mechanic occupation with workshop and inspection regulation kept separate from personal occupational licensing",
      entryPathway:
        "Automotive Service Technician maps directly to SSOC 72310 Automotive mechanic. Applied automotive technical training, apprenticeship-style learning and supervised workshop experience are practical routes; no approved Singapore programme mapping is currently present.",
      registration:
        "There is no universal statutory personal occupational licence for Automotive Mechanics. Vehicle inspection, workshop operation, specialised systems and workplace-safety requirements can impose separate controls on businesses or specific activities.",
      jobMarketNote:
        "Vehicle regulation and inspection requirements are not converted into demand evidence, and no exact market component is scored at foundation stage.",
      scoreCaveat:
        "The foundation score recognises accessible technical entry and low universal licensing burden. Shortage, vacancy, salary, growth and occupation-specific visa components remain zero.",
    },
  },
]
