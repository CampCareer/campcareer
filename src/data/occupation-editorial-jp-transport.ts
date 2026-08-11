import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanTransportOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "JP",
    editorial: {
      headline: "A freight-truck driving umbrella split by vehicle class, with the matching Japanese driver licence legally required",
      entryPathway:
        "Japan classifies freight-truck driving by vehicle and operating type: 083-01 large trucks, 083-02 medium and small trucks, 083-03 tractor-trailers, 083-04 dump trucks and 083-99 other freight vehicles. Entry is primarily through the appropriate driver-licence class and employer training rather than academic study.",
      registration:
        "A valid Japanese driver licence for the vehicle being driven is required. Large, medium and semi-medium trucks use their corresponding licence classes, while tractor-trailer operation can additionally require a towing licence. Higher licence classes can carry staged age or prior-licence experience requirements.",
      jobMarketNote:
        "The canonical Truck Driver career spans several MHLW small classifications, so CampCareer preserves 083-01 to 083-99 as non-rollup scopes rather than fabricating one exact labour series.",
      scoreCaveat:
        "The provisional foundation score recognises accessible non-degree entry but also the mandatory vehicle-licence burden. Shortage, vacancies, salary, growth and visa evidence remain deferred to the common market-enrichment phase.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "JP",
    editorial: {
      headline: "A logistics-coordination umbrella spanning shipping and receiving administration plus transport dispatch rather than one standalone Japanese code",
      entryPathway:
        "The closest MHLW scopes are 039-02 出荷・受荷係事務員 for shipping, receiving, inventory and warehouse coordination and 042-02 運行管理事務員 when dispatching, routing or vehicle-operation coordination is central. Logistics or supply-chain study can help, but many roles are entered through operational experience.",
      registration:
        "There is no universal statutory Logistics Coordinator licence. Certain regulated transport businesses must appoint qualified 運行管理者 for defined safety-management responsibilities, but that narrower statutory role is not treated as a licence for every logistics coordinator.",
      jobMarketNote:
        "Shipping/receiving administration and transport dispatch are separate official classifications. CampCareer does not combine them into a fabricated exact Logistics Coordinator market series. The one approved Japanese industrial programme remains a related study pathway.",
      scoreCaveat:
        "Only entry accessibility and universal burden are scored in this foundation phase. Market demand, earnings, growth and visa components remain unscored.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "JP",
    editorial: {
      headline: "A direct 075-04 aircraft-maintenance scope with mandatory Civil Aeronautics Act qualification for the Japanese 航空整備士 occupation",
      entryPathway:
        "MHLW places aircraft maintenance under 075-04 輸送用機械器具整備・修理工（自動車を除く）. Technical university, college or aircraft-maintenance vocational study followed by airline or maintenance-organisation experience is the usual route. The reviewed Japan Aviation Academy programme is retained as a direct study pathway.",
      registration:
        "MHLW job tag states that the national 航空整備士 qualification prescribed by the Civil Aeronautics Act is required for this occupation. MLIT issues aviation personnel skill certificates by licence class and aircraft category, with examinations and experience requirements; certifying responsibilities are additionally controlled within operators.",
      jobMarketNote:
        "075-04 also includes maintenance of other non-automotive transport equipment, so group-level statistics are not treated as exact aircraft-maintenance values. Current official market data will be incorporated later under the common enrichment methodology.",
      scoreCaveat:
        "The low foundation score reflects the structured technical and licensing burden, not a judgement that the Japanese aircraft-maintenance market is weak. Market and visa components remain intentionally unscored.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "JP",
    editorial: {
      headline: "A direct 087-04 aircraft-pilot occupation with mandatory MLIT aviation personnel certification and medical requirements",
      entryPathway:
        "MHLW 087-04 航空機操縦士 directly covers professional pilots. Paid flight operations require formal flight training, aeronautical experience, written and practical examinations and the applicable aviation medical certification. The reviewed Japanese programme staging currently has no approved programme link for this canonical career.",
      registration:
        "Commercial flying requires the applicable MLIT aviation personnel skill certificate. Japan distinguishes private, commercial and airline transport pilot qualifications; airline command requires the higher qualification, and professional pilots must also meet applicable aviation medical requirements.",
      jobMarketNote:
        "The occupational classification is direct, but the current foundation phase deliberately leaves current pilot shortage, vacancy and pay evidence out of the score so Japan remains comparable with countries whose market enrichment has not yet been run.",
      scoreCaveat:
        "The foundation score is low because flight training, experience, examinations and medical certification create a high entry burden. It is not an opportunity-market rating.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A direct 087-03 ship engineer-officer occupation requiring the applicable Japanese marine engineer certificate",
      entryPathway:
        "MHLW 087-03 船舶機関長・機関士（漁労船を除く） directly covers engineer officers on non-fishing vessels. Maritime engineering education, approved training and documented sea service are standard foundations. The reviewed Osaka maritime graduate programme is related study, not automatic licence qualification.",
      registration:
        "Serving as a ship engineer officer requires the applicable 海技士（機関） certificate under Japan's maritime qualification system. Certificates are divided by grade and duty scope and require the prescribed examinations, medical fitness and sea-service or approved-training conditions.",
      jobMarketNote:
        "The official 087-03 group includes both chief engineers and engineer officers, so CampCareer keeps the canonical Marine Engineer scope explicit and defers labour-market enrichment rather than treating the entire group as an exact role-level series.",
      scoreCaveat:
        "The low provisional score reflects sea-service and licensing burden only. Shortage, vacancy, earnings, growth and visa evidence will be assessed in the later common market phase.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "JP",
    editorial: {
      headline: "A direct 087-02 navigation-officer scope with mandatory 海技士（航海） certification, kept separate from masters and maritime pilots",
      entryPathway:
        "MHLW 087-02 covers ship masters, deck/navigation officers, operations officers and maritime pilots on non-fishing vessels. CampCareer restricts this canonical profile to deck/navigation officer duties. Nautical study, approved training and documented sea service lead toward certification; there is currently no approved Japanese programme link in the reviewed staging data.",
      registration:
        "Serving as a deck or navigation officer requires the applicable 海技士（航海） certificate under Japan's maritime qualification system. Grade, vessel and duty limits apply, with examination, medical and sea-service requirements.",
      jobMarketNote:
        "Because 087-02 also contains masters and maritime pilots, its group-level statistics are not treated as exact Deck Officer observations. Market enrichment remains deferred.",
      scoreCaveat:
        "The low foundation score reflects the demanding licensed seagoing pathway rather than current employment prospects. Market and visa components are still zero by design.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "JP",
    editorial: {
      headline: "A warehouse-management umbrella spanning organisational management, warehouse administration and operational supervision",
      entryPathway:
        "Japan has no single MHLW Warehouse Manager code. Higher organisational management can fall under 002-01 会社管理職員, inventory and warehouse administration under 039-02 出荷・受荷係事務員, and hands-on warehouse operations under 095-03 倉庫作業員. Management is commonly reached through logistics or warehouse experience plus supervisory progression.",
      registration:
        "There is no universal personal Warehouse Manager licence. Particular warehouse businesses or responsibilities can require a 倉庫管理主任者 or other designated qualifications, but those requirements are not promoted into a blanket occupational licence.",
      jobMarketNote:
        "Management, warehouse administration and physical warehouse operations remain separate official scopes. The one reviewed Japanese industrial programme is kept as a related pathway rather than occupational qualification.",
      scoreCaveat:
        "The current score reflects the experience-based management pathway and low universal licensing burden only. Market and visa components await enrichment.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "JP",
    editorial: {
      headline: "A direct 075-03 automotive service and repair occupation where national mechanic certification is valuable but not universal permission to enter the job",
      entryPathway:
        "MHLW 075-03 自動車整備・修理工 directly covers automotive mechanics, repair workers and automotive electrical repair. Vocational automotive study is common, but MHLW job tag explicitly states that a person can be employed by a repair workshop before obtaining the national 自動車整備士 qualification and then qualify while working.",
      registration:
        "The national 自動車整備士 qualification is professionally important and is required for specified higher-responsibility functions, but it is not a universal personal licence required merely to enter every automotive service technician job. CampCareer therefore keeps the broad canonical role registration flag false.",
      jobMarketNote:
        "075-03 is a strong occupational classification match. The three approved Japanese automotive university programmes are retained as related engineering-study pathways because they do not themselves confer the trade qualification.",
      scoreCaveat:
        "The foundation score recognises a technical training burden without treating national certification as universal entry permission. Market, salary, growth and visa evidence remains deferred.",
    },
  },
]
