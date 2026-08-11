import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkEducationOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level early-years profession with a new paid EYTS apprenticeship and targeted recruitment support",
      entryPathway:
        "Early Childhood Teacher maps to SOC 2315 Nursery education teaching professionals. England now has a Level 6 Early Years Teacher degree apprenticeship leading to Early Years Teacher Status (EYTS), alongside graduate-entry Early Years Initial Teacher Training routes.",
      registration:
        "QTS is not required to teach in early years settings in England. EYTS is the relevant professional status for early-years teachers, while maintained-school teaching roles can require QTS instead. Requirements differ across the UK nations and by setting.",
      jobMarketNote:
        "DfE introduced employer grants for 400 Early Years Teacher degree apprentices in 2026/27 and a £4,500 recognition payment for graduate teachers in eligible deprived nurseries, reflecting recruitment and retention pressure in higher-qualified early-years roles.",
      scoreCaveat:
        "The shortage score is limited because the evidence is targeted workforce-policy support rather than a recurring occupation-wide vacancy series. Standard Skilled Worker eligibility receives partial visa credit; early-years teaching is not on the current Temporary Shortage List.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "UK",
    editorial: {
      headline: "A regulated degree-level teaching profession with strong training supply and standard Skilled Worker eligibility",
      entryPathway:
        "Primary School Teacher maps to SOC 2314 Primary education teaching professionals. Degree, postgraduate teacher-training and the Level 6 Teacher Degree Apprenticeship can lead to Qualified Teacher Status (QTS).",
      registration:
        "QTS is legally required to teach in maintained primary schools in England, although academies and private schools can employ teachers without it. Overseas-qualified teachers can use specific temporary and recognition routes, and the other UK nations operate their own teacher-registration systems.",
      jobMarketNote:
        "Primary postgraduate teacher recruitment reached 128% of estimated 2025/26 need, while the nursery and primary teacher workforce fell in the context of a declining pupil population. Current evidence therefore does not support shortage credit for the broad primary occupation.",
      scoreCaveat:
        "Primary receives no shortage points despite standard Skilled Worker eligibility. QTS is treated as a meaningful entry burden because it is legally required in maintained schools, but the burden is not scored as universally absolute because other English school settings can employ without QTS.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "UK",
    editorial: {
      headline: "A degree-level profession with persistent secondary recruitment pressure, especially in shortage subjects",
      entryPathway:
        "Secondary School Teacher maps to SOC 2313 Secondary education teaching professionals. Common routes include postgraduate initial teacher training and the Level 6 Teacher Degree Apprenticeship, both leading to QTS for maintained-school teaching.",
      registration:
        "QTS is legally required in maintained secondary schools in England, while academies and private schools can employ without it. Subject expertise and safeguarding requirements remain central, and recognition rules differ across the UK nations.",
      jobMarketNote:
        "Secondary postgraduate teacher recruitment has not met estimated need in a normal year since 2012/13; provisional 2025/26 recruitment reached 89% of need. DfE continues targeted bursaries and retention incentives in subjects such as chemistry, computing, mathematics and physics.",
      scoreCaveat:
        "The canonical profile covers all secondary teachers, so subject-specific shortages are not treated as a maximum occupation-wide shortage. Moderate shortage credit reflects the persistent aggregate recruitment gap, while visa credit remains standard rather than targeted-list credit.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "UK",
    editorial: {
      headline: "A regulated specialist-teaching profession facing expanding SEND provision and sustained demand for specialist expertise",
      entryPathway:
        "Special Education Teacher maps to SOC 2316 Special and additional needs education teaching professionals. Teacher-training routes leading to QTS can be combined with SEND-focused placements and specialist professional development; the Level 6 Teacher Degree Apprenticeship explicitly includes specialist schools.",
      registration:
        "QTS is required in maintained and non-maintained special schools in England, with some exceptions in other school types. Additional specialist competence may be expected for particular SEND settings, and teacher-registration rules vary across the UK.",
      jobMarketNote:
        "Special and PRU teacher FTE increased 3.9% in 2025/26 alongside continued growth in special-school pupil numbers. Government SEND reforms include 60,000 specialist places and expanded access to specialist teachers, pointing to continued demand rather than a measured occupation-wide vacancy crisis.",
      scoreCaveat:
        "Only limited shortage credit is awarded because current evidence is strongest on growing service demand and workforce expansion, not a comparable recurring special-teacher vacancy rate. Standard Skilled Worker eligibility receives partial visa credit.",
    },
  },
  {
    id: "social-worker",
    countryCode: "UK",
    editorial: {
      headline: "A protected, regulated social-care profession with strong vacancy evidence and Health and Care Worker visa access",
      entryPathway:
        "Social Worker maps to SOC 2461 Social workers. Approved social-work degrees and the Level 6 Social Worker integrated degree apprenticeship provide regulated entry routes, followed by registration with the relevant UK social-work regulator.",
      registration:
        "Social worker is a protected title across the UK. In England, registration with Social Work England is mandatory; Scotland, Wales and Northern Ireland have their own statutory regulators and recognition processes.",
      jobMarketNote:
        "England's local-authority child and family social-work workforce reported 6,000 FTE vacancies at September 2025. The figure has fallen from its 2022 peak but remains a large direct vacancy signal in a regulated profession.",
      scoreCaveat:
        "Social Worker receives maximum shortage credit from the direct vacancy series and 10/10 visa credit because SOC 2461 is explicitly eligible for the Health and Care Worker visa. Mandatory statutory registration creates a high entry burden and is scored separately.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "UK",
    editorial: {
      headline: "A Level 6 professional youth-work occupation with JNC-endorsed training and standard Skilled Worker eligibility",
      entryPathway:
        "Youth Worker is mapped to SOC 2464 Youth work professionals for the canonical professional role. Skills England maintains a Level 6 Youth Worker degree apprenticeship requiring a JNC-endorsed professional Youth Work degree.",
      registration:
        "There is no single UK-wide statutory registration requirement for the generic professional youth-worker role. Professional qualification expectations are significant, and nation-specific rules can differ; for example, regulated education-workforce registration can apply in Wales.",
      jobMarketNote:
        "The current official evidence set does not provide a comparable recurring UK-wide shortage series for Youth work professionals. The role remains eligible for the standard Skilled Worker route as an RQF 6+ occupation.",
      scoreCaveat:
        "The profile deliberately uses professional SOC 2464 rather than SOC 3221, which Home Office labels for youth workers excluding youth work professionals and community workers. No shortage points are inferred without direct recurring evidence.",
    },
  },
  {
    id: "community-worker",
    countryCode: "UK",
    editorial: {
      headline: "An accessible community-support occupation with work-based training but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Community Worker is scoped to the community-worker sub-unit within SOC 3221 Youth and community workers. Skills England Level 3 Youth Support Worker and Level 4 family/community-support pathways provide accessible work-based entry into related community roles.",
      registration:
        "The generic Community Worker occupation is not a statutorily protected UK profession. Employers can require safeguarding checks, specialist certificates or experience depending on the client group and service setting.",
      jobMarketNote:
        "No direct recurring UK-wide shortage series is currently available for the community-worker scope. The occupation is medium-skilled under current immigration rules and is not on the Temporary Shortage List.",
      scoreCaveat:
        "SOC 3221 is not treated as a normal new-overseas Skilled Worker route after the July 2025 skill-threshold change; transitional access can remain for workers with continuous pre-22 July 2025 Skilled Worker permission. Visa credit is therefore low rather than zero.",
    },
  },
  {
    id: "counsellor",
    countryCode: "UK",
    editorial: {
      headline: "A Level 4 counselling occupation with recognised technical training but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Counsellor maps to SOC 3224 Counsellors. Skills England recognises Counsellor as a Level 4 higher technical occupation, including approved therapeutic-counselling qualifications, while employers and professional bodies can set additional supervised-practice standards.",
      registration:
        "Counsellor is not a statutorily protected professional title across the UK in the same way as Social Worker. Professional-body registration or accreditation can be important in practice, especially for clinical, education or commissioned-service roles, but it is not one universal statutory licence.",
      jobMarketNote:
        "The reviewed official sources do not provide a recurring UK-wide occupation-specific shortage series for Counsellors. SOC 3224 is not on the current Temporary Shortage List.",
      scoreCaveat:
        "SOC 3224 sits in the additional RQF 3-5 occupation table and generally cannot support a new overseas Skilled Worker hire unless a specific rule exception applies; transitional access remains for qualifying pre-22 July 2025 Skilled Workers. No shortage points are inferred.",
    },
  },
]
