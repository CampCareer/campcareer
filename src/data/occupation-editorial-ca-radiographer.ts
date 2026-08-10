import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const RADIOGRAPHER_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "radiographer",
  countryCode: "CA",
  editorial: {
    headline: "A medical-imaging profession with high national median pay, a strong broader MRT shortage signal and current healthcare-category immigration eligibility",
    entryPathway:
      "The diagnostic-radiography route generally requires an approved radiological technology or radiography programme with supervised clinical training, followed by CAMRT entry-to-practice certification and any provincial registration required where the profession is regulated. CampCareer currently has one approved direct Tier A Medical Radiation Technology programme with verified international availability.",
    registration:
      "CAMRT is the national certifying body for medical radiation technologists. Job Bank states that provincial licensure is required in Nova Scotia, New Brunswick, Quebec, Ontario, Saskatchewan and Alberta, so regulatory requirements must be checked for the intended province of practice.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 40.00 per hour for Diagnostic Medical Radiation Technologist. COPS classifies the broader NOC 32121 Medical radiation technologists group as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The canonical Radiographer scope is narrower than NOC 32121, which also includes other MRT disciplines. The broader-group employment total is therefore not used and shortage credit is capped at 15; only title-specific diagnostic wage evidence and a scope-aligned approved programme are treated as direct observations.",
  },
}
