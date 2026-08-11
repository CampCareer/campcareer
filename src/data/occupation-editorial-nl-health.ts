import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlHealthOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "NL",
    editorial: {
      headline: "A nationally regulated nursing profession in a persistently tight Dutch healthcare labour market",
      entryPathway:
        "Registered Nurse maps to ISCO-08 2221 Nursing Professionals. Dutch entry is through recognised mbo-4 or hbo nursing education followed by BIG registration; hbo nursing is commonly a four-year bachelor route.",
      registration:
        "Verpleegkundige is an Article 3 Wet BIG profession. BIG registration is mandatory to use the protected professional title and practise within the regulated nursing scope; foreign-qualified nurses must complete the applicable diploma-recognition and language pathway.",
      jobMarketNote:
        "UWV continues to report nursing shortages. General and specialised nurses are structurally promising occupations, and healthcare remains one of the sectors with persistent labour shortages in 2026.",
      scoreCaveat:
        "Shortage evidence is strong, but the Netherlands does not provide a nurse-specific migration fast track. Work and residence access for non-EU applicants remains dependent on the applicable IND route, employer and permit conditions.",
    },
  },
  {
    id: "midwife",
    countryCode: "NL",
    editorial: {
      headline: "A regulated four-year HBO profession with protected title and continued healthcare-sector demand",
      entryPathway:
        "Midwife maps to ISCO-08 2222 Midwifery Professionals. The standard Dutch route is the four-year hbo bachelor Verloskunde, followed by BIG registration before practising under the protected title.",
      registration:
        "Verloskundige is an Article 3 Wet BIG profession. BIG registration is mandatory; internationally qualified applicants must first obtain recognition of their professional qualification and meet the applicable Dutch-language requirements.",
      jobMarketNote:
        "Midwifery sits inside a healthcare labour market that remains structurally tight, but the current evidence set is less occupation-specific than for nurses, physiotherapists and verzorgenden. Shortage credit is therefore deliberately below the maximum.",
      scoreCaveat:
        "The score separates Dutch professional registration from immigration access. BIG eligibility does not itself create an IND residence or work-permit fast track.",
    },
  },
  {
    id: "care-worker",
    countryCode: "NL",
    editorial: {
      headline: "An accessible MBO care occupation with very strong job prospects and a protected education title rather than BIG registration",
      entryPathway:
        "Care Worker is constrained to the Dutch Verzorgende IG / health-care-assistant scope under ISCO-08 5321. KiesMBO lists a direct MBO level 3 Verzorgende IG route, normally two to three years through BOL or BBL.",
      registration:
        "Verzorgende IG is not an Article 3 BIG-register profession. It is an Article 34 occupation with a protected education title, so the profile is not marked as BIG-registration-required even though recognised training matters for use of the title.",
      jobMarketNote:
        "UWV identifies verzorgenden as a shortage group and Verzorgende IG as structurally promising. KiesMBO also reports very strong current job prospects for the training route.",
      scoreCaveat:
        "High labour-market demand does not translate into occupation-specific migration priority. Non-EU access still depends on the employer and applicable IND work route.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "NL",
    editorial: {
      headline: "A BIG-registered HBO profession that UWV still identifies as very tight in 2026",
      entryPathway:
        "Physiotherapist maps to ISCO-08 2264 Physiotherapists. Dutch entry normally follows a four-year hbo bachelor Opleiding tot Fysiotherapeut and BIG registration.",
      registration:
        "Fysiotherapeut is an Article 3 Wet BIG profession. BIG registration is mandatory to use the protected professional title and practise as a physiotherapist; foreign qualifications require recognition before registration.",
      jobMarketNote:
        "UWV explicitly names physiotherapists among healthcare occupations with major shortages in the first quarter of 2026 and expects pressure to increase further toward 2030.",
      scoreCaveat:
        "Strong shortage evidence is kept separate from immigration. The Highly Skilled Migrant route remains sponsor- and salary-dependent rather than occupation-listed.",
    },
  },
  {
    id: "medical-lab-tech",
    countryCode: "NL",
    editorial: {
      headline: "A laboratory-technician profile with a direct MBO-4 biomedical-analysis route and good current job prospects",
      entryPathway:
        "Medical Lab Tech maps to ISCO-08 3212 Medical and Pathology Laboratory Technicians. The closest direct Dutch vocational route is MBO level 4 Biologisch Medisch Analist, normally three to four years.",
      registration:
        "Biologisch medisch analist is not one of the Article 3 BIG-register professions and no universal statutory personal register is applied to this canonical technician scope. Laboratory employers can still impose role-specific quality and safety requirements.",
      jobMarketNote:
        "UWV continues to describe laboratory and biochemistry roles as promising, while KiesMBO reports good employment prospects for Biologisch Medisch Analist. The evidence is supportive but less direct than the explicit 2026 nurse/physiotherapist shortage signals.",
      scoreCaveat:
        "The salary input uses the MBO biomedical-analyst starting wage as a transparent technician proxy and does not import higher-paid laboratory-scientist salaries.",
    },
  },
  {
    id: "radiographer",
    countryCode: "NL",
    editorial: {
      headline: "A protected Article 34 medical-imaging profession with strong study-to-work alignment in a tight paramedical market",
      entryPathway:
        "Radiographer maps to ISCO-08 3211 Medical Imaging and Therapeutic Equipment Technicians. The direct Dutch route is the hbo bachelor Medisch Beeldvormende en Radiotherapeutische Technieken (MBRT).",
      registration:
        "Radiodiagnostisch laborant is an Article 34 Wet BIG profession with a protected education title but is not entered in the Article 3 BIG register. This profile therefore records professional-title protection without treating it as mandatory BIG registration.",
      jobMarketNote:
        "UWV identifies paramedical healthcare as a promising higher-education segment. Studiekeuze123 reports very high study-to-field and study-to-level matching for MBRT graduates.",
      scoreCaveat:
        "The canonical role is diagnostic radiography / medical imaging. Radiation-therapy and other specialist imaging scopes are not used to inflate the base profile.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "NL",
    editorial: {
      headline: "A six-year university-level BIG profession with good graduate outcomes but no occupation-specific migration privilege",
      entryPathway:
        "Pharmacist maps to ISCO-08 2262 Pharmacists. Dutch qualification normally requires the university Pharmacy bachelor-plus-master route before BIG registration as apotheker.",
      registration:
        "Apotheker is an Article 3 Wet BIG profession. BIG registration is mandatory to use the protected professional title; foreign-qualified pharmacists must complete the applicable professional-qualification recognition and language process.",
      jobMarketNote:
        "Healthcare remains structurally tight, and Studiekeuze123 reports very good labour-market outcomes for Pharmacy graduates. Current UWV evidence is less occupation-specific for pharmacists than for nurses and physiotherapists, so shortage credit is conservative.",
      scoreCaveat:
        "The lengthy university route and mandatory BIG registration materially raise entry burden. Highly Skilled Migrant eligibility remains dependent on recognised sponsorship and salary thresholds rather than pharmacist status itself.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "NL",
    editorial: {
      headline: "A four-year HBO paramedical profession with a protected Article 34 education title and good graduate alignment",
      entryPathway:
        "Occupational Therapist is mapped to ISCO-08 2269 Health Professionals Not Elsewhere Classified for the Dutch Ergotherapeut scope. Entry normally follows a four-year hbo bachelor Ergotherapie.",
      registration:
        "Ergotherapeut is an Article 34 Wet BIG occupation with a protected education title, not an Article 3 BIG-register profession. Voluntary professional registration can exist, but there is no universal mandatory BIG registration for this canonical scope.",
      jobMarketNote:
        "UWV identifies paramedical care as a promising healthcare segment. Studiekeuze123 shows strong occupational and level matching for Ergotherapie graduates, while the current shortage evidence remains broader than for nurses or physiotherapists.",
      scoreCaveat:
        "The score therefore gives moderate shortage credit and does not convert professional-title protection into a statutory BIG-registration burden.",
    },
  },
]
