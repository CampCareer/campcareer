import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeEducationOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "IE",
    editorial: {
      headline: "A qualified early-childhood teaching scope that must not be confused with permit-ineligible early-years support roles",
      entryPathway:
        "Early Childhood Teacher is constrained to the nursery-teaching side of SOC 2010 2315 Primary and nursery education teaching professionals. Early Learning and Care staff working directly with children must hold at least an NFQ Level 5 major award in early childhood care and education, or a qualification recognised as equivalent by the Department of Children, Disability and Equality.",
      registration:
        "Generic Early Learning and Care practitioner work is not registered with the Teaching Council. A recognised early-years qualification is nevertheless a regulatory requirement for staff working directly with children in pre-school services.",
      jobMarketNote:
        "SOLAS 2025 identifies subject-specific secondary teachers, not the broad early-childhood occupation, as the explicit Education shortage. Employment-permit treatment depends heavily on duties: genuine SOC 2315 nursery teaching is kept separate from Child and early years officers SOC 3233 and Nursery nurses and assistants SOC 6121, which are on the current Ineligible List.",
      scoreCaveat:
        "No shortage, salary or growth points are inferred. Ordinary GEP access is treated cautiously because DETE may classify operational early-years duties into an ineligible SOC rather than the professional teaching scope.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "IE",
    editorial: {
      headline: "A Teaching Council-regulated primary profession with regional vacancy pressure but no broad SOLAS shortage designation",
      entryPathway:
        "Primary School Teacher is constrained to primary-school work within SOC 2010 2315. Teaching Council registration normally requires an approved undergraduate primary initial-teacher-education qualification or a Level 8 degree followed by an approved postgraduate primary teacher-education qualification.",
      registration:
        "Teaching Council registration is required for teachers in state-recognised primary schools to receive salary paid from State funds. Qualification, character and vetting requirements apply, with additional assessment for teachers qualified outside Ireland.",
      jobMarketNote:
        "SOLAS 2025 notes difficulties filling some primary posts, including special-school and regional issues, but the explicit Education shortage listed is subject-specific secondary teachers. Primary therefore receives no occupation-wide shortage credit.",
      scoreCaveat:
        "The profile uses ordinary GEP accessibility rather than CSEP treatment and does not turn local vacancy reports into a national shortage score. Salary and recurring vacancy series remain unscored.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "IE",
    editorial: {
      headline: "A regulated post-primary profession with direct but subject-specific SOLAS shortage evidence",
      entryPathway:
        "Secondary School Teacher maps to SOC 2010 2314. Post-primary registration normally requires an appropriate Level 8 degree meeting at least one curricular-subject requirement plus an approved Professional Master of Education, or an approved concurrent post-primary initial-teacher-education degree.",
      registration:
        "Teaching Council registration is required for recognised post-primary teaching. Curricular-subject requirements form part of the registration route, and internationally qualified teachers are assessed for comparability and may receive conditions.",
      jobMarketNote:
        "SOLAS 2025 explicitly lists subject-specific secondary teachers as a shortage. Because the finding is not universal across every subject, the broad canonical Secondary School Teacher profile receives strong partial rather than maximum shortage credit.",
      scoreCaveat:
        "The shortage score reflects subject-specific evidence and must not be read as equal demand for every teaching subject. School teaching is not on the current CSEP list, so visa scoring uses ordinary GEP access.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "IE",
    editorial: {
      headline: "A regulated special-education teaching scope with clear demand growth but only limited shortage credit",
      entryPathway:
        "Special Education Teacher maps to SOC 2010 2316 Special needs education teaching professionals. The core route remains recognised primary or post-primary initial teacher education and Teaching Council registration, with special-education expertise layered by school setting, learner group and role.",
      registration:
        "Teaching Council registration applies to teachers in recognised school settings. CampCareer does not invent a separate statutory Special Education Teacher licence beyond the applicable teacher-registration route.",
      jobMarketNote:
        "SOLAS 2025 reports greater demand for special education and continuing difficulty filling posts in special schools, but its explicit Education shortage is limited to subject-specific secondary teachers. Special Education therefore receives limited demand credit rather than a direct shortage maximum.",
      scoreCaveat:
        "Vacancy pressure and budgeted expansion are treated as demand context, not as a complete occupation-wide shortage series. Salary and growth remain unscored until comparable Irish occupation-level inputs are normalised.",
    },
  },
  {
    id: "social-worker",
    countryCode: "IE",
    editorial: {
      headline: "A CORU-regulated protected profession with direct Critical Skills access",
      entryPathway:
        "Social Worker maps to SOC 2010 2442. Entry requires a professional social-work qualification approved for registration, or recognition of an international qualification, followed by registration with CORU's Social Workers Registration Board.",
      registration:
        "Social worker is a legally protected title in Ireland. CORU's Social Workers Registration Board maintains the register and is the competent authority for recognition of qualifications gained outside the State.",
      jobMarketNote:
        "Social Worker SOC 2442 is explicitly listed on the current Critical Skills Occupations List. CampCareer records that immigration advantage in the visa component rather than double-counting it as a separate shortage score without an independent occupation-specific labour-market series.",
      scoreCaveat:
        "CSEP access is strong, but the protected title and statutory registration pathway create substantial entry burden. Salary, vacancy and growth components remain unscored where exact comparable evidence has not been normalised.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "IE",
    editorial: {
      headline: "A structured youth-work pathway whose generic SOC is currently ineligible for an employment permit",
      entryPathway:
        "Youth Worker is constrained to youth-work duties within SOC 2010 3231 Youth and community workers. SOLAS lists a Youth Work traineeship with substantial on-the-job learning and a Level 6 Community Development outcome as one structured route into the field.",
      registration:
        "Generic youth work does not have one universal statutory professional register in Ireland.",
      jobMarketNote:
        "SOC 3231 Youth and community workers is on the current Ineligible List for employment permits. The listed Family Support Worker exception for disability services is a separate employment scope and is not borrowed for generic Youth Worker roles.",
      scoreCaveat:
        "The profile receives zero visa credit under the ordinary employment-permit route and zero shortage credit. Accessible work-based training improves the entry score but does not override the permit restriction.",
    },
  },
  {
    id: "community-worker",
    countryCode: "IE",
    editorial: {
      headline: "A community-work scope with accessible training routes but a current employment-permit restriction",
      entryPathway:
        "Community Worker is constrained to community-work duties within SOC 2010 3231 Youth and community workers. SOLAS Social and Community Care and Youth Work traineeships provide related work-based pathways into community-facing support and development roles.",
      registration:
        "Generic Community Worker is not treated as a statutorily protected profession. Social Worker and Social Care Worker are distinct regulated titles and are not rolled into this profile.",
      jobMarketNote:
        "SOC 3231 is on the current Ineligible List for employment permits. The Family Support Worker disability-services exception is not generalised to every community-work role.",
      scoreCaveat:
        "No visa or shortage credit is awarded to generic Community Worker. The profile remains separate from regulated social-work and social-care occupations even when some duties overlap.",
    },
  },
  {
    id: "counsellor",
    countryCode: "IE",
    editorial: {
      headline: "A counselling profession moving toward CORU regulation but still permit-ineligible under the current SOC list",
      entryPathway:
        "Counsellor maps to SOC 2010 3235. Formal counselling education and supervised practice are common, while CORU has published future standards for counsellor education and training.",
      registration:
        "The Counsellors and Psychotherapists Registration Board exists, but the statutory counsellor and psychotherapist registers are not yet open. CampCareer therefore does not mark current generic Counsellor work as registration-required or claim a current CORU-approved qualification pathway.",
      jobMarketNote:
        "SOC 3235 Counsellors is on the current Ineligible List for employment permits. Future CORU regulation does not change that current immigration position.",
      scoreCaveat:
        "The current profile receives zero visa and shortage credit. Regulation is explicitly time-bounded: the standards exist, but individual statutory registration is not yet available.",
    },
  },
]
