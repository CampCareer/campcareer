import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeHealthOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "IE",
    editorial: {
      headline: "A regulated shortage profession with Critical Skills permit access and mandatory NMBI registration",
      entryPathway:
        "Registered Nurse maps to SOC 2010 2231. The standard Irish route is an NMBI-approved pre-registration nursing programme followed by entry to the relevant division of the Register of Nurses and Midwives; internationally educated nurses use NMBI qualification-recognition and registration routes.",
      registration:
        "NMBI registration is mandatory. It is illegal to practise as a nurse in Ireland without being entered in the appropriate division of the NMBI Register.",
      jobMarketNote:
        "SOLAS National Skills Bulletin 2025 identifies nurses as a current healthcare skills shortage. Registered Nurses are also explicitly listed under SOC 2231 on the current Critical Skills Occupations List.",
      scoreCaveat:
        "Shortage and permit access are scored separately. Salary, recurring vacancy intensity and growth remain unscored until a comparable occupation-level Irish series is normalised.",
    },
  },
  {
    id: "midwife",
    countryCode: "IE",
    editorial: {
      headline: "A distinct regulated profession with Critical Skills access and a four-year professional education route",
      entryPathway:
        "Midwife maps to SOC 2010 2232. Irish pre-registration midwifery education is governed by NMBI standards and includes substantial clinical practice; qualified applicants must then register in the Midwives Division.",
      registration:
        "NMBI registration in the Midwives Division is mandatory to practise as a midwife in Ireland. Midwifery is a distinct profession under Irish law rather than a nursing specialism inferred from a nursing qualification.",
      jobMarketNote:
        "Registered Midwives are explicitly eligible under the current Critical Skills Occupations List. SOLAS 2025 names nurses, but not midwives separately, as the direct healthcare shortage finding, so the v1 shortage score does not infer a midwife-specific shortage from the permit list alone.",
      scoreCaveat:
        "Critical Skills eligibility earns visa credit, while shortage remains zero without a separate current midwife-specific SOLAS finding. Salary and recurring vacancy series are not yet normalised.",
    },
  },
  {
    id: "care-worker",
    countryCode: "IE",
    editorial: {
      headline: "A labour-shortage care occupation with a dedicated General Employment Permit route rather than professional registration",
      entryPathway:
        "Care Worker is centred on SOC 2010 6145 Care workers and home carers. A common structured route is the QQI Level 5 Healthcare Support major award; employment-permit applications for care workers and home carers have occupation-specific qualification and remuneration requirements.",
      registration:
        "Generic Care Worker is not a universally protected health-profession title. This profile must not be confused with CORU-regulated Social Care Worker roles, which are a separate professional scope.",
      jobMarketNote:
        "SOLAS 2025 identifies care workers as a labour shortage. Ireland also maintains a dedicated General Employment Permit route for care workers and home carers, subject to the current permit rules, remuneration threshold and any applicable quota conditions.",
      scoreCaveat:
        "Labour shortage and GEP accessibility are scored separately. The lower healthcare-specific permit threshold is not treated as a salary metric, and no occupation median is fabricated.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "IE",
    editorial: {
      headline: "A CORU-regulated therapy profession with direct Critical Skills permit eligibility",
      entryPathway:
        "Physiotherapist maps directly to SOC 2010 2221. Entry requires a CORU-approved qualification or recognised international qualification followed by registration with the Physiotherapists Registration Board.",
      registration:
        "Physiotherapist and Physical Therapist are protected titles. A person must be registered with CORU to use the protected title and practise within the regulated professional scope.",
      jobMarketNote:
        "Physiotherapist is explicitly listed on the current Critical Skills Occupations List. SOLAS 2025 says evidence of shortages for some healthcare occupations such as therapists is inconclusive because of small employment levels, so no direct shortage points are assigned.",
      scoreCaveat:
        "Critical Skills access is not converted into a shortage score. Salary, vacancy intensity and growth stay unscored until comparable Irish occupation-level inputs are available.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "IE",
    editorial: {
      headline: "A technical laboratory scope kept separate from Ireland's regulated Medical Scientist profession",
      entryPathway:
        "Medical Laboratory Technician is constrained to SOC 2010 3218 Medical and dental technicians, medical-laboratory technical scope. Employer-required laboratory qualifications and competence vary by setting; this profile does not assume the CORU Medical Scientist pathway.",
      registration:
        "The generic technician scope is not the protected CORU title Medical Scientist. Medical Scientists are a separate regulated professional occupation with different education, registration and Critical Skills treatment.",
      jobMarketNote:
        "Current Critical Skills treatment for SOC 3218 is limited to specified employments such as prosthetists, orthotists and respiratory physiologists, not generic medical laboratory technicians. The technician scope therefore receives only general-permit accessibility where applicable and no borrowed Medical Scientist shortage credit.",
      scoreCaveat:
        "This deliberate scope boundary prevents the canonical technician from inheriting CORU registration, Medical Scientist shortage evidence or CSEP points. Exact technician salary and recurring vacancy series remain unscored.",
    },
  },
  {
    id: "radiographer",
    countryCode: "IE",
    editorial: {
      headline: "A protected CORU profession with explicit Critical Skills eligibility",
      entryPathway:
        "Radiographer maps to SOC 2010 2217. Entry requires a CORU-approved radiography qualification or recognised international qualification and registration with the Radiographers Registration Board.",
      registration:
        "Radiographer and Radiation Therapist are protected titles under the CORU statutory registration framework. Registration is mandatory for use of the protected professional title.",
      jobMarketNote:
        "Radiographers are explicitly listed on the current Critical Skills Occupations List. The reviewed SOLAS 2025 healthcare summary does not publish a separate radiographer shortage finding, so permit eligibility is not double-counted as shortage evidence.",
      scoreCaveat:
        "Visa credit reflects CSEP eligibility; shortage remains zero without an occupation-specific current finding. Salary and recurring vacancy evidence remain unscored.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "IE",
    editorial: {
      headline: "A statutory pharmacy profession requiring PSI registration and a five-year accredited MPharm route",
      entryPathway:
        "Pharmacist maps directly to SOC 2010 2213. The standard Irish education route is a PSI-accredited five-year integrated MPharm including experiential learning, followed by application to the Register of Pharmacists.",
      registration:
        "Anyone wishing to practise as a pharmacist in Ireland must be registered with the Pharmaceutical Society of Ireland (PSI).",
      jobMarketNote:
        "Pharmacists and industrial pharmacists are explicitly listed on the current Critical Skills Occupations List. No separate pharmacist-specific SOLAS 2025 shortage finding is used in v1, so CSEP status is kept distinct from shortage scoring.",
      scoreCaveat:
        "The long regulated education pathway reduces entry accessibility. Salary, vacancy intensity and growth remain unscored until a comparable current occupation-level series is normalised.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "IE",
    editorial: {
      headline: "A protected CORU therapy profession with direct Critical Skills permit eligibility",
      entryPathway:
        "Occupational Therapist maps directly to SOC 2010 2222. Entry requires a CORU-approved qualification or recognised international qualification followed by registration with the Occupational Therapists Registration Board.",
      registration:
        "Occupational Therapist is a protected title. Registration with CORU is required to use the title and practise within the regulated profession.",
      jobMarketNote:
        "Occupational Therapist is explicitly listed on the current Critical Skills Occupations List. SOLAS 2025 describes shortage evidence for some therapist occupations as inconclusive, so no direct shortage points are inferred.",
      scoreCaveat:
        "CSEP access is scored separately from shortage. Salary, vacancy intensity and growth remain zero until exact comparable Irish evidence is normalised.",
    },
  },
]
