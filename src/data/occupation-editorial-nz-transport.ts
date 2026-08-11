import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzTransportOccupationEditorialOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "NZ",
    editorial: {
      headline: "A licensed heavy-vehicle occupation mapped to ANZSCO 733111, with direct entry but no current Green List residence pathway",
      entryPathway:
        "Truck Driver is constrained to ANZSCO 733111 Truck Driver (General). Tahatū's Heavy Truck Driver route is strongly work-based, while NZ Transport Agency Waka Kotahi requires the correct heavy-vehicle licence class for the vehicle: Classes 2, 3, 4 or 5 depending on weight and configuration.",
      registration:
        "Driving heavy vehicles is legally licensed. A driver needs the appropriate current NZ heavy-vehicle licence class, and some loads or vehicle uses can require additional endorsements or compliance requirements.",
      jobMarketNote:
        "Truck Driver (General) is not on the current Green List. Earlier transport-sector residence settings are not treated as current Green List evidence in NZ v1 scoring.",
      scoreCaveat:
        "The direct work-based route receives strong entry credit, but no shortage points are assigned. Visa credit is conservative because the canonical role has no current Green List residence pathway, and the mandatory driver-licence requirement reduces entry-burden credit.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "NZ",
    editorial: {
      headline: "A logistics coordination career with a direct Tahatū scope, kept separate from manager-level ANZSCO 133611",
      entryPathway:
        "Tahatū's Logistics Specialist career explicitly includes Logistics Coordinator as an alternative title. Entry can combine logistics, supply-chain or business study with operations experience, and Tahatū describes a relatively short training pathway for many roles.",
      registration:
        "Logistics coordination is not a statutorily registered occupation. Individual workplaces can require safety, dangerous-goods, customs, inventory-system or transport-compliance competence depending on the role.",
      jobMarketNote:
        "There is no exact ANZSCO 1.3 occupation for the canonical coordinator scope. ANZSCO 133611 is a manager-level Supply and Distribution Manager occupation, so it is not forced onto this profile merely because Logistics Manager is a specialisation of that code.",
      scoreCaveat:
        "No Green List or occupation-specific shortage credit is assigned. Visa treatment is conservative because a specific logistics coordinator job must be classified by its actual duties rather than automatically promoted to a manager occupation.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "NZ",
    editorial: {
      headline: "A licensed aircraft-maintenance roll-up covering ANZSCO 323111-323113, all current Green List Tier 1 occupations",
      entryPathway:
        "Aircraft Maintenance Technician is represented as the ANZSCO 3231 aircraft-maintenance roll-up: 323111 Avionics, 323112 Mechanical and 323113 Structures. Tahatū provides the Aircraft Maintenance Engineer career route, while the Civil Aviation Authority's Part 66 pathway requires examinations and substantial practical aviation-engineering experience for an AME licence.",
      registration:
        "The Green List aircraft-maintenance scope requires an Aircraft Maintenance Engineer Licence issued by the Civil Aviation Authority of New Zealand. Part 66 governs licence categories, ratings, experience, examinations and privileges.",
      jobMarketNote:
        "Aircraft Maintenance Engineer (Avionics), (Mechanical) and (Structures) are all current Green List Tier 1 occupations, making this the strongest targeted migration pathway in the Transport cohort.",
      scoreCaveat:
        "The profile receives Tier 1 shortage and visa credit, but entry accessibility is deliberately conservative because the CAA licence requires much more than short classroom training: exams, practical experience and licensing requirements apply.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "NZ",
    editorial: {
      headline: "A licensed fixed-wing commercial flying career mapped to ANZSCO 231111, outside the current Green List",
      entryPathway:
        "Commercial Pilot is constrained to ANZSCO 231111 Aeroplane Pilot. Tahatū's Pilot pathway and Civil Aviation Rule Part 61 require progressive flight training; a commercial pilot licence requires the applicable prior licence, a current Class 1 medical certificate and prescribed flight experience and examinations.",
      registration:
        "Commercial flying requires a Civil Aviation Authority of New Zealand pilot licence and applicable medical, ratings and currency. The canonical profile is fixed-wing and does not automatically roll in ANZSCO 231114 Helicopter Pilot.",
      jobMarketNote:
        "Aeroplane Pilot 231111 is not on the current Green List. Aviation demand is therefore not converted into Green List shortage credit in the v1 score.",
      scoreCaveat:
        "High earnings are balanced by substantial licensing, flight-hour and medical requirements. Visa credit reflects ordinary skilled-work treatment rather than targeted Green List residence access.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "A licensed seagoing engineering career mapped to ANZSCO 231212 Ship's Engineer / Marine Engineer",
      entryPathway:
        "Marine Engineer maps to ANZSCO 231212 Ship's Engineer, whose alternative title is Marine Engineer. Tahatū describes marine-engineering training and Maritime New Zealand sets certificate-of-competency pathways with sea service, training, medical and examination requirements appropriate to the certificate held.",
      registration:
        "Serving in covered marine-engineering capacities requires the relevant Maritime New Zealand certificate of competency and endorsements. The required certificate depends on vessel, operating area, propulsion power and level of responsibility.",
      jobMarketNote:
        "Ship's Engineer 231212 is not on the current Green List. The occupation remains a regulated maritime profession, but regulation alone is not treated as shortage evidence.",
      scoreCaveat:
        "Salary credit is strong, but no Green List shortage points are assigned. Entry-burden credit is low because Maritime New Zealand certification and sea-service requirements govern professional progression.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "NZ",
    editorial: {
      headline: "A licensed navigation and ship-operations profession mapped to ANZSCO 231214 Ship's Officer / Deck Officer",
      entryPathway:
        "Deck Officer maps directly to ANZSCO 231214 Ship's Officer, alternative title Deck Officer. Maritime New Zealand's deck certificate pathways require the relevant training, sea service, medical fitness and competency assessment. Tahatū's Deckhand page is used only as a transparent lower-level maritime feeder and pay proxy, not as an exact officer qualification or salary source.",
      registration:
        "Deck officers serving in covered capacities need the appropriate Maritime New Zealand certificate of competency and endorsements, such as watchkeeping, chief mate or master certificates according to the role.",
      jobMarketNote:
        "Ship's Officer 231214 is not on the current Green List. No general maritime labour pressure is converted into targeted shortage points without a current occupation-specific residence pathway.",
      scoreCaveat:
        "The salary input is deliberately conservative because the reviewed Tahatū layer did not provide a clean exact Deck Officer pay page. Licensing and sea-service requirements also keep entry accessibility and burden scores conservative.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "NZ",
    editorial: {
      headline: "A storage and distribution management career aligned to ANZSCO 133611 without current Green List treatment",
      entryPathway:
        "Warehouse Manager is aligned to ANZSCO 133611 Supply and Distribution Manager for genuine manager-level warehouse and distribution responsibility. Tahatū's Transportation, Storage and Distribution Manager career includes warehouse and distribution management titles and supports progression through operations experience plus logistics or business study.",
      registration:
        "Warehouse management is not a statutorily registered occupation. Workplaces can require role-specific health and safety, forklift, hazardous-substances, inventory, customs or food-storage compliance depending on the operation.",
      jobMarketNote:
        "ANZSCO 133611 is not on the current Green List. The manager-level mapping is not reused for the separate Logistics Coordinator profile.",
      scoreCaveat:
        "The score reflects accessible experience-led management progression and solid Tahatū earnings, but no shortage or targeted residence credit is assigned.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "NZ",
    editorial: {
      headline: "A light-automotive mechanic scope mapped to ANZSCO 321211, a current Green List Tier 2 trade",
      entryPathway:
        "Automotive Service Technician is constrained to ANZSCO 321211 Motor Mechanic (General), with the canonical emphasis on general/light automotive service and repair. Tahatū's Automotive Technician pathway covers work-based and Level 4 automotive training, while the Green List specifies accepted Level 4 automotive certificates or an applicable NZTA vehicle-inspector appointment.",
      registration:
        "Generic motor-mechanic work is not a universally registered profession. The Green List pathway is qualification- or vehicle-inspector-appointment based; vehicle inspection itself has separate NZTA appointment requirements.",
      jobMarketNote:
        "Motor Mechanic (General) 321211 is on the current Green List Tier 2. Diesel Motor Mechanic 321212 and Motorcycle Mechanic 321213 are separate occupations and are not rolled into this canonical light/general automotive profile.",
      scoreCaveat:
        "The profile receives Tier 2 shortage and visa credit for 321211, while maintaining a conservative canonical boundary that does not borrow policy treatment or earnings from adjacent diesel or motorcycle occupations.",
    },
  },
]
