import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeEducationOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 36100 preschool-teaching occupation with mandatory ECDA educator certification",
      entryPathway:
        "Preschool Education Teacher maps directly to SSOC 2024 code 36100. ECDA-recognised early-childhood training is the regulated preparation route. One reviewed Singapore university programme is retained as a direct academic pathway, but ECDA notes that a degree by itself is not the basic qualification used for preschool educator certification.",
      registration:
        "ECDA educator certification is required for educators deployed in Singapore kindergartens and childcare centres, with certification levels determining the age groups they can teach. Applicants must meet the relevant professional, academic and language requirements.",
      jobMarketNote:
        "Certification and programme availability are kept separate from labour-demand evidence. CampCareer has not yet normalised an exact recurring 36100 shortage, vacancy, salary or growth series into SG v1.",
      scoreCaveat:
        "The foundation score recognises a clear vocational/professional entry pathway while applying a registration burden. Market and occupation-specific visa components remain unscored until the later enrichment phase.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 23500 school-teaching occupation with structured MOE/NIE preparation but no universal teacher licensing register",
      entryPathway:
        "Primary School Teacher maps directly to SSOC 23500. MOE school teaching uses structured teacher selection and NIE professional preparation pathways, including education degrees and subject-specific diploma routes. There is currently no approved SG programme mapping attached to this canonical profile.",
      registration:
        "MOE appointment and professional teacher preparation are important public-school entry requirements, but Singapore does not operate one universal statutory personal teacher-registration system that applies to every primary-school teacher across all employers.",
      jobMarketNote:
        "The official classification is direct, but teacher-training evidence is not converted into shortage, vacancy, earnings or growth credit during the foundation phase.",
      scoreCaveat:
        "SG v1 scores the structured professional entry route and moderate employer-specific entry burden only. Market and visa components remain zero.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 23400 secondary-teaching occupation, kept separate from junior-college and pre-university teaching",
      entryPathway:
        "Secondary School Teacher maps directly to SSOC 23400. MOE secondary teaching commonly requires subject expertise together with professional teacher preparation through NIE or another accepted appointment pathway. No approved SG programme mapping is currently attached to this canonical profile.",
      registration:
        "Public-school selection and teacher preparation are employer and school-system requirements rather than one universal statutory personal occupational licence applying to every secondary-school teacher in Singapore.",
      jobMarketNote:
        "SSOC keeps secondary teaching separate from 23200 Junior college/Pre-university teacher, and CampCareer does not merge those groups into one unsupported exact labour-market series.",
      scoreCaveat:
        "The foundation score reflects professional preparation and entry burden only. Shortage, vacancy, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "SG",
    editorial: {
      headline: "A multi-code SPED teaching umbrella across visual-impairment, early-intervention and other special-education teaching",
      entryPathway:
        "Special Education Teacher spans SSOC 23621 Teacher of the visually impaired, 23622 Early intervention teacher for infants and children and 23629 Special education teacher n.e.c. Professional preparation is disability- and setting-specific, and there is currently no approved canonical Singapore programme link.",
      registration:
        "There is no one universal statutory personal Special Education Teacher licence covering all three SSOC scopes. MOE and social-service-agency SPED schools impose appointment and professional-development requirements, while ECDA certification applies separately when a role falls within regulated preschool educator deployment.",
      jobMarketNote:
        "The three SPED scopes remain separate official classifications and are not merged into fabricated exact salary, vacancy or shortage figures.",
      scoreCaveat:
        "SG v1 credits structured specialist preparation while retaining moderate entry burden. Market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "social-worker",
    countryCode: "SG",
    editorial: {
      headline: "A professional social-work umbrella across general, medical and other social-work practice, with Youth Work kept separate",
      entryPathway:
        "The canonical Social Worker scope spans SSOC 26621 Social worker (general), 26622 Medical social worker and 26629 Social work professional n.e.c. Recognised social-work degrees or graduate diplomas are the core professional preparation; two approved Singapore Social Work programmes are retained as direct pathways.",
      registration:
        "Singapore has an MSF-owned professional accreditation framework overseen by the Social Work Accreditation and Advisory Board and administered by SASW. Current SASW guidance explicitly states that accreditation is not mandatory, so CampCareer does not mark the broad occupation as universally registration-required.",
      jobMarketNote:
        "General, medical and other professional social-work scopes are preserved separately. Accreditation status and programme availability are not treated as labour-demand evidence.",
      scoreCaveat:
        "The foundation score reflects a clear professional degree route and non-statutory accreditation burden. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 26623 Youth Work Professional occupation with the lower-level Youth Work Associate kept as a related scope",
      entryPathway:
        "Youth Worker maps directly at professional level to SSOC 26623 Youth work professional. SSOC 34121 Youth work associate is retained as a separate related reference. Social work, psychology, counselling and community-service study can support entry; five approved Singapore programmes are related pathways.",
      registration:
        "There is no universal statutory Youth Worker occupational registration. Safeguarding, screening, supervision and employer competency requirements can apply when working with children, vulnerable young people or residential services.",
      jobMarketNote:
        "Professional and associate youth-work classifications are kept separate instead of being collapsed into one unsupported occupation-market series.",
      scoreCaveat:
        "SG v1 gives moderate entry credit because pathways vary by role and seniority. Market and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "community-worker",
    countryCode: "SG",
    editorial: {
      headline: "A community-services umbrella without one exact SSOC occupation, preserving associate and professional community-development references",
      entryPathway:
        "SSOC 2024 has no exact five-digit occupation titled Community Worker. CampCareer retains 34122 Social work associate as the closest practical support reference and 26629 Social work professional n.e.c. as a separate professional community-development reference. Three approved Singapore programmes are related pathways.",
      registration:
        "There is no universal statutory Community Worker licence. Employers may require safeguarding, casework, programme-delivery, volunteer-management or client-group-specific competencies depending on the service setting.",
      jobMarketNote:
        "Associate and professional community-work references stay separate; CampCareer does not manufacture an exact Community Worker salary, vacancy or shortage series from them.",
      scoreCaveat:
        "The foundation score recognises relatively accessible community-service entry while leaving all market and occupation-specific visa components unscored.",
    },
  },
  {
    id: "counsellor",
    countryCode: "SG",
    editorial: {
      headline: "A counselling-profession umbrella across rehabilitation, addiction, family, school and general counselling, without statutory licensing",
      entryPathway:
        "The neutral Counsellor career spans SSOC 26631 rehabilitation, 26632 drugs/alcohol, 26633 family, 26634 school and 26639 counselling professional n.e.c. NCSS describes postgraduate counselling qualifications as the international professional benchmark. The three approved Singapore psychology programmes are retained only as related pathways, not direct counselling qualifications.",
      registration:
        "NCSS states that Singapore does not require counsellors to be licensed. Singapore Association for Counselling registration is a professional credential with its own postgraduate and practice requirements rather than a universal statutory occupational licence.",
      jobMarketNote:
        "Counselling specialisations remain separately classified and are not aggregated into unsupported exact salary, vacancy or shortage figures at foundation stage.",
      scoreCaveat:
        "SG v1 reflects the postgraduate professional benchmark and non-statutory credential burden. Market and occupation-specific visa components remain zero.",
    },
  },
]
