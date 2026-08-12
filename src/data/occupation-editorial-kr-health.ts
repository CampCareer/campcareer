import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaHealthOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "KR",
    editorial: {
      headline: "A nationally licensed nursing profession with a direct accredited-degree route and mandatory Korean state examination",
      entryPathway:
        "Registered Nurse maps to KECO 2025 code 3040 간호사. Under the Nursing Act, the standard Korean route is graduation from an accredited nursing university or college programme followed by the national nursing examination and a Ministry of Health and Welfare licence. A nursing degree listing by itself is not treated as proof that every international student can obtain Korean licensure; programme accreditation, exam eligibility and current language or administrative requirements must be checked separately.",
      registration:
        "A Ministry of Health and Welfare nursing licence is mandatory. The Nursing Act requires eligible nursing graduates to pass the national nursing examination before receiving the licence. The protected professional route is therefore materially different from unlicensed care or nursing-assistant work.",
      jobMarketNote:
        "CampCareer currently publishes the verified classification and licensing pathway but does not yet publish an exact KECO 3040 recurring vacancy, national comparable salary or shortage series for Korea. Six verified Study in Korea nursing programme mappings are retained as direct study links, subject to separate licensure eligibility review.",
      scoreCaveat:
        "KR v1 credits the structured graduate entry route but does not infer labour shortage, vacancy intensity, salary, growth or occupation-specific visa points. The resulting score is provisional and should not be read as a completed cross-country nursing ranking.",
    },
  },
  {
    id: "midwife",
    countryCode: "KR",
    editorial: {
      headline: "A separate licensed midwifery profession reached through prior nursing licensure and additional supervised training",
      entryPathway:
        "KECO 2025 keeps Midwife within the broader 3040 간호사 group, so CampCareer restricts this profile to the 조산사 scope rather than treating all nurses as midwives. Under the Medical Service Act currently in force, the domestic route requires an existing nursing licence, one year of midwifery training at a Ministry-recognised medical institution, the national midwife examination and a Ministry of Health and Welfare midwife licence.",
      registration:
        "A separate midwife licence is mandatory. Nursing licensure alone does not authorise practice as a midwife, and the additional statutory training and examination requirements make this an advanced entry route rather than a direct undergraduate occupation pathway.",
      jobMarketNote:
        "No exact midwife-only KECO labour-market series is normalised in KR v1 because the current KECO unit group is broader 3040 간호사. No Korean programme is linked as a direct midwifery pathway unless the programme evidence explicitly covers the statutory post-nursing route.",
      scoreCaveat:
        "KR v1 gives only limited entry credit because midwifery requires prior nursing licensure plus additional training and examination. Broader nursing demand, salary and vacancies are not reused as midwife-only evidence.",
    },
  },
  {
    id: "care-worker",
    countryCode: "KR",
    editorial: {
      headline: "A regulated elder-care occupation with a short vocational route, mandatory training and a statutory caregiver qualification",
      entryPathway:
        "Care Worker is mapped to KECO 2025 code 5501 요양보호사, not blended with unlicensed 간병인 or other care roles. Under the Elderly Welfare Act, applicants must complete the prescribed training at a designated caregiver education institution and pass the caregiver qualification examination before receiving the certificate.",
      registration:
        "A 요양보호사 qualification certificate is required for the statutory caregiver role in elderly welfare services. Provincial and metropolitan authorities issue the qualification after the legally prescribed education and examination route.",
      jobMarketNote:
        "The verified Korean programme catalogue currently contains two social-welfare programmes mapped as related study only. They are not presented as substitutes for the statutory caregiver training and qualification process. Exact KECO 5501 recurring vacancy and comparable wage series are not yet normalised for KR v1.",
      scoreCaveat:
        "KR v1 credits the relatively accessible vocational entry route but leaves shortage, vacancy, salary, growth and occupation-specific visa components unscored until exact comparable evidence is ingested.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "KR",
    editorial: {
      headline: "A licensed rehabilitation profession with direct university study options, a national examination and Ministry licensure",
      entryPathway:
        "KECO 2025 combines Physical and Occupational Therapists under code 3065 물리 및 작업 치료사. CampCareer restricts this profile to the 물리치료사 subset. The Korean professional route requires qualifying physical-therapy education, the national examination and a Ministry of Health and Welfare licence under the Medical Technologists Act.",
      registration:
        "A physical therapist licence is mandatory. The Medical Technologists Act identifies physical therapists as medical technologists and requires eligible applicants to pass the national examination and obtain the Ministry licence before practising the licensed scope.",
      jobMarketNote:
        "One verified Study in Korea physical-therapy programme is linked as direct study evidence, but programme admission does not by itself guarantee Korean national-exam eligibility for every international student. Broader KECO 3065 labour data are not presented as physical-therapist-only market evidence.",
      scoreCaveat:
        "KR v1 credits the structured professional study route while leaving market and visa components unscored. The shared KECO 3065 classification is explicitly narrowed so occupational-therapy observations are not mixed into the physical-therapy profile.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "KR",
    editorial: {
      headline: "An exact licensed clinical-laboratory profession with a verified specialist degree route and mandatory national examination",
      entryPathway:
        "Medical Laboratory Technician maps directly to KECO 2025 code 3061 임상병리사. The professional route requires qualifying clinical laboratory science education, the national examination and a Ministry of Health and Welfare clinical laboratory technologist licence under the Medical Technologists Act.",
      registration:
        "An 임상병리사 licence is mandatory for the statutory professional scope. The law places clinical laboratory technologists within the licensed medical-technologist professions and requires the applicable state examination and Ministry licence.",
      jobMarketNote:
        "The Korean programme catalogue contains one verified Clinical Laboratory Science programme mapped as direct study and four broader biotechnology or life-science programmes mapped only as related study. Related bioscience degrees are not treated as substitutes for professional licensure requirements.",
      scoreCaveat:
        "KR v1 credits the direct professional education route but does not score shortage, recurring vacancy intensity, salary, growth or occupation-specific visa pathways until exact KECO 3061 evidence is normalised.",
    },
  },
  {
    id: "radiographer",
    countryCode: "KR",
    editorial: {
      headline: "An exact licensed medical-imaging profession with direct radiological-science study and mandatory state examination",
      entryPathway:
        "Radiographer maps directly to KECO 2025 code 3062 방사선사. The Korean route requires qualifying radiological-science education, the national examination and a Ministry of Health and Welfare radiologic technologist licence under the Medical Technologists Act.",
      registration:
        "A 방사선사 licence is mandatory. The statutory scope covers the handling or examination of radiation and related medical-imaging equipment, and practice requires the professional licence rather than a general science credential alone.",
      jobMarketNote:
        "One verified Study in Korea Radiological Science programme is retained as direct study evidence, subject to separate confirmation of national-exam eligibility for the individual student. Exact recurring KECO 3062 vacancy and comparable salary series are not yet published in KR v1.",
      scoreCaveat:
        "KR v1 scores only the structured entry route and licensing burden. No market or occupation-specific visa points are inferred from broader healthcare demand.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "KR",
    editorial: {
      headline: "A tightly regulated pharmacy profession with a six-year degree pathway, national examination and protected Ministry licence",
      entryPathway:
        "Pharmacist maps directly to KECO 2025 code 3031 약사, which is separated from 3032 한약사 in the revised classification. Under the Pharmaceutical Affairs Act, the domestic route requires graduation with a pharmacy degree from an accredited pharmacy university, passing the national pharmacist examination and receiving a Ministry of Health and Welfare pharmacist licence.",
      registration:
        "A pharmacist licence is mandatory and the title is protected. A general pharmaceutical-science or life-science degree is not treated as a pharmacist qualification unless it meets the statutory pharmacy-education and national-examination requirements.",
      jobMarketNote:
        "Two verified Study in Korea pharmacy programme mappings are retained as direct study evidence. They still require programme-level confirmation of the student's professional-exam eligibility and do not automatically establish a licence outcome. Exact KECO 3031 market series are not yet normalised in KR v1.",
      scoreCaveat:
        "The long professional degree and mandatory licence keep entry credit conservative. Shortage, vacancies, salary, growth and occupation-specific visa points remain unscored until comparable exact-code evidence is available.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "KR",
    editorial: {
      headline: "A licensed rehabilitation profession sharing KECO 3065 with physical therapy but preserved as a separate professional scope",
      entryPathway:
        "KECO 2025 combines Physical and Occupational Therapists under code 3065 물리 및 작업 치료사. CampCareer restricts this profile to the 작업치료사 subset. The Korean route requires qualifying occupational-therapy education, the national examination and a Ministry of Health and Welfare occupational therapist licence under the Medical Technologists Act.",
      registration:
        "An 작업치료사 licence is mandatory. The statutory scope includes occupational therapy for recovery of physical and mental functional impairment, and the licence is distinct from physical-therapist licensure despite the shared KECO code.",
      jobMarketNote:
        "One verified Study in Korea Occupational Therapy programme is retained as direct study evidence, subject to individual national-exam eligibility review. Broader KECO 3065 market observations are not presented as occupational-therapist-only evidence.",
      scoreCaveat:
        "KR v1 credits the structured professional study route while leaving market and visa components unscored. Shared-code data are kept conservative to avoid mixing physical- and occupational-therapy labour signals.",
    },
  },
]
