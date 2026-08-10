import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaTransportOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "CA",
    editorial: {
      headline: "A high-volume regulated driving occupation with moderate long-run shortage risk, but no current Express Entry Transport-category credit",
      entryPathway:
        "Truck Driver maps directly to NOC 73300 Transport truck drivers. Secondary school is usually required, on-the-job training is provided, and an accredited driver-training course of up to three months may be required. The licence class depends on the vehicle: Class 3 or D is required for straight-body trucks and Class 1 or A for long combination vehicles, with additional endorsements where applicable.",
      registration:
        "Commercial driving is licensed provincially and territorially. Air-brake endorsements are required for air-brake vehicles and Transportation of Dangerous Goods certification is required when carrying regulated dangerous goods. The exact licensing route must therefore be checked in the intended province or territory.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 26.42 per hour. COPS classifies NOC 73300 as facing a moderate risk of shortage over 2024–2033.",
      scoreCaveat:
        "Truck Driver receives moderate-shortage credit but no current Express Entry Transport-category credit because NOC 73300 is not on the current category list. The reviewed Commercial Driver programme is not currently available to international students, so no public Canada programme link is added.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "CA",
    editorial: {
      headline: "An accessible supply-chain coordination career with multiple international study pathways, balanced national demand and no licensing barrier",
      entryPathway:
        "Logistics Coordinator maps directly to NOC 13201 Production and transportation logistics coordinators. Job Bank states that a post-secondary Business or Supply Chain Management programme of less than two years, or extensive experience in dispatcher, production-clerk or scheduling-clerk work, is usually required.",
      registration:
        "Job Bank records Logistics Coordinator as not regulated in Canada. Professional supply-chain credentials may support progression, but no single national occupational licence is required for entry.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 29.49 per hour. COPS projects NOC 13201 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "No shortage or current Express Entry occupation-category credit is awarded. Reviewed supply-chain programmes that serve several logistics and warehouse careers are published as related pathways rather than overstated as single-title occupational qualifications.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "CA",
    editorial: {
      headline: "A technical aviation maintenance pathway with moderate national shortage risk, current Transport-category credit and a strong set of direct study routes",
      entryPathway:
        "Aircraft Maintenance Technician is represented within NOC 72404 Aircraft mechanics and aircraft inspectors. Secondary school is required and a college aircraft-maintenance diploma or a four-year apprenticeship is usually required, followed by substantial on-the-job training.",
      registration:
        "Transport Canada issues Aircraft Maintenance Engineer licences. An AME licence is required for mechanics and inspectors who sign maintenance releases and certify airworthiness, while some maintenance work can be performed without holding that certification authority. The profile therefore treats licensing as a material entry burden without implying that every junior maintenance task requires an AME licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 39.00 per hour. COPS classifies NOC 72404 as facing a moderate risk of shortage over 2024–2033.",
      scoreCaveat:
        "NOC 72404 is in the current Express Entry Transport occupations category. Direct internationally available aircraft-maintenance programmes are linked, while current Job Bank posting counts remain point-in-time evidence and are not converted into recurring vacancy-intensity scores.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "CA",
    editorial: {
      headline: "A high-paying aviation career with strong national shortage risk and current Transport-category credit, offset by a demanding licensed flight-training pathway",
      entryPathway:
        "Commercial Pilot is represented within NOC 72600 Air pilots, flight engineers and flying instructors. Secondary school and graduation from a certified flying or aviation school are required; a university degree or college diploma may also be required. Job Bank states that a commercial pilot licence requires more than 200 hours of flight experience, while an air transport pilot licence requires more than 1,500 hours.",
      registration:
        "Pilot licensing is federally regulated through Transport Canada. Additional licences, ratings or endorsements are required for different aircraft and operating privileges, so completion of an academic aviation programme alone does not create commercial flying authority.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 52.00 per hour. COPS classifies NOC 72600 as facing a strong risk of shortage over 2024–2033.",
      scoreCaveat:
        "NOC 72600 is in the current Express Entry Transport occupations category. The entry score remains conservative because flight-hour accumulation, medical and licensing requirements create a substantially higher barrier than a normal college-entry occupation. Programme availability and PGWP status are kept separate; one reviewed direct pilot pathway is currently PGWP-ineligible.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A federally certificated ship-engineering officer career with strong wages but balanced national supply and demand",
      entryPathway:
        "Marine Engineer uses NOC 72603 Engineer officers, water transport. The standard route is a marine-engineering cadet programme of approximately three years or qualifying engine-room experience combined with formal training before progressing through Transport Canada certification requirements.",
      registration:
        "A Transport Canada marine engineer officer certificate of competency is required for officer duties. Certification level depends on vessel, propulsion power and responsibility, making this a materially regulated progression rather than an unlicensed engineering job title.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 37.00 per hour. COPS projects NOC 72603 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "No shortage or current Express Entry Transport-category credit is awarded. Direct marine-engineering programmes have been reviewed in the Canada catalogue, but none currently clears the public international-programme publication gate, so no programme link is fabricated here.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "CA",
    editorial: {
      headline: "A high-wage ship-navigation officer pathway with federal certification requirements and balanced national demand",
      entryPathway:
        "Deck Officer maps directly to NOC 72602 Deck officers, water transport. Entry normally proceeds through an approved nautical cadet programme or through one to three years of deck-crew experience followed by required training and examinations.",
      registration:
        "Deck officer duties require a Transport Canada certificate of competency. Certification depends on vessel class, voyage and officer responsibility, so a related maritime programme must not be presented as sufficient on its own.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 41.36 per hour. COPS projects NOC 72602 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "No shortage or current Express Entry Transport-category credit is awarded. Reviewed navigation programmes are currently outside the public Canada programme set because current international admission or publication evidence does not clear the release gate.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "CA",
    editorial: {
      headline: "A well-paid warehouse leadership role with broad supply-chain study pathways, but experience-heavy entry and balanced long-run demand",
      entryPathway:
        "Warehouse Manager is represented conservatively through the warehouse facility-operation scope within NOC 70012 Facility operation and maintenance managers. Job Bank states that facility operation managers normally require relevant college or university study or equivalent technical and administrative experience, together with several years of supervisory experience.",
      registration:
        "Job Bank records Warehouse Manager under NOC 70012 as not regulated in Canada. The principal entry barrier is management and supervisory experience rather than professional licensing.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 45.20 per hour for Warehouse Manager. COPS projects broader NOC 70012 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "The canonical title is narrower than the full facility-operation NOC, so broad employment totals are not presented as warehouse-manager-only figures. Supply-chain programmes are linked as related pathways, and entry-level credit is deliberately low because several years of supervisory experience are normally required.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "CA",
    editorial: {
      headline: "A Red Seal automotive trade with moderate national shortage risk and current Transport-category credit, supported by direct study routes",
      entryPathway:
        "Automotive Service Technician is represented within NOC 72410 Automotive service technicians, truck and bus mechanics and mechanical repairers. Secondary school and vocational training are usually required, and eligibility for trade certification normally follows a four-year apprenticeship or an equivalent combination of more than four years of work experience and industry training.",
      registration:
        "Automotive Service Technician certification is compulsory in Nova Scotia, Prince Edward Island, New Brunswick, Ontario and Alberta and voluntary in the other listed jurisdictions. Red Seal endorsement is available to qualified automotive service technicians after the interprovincial examination.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 29.89 per hour. COPS classifies NOC 72410 as facing a moderate risk of shortage over 2024–2033.",
      scoreCaveat:
        "NOC 72410 is in the current Express Entry Transport occupations category. A reviewed RRC direct programme is publicly available to international students but currently marked PGWP-ineligible, so programme availability is not presented as a post-graduation work-permit guarantee.",
    },
  },
]
