import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const PHARMACIST_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "pharmacist",
  countryCode: "CA",
  editorial: {
    headline: "A regulated pharmacy profession with strong national shortage risk, very high median pay and current healthcare-category immigration eligibility",
    entryPathway:
      "The direct route is an approved pharmacy education programme followed by entry-to-practice competency assessment and the additional registration requirements of the provincial or territorial pharmacy regulator. The current Canada catalogue includes an internationally eligible University of Saskatchewan PharmD route whose next verified application cycle opens in November 2026.",
    registration:
      "Pharmacists are licensed by provincial and territorial regulatory authorities. Outside Quebec, the PEBC Certificate of Qualification is an entry-to-practice licensing requirement, but PEBC certification alone does not grant the right to practise; each regulator adds its own practical, language, jurisprudence and other requirements.",
    jobMarketNote:
      "Job Bank reports a national median wage of CAD 55.49 per hour and COPS reports about 47,700 pharmacists in 2023. COPS classifies NOC 31120 as facing a strong risk of labour shortage over 2024–2033.",
    scoreCaveat:
      "The score uses exact NOC 31120 labour, wage and shortage evidence. The linked PharmD programme is internationally eligible and publicly listed but its 2027 application cycle is not yet open, so the profile does not present it as a currently accepting intake.",
  },
}
