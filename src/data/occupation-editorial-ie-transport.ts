import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeTransportOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_TRANSPORT_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeTransportOccupationEditorialOverride[] = [
  {
    id: "truck-driver",
    countryCode: "IE",
    editorial: {
      headline: "A direct HGV shortage occupation with licence-and-CPC-gated permit access",
      entryPathway:
        "Truck Driver is mapped to SOC 2010 8211 Large goods vehicle drivers and constrained to professional HGV driving. Ireland has a structured RSA licence and Driver CPC pathway; the current employment-permit exception is narrower and requires category CE or C1E, or an equivalent category recognised through an RSA mutual-recognition agreement.",
      registration:
        "Professional truck driving requires the applicable full driving licence and a valid Driver Certificate of Professional Competence. The RSA states that it is illegal to drive professionally without a valid Driver CPC card.",
      jobMarketNote:
        "SOLAS 2025 directly identifies HGV drivers as a current Transport and Logistics shortage. The current Ineligible List still contains SOC 8211 generally, with the qualifying CE/C1E HGV exception, so shortage evidence does not mean every truck-driver job is permit-accessible.",
      scoreCaveat:
        "The direct shortage receives full shortage credit; permit credit is conditional GEP access rather than Critical Skills treatment. Exact salary, recurring vacancy and growth series remain unscored.",
    },
  },
  {
    id: "logistics-coordinator",
    countryCode: "IE",
    editorial: {
      headline: "A transport-distribution coordination role with ordinary GEP access but inconclusive shortage evidence",
      entryPathway:
        "Logistics Coordinator is mapped to SOC 2010 4134 Transport and distribution clerks and assistants. Logistics, supply-chain and FET training plus workplace progression provide practical routes, including broader supply-chain apprenticeships.",
      registration:
        "No universal statutory personal registration is required for the broad Logistics Coordinator occupation.",
      jobMarketNote:
        "SOLAS 2025 says shortage evidence for stock-control and transport/distribution administrative occupations is inconclusive because of small employment numbers. SOC 4134 is not on the current Critical Skills or Ineligible lists, so ordinary General Employment Permit treatment may apply subject to the Labour Market Needs Test and other requirements.",
      scoreCaveat:
        "Broad logistics demand and replacement demand are not converted into an occupation-specific shortage score. Salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "aircraft-maintenance-technician",
    countryCode: "IE",
    editorial: {
      headline: "A structured aircraft-mechanics pathway with Part-66 licensing at the certifying boundary",
      entryPathway:
        "Aircraft Maintenance Technician is mapped to SOC 2010 5235 Aircraft maintenance and related trades. Aircraft Mechanics is a current Irish craft apprenticeship and provides a direct structured work-based route.",
      registration:
        "IAA Part-66 Aircraft Maintenance Licences apply to certifying privileges. The broader technician occupation also includes work under appropriately authorised certifying staff, so a universal personal licence is not asserted for every technician function.",
      jobMarketNote:
        "SOC 5235 is neither on the current Critical Skills List nor the current Ineligible List and is treated as ordinary General Employment Permit-accessible subject to current requirements. The reviewed SOLAS Transport summary does not publish an exact aircraft-maintenance shortage.",
      scoreCaveat:
        "The exact craft pathway increases entry accessibility, but no shortage score is inferred from broader engineering or aviation demand. Salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "commercial-pilot",
    countryCode: "IE",
    editorial: {
      headline: "A heavily licensed commercial aviation profession with ordinary employment-permit access",
      entryPathway:
        "Commercial Pilot is mapped to SOC 2010 3512 Aircraft pilots and flight engineers, restricted to commercial pilot employment. IAA-approved training leads to commercial-level flight crew licensing; the IAA distinguishes CPL and ATPL privileges and normally requires a Class 1 medical standard for commercial use.",
      registration:
        "Commercial flying requires the applicable IAA/EASA flight crew licence and medical fitness. A CPL permits specified commercial privileges, while an ATPL is required for command positions in commercial air transport.",
      jobMarketNote:
        "SOC 3512 is neither on the current Critical Skills List nor the current Ineligible List, so ordinary General Employment Permit treatment may apply. SOLAS 2025 does not identify commercial pilots as a current Transport shortage in the reviewed summary.",
      scoreCaveat:
        "High training and licensing burden keeps entry accessibility low despite permit access. No salary, shortage, vacancy or growth signal is inferred without exact comparable evidence.",
    },
  },
  {
    id: "marine-engineer",
    countryCode: "IE",
    editorial: {
      headline: "A regulated seagoing engineering-officer pathway kept separate from shore-based engineering",
      entryPathway:
        "Marine Engineer is mapped to SOC 2010 3513 Ship and hovercraft officers, restricted to marine engineering officer duties. Maritime engineering education, approved sea service and competency certification form the professional route.",
      registration:
        "The Department of Transport states that seafaring is strictly regulated and issues Certificates of Competency for service on merchant ships and fishing vessels; the applicable engineering-officer certificate is required for the relevant seagoing duties.",
      jobMarketNote:
        "SOC 3513 is neither on the current Critical Skills List nor the current Ineligible List, so ordinary General Employment Permit treatment may apply. No exact Marine Engineer shortage is published in the reviewed SOLAS Transport summary.",
      scoreCaveat:
        "This profile does not borrow Mechanical Engineer 2122 Critical Skills treatment for shore-based professional engineering. Salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "deck-officer",
    countryCode: "IE",
    editorial: {
      headline: "A regulated deck-and-navigation officer pathway with Certificate of Competency requirements",
      entryPathway:
        "Deck Officer is mapped to SOC 2010 3513 Ship and hovercraft officers, restricted to deck/navigation officer duties. Approved maritime education, sea service and competency examinations form the professional route.",
      registration:
        "The Department of Transport regulates seafarer education and certification and issues Certificates of Competency for service on merchant ships and fishing vessels. The appropriate deck/navigation officer certificate is required for the applicable duties.",
      jobMarketNote:
        "SOC 3513 is neither on the current Critical Skills List nor the current Ineligible List, so ordinary General Employment Permit treatment may apply. The reviewed SOLAS Transport summary does not publish an exact Deck Officer shortage.",
      scoreCaveat:
        "Maritime regulation and sea-service requirements are reflected as a high entry burden. Salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "warehouse-manager",
    countryCode: "IE",
    editorial: {
      headline: "A genuine warehousing-management scope with ordinary GEP access and no inferred shortage",
      entryPathway:
        "Warehouse Manager is mapped to SOC 2010 1162 Managers and directors in storage and warehousing. Warehouse operations, logistics or supply-chain study and progression from supervisory roles are common routes; broader supply-chain management apprenticeships can support progression.",
      registration:
        "No universal statutory personal registration is required for the broad Warehouse Manager occupation.",
      jobMarketNote:
        "SOLAS 2025 reports replacement demand, churn and difficult-to-fill transport/logistics roles but does not publish an exact Warehouse Manager shortage. SOC 1162 is not on the current Critical Skills or Ineligible lists, so ordinary General Employment Permit treatment may apply.",
      scoreCaveat:
        "The profile is kept separate from elementary storage occupations and fork-lift driving. Broad sector demand is not converted into exact shortage points, and salary/vacancy/growth inputs remain unscored.",
    },
  },
  {
    id: "automotive-service-technician",
    countryCode: "IE",
    editorial: {
      headline: "A craft-based vehicle-service pathway with renewed quota-based General Employment Permit access",
      entryPathway:
        "Automotive Service Technician is mapped to SOC 2010 5231 Vehicle technicians, mechanics and electricians, restricted to car/motor mechanic and vehicle-service technician work. Motor Mechanics is a current Irish craft apprenticeship and provides a direct structured work-based route.",
      registration:
        "No universal statutory personal occupational licence is asserted for the broad Automotive Service Technician scope.",
      jobMarketNote:
        "The 2026 occupations review renewed General Employment Permit quota access for Car/Motor Mechanic, Auto Electrician and Vehicle Technician, subject to a fresh Labour Market Needs Test and current quota conditions. Permit access is not converted into an exact SOLAS shortage signal.",
      scoreCaveat:
        "Quota-based GEP access is kept separate from shortage evidence and Critical Skills status. Salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
]
