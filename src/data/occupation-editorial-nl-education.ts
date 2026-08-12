import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NlEducationOccupationEditorialOverride = {
  id: string
  countryCode: "NL"
  editorial: CountryOccupationEditorial
}

export const NL_EDUCATION_OCCUPATION_EDITORIAL_OVERRIDES: readonly NlEducationOccupationEditorialOverride[] = [
  {
    id: "early-childhood-teacher",
    countryCode: "NL",
    editorial: {
      headline: "A high-demand early-childhood education and childcare role with formal qualification and Dutch-language requirements but no universal teacher licence",
      entryPathway:
        "Pedagogisch Educatief Professional, Pedagogiek and qualifying childcare programmes are common routes into early-childhood education and pedagogical work. The canonical profile maps to ISCO-08 Early Childhood Educators and is kept separate from licensed primary-school teaching.",
      registration:
        "Early-childhood and childcare work is not governed by the primary-school teacher authorisation system, but Dutch childcare law and collective-agreement rules impose qualification requirements. Pedagogical staff in day care must also meet the applicable Dutch-language requirement, with additional training requirements for work with babies.",
      jobMarketNote:
        "UWV reports persistent staffing pressure in childcare. Nearly 7,600 childcare vacancies were open at the end of 2025 and demand is especially high for pedagogical employees.",
      scoreCaveat:
        "The score recognises direct childcare labour demand while keeping the regulatory burden distinct from a teaching licence. Salary uses the Studiekeuze123 Pedagogisch Educatief Professional associate-degree graduate starting-pay proxy rather than an occupation median.",
    },
  },
  {
    id: "primary-school-teacher",
    countryCode: "NL",
    editorial: {
      headline: "A very tight Dutch labour-market profession with a mandatory primary-teaching qualification",
      entryPathway:
        "The standard route is the four-year hbo Opleiding tot Leraar Basisonderwijs (pabo), with academic and side-entry variants also available. A pabo qualification authorises teaching across primary education and special primary education within its scope.",
      registration:
        "Primary-school teaching is a regulated teaching profession. A recognised Dutch teaching qualification is required for normal appointment; holders of foreign teaching qualifications must obtain recognition through DUO for permanent teaching in the Netherlands.",
      jobMarketNote:
        "UWV classifies primary-school teachers as a very tight labour-market occupation in Q1 2026 and reports that teacher shortages are expected to persist for years, particularly in the Randstad.",
      scoreCaveat:
        "The strong shortage score is offset by the required teaching qualification and recognition burden. Salary is the Studiekeuze123 pabo graduate starting-pay proxy and immigration remains a separate employer/sponsor question.",
    },
  },
  {
    id: "secondary-school-teacher",
    countryCode: "NL",
    editorial: {
      headline: "A shortage teaching profession where labour-market pressure varies materially by subject and teaching authorisation is mandatory",
      entryPathway:
        "Secondary teachers normally qualify through a subject-specific second-degree hbo teacher programme or a first-degree hbo/university route. Side-entry and educational-minor routes exist under defined conditions.",
      registration:
        "Teaching in secondary education requires the applicable first-degree or second-degree teaching authorisation for the subject and school level, subject to limited statutory exceptions. Foreign qualifications require DUO recognition for permanent work.",
      jobMarketNote:
        "UWV reports increasing tightness in secondary education and expects a shortage of more than 2,500 FTE in 2026. Shortages are strongest in mathematics, physics, chemistry, informatics, Dutch and several foreign/classical languages, so the canonical score remains below a blanket maximum.",
      scoreCaveat:
        "Shortage credit is substantial but not maximal because conditions differ sharply by subject. Salary uses a Studiekeuze123 second-degree teacher-programme graduate proxy rather than an occupation-wide teacher median.",
    },
  },
  {
    id: "special-education-teacher",
    countryCode: "NL",
    editorial: {
      headline: "A regulated teaching role within the broader Dutch teacher shortage, with school-level special-needs training often expected",
      entryPathway:
        "Special education teachers first require the appropriate primary or secondary teaching authorisation for the setting. Many schools additionally prefer or require further special-educational-needs study such as a Master Special Educational Needs.",
      registration:
        "The applicable teaching authorisation is mandatory: primary authorisation is required for special primary education, while the required primary or secondary authorisation in special secondary education depends on the school and examination setting. Foreign qualifications require DUO recognition.",
      jobMarketNote:
        "UWV includes special primary and special secondary education within the education sector affected by persistent teacher shortages, but the reviewed current evidence does not publish a separate national vacancy intensity for this exact canonical role.",
      scoreCaveat:
        "The score uses strong but non-maximal teacher-shortage credit and preserves the additional qualification burden common in special education. Pabo graduate pay is used only as an early-career proxy.",
    },
  },
  {
    id: "social-worker",
    countryCode: "NL",
    editorial: {
      headline: "A growing Dutch social-work profession with current hiring pressure but a more mixed longer-term outlook than teaching",
      entryPathway:
        "The hbo Social Work bachelor is the main broad professional route into social work, community support, youth and family work and related social-service roles. The canonical Social Worker profile uses the professional ISCO-08 social-work scope.",
      registration:
        "Generic social work is not one universally statutorily registered profession in the Netherlands. Some settings, especially youth care involving complex or high-risk tasks, can require an SKJ or BIG-registered professional, but that conditional rule is not applied to every social-worker job.",
      jobMarketNote:
        "UWV reports that social-work employment rose strongly from 2020 to 2024 and vacancies increased again in late 2025. Sector forecasts still point to staffing shortages, while newer long-run projections also suggest that the labour market for maatschappelijk werkers may gradually become somewhat less tight.",
      scoreCaveat:
        "The shortage score is therefore moderate rather than maximum. Salary is the Studiekeuze123 Social Work graduate starting-pay proxy, and conditional SKJ requirements are described without turning the entire profession into a registered occupation.",
    },
  },
  {
    id: "youth-worker",
    countryCode: "NL",
    editorial: {
      headline: "A youth-support profession with sector staffing pressure and task-dependent SKJ registration rather than a universal licence",
      entryPathway:
        "Social Work and Pedagogiek are common higher-education routes into youth work, youth and family support and jeugdzorg. The canonical profile maps to ISCO-08 Social Work Associate Professionals for practical youth-service delivery rather than to licensed clinical treatment.",
      registration:
        "SKJ registration is not required for every youth worker. It becomes relevant when an hbo/wo professional performs complex or high-risk youth-care tasks that the Norm verantwoorde werktoedeling reserves for a registered professional; other youth-work roles may be performed without SKJ registration.",
      jobMarketNote:
        "UWV reports that jeugdzorg employment grew from about 31,000 jobs in 2020 to 36,100 in 2024. Vacancies remained material in 2025, although demand eased from its earlier peak and the sector faces qualitative matching problems as well as headcount shortages.",
      scoreCaveat:
        "The score uses moderate shortage credit and a small burden adjustment for task-dependent SKJ requirements. Social Work graduate pay is used as a transparent pathway proxy rather than a youth-worker salary median.",
    },
  },
  {
    id: "community-worker",
    countryCode: "NL",
    editorial: {
      headline: "A community-services occupation supported by broader social-work demand but intentionally kept below the professional Social Worker scope",
      entryPathway:
        "Social Work, Pedagogiek and community-development pathways can lead into neighbourhood, community and participation work. The canonical profile maps to ISCO-08 Social Work Associate Professionals because it centres on implementing community services and practical client support.",
      registration:
        "Community work is not a universally statutorily registered profession. Specific youth-care or regulated-care tasks can trigger separate professional requirements, but they are not inherent to every community-worker position.",
      jobMarketNote:
        "UWV reports rising employment and vacancies across social work and continued staffing pressure in the broader social-work sector, but the available evidence does not isolate a separate national shortage series for community workers.",
      scoreCaveat:
        "Moderate labour-market credit is inherited only from directly relevant social-work/community-service evidence. Salary uses the Social Work graduate starting-pay proxy and no immigration fast track is inferred.",
    },
  },
  {
    id: "counsellor",
    countryCode: "NL",
    editorial: {
      headline: "A broad counselling profession with applied-psychology entry routes but no current generic Dutch shortage or universal professional register",
      entryPathway:
        "Toegepaste Psychologie, Social Work and related behavioural programmes can lead into non-clinical counselling, coaching and guidance roles. The canonical profile uses ISCO-08 Social Work and Counselling Professionals while excluding protected BIG psychologist or psychotherapist scopes unless separately qualified.",
      registration:
        "The generic counsellor title is not universally statutorily registered. Clinical roles may fall under separate BIG-regulated professions or employer standards, but those requirements are not transferred to every counselling position.",
      jobMarketNote:
        "The reviewed UWV evidence does not establish a broad counsellor shortage. Current long-run evidence also indicates that some psychology and social-work labour markets may become less tight, so no generic shortage points are awarded.",
      scoreCaveat:
        "The score is driven by structured study access and modest graduate pay rather than a shortage claim. Salary uses the Studiekeuze123 Toegepaste Psychologie graduate starting-pay proxy.",
    },
  },
]
