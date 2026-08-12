import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsEducationOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "US",
    editorial: {
      headline: "A large early-learning occupation with modest growth, low national median pay and licensing that depends strongly on setting and state",
      entryPathway:
        "Early Childhood Teacher maps to SOC 2018 25-2011 Preschool Teachers, Except Special Education. BLS lists an associate degree as typical overall, while public-school preschool roles generally require at least a bachelor's degree in early childhood education or a related field.",
      registration:
        "There is no single nationwide preschool-teacher licence across every childcare and private setting. BLS states that public-school preschool teachers must be licensed to teach early childhood education, with requirements varying by state.",
      jobMarketNote:
        "BLS reports 555,100 preschool-teacher jobs in 2024, a May 2024 median annual wage of $37,120, and 4% projected growth for 2024–2034.",
      scoreCaveat:
        "Public-school licensure is preserved as a setting-specific boundary rather than applied to every preschool role. Growth and replacement openings are not treated as a federal shortage designation, and the associate-degree national entry profile limits generic H-1B fit.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "US",
    editorial: {
      headline: "A very large elementary-school profession with substantial replacement openings despite projected enrollment-driven decline",
      entryPathway:
        "Primary School Teacher maps to SOC 2018 25-2021 Elementary School Teachers, Except Special Education. BLS lists a bachelor's degree as the typical entry route.",
      registration:
        "All states require public elementary-school teachers to hold state certification or licensure for the grade level they teach. Private-school teachers typically are not subject to that public-school licensing rule.",
      jobMarketNote:
        "BLS reports 1,422,700 elementary-school teacher jobs in 2024, a May 2024 median annual wage of $62,340, and a 2% projected decline for 2024–2034, while replacement openings remain large.",
      scoreCaveat:
        "Replacement demand is not converted into shortage credit when national employment is projected to decline. H-1B or PERM access remains employer-, role-, degree- and state-licensure-specific.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "US",
    editorial: {
      headline: "A million-plus high-school teaching profession with state public-school certification and replacement demand despite projected decline",
      entryPathway:
        "Secondary School Teacher maps to SOC 2018 25-2031 Secondary School Teachers, Except Special and Career/Technical Education. BLS lists a bachelor's degree as typical and notes that public-school certification may require subject-specific academic preparation.",
      registration:
        "Public high-school teachers must have state-issued certification or licensure; private-school requirements differ and often do not use the same state public-school licensing rule.",
      jobMarketNote:
        "BLS reports 1,094,500 jobs in 2024, a May 2024 median annual wage of $64,580, and about a 2% projected decline for 2024–2034.",
      scoreCaveat:
        "Large annual replacement openings do not create a federal shortage designation or positive growth credit. Immigration pathways remain conditional on the specific teaching position, degree requirement, employer filing and state credential.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "US",
    editorial: {
      headline: "A broad special-education teaching family with state public-school licensure and large replacement needs despite slight aggregate decline",
      entryPathway:
        "Special Education Teacher uses the BLS 25-2050 Special Education Teachers aggregate across preschool, elementary, middle, secondary and all-other detailed specialties. A bachelor's degree is the standard minimum public-school entry route, with state-specific special-education preparation rules.",
      registration:
        "All states require special-education teachers in public schools to be licensed for the grade level they teach. Private-school teachers typically need a bachelor's degree but generally are not required to hold the same public-school licence.",
      jobMarketNote:
        "BLS reports 559,500 special-education teacher jobs in 2024, a May 2024 aggregate median annual wage of $64,270, and a 1% projected decline for 2024–2034.",
      scoreCaveat:
        "The profile deliberately uses the BLS aggregate rather than selecting one grade-level specialty. Replacement openings and local staffing pressure are not promoted into national shortage credit; immigration access remains filing- and licence-specific.",
    },
  },
  {
    id: "social-worker",
    countryCode: "US",
    editorial: {
      headline: "A large social-service profession with steady growth and a clear state clinical-licensure boundary",
      entryPathway:
        "Social Worker uses the BLS 21-1020 aggregate. Entry-level nonclinical roles commonly use a BSW, while clinical social work requires an MSW plus supervised experience.",
      registration:
        "Licensing varies by state for nonclinical social work, but all states require clinical social workers to be licensed. Clinical practice requires graduate education and supervised experience in addition to state licensure.",
      jobMarketNote:
        "BLS reports 810,900 social-worker jobs in 2024, a May 2024 median annual wage of $61,330, and 6% projected growth for 2024–2034.",
      scoreCaveat:
        "The aggregate combines child/family/school, healthcare, mental-health/substance-abuse and all-other social workers. Clinical licensure is not generalized to every nonclinical role, and growth is demand evidence rather than federal shortage status.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "US",
    editorial: {
      headline: "A youth-support pathway using Social and Human Service Assistants as a declared national proxy rather than an exact federal occupation title",
      entryPathway:
        "The United States has no single detailed BLS Youth Worker title matching the canonical scope. SOC 2018 21-1093 Social and Human Service Assistants is used as a transparent proxy because it covers client support, referrals, service coordination and assistance across social-service settings.",
      registration:
        "There is no universal nationwide Youth Worker licence. Employers and states may impose background checks, safeguarding rules, driving requirements or setting-specific credentials.",
      jobMarketNote:
        "The 21-1093 proxy reports 449,600 jobs in 2024, a May 2024 median annual wage of $45,120, and 6% projected growth for 2024–2034.",
      scoreCaveat:
        "These figures are a Social and Human Service Assistant proxy and are not an exact census of youth-worker titles. The high-school-level proxy also means generic H-1B specialty-occupation fit is weak; no shortage credit is inferred from growth.",
    },
  },
  {
    id: "community-worker",
    countryCode: "US",
    editorial: {
      headline: "A broad community-support pathway using Social and Human Service Assistants as an explicit national proxy",
      entryPathway:
        "Community Worker is broader than the narrower Community Health Worker occupation. SOC 2018 21-1093 Social and Human Service Assistants is used as the closest general proxy for connecting clients with housing, social services, rehabilitation, benefits and practical community support.",
      registration:
        "There is no universal nationwide Community Worker licence. Setting-specific screening, background checks and employer credentials may apply.",
      jobMarketNote:
        "The declared 21-1093 proxy reports 449,600 jobs in 2024, a May 2024 median annual wage of $45,120, and 6% projected growth for 2024–2034.",
      scoreCaveat:
        "The proxy intentionally avoids narrowing the canonical occupation to Community Health Worker alone. Metrics are therefore proxy evidence, not an exact title census, and the high-school-level entry profile limits generic H-1B fit.",
    },
  },
  {
    id: "counsellor",
    countryCode: "US",
    editorial: {
      headline: "A fast-growing counselling pathway using the mental-health and behavioral-counselling BLS series as a transparent proxy",
      entryPathway:
        "Generic Counsellor has no single exact detailed BLS title matching the canonical scope. SOC 2018 21-1018 Substance Abuse, Behavioral Disorder, and Mental Health Counselors is used as the closest therapeutic-counselling proxy; mental-health counselors typically need a master's degree and internship.",
      registration:
        "Counselling licensure varies by specialty and state. BLS notes that some counselors need a state-issued licence; mental-health practice commonly has graduate education, supervised experience and state-specific licensing requirements.",
      jobMarketNote:
        "The 21-1018 proxy reports 483,500 jobs in 2024, a May 2024 median annual wage of $59,190, and 17% projected growth for 2024–2034.",
      scoreCaveat:
        "The profile does not claim that all general counsellors are substance-use or mental-health counselors. The BLS series is an explicit therapeutic-counselling proxy; strong growth receives growth credit but is not converted into a federal shortage designation.",
    },
  },
]
