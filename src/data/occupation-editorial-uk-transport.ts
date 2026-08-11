import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkTransportOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "UK",
    editorial: {
      headline: "A licensed LGV/HGV driving occupation in SOC 8211 with a direct Level 2 route but no Skilled Worker eligibility",
      entryPathway:
        "Truck Driver maps to SOC 8211 Heavy and large goods vehicle drivers. Skills England's approved Level 2 Large Goods Vehicle Driver C+E route provides a direct occupational pathway; professional LGV driving requires the appropriate vocational driving entitlement and Driver CPC.",
      registration:
        "Professional lorry drivers must hold the appropriate DVLA driving-licence entitlement and, unless exempt, Driver Certificate of Professional Competence. Driver CPC normally requires 35 hours of periodic training every five years.",
      jobMarketNote:
        "SOC 8211 is listed in Home Office Table 6 as ineligible for Skilled Worker sponsorship. General haulage recruitment pressure is not converted into a shortage score without an occupation-specific recurring shortage finding.",
      scoreCaveat:
        "Entry is accessible through a Level 2 route, but the licensing burden reduces entry-burden credit and Skilled Worker visa credit is zero. Salary uses the stored ONS ASHE 2025 occupation median because no Skilled Worker going rate applies.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "UK",
    editorial: {
      headline: "A transport-coordination role mapped to SOC 4134 rather than logistics management, with a direct Level 3 route and restricted new-overseas access",
      entryPathway:
        "Logistics Coordinator is constrained to SOC 4134/00 Transport and distribution clerks and assistants. Skills England's Level 3 Transport Operations Supervisor occupation explicitly lists Transport Coordinator as a typical title and provides a direct work-based route.",
      registration:
        "There is no universal statutory personal register for logistics coordinators. Employers may require role-specific transport-compliance, dangerous-goods, customs or operator-system competence depending on the operation.",
      jobMarketNote:
        "The canonical role is deliberately not promoted to SOC 1243 Managers in logistics and is not mapped to Table 6 SOC 4133 merely because that group includes a 'supply chain coordinator' example. SOC 4134 is the direct Transport Coordinator fit.",
      scoreCaveat:
        "SOC 4134 is an RQF 3-5 additional occupation and is not on the current Temporary Shortage List. New-overseas Skilled Worker access is therefore generally restricted while qualifying transitional access can remain; shortage remains zero.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "UK",
    editorial: {
      headline: "A regulated aircraft-maintenance technician scope centred on SOC 5234, with a direct Level 3 route but no current TSL access for the core code",
      entryPathway:
        "Aircraft Maintenance Technician is centred on SOC 5234/00 Aircraft maintenance and related trades. Skills England's Level 3 occupation also recognises adjacent avionics technician 3112/01 and aerospace technician 3113/01 work, but the canonical score is anchored to the core 5234 mapping rather than borrowing their immigration treatment.",
      registration:
        "Aircraft maintenance is highly regulated. Certifying functions on relevant UK-registered aircraft can require a UK CAA Part-66 Aircraft Maintenance Licence, with category, experience and aircraft-rating requirements controlling certification privileges.",
      jobMarketNote:
        "The July 2026 MAC Stage 2 review found very limited occupation-wide shortage evidence for SOC 5234 and recommended no future TSL access. The current Immigration Rules likewise do not include core SOC 5234 on the interim TSL.",
      scoreCaveat:
        "No visa credit is borrowed from related 3112/3113 technician sub-units. The core 5234 role receives low RQF 3-5 transitional visa credit, zero shortage credit, and a reduced entry-burden component because certifying work can require CAA licensing.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "UK",
    editorial: {
      headline: "A highly regulated SOC 3511 profession with strong salary evidence and standard RQF 6+ Skilled Worker access",
      entryPathway:
        "Commercial Pilot maps to SOC 3511 Aircraft pilots and air traffic controllers, constrained to commercial aeroplane/airline-pilot work. UK professional flight training leads through CAA licensing, ratings, flight-experience requirements and commercial operating privileges.",
      registration:
        "A UK CAA Commercial Pilot Licence or higher appropriate professional licence is required for the relevant commercial privileges. CPL and ATPL holders also require a valid UK Class 1 medical certificate, with aircraft class/type ratings applying to the operation flown.",
      jobMarketNote:
        "SOC 3511 is an RQF 6+ Skilled Worker occupation. The current evidence set does not establish an occupation-wide shortage suitable for UK v1 scoring, so high earnings are not treated as shortage evidence.",
      scoreCaveat:
        "The score receives maximum salary credit but low entry-accessibility and burden credit because professional flight training, licensing, medical certification, ratings and experience requirements are substantial. Visa credit is standard RQF 6+ rather than shortage-list based.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "UK",
    editorial: {
      headline: "A maritime engineering occupation mapped to SOC 3512/02, with strong current shortage evidence but a legal TSL recommendation not yet reflected in Immigration Rules",
      entryPathway:
        "Marine Engineer is constrained to SOC 3512/02 Marine engineers, not the broader professional Mechanical Engineer SOC 2122. Skills England's approved Level 3 Marine Engineer route maps directly to SOC 3512 and provides a practical maritime-engineering pathway.",
      registration:
        "The broad Marine Engineer occupation is not universally subject to one statutory personal register. However, seagoing engineer-officer and certificating responsibilities can require Maritime and Coastguard Agency certificates of competency or other vessel-specific statutory competence.",
      jobMarketNote:
        "The MAC's 23 July 2026 Stage 2 report found strong shortage evidence and a clear shortfall of domestic workers in SOC 3512 and recommended 18 months of TSL access. As of the current 1 July 2026 Immigration Rules, that recommendation has not yet been added to the legal TSL.",
      scoreCaveat:
        "Shortage receives strong evidence credit, while visa credit remains the current non-TSL RQF 3-5 level. This deliberately separates a MAC recommendation from the immigration rules actually in force.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "UK",
    editorial: {
      headline: "A regulated ship-deck officer role in SOC 3512/01, with strong shortage evidence and an MCA Certificate of Competency requirement",
      entryPathway:
        "Deck Officer maps to SOC 3512/01 Ship and hovercraft captains and deck officers. Skills England's approved Level 3 Officer of the Watch route leads through mandatory maritime qualifications and MCA examinations toward the Certificate of Competency required to practise as an Officer of the Watch.",
      registration:
        "Officer-of-the-Watch practice requires the relevant Maritime and Coastguard Agency Certificate of Competency. The pathway also includes mandatory STCW safety and navigation qualifications appropriate to the certificate and vessel operation.",
      jobMarketNote:
        "SOC 3512 has strong shortage evidence in the MAC's 23 July 2026 Stage 2 report and was recommended for 18 months of TSL access. The current Immigration Rules dated 1 July 2026 have not yet incorporated that recommendation.",
      scoreCaveat:
        "The score therefore gives strong shortage credit but only current non-TSL RQF 3-5 visa credit. The statutory Certificate of Competency requirement materially reduces entry-burden accessibility.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "UK",
    editorial: {
      headline: "A storage-and-warehousing management occupation in SOC 1242, with Level 3 supervisor progression and restricted new-overseas access",
      entryPathway:
        "Warehouse Manager maps to SOC 1242 Managers in storage and warehousing. Skills England's Level 3 Warehouse Operations Supervisor pathway is used as a progression route into management responsibilities; its occupational-map SOC 9252 operative classification is not substituted for the canonical manager SOC.",
      registration:
        "There is no universal statutory personal register for warehouse managers. Operations can require competence in workplace safety, dangerous goods, material-handling equipment, customs, food/pharmaceutical controls or transport compliance depending on the site.",
      jobMarketNote:
        "SOC 1242 is an RQF 3-5 additional Skilled Worker occupation and is not on the current Temporary Shortage List. The adjacent SOC 1243 Managers in logistics is a different occupation and does not supply immigration credit to this profile.",
      scoreCaveat:
        "Entry credit reflects a Level 3 supervisor-to-manager progression route, while visa credit remains low under the post-22 July 2025 rules for a non-TSL RQF 3-5 occupation. Shortage remains zero.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "UK",
    editorial: {
      headline: "A direct SOC 5231/02 light-vehicle technician route with current interim TSL access but no recommendation for future TSL continuation",
      entryPathway:
        "Automotive Service Technician maps to SOC 5231/02 Car/light vehicle technicians. Skills England's approved Level 3 Motor Vehicle Service and Maintenance Technician route maps directly to SOC 5231 and covers diagnosis, servicing, repair and increasingly hybrid/electric-vehicle systems.",
      registration:
        "There is no universal statutory registration for automotive service technicians. Specific functions such as MOT testing require separate authorisation, while general workshop activity is governed by health, safety, environmental and vehicle-repair requirements.",
      jobMarketNote:
        "SOC 5231 is on the current interim Temporary Shortage List for qualifying Certificates of Sponsorship issued before 31 December 2026. The MAC's 23 July 2026 Stage 2 review nevertheless recommended no future TSL access after finding only some shortage elements and failing the final appropriateness test.",
      scoreCaveat:
        "Current legal TSL status receives targeted visa credit, but shortage is kept modest rather than inferred from list membership. The profile distinguishes today's immigration rule from the MAC's recommendation for what should happen next.",
    },
  },
]
