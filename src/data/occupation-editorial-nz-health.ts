import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzHealthOccupationEditorialOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Green List Tier 1 profession with Straight to Residence access across the major registered-nurse scopes",
      entryPathway:
        "The canonical profile rolls up the main ANZSCO 2544 registered-nurse occupations on the current Green List, excluding Nurse Practitioner. A New Zealand-approved nursing degree is followed by the Nursing Council state final examination, registration and an Annual Practising Certificate.",
      registration:
        "Nursing is regulated under the Health Practitioners Competence Assurance Act. Registered nurses must be registered with the Nursing Council of New Zealand and hold a current Annual Practising Certificate to practise.",
      jobMarketNote:
        "Registered-nurse occupations are current Green List Tier 1 roles. Immigration New Zealand therefore provides Straight to Residence access when the role and registration requirements are met.",
      scoreCaveat:
        "Green List Tier 1 is used as direct policy demand evidence, while posting-level vacancy intensity, employer diversity, vacancy trend and growth remain zero until recurring comparable New Zealand series are ingested.",
    },
  },
  {
    id: "midwife",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated ANZSCO 254111 Green List Tier 1 profession with a four-year professional education route",
      entryPathway:
        "New Zealand entry normally requires an approved 480-credit Bachelor of Midwifery or equivalent professional programme, followed by Midwifery Council registration and a practising certificate. Internationally qualified midwives are assessed separately and may have competence-programme conditions.",
      registration:
        "Midwifery is a regulated profession. Registration with Te Tatau o te Whare Kahu | Midwifery Council and a current practising certificate are required to practise as a midwife in New Zealand.",
      jobMarketNote:
        "Midwife 254111 is on the current Green List Tier 1 and can support Straight to Residence when the Green List registration requirements are satisfied.",
      scoreCaveat:
        "The score recognises Tier 1 policy demand and the direct residence pathway, but does not infer additional vacancy or growth points without a comparable recurring occupation series.",
    },
  },
  {
    id: "care-worker",
    countryCode: "NZ",
    editorial: {
      headline: "A non-registered health-care-assistant profile with a dedicated Care Workforce Work to Residence pathway rather than Green List status",
      entryPathway:
        "Care Worker is constrained to ANZSCO 423313 Personal Care Assistant, whose New Zealand specialisation includes Health Care Assistant. Entry is commonly through employer training and New Zealand Health and Wellbeing certificates rather than a regulated professional degree.",
      registration:
        "Health care assistants are not a profession regulated under the Health Practitioners Competence Assurance Act. Workers must not represent themselves as a registered health practitioner when they are working in an assistant role.",
      jobMarketNote:
        "Personal Care Assistant is one of the selected care-workforce occupations that can lead to the Care Workforce Work to Residence Visa after 24 months of qualifying New Zealand work with an accredited employer and the required wage.",
      scoreCaveat:
        "The residence pathway is conditional: the current care-workforce wage threshold is NZD 28.25 an hour, which is above the midpoint of Tahatū's most-common Health Care Assistant pay range. The score therefore should not be read as automatic residence eligibility for a typical vacancy.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated ANZSCO 252511 Green List Tier 1 profession with strong pay and direct professional-degree routes",
      entryPathway:
        "Entry requires an approved physiotherapy qualification, commonly a Bachelor of Physiotherapy or Bachelor of Health Science in Physiotherapy, followed by Physiotherapy Board registration and an Annual Practising Certificate. International applicants use the Board's express, general or Trans-Tasman pathways as applicable.",
      registration:
        "Physiotherapists must be registered with the Physiotherapy Board of New Zealand and hold a current Annual Practising Certificate for any role in which physiotherapy skills or knowledge are used.",
      jobMarketNote:
        "Physiotherapist 252511 is on the current Green List Tier 1 and is eligible for the Straight to Residence pathway when registration and role requirements are met.",
      scoreCaveat:
        "Tier 1 policy status drives the shortage and visa components; no additional vacancy-series or growth points are inferred in career-opportunity-nz-v1.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated ANZSCO 311213 laboratory-technician scope on Green List Tier 1, distinct from Medical Laboratory Scientist 234611",
      entryPathway:
        "Medical Lab Tech is constrained to ANZSCO 311213 Medical Laboratory Technician / Medical Laboratory Pre-Analytical Technician. New Zealand routes include the QMLT certificate, relevant applied-science qualifications or other accepted biological-science qualifications, followed by Medical Sciences Council registration and an APC.",
      registration:
        "Medical Laboratory Technician is a regulated scope under the Medical Sciences Council of New Zealand. Registration and a current Annual Practising Certificate are legally required; newly registered technicians may initially practise under supervision.",
      jobMarketNote:
        "Medical Laboratory Technician 311213 is included in the current Green List Tier 1. The profile does not substitute the higher-level Medical Laboratory Scientist 234611 occupation for the technician scope.",
      scoreCaveat:
        "The pay input uses Tahatū's current medical laboratory pre-analytical technician range because it is the published 311213 technician pathway. Broader scientist salaries are not imported into this technician score.",
    },
  },
  {
    id: "radiographer",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Medical Imaging Technologist profile in ANZSCO 251211 with Green List Tier 1 residence access",
      entryPathway:
        "Radiographer is mapped to ANZSCO 251211 Medical Imaging Technologist. Accredited New Zealand undergraduate medical-imaging qualifications lead to registration with the Medical Radiation Technologists Board and an Annual Practising Certificate.",
      registration:
        "Medical imaging technology is regulated under the Health Practitioners Competence Assurance Act. Registration with the Medical Radiation Technologists Board and a current APC are required to practise.",
      jobMarketNote:
        "Medical Imaging Technologist 251211 is a current Green List Tier 1 occupation. The same Green List group also covers specialised imaging scopes, but the canonical profile remains diagnostic radiography / medical imaging.",
      scoreCaveat:
        "The score uses Tahatū's Medical Imaging Technologist pay range and Tier 1 policy evidence. MRI, nuclear medicine and radiation-therapy salary evidence is not blended into the base radiographer profile.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated pharmacist roll-up on Green List Tier 1 with strong pay but a substantial internship and registration pathway",
      entryPathway:
        "The profile covers Hospital Pharmacist 251511, Industrial Pharmacist 251512 and Retail Pharmacist 251513. New Zealand graduates complete an accredited pharmacy degree, register as an intern, complete the 1,450-hour Intern Training Programme and pass the Pharmacy Council Assessment Centre before full pharmacist registration.",
      registration:
        "Pharmacy is regulated by the Pharmacy Council of New Zealand. A pharmacist must be registered in the appropriate scope and hold a current Annual Practising Certificate to practise independently.",
      jobMarketNote:
        "All three pharmacist occupations in the canonical roll-up are current Green List Tier 1 roles and can support Straight to Residence when the registration requirements are met.",
      scoreCaveat:
        "High pay and Tier 1 status are balanced by the long professional education, internship and assessment route. Overseas pharmacists may face additional REQR or Non-REQR assessment steps.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated ANZSCO 252411 Green List Tier 1 profession with a direct three-year occupational-therapy degree route",
      entryPathway:
        "Entry commonly requires a Bachelor of Occupational Therapy or Bachelor of Health Science in Occupational Therapy followed by registration with the Occupational Therapy Board of New Zealand and a current Annual Practising Certificate.",
      registration:
        "Occupational therapy is a regulated profession under the Health Practitioners Competence Assurance Act. Registration with the Occupational Therapy Board and a current APC are required to practise.",
      jobMarketNote:
        "Occupational Therapist 252411 is on the current Green List Tier 1 and can support Straight to Residence when professional registration requirements are met.",
      scoreCaveat:
        "The score gives full Tier 1 policy credit but leaves vacancy intensity, employer diversity, vacancy trend and employment growth at zero pending recurring comparable New Zealand evidence.",
    },
  },
]
