import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanHealthOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "JP",
    editorial: {
      headline: "A licensed nursing profession represented across Japan's workplace-based 023 classifications rather than a fabricated single Registered Nurse code",
      entryPathway:
        "Japan's 2022 MHLW classification places 看護師 and 准看護師 together under 023 and then splits them by workplace: 023-01 hospitals and clinics, 023-02 care facilities, 023-03 home nursing and 023-99 other settings. CampCareer restricts this canonical profile to 看護師. Two approved Japanese nursing programmes are retained as direct study pathways, but programme completion is not itself professional registration.",
      registration:
        "看護師 is a nationally licensed profession under the 保健師助産師看護師法. A person must pass the 看護師国家試験 and obtain the Minister of Health, Labour and Welfare licence. Foreign-trained nurses require the applicable examination-eligibility recognition before taking the Japanese national examination.",
      jobMarketNote:
        "The official occupation classification combines registered nurses and assistant nurses within workplace-specific codes. CampCareer therefore does not publish a single 023 market figure as if it represented Registered Nurses alone, and no exact recurring comparable labour-market series is scored yet.",
      scoreCaveat:
        "The Japan v1 score is provisional and reflects the structured study pathway plus the high statutory licensing burden only. Shortage, vacancy, salary, growth and occupation-specific visa components remain zero until comparable evidence is normalised.",
    },
  },
  {
    id: "midwife",
    countryCode: "JP",
    editorial: {
      headline: "A directly classified and nationally licensed profession mapped to MHLW 2022 022-02 助産師",
      entryPathway:
        "Midwife maps directly to 022-02 助産師. The statutory route requires recognised nursing and midwifery education followed by the relevant national examinations. CampCareer currently has no approved Japanese programme link for this canonical career, so no study programme is inferred from nursing degrees alone.",
      registration:
        "助産師 is a nationally licensed profession under the 保健師助産師看護師法. A person must pass both the 助産師国家試験 and 看護師国家試験 and obtain the Minister of Health, Labour and Welfare licence.",
      jobMarketNote:
        "CampCareer has not yet normalised an exact recurring 022-02 vacancy, wage or shortage series suitable for cross-country comparison.",
      scoreCaveat:
        "The score recognises the regulated professional entry route but does not infer labour demand, salary, growth or visa advantage from the existence of the licence or training pathway.",
    },
  },
  {
    id: "care-worker",
    countryCode: "JP",
    editorial: {
      headline: "A broad care occupation spanning facility and home-care classifications, with no universal personal licence across the full canonical scope",
      entryPathway:
        "Care Worker spans facility care 050-01/02/03/99 and home-care 051-01/02 rather than one exact small classification. MHLW job information states that entry to facility care does not necessarily require a particular academic qualification, while 介護職員初任者研修 and the national 介護福祉士 qualification are important routes for skills development and particular care-service responsibilities. One approved Japanese social-work programme is retained only as related study.",
      registration:
        "The broad Care Worker occupation is not universally licensed. 介護福祉士 is a protected national professional title, and home-care or service-specific duties can require prescribed training or qualifications, but CampCareer does not turn those narrower rules into a universal licence requirement for every facility or support worker.",
      jobMarketNote:
        "Facility and home-care occupations are classified separately, so their labour-market evidence is not merged into one fabricated Care Worker series. Current recruitment and workforce conditions remain contextual until a comparable aggregation method is reviewed.",
      scoreCaveat:
        "The provisional score reflects relatively accessible facility-care entry and the absence of one universal licence only. It does not award shortage, vacancy, salary, growth or visa points.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "JP",
    editorial: {
      headline: "A nationally licensed allied-health profession mapped directly to MHLW 2022 024-04 理学療法士",
      entryPathway:
        "Physiotherapist maps directly to 024-04 理学療法士. An approved Japanese physical-therapy programme is retained as a direct study pathway, subject to statutory education eligibility and the national examination; a degree title alone is not treated as a licence.",
      registration:
        "理学療法士 is regulated by the 理学療法士及び作業療法士法. A person must pass the 理学療法士国家試験 and obtain the Minister of Health, Labour and Welfare licence before using the professional title and practising within the statutory scope.",
      jobMarketNote:
        "No exact recurring 024-04 vacancy, salary or shortage series has yet been normalised for the CampCareer Japan comparison layer.",
      scoreCaveat:
        "Only verified entry structure and licensing burden are scored provisionally. Market, growth and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "JP",
    editorial: {
      headline: "A licensed clinical laboratory profession mapped directly to MHLW 2022 024-03 臨床検査技師",
      entryPathway:
        "Medical Laboratory Technician maps to 024-03 臨床検査技師. The approved Japanese medical-laboratory-science programme is retained as a direct study pathway, while statutory education eligibility, the national examination and licence remain separate requirements.",
      registration:
        "臨床検査技師 is a nationally licensed profession under the 臨床検査技師等に関する法律. The licence is granted after passing the national examination and registration with the Ministry of Health, Labour and Welfare.",
      jobMarketNote:
        "The Japan occupation layer does not yet contain a reviewed recurring 024-03 market series that is directly comparable with other countries.",
      scoreCaveat:
        "The provisional score does not infer shortage, salary, vacancy trends, growth or visa advantage from programme availability or professional regulation.",
    },
  },
  {
    id: "radiographer",
    countryCode: "JP",
    editorial: {
      headline: "A nationally licensed medical-imaging profession mapped directly to MHLW 2022 024-01 診療放射線技師",
      entryPathway:
        "Radiographer maps directly to 024-01 診療放射線技師. An approved Japanese radiological-technology programme is retained as a direct study pathway, but professional practice depends on satisfying statutory education, examination and licensing requirements.",
      registration:
        "診療放射線技師 is regulated by the 診療放射線技師法. A person must pass the national examination and obtain the Minister of Health, Labour and Welfare licence.",
      jobMarketNote:
        "Exact recurring 024-01 wage, vacancy and shortage evidence has not yet been normalised for cross-country scoring.",
      scoreCaveat:
        "The score reflects the verified study pathway and mandatory professional licensing burden only; unsupported labour-market and visa components remain zero.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "JP",
    editorial: {
      headline: "A directly classified and nationally licensed profession mapped to MHLW 2022 021-04 薬剤師",
      entryPathway:
        "Pharmacist maps directly to 021-04 薬剤師. The approved Japanese pharmacy programme is retained as a direct study pathway, but programme completion does not replace the statutory eligibility and national examination requirements for pharmacist licensure.",
      registration:
        "薬剤師 is a nationally licensed profession under the 薬剤師法. A person must pass the 薬剤師国家試験 and obtain the Minister of Health, Labour and Welfare licence, with registration in the pharmacist register.",
      jobMarketNote:
        "CampCareer has not yet normalised a recurring exact 021-04 vacancy, wage or shortage series for direct international comparison.",
      scoreCaveat:
        "The provisional score reflects a long regulated education route and licensing burden. It does not infer labour-market strength or immigration advantage from the professional title.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "JP",
    editorial: {
      headline: "A nationally licensed allied-health profession mapped directly to MHLW 2022 024-05 作業療法士",
      entryPathway:
        "Occupational Therapist maps directly to 024-05 作業療法士. An approved Japanese occupational-therapy programme is retained as a direct study pathway, subject to the statutory education and national-examination route.",
      registration:
        "作業療法士 is regulated by the 理学療法士及び作業療法士法. A person must pass the 作業療法士国家試験 and obtain the Minister of Health, Labour and Welfare licence.",
      jobMarketNote:
        "No reviewed exact recurring 024-05 vacancy, salary or shortage series is currently available in the Japan comparison layer.",
      scoreCaveat:
        "Only verified entry structure and mandatory professional licensing burden are recognised in the provisional score. Market, growth and visa components remain unscored.",
    },
  },
]
