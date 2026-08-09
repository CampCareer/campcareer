import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const CARE_WORKER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "care-worker",
  countryCode: "CA",
  editorial: {
    headline: "A high-demand frontline patient-care occupation with a short vocational entry route and current healthcare-category immigration eligibility",
    entryPathway:
      "The Canada scope is NOC 33102 Nurse aides, orderlies and patient service associates, covering basic patient and resident care in hospitals, nursing homes and assisted-care settings. College certificate and structured workplace-training routes are common, and the verified Canada catalogue contains direct Personal Support Worker and Health Care Aide programmes currently available to international students.",
    registration:
      "There is no single national licence for NOC 33102. Employer, provincial registry, health authority, immunisation, screening and workplace competency requirements vary by role and jurisdiction.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 24.00 per hour. COPS reports about 296,900 workers in 2023 and classifies NOC 33102 as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The profile intentionally uses NOC 33102 frontline institutional care rather than home-support NOC 44101. Point-in-time Job Bank postings do not earn vacancy intensity or trend credit, and programme links are limited to approved direct routes with verified current international availability.",
  },
}
