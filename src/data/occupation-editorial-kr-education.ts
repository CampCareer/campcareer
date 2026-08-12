import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaEducationOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "KR",
    editorial: {
      headline: "A licensed kindergarten-teaching profession with a dedicated early-childhood education route and teacher certification",
      entryPathway:
        "Early Childhood Teacher maps to KECO 2025 code 2130 유치원 교사. The Korean route is through an approved early-childhood teacher-education programme that satisfies the teacher-certification curriculum and practicum requirements. CampCareer keeps kindergarten teaching separate from childcare-centre 보육교사 work because the legal qualifications and employing institutions are not interchangeable.",
      registration:
        "A valid kindergarten teacher qualification is required for the statutory 유치원 교사 role. Current Ministry of Education standards govern the subject, teaching-practice and grade requirements for teacher certification. Public kindergarten employment additionally requires the relevant public-teacher appointment process, while private kindergarten recruitment follows separate hiring procedures.",
      jobMarketNote:
        "One reviewed Study in Korea Early Childhood Education programme is retained as a direct study pathway. Programme admission or graduation should not be read as an automatic guarantee of teacher-certificate issuance for every international student; programme approval, practicum and current administrative eligibility must be checked.",
      scoreCaveat:
        "KR v1 credits the structured professional route but leaves shortage, vacancy intensity, salary, growth and occupation-specific visa components unscored. Public appointment competition is not converted into a synthetic market score.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "KR",
    editorial: {
      headline: "A tightly structured elementary-teaching profession requiring an approved teacher-education route and elementary teacher certification",
      entryPathway:
        "Primary School Teacher maps directly to KECO 2025 code 2122 초등학교 교사. The standard domestic route is an approved elementary teacher-education programme, typically through a university of education or an approved elementary-education department, followed by issuance of the applicable teacher qualification.",
      registration:
        "An elementary teacher qualification under the Elementary and Secondary Education Act is required for the statutory school-teacher role. Public-school employment normally adds the provincial or metropolitan teacher appointment examination; the certificate and the public appointment exam are distinct steps.",
      jobMarketNote:
        "One reviewed Study in Korea Elementary Education programme is linked directly. CampCareer does not infer national teacher demand from general education-sector statistics or from public appointment headcounts until a comparable exact-occupation series is normalised.",
      scoreCaveat:
        "The route is professionally clear but entry burden is high because the approved programme and teacher qualification are mandatory and public-school entry usually adds an appointment examination. Market and visa components remain unscored in KR v1.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "KR",
    editorial: {
      headline: "A subject-specific licensed teaching profession with approved education degrees, teacher certification and a separate public appointment process",
      entryPathway:
        "Secondary School Teacher maps directly to KECO 2025 code 2121 중·고등학교 교사. Teacher preparation is subject-specific: approved colleges of education, education departments or other authorised teacher-training routes must satisfy the current subject-major, pedagogy and teaching-practice requirements for the relevant secondary teacher certificate.",
      registration:
        "The appropriate secondary-school teacher qualification is required for the statutory role. Public middle and high schools generally require the additional teacher appointment examination, while private schools recruit under their own processes. A general Bachelor degree in the subject is not automatically equivalent to a teaching qualification.",
      jobMarketNote:
        "Four reviewed Study in Korea education programmes covering English and Social Studies Education are retained as direct examples. They represent only selected teaching subjects and are not presented as exhaustive subject coverage.",
      scoreCaveat:
        "KR v1 credits the defined professional pathway but does not score teacher shortages, advertised vacancies, pay, growth or visas until exact comparable evidence is available for the canonical occupation.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "KR",
    editorial: {
      headline: "A licensed special-education profession with school-level-specific certification and a dedicated approved training route",
      entryPathway:
        "Special Education Teacher maps directly to KECO 2025 code 2123 특수교육 교사. Korean certification distinguishes special-education teaching by school level and requires an approved special-education teacher-training route meeting current Ministry of Education curriculum and practicum standards.",
      registration:
        "The applicable special-school teacher qualification is mandatory for the statutory teaching role. Public-school employment normally adds the relevant appointment examination. A general education, psychology or welfare degree does not replace the special-education teacher certificate.",
      jobMarketNote:
        "One reviewed Study in Korea Special Education programme is retained as direct study evidence. CampCareer does not merge broader disability-services or general teaching labour signals into the special-education teacher market profile.",
      scoreCaveat:
        "The dedicated pathway is clear but regulated. KR v1 therefore gives limited entry credit and leaves exact shortage, vacancy, salary, growth and visa evidence unscored.",
    },
  },
  {
    id: "social-worker",
    countryCode: "KR",
    editorial: {
      headline: "A nationally credentialed social-work profession with direct social-welfare degrees and statutory social-worker certification",
      entryPathway:
        "Social Worker maps directly to KECO 2025 code 2311 사회복지사. The standard pathway is completion of the prescribed social-welfare education and field-practice requirements followed by issuance of the relevant social-worker qualification under the Social Welfare Services Act; higher-grade routes add further examination or experience requirements.",
      registration:
        "Korea operates statutory social-worker qualifications issued under the authority of the Ministry of Health and Welfare. CampCareer treats the canonical Social Worker role as credentialed, while recognising that adjacent community-service jobs may use similar skills without requiring the same qualification.",
      jobMarketNote:
        "Five reviewed Study in Korea Social Welfare Bachelor programmes are linked as direct study pathways. Programme presence still does not guarantee that every international student automatically satisfies all current qualification or field-practice requirements.",
      scoreCaveat:
        "KR v1 credits the structured education route but does not infer shortage, recurring vacancy intensity, salary, growth or occupation-specific visa points from the broader social-service sector.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "KR",
    editorial: {
      headline: "A statutory youth-guidance qualification pathway with national qualification assessment and required training",
      entryPathway:
        "Youth Worker maps to KECO 2025 code 2313 청소년 지도사. Under the Framework Act on Youth, the statutory 청소년지도사 qualification is granted after meeting the applicable qualification-assessment requirements and completing the designated training course. CampCareer therefore does not treat a general social-welfare degree as a direct youth-worker qualification.",
      registration:
        "The national 청소년지도사 qualification is a formal credential administered under the authority of the Ministry of Gender Equality and Family. The exact grade and eligibility route depend on education, subjects and experience, so individual qualification review is required.",
      jobMarketNote:
        "One reviewed Social Welfare Bachelor programme is linked only as related study. It can support relevant preparation but is not represented as a direct substitute for the statutory youth-leader qualification process.",
      scoreCaveat:
        "KR v1 gives moderate entry credit because a defined national qualification exists but additional assessment and training are required. Market and visa components remain unscored.",
    },
  },
  {
    id: "community-worker",
    countryCode: "KR",
    editorial: {
      headline: "A broad community-services career anchored to social work, without pretending every community role is a licensed social-worker position",
      entryPathway:
        "KECO 2025 does not publish a standalone Community Worker occupation matching CampCareer's community-services scope. The profile therefore uses broader 2311 사회복지사 as an occupational anchor only for community welfare, outreach, case-support and local-service coordination work. Social-welfare education is a common pathway, but actual community roles vary by employer and statutory service setting.",
      registration:
        "There is no single universal Community Worker licence. Some positions in social-welfare institutions may require or strongly prefer the statutory 사회복지사 qualification, while community outreach, nonprofit and local programme roles can have different requirements. CampCareer therefore keeps `registration_required` false for this broad canonical profile.",
      jobMarketNote:
        "Four reviewed Social Welfare Bachelor programmes are linked as related pathways rather than direct qualification routes. Broader 2311 labour data are not treated as community-worker-only evidence.",
      scoreCaveat:
        "Because the mapping is broader than the canonical title, exact market metrics remain unscored. KR v1 credits accessible related study and low universal licensing burden only.",
    },
  },
  {
    id: "counsellor",
    countryCode: "KR",
    editorial: {
      headline: "A broad counselling occupation with an exact KECO group but no single licence covering every counselling setting",
      entryPathway:
        "Counsellor maps to KECO 2025 code 2312 상담 전문가. Psychology, counselling and related degrees are common academic routes, but the Korean counselling labour market includes multiple regulated and non-regulated settings. Specific roles such as professional school counsellor or youth counsellor have their own qualification rules and should not be generalized to every counsellor job.",
      registration:
        "There is no single universal statutory licence for the whole KECO 2312 상담 전문가 group. Employers may require role-specific national credentials, professional association credentials, supervised experience or postgraduate training. CampCareer therefore does not mark the broad canonical occupation as universally registered.",
      jobMarketNote:
        "Five reviewed Psychology Bachelor programmes are linked as related study only. They are not presented as direct professional qualification pathways because many counselling roles require additional postgraduate, supervised or role-specific credentialing.",
      scoreCaveat:
        "KR v1 credits the existence of relevant academic pathways but leaves shortage, vacancies, salary, growth and visa components unscored and does not award qualification credit based on a psychology degree alone.",
    },
  },
]
