import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzEducationOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzEducationOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Green List Tier 2 teaching route with a clear ECE qualification pathway",
      entryPathway:
        "Entry requires a Teaching Council-approved initial teacher education programme for early childhood teaching. Direct bachelor and graduate-entry routes are available before teacher registration and certification.",
      registration:
        "Registered early-childhood teachers must be registered with the Teaching Council of Aotearoa New Zealand and hold a current practising certificate to officially teach.",
      jobMarketNote:
        "ANZSCO 241111 Early Childhood (Pre-primary School) Teacher — registered is on the current Green List Tier 2, rather than Tier 1.",
      scoreCaveat:
        "Tier 2 supplies the policy-demand and Work to Residence signal. Salary uses Tahatū's current most-common ECE teacher range; posting-derived components remain zero.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Tier 1 primary-teaching profession with Straight to Residence access",
      entryPathway:
        "Primary teachers complete a Teaching Council-approved initial teacher education programme, including bachelor and graduate-entry options, before applying for registration and a practising certificate.",
      registration:
        "Teaching Council registration and a current practising certificate are required to officially teach in New Zealand.",
      jobMarketNote:
        "ANZSCO 241213 Primary School Teacher is on the current Green List Tier 1. Māori-medium and intermediate teacher codes are not rolled into this canonical profile.",
      scoreCaveat:
        "Tier 1 supplies the direct shortage and visa signal. Salary uses Tahatū's current primary-teacher range and no additional posting-derived demand points are inferred.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Tier 1 secondary-teaching pathway with direct residence access",
      entryPathway:
        "Secondary teachers complete an approved secondary initial teacher education programme, often after or alongside subject-specialist degree study, then obtain Teaching Council registration and certification.",
      registration:
        "Teaching Council registration and a current practising certificate are mandatory for official secondary teaching.",
      jobMarketNote:
        "ANZSCO 241411 Secondary School Teacher is on the current Green List Tier 1.",
      scoreCaveat:
        "Current Tier 1 status is used as policy-demand evidence. Salary uses Tahatū's secondary-teacher range; vacancy and growth dimensions remain zero pending recurring comparable data.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "NZ",
    editorial: {
      headline: "A registered-teacher Tier 2 roll-up covering the four special-education ANZSCO occupations",
      entryPathway:
        "The professional foundation is a Teaching Council-approved initial teacher education route and registered-teacher status, with specialist learning-support or disability expertise layered on top.",
      registration:
        "The Green List special-education teacher scope requires Teaching Council registration and a provisional or full practising certificate.",
      jobMarketNote:
        "The profile rolls up 241511 Special Needs Teacher, 241512 Teacher of the Hearing Impaired, 241513 Teacher of the Sight Impaired and 241599 Special Education Teachers nec. Teacher aides are excluded. These occupations sit in Tier 2.",
      scoreCaveat:
        "No exact Tahatū special-education teacher pay page is used. The profile transparently uses the published primary/secondary registered-teacher range as a representative salary proxy.",
    },
  },
  {
    id: "social-worker",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated Tier 1 social-work profession with mandatory SWRB registration",
      entryPathway:
        "Entry requires an SWRB-recognised New Zealand social-work qualification or an accepted Australian/overseas qualification pathway. The former experience-only section 13 pathway closed to new applications on 28 February 2026.",
      registration:
        "Social Worker is a protected title. Registration with the Social Workers Registration Board and a current annual Practising Certificate are required to practise as a social worker.",
      jobMarketNote:
        "ANZSCO 272511 Social Worker is on the current Green List Tier 1 and can support Straight to Residence when the registration and qualification requirements are met.",
      scoreCaveat:
        "Tier 1 policy evidence drives the shortage and visa components, while Tahatū supplies the salary input and posting-derived components remain zero.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "NZ",
    editorial: {
      headline: "An accessible ANZSCO 411716 community profession without a current Green List shortcut",
      entryPathway:
        "Tahatū describes youth work as accessible through experience and youth-work, community or social-service study, with no single statutory degree required for the generic occupation.",
      registration:
        "Youth Worker is not a statutorily registered occupation. Police vetting, safeguarding and employer-specific requirements can still apply.",
      jobMarketNote:
        "ANZSCO 411716 Youth Worker is the exact canonical mapping and receives standard skilled-work treatment rather than Green List credit.",
      scoreCaveat:
        "No shortage points are inferred from broad social-sector demand. Salary uses Tahatū's current Youth Worker range.",
    },
  },
  {
    id: "community-worker",
    countryCode: "NZ",
    editorial: {
      headline: "A distinct community-support occupation kept separate from health-care assistant work",
      entryPathway:
        "Community work can be entered through practical experience and certificate-level community or social-service study. Tahatū Support Worker is used only as the closest transparent entry and pay proxy.",
      registration:
        "Generic ANZSCO 411711 Community Worker has no statutory occupational registration requirement.",
      jobMarketNote:
        "The profile is anchored to ANZSCO 411711 Community Worker and is deliberately not collapsed into Personal Care Assistant 423313 used by the Health Care Worker profile.",
      scoreCaveat:
        "No exact Tahatū Community Worker pay page is used; Support Worker pay is explicitly labelled as a proxy. No Green List or recurring shortage credit is added.",
    },
  },
  {
    id: "counsellor",
    countryCode: "NZ",
    editorial: {
      headline: "A Tier 1 counsellor roll-up with NZAC membership requirements and a deliberate addiction-practice exclusion",
      entryPathway:
        "Green List eligibility for this counsellor scope uses New Zealand Association of Counsellors membership plus one of the listed counselling or related professional degrees, with NZAC accreditation requirements applying to the designated counselling degrees.",
      registration:
        "The canonical profile is not marked as universally statutorily registered, but Green List access depends on the required NZAC membership and qualifying study.",
      jobMarketNote:
        "The roll-up includes 272111 Careers Counsellor, 272113 Family and Marriage Counsellor, 272114 Rehabilitation Counsellor, 272115 Student Counsellor and 272199 Counsellors nec. Drug and Alcohol Counsellor 272112 is excluded because current immigration instructions treat addiction practice under a separate DAPAANZ pathway.",
      scoreCaveat:
        "The included counsellor group receives Tier 1 policy credit, while entry burden is reduced for the membership/qualification gate. Salary uses Tahatū's current Counsellor range.",
    },
  },
] as const
