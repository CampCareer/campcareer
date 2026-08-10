import type { CountryOccupationEditorial } from "./occupation-editorial-base"

export const MIDWIFE_CA_OCCUPATION_EDITORIAL: {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
} = {
  id: "midwife",
  countryCode: "CA",
  editorial: {
    headline: "A regulated maternity-care profession with a strong broader-group shortage signal but restricted current international study access",
    entryPathway:
      "Canadian registration follows an approved baccalaureate midwifery education program or an approved assessment or bridging route, the Canadian Midwifery Registration Exam where required, and registration with the provincial or territorial regulator. The two direct midwifery programmes currently verified in CampCareer are restricted to Canadian citizens or permanent residents, so no international programme link is published.",
    registration:
      "Midwives must be registered with the regulatory authority in the province or territory where they practise. The Canadian Midwifery Regulators Council administers the CMRE, while each regulator can impose additional registration requirements.",
    jobMarketNote:
      "Job Bank reports a national midwife median wage of CAD 46.81 per hour. COPS classifies the broader NOC 31303 group as facing a strong risk of labour shortage over 2024–2033, but that group also contains physician assistants and other allied health professionals.",
    scoreCaveat:
      "Because the COPS shortage signal is broader than midwives alone, shortage credit is capped at 15 rather than the full 20. The broader-group employment count is not used as a midwife employment total, and current direct midwifery programmes are not presented as international study routes because verified admission is domestic-status restricted.",
  },
}
