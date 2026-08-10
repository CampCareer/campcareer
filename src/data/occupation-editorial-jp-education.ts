import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanEducationOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "JP",
    editorial: {
      headline: "A licensed kindergarten-teaching career mapped directly to MHLW 029-02 and kept separate from nursery-care work",
      entryPathway:
        "Japan's 2022 MHLW classification maps the canonical Early Childhood Teacher to 029-02 幼稚園教員. This profile intentionally excludes 029-01 保育士. A recognised teacher-training curriculum leading to the applicable 幼稚園教諭免許状 is the direct pathway; the reviewed Japanese child-education programme is retained as a direct academic route only where its approved curriculum supports that licence.",
      registration:
        "Kindergarten teaching requires the applicable 幼稚園教諭免許状. The licence is granted through the prefectural board-of-education framework after completing an approved teacher-training route or another lawful qualification route; a degree title by itself is not a teaching licence.",
      jobMarketNote:
        "幼稚園教員 and 保育士 are separate official classifications and qualification systems. CampCareer does not merge childcare employment or programme evidence into the kindergarten-teacher profile.",
      scoreCaveat:
        "The Japan foundation score reflects the structured teacher-entry pathway and licensing burden only. Shortage, vacancy, salary, growth and visa evidence remain unscored until the later common occupation-market enrichment phase.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "JP",
    editorial: {
      headline: "A licensed elementary-school teaching occupation mapped directly to MHLW 031-01 小学校教員",
      entryPathway:
        "MHLW 031-01 directly covers 小学校教員. The standard route is an approved university teacher-training curriculum or another recognised route leading to a 小学校教諭免許状. The reviewed Japanese child-education programme is kept as a direct study pathway only to the extent that its approved curriculum supports the relevant elementary-school teacher licence.",
      registration:
        "A teacher must hold the licence corresponding to the school type. Public-school employment additionally normally involves a prefectural or municipal teacher hiring selection; holding a degree or completing education study alone does not constitute appointment as a teacher.",
      jobMarketNote:
        "The profile is restricted to 031-01 小学校教員 and does not absorb kindergarten, middle-school or special-support teachers into one education market series.",
      scoreCaveat:
        "Only entry structure and licensing burden are scored in the foundation phase. Japanese teacher shortages, hiring competition, salaries, demographic demand and visa feasibility will be normalised later across all countries.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "JP",
    editorial: {
      headline: "A licensed secondary-teaching umbrella spanning middle school, high school and combined secondary schools",
      entryPathway:
        "Japan does not publish one small-classification code for CampCareer's cross-system Secondary School Teacher. The role spans 031-02 中学校教員, 031-04 高等学校教員 and 031-05 中等教育学校教員. Teacher preparation must correspond to the relevant school type and subject. The currently reviewed Japanese-language-teaching programme is therefore retained only as related rather than being treated as a Japanese middle/high-school licensure programme.",
      registration:
        "Middle-school and high-school teaching requires the applicable school-type and subject teacher licence. A language-teaching or general education degree does not automatically confer 中学校教諭 or 高等学校教諭 status, and recruitment or appointment is a separate step.",
      jobMarketNote:
        "Middle schools, high schools and combined secondary schools are separate MHLW classifications. CampCareer keeps them as reference scopes instead of manufacturing one exact secondary-teacher labour series.",
      scoreCaveat:
        "The provisional score captures professional entry and licensing burden only. Hiring demand, teacher shortages, earnings, growth and visa components remain zero until the later market-data phase.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "JP",
    editorial: {
      headline: "A special-support school teaching occupation mapped to MHLW 031-06 with a required base teacher licence and a specialist-licence exception",
      entryPathway:
        "MHLW 031-06 directly classifies 特別支援学校教員. The professional route starts with the relevant kindergarten, elementary, middle-school or high-school teacher licence. MEXT sets out additional study for the 特別支援学校教諭免許状, and the reviewed Japanese special-needs-education programme is retained as a direct academic pathway toward that specialist preparation.",
      registration:
        "The occupation remains registration-required because a foundational school-type teacher licence is required. The specialist 特別支援学校教諭免許状 is the principle qualification for special-support school teaching, but Education Personnel Certification Act Supplementary Provision 16 currently allows appointment without that specialist licence as a transitional exception. CampCareer therefore does not describe the specialist licence itself as universally mandatory.",
      jobMarketNote:
        "Special-support school teachers are kept distinct from general school teachers and from residential support staff such as 特別支援学校寄宿舎指導員. Specialist-licence possession is tracked separately by MEXT because the statutory exception still exists.",
      scoreCaveat:
        "The current score reflects the required base teaching qualification and the additional specialist pathway, while recognising the statutory specialist-licence exception. No shortage, vacancy, salary, growth or visa credit is assigned before the later comparable market-data enrichment phase.",
    },
  },
  {
    id: "social-worker",
    countryCode: "JP",
    editorial: {
      headline: "A protected national social-work profession represented across multiple MHLW welfare settings rather than one facility code",
      entryPathway:
        "社会福祉士 work appears across 049-02 welfare consultation, 049-03 elder-welfare guidance, 049-04 disability-welfare guidance, 049-05 child-welfare guidance and 049-99 other professional welfare settings. The reviewed Japanese social-work programme is retained as a direct academic pathway, but the statutory subject, examination and registration requirements remain decisive.",
      registration:
        "社会福祉士 is a protected national title under the Social Worker and Certified Care Worker Act. Eligible candidates must pass the national examination and register before using the title. This profile is therefore narrower than generic welfare-assistance jobs that do not require 社会福祉士 status.",
      jobMarketNote:
        "Because the same professional qualification is deployed in municipal, elder, disability, child, medical and community settings, CampCareer preserves the setting classifications rather than presenting any one as the full Social Worker market.",
      scoreCaveat:
        "The foundation score currently reflects the regulated professional pathway only. Shortage, vacancy intensity, earnings, growth and visa components remain unscored until setting-level evidence can be normalised consistently.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "JP",
    editorial: {
      headline: "A broad child and youth support occupation spanning youth-center and child-welfare settings rather than one universal Japanese title",
      entryPathway:
        "The canonical Youth Worker spans 030-02 児童館指導員 and youth-support work within 049-05 児童福祉施設指導専門員. Social welfare, psychology, education and supervised child-welfare experience can support entry depending on the setting. The reviewed Japanese social-work programme is kept as related rather than as an automatic youth-worker qualification.",
      registration:
        "There is no single universal Youth Worker licence across this broad canonical scope. Specific 児童指導員 positions require an appointment qualification, with qualifying routes including relevant university study, recognised professional qualifications or specified child-welfare experience; individual facilities can impose further staffing criteria.",
      jobMarketNote:
        "Youth-center guidance and child-welfare-facility support are separate official classifications. Counselling-specific youth roles, such as regional youth-support-station counsellors, are kept under the counselling classification rather than rolled into this profile.",
      scoreCaveat:
        "The score currently captures accessible but setting-dependent entry and moderate role-specific qualification burden. Market demand, wages, growth and visa evidence are intentionally deferred.",
    },
  },
  {
    id: "community-worker",
    countryCode: "JP",
    editorial: {
      headline: "A community-welfare pathway anchored to MHLW 049-99 roles such as social-welfare-council advisers and welfare activity specialists",
      entryPathway:
        "MHLW 049-99 explicitly includes 社会福祉協議会の相談員 and 福祉活動専門員, which provide the closest official anchor for CampCareer's Community Worker role. Social work, social sciences and broader human-studies programmes can support entry, but the four reviewed Japanese programme mappings remain related rather than occupational qualifications.",
      registration:
        "No universal personal Community Worker licence applies across the canonical role. Some municipal or statutory welfare posts can require a 社会福祉主事 appointment qualification or other role-specific eligibility, while community organisations may use different hiring standards.",
      jobMarketNote:
        "Community work varies across social-welfare councils, local government, nonprofit organisations and community-support services. CampCareer does not substitute the entire 049 welfare group for exact Community Worker demand.",
      scoreCaveat:
        "The foundation score recognises broad academic and practical entry with low universal licensing burden. Market, salary, shortage, growth and visa evidence remain unscored until the common enrichment phase.",
    },
  },
  {
    id: "counsellor",
    countryCode: "JP",
    editorial: {
      headline: "A broad counselling career anchored to MHLW 019-03 while preserving separate medical and welfare counselling scopes",
      entryPathway:
        "MHLW 019-03 covers counsellors outside medical and welfare facilities, including school, student, career, workplace and private-practice counselling. Medical psychological counselling is classified separately under 027-99 and welfare-facility counselling under 049-99. Psychology and human-sciences study are relevant, but the two reviewed Japanese programmes remain related rather than professional qualification pathways.",
      registration:
        "Counsellor is not one universally licensed occupation in Japan. Specific protected titles and roles have separate rules: 公認心理師 is a national registered title, キャリアコンサルタント is separately protected, and many school or clinical counselling posts normally expect recognised psychological credentials. Those narrower requirements are not promoted into a universal licence for every counsellor.",
      jobMarketNote:
        "CampCareer uses 019-03 as the main general counselling anchor but retains medical and welfare counselling as non-rollup reference scopes. Their labour data are not merged into one artificial counsellor series.",
      scoreCaveat:
        "The provisional score reflects the educational pathway and moderate credential expectations only. Shortage, vacancies, earnings, growth and visa evidence are deferred to the later market-data phase.",
    },
  },
]
