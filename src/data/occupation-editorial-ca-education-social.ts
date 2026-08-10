import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaEducationSocialOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_EDUCATION_SOCIAL_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaEducationSocialOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "CA",
    editorial: {
      headline: "A high-demand early-childhood education pathway with current Express Entry education-category eligibility",
      entryPathway:
        "Early Childhood Teacher is represented by the early childhood educator scope within NOC 42202 Early childhood educators and assistants. Early childhood educators normally complete a two- to four-year college ECE program or a bachelor's degree in child development before meeting the applicable provincial or territorial licensing or certification requirements.",
      registration:
        "Early childhood education regulation is provincial or territorial. NOC guidance states that licensing is required in Ontario, certification is required in British Columbia, and licensing is usually required for early childhood educators in the other provinces and territories.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 22.30 per hour for early childhood educators. The reviewed COPS evidence classifies NOC 42202 as facing a strong risk of shortage over 2024–2033, and NOC 42202 is in the current Express Entry education occupations category.",
      scoreCaveat:
        "NOC 42202 also includes early childhood educator assistants, so the broader employment total is not presented as an educator-only count. The score uses the title-specific national wage, strong shortage signal and current education-category immigration eligibility while leaving vacancy trend components unscored.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "CA",
    editorial: {
      headline: "A provincially certified teaching career with moderate national shortage risk, strong pay and current education-category eligibility",
      entryPathway:
        "Primary School Teacher maps to NOC 41221 Elementary school and kindergarten teachers. A bachelor's degree in education is required, and provincial teaching certification is required before practising in the applicable school system.",
      registration:
        "Teacher certification is administered provincially or territorially rather than through one national licence. NOC 41221 requires a provincial teaching certificate and notes that membership in a provincial or territorial teachers' association or federation is usually required.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 43.27 per hour. The reviewed COPS evidence classifies NOC 41221 as a moderate risk of shortage over 2024–2033, and the occupation is in the current Express Entry education category.",
      scoreCaveat:
        "The canonical role sits within NOC 41221, which also includes kindergarten teachers. The score uses the exact unit-group labour signal and national teacher wage but does not add vacancy-intensity or trend points from point-in-time postings.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "CA",
    editorial: {
      headline: "A regulated school-teaching career with high median pay, moderate shortage risk and current education-category eligibility",
      entryPathway:
        "Secondary School Teacher maps directly to NOC 41220 Secondary school teachers. Teachers generally complete teacher education following relevant subject study, and a provincial teaching certificate is required.",
      registration:
        "Teacher certification is provincial or territorial. NOC 41220 requires a provincial teaching certificate and notes that membership in a provincial or territorial teachers' association or federation may also be required.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 45.67 per hour. The reviewed COPS evidence classifies NOC 41220 as a moderate risk of shortage over 2024–2033, and NOC 41220 is currently eligible under the Express Entry education occupations category.",
      scoreCaveat:
        "The score uses direct NOC 41220 wage, shortage and immigration-category evidence. Vacancy intensity and trend remain unscored because the current Job Bank posting count is a point-in-time measure rather than the required comparable series.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "CA",
    editorial: {
      headline: "A specialist teaching pathway spanning elementary and secondary NOCs, with current education-category eligibility but deliberately unblended wage data",
      entryPathway:
        "Special Education Teacher spans school-based special-education titles in NOC 41221 Elementary school and kindergarten teachers and NOC 41220 Secondary school teachers. Both require teacher education and provincial certification, with additional training required to specialize in special education.",
      registration:
        "School-based special education teachers follow the same provincial or territorial teacher-certification framework as other certified teachers, with additional special-education training. This profile excludes NOC 42203 instructors of persons with disabilities because that is a distinct paraprofessional occupation.",
      jobMarketNote:
        "Both NOC 41220 and 41221 carry a reviewed moderate shortage signal and both are in the current Express Entry education category. Their national median wages differ, so no synthetic Special Education Teacher wage is calculated for this cross-level canonical profile.",
      scoreCaveat:
        "Because the canonical role crosses two school-teacher NOCs, employment and median wage are not blended. Shortage and visa credit are retained because both constituent NOCs have the same reviewed shortage classification and current education-category eligibility.",
    },
  },
  {
    id: "social-worker",
    countryCode: "CA",
    editorial: {
      headline: "A regulated social-work profession with strong national shortage risk and current healthcare and social-services category eligibility",
      entryPathway:
        "Social Worker maps directly to NOC 41300 Social workers. A social-work degree is the standard route in most jurisdictions, supervised practical experience is usually required, and provincial registration requirements apply before using regulated social-work titles or practising where legislation requires registration.",
      registration:
        "Social-work regulation is provincial or territorial. Canadian social-work regulatory bodies govern registration, and NOC guidance notes that the titles Social Worker and Registered Social Worker are regulated across the provinces, with mandatory registration to practise in several jurisdictions.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 38.46 per hour. The reviewed COPS evidence classifies NOC 41300 as a strong risk of shortage over 2024–2033, and NOC 41300 is in the current Express Entry healthcare and social services category.",
      scoreCaveat:
        "The score uses exact NOC 41300 national wage and shortage evidence plus current immigration-category eligibility. Registration obligations vary by jurisdiction, so applicants still need to verify the regulator where they plan to practise.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "CA",
    editorial: {
      headline: "A child-and-youth services pathway inside a strong-shortage NOC with current healthcare and social-services category eligibility",
      entryPathway:
        "Youth Worker is represented by child and youth worker titles within NOC 42201 Social and community service workers. College or university study in child and youth care, social work, psychology or another social-service or health-related discipline is a common route, although some roles may accept relevant support experience.",
      registration:
        "There is no single national Youth Worker licence. NOC guidance notes that social service workers may need provincial regulatory membership in some provinces, so requirements should be checked against the specific role and jurisdiction.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 26.00 per hour for the broader NOC 42201 social and community service worker group. COPS classifies NOC 42201 as a strong risk of shortage, and the NOC is currently included in the Express Entry healthcare and social services category.",
      scoreCaveat:
        "Youth Worker is a narrower title within NOC 42201, so the broader employment total is not presented as youth-worker-only. The score uses the shared unit-group wage and strong shortage signal with current immigration-category eligibility, while programme links are restricted to reviewed child-and-youth-care routes.",
    },
  },
  {
    id: "community-worker",
    countryCode: "CA",
    editorial: {
      headline: "A community-services career in a strong-shortage NOC with accessible study routes and current healthcare and social-services category eligibility",
      entryPathway:
        "Community Worker maps to community-service titles within NOC 42201 Social and community service workers. College or university study in social services, community services, social work, psychology or a related field is common, and relevant support experience can substitute for formal education in some roles.",
      registration:
        "Community Worker is not one nationally licensed occupation. Some social-service roles may require membership in a provincial regulatory body, but requirements vary by job title and province rather than applying uniformly across the canonical role.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 26.00 per hour for NOC 42201. The reviewed national COPS evidence classifies the unit group as a strong risk of shortage, and NOC 42201 is included in the current Express Entry healthcare and social services category.",
      scoreCaveat:
        "Community Worker shares NOC 42201 with youth, addictions and other social-service workers, so the employment total is not treated as community-worker-only. The score retains shared NOC wage, shortage and visa evidence while avoiding false title-level precision.",
    },
  },
  {
    id: "counsellor",
    countryCode: "CA",
    editorial: {
      headline: "A counselling-therapy career with moderate shortage risk, current healthcare and social-services eligibility and jurisdiction-specific regulation",
      entryPathway:
        "Counsellor is represented by counselling-therapy titles in NOC 41301 Therapists in counselling and related specialized therapies. A bachelor's or master's degree in counselling, therapy, mental health, psychology or a related social-service discipline is required, and supervised clinical work may also be required.",
      registration:
        "Counselling regulation varies by jurisdiction and activity. NOC guidance notes regulatory registration for counselling therapists in Nova Scotia and New Brunswick, and additional psychotherapy regulation in Ontario and Quebec, while employers elsewhere may require professional association membership.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 34.00 per hour for registered clinical counsellor/counselling-therapy titles. COPS classifies NOC 41301 as a moderate risk of shortage over 2024–2033, and NOC 41301 is in the current Express Entry healthcare and social services category.",
      scoreCaveat:
        "The canonical Counsellor profile uses clinical and therapeutic counselling rather than career counselling NOC 41321. Regulation and educational requirements differ across provinces, so the score remains provisional despite exact current NOC shortage and immigration-category evidence.",
    },
  },
]
