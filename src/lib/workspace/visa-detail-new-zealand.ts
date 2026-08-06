import type { VisaCostItem, VisaDetail } from "./visa-detail"

type NewZealandDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

function makeNewZealandDetail(input: NewZealandDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the visa and current rules",
        duration: "Before applying",
        note: "Use the linked Immigration New Zealand page to check the qualification, nationality, age, job, funds and health conditions that apply.",
      },
      {
        step: "Prepare supporting evidence",
        duration: "Application stage",
        note: "Collect the passport, offer of place, qualification, funds, insurance, job offer, employer, training or residence evidence required for the route.",
      },
      {
        step: "Submit online",
        duration: "Application stage",
        note: "Most of these visas are submitted through Immigration Online. Employer-linked routes also require the employer's accreditation, job check or application link.",
      },
      {
        step: "Complete the decision and visa conditions",
        duration: input.processingTime,
        note: "Respond to any evidence request and check the final eVisa conditions before studying, working, changing employer or travelling.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "NZD",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} Immigration fees and the International Visitor Conservation and Tourism Levy can depend on the visa and passport; confirm the current total before applying.`,
    topCities: ["Auckland", "Wellington", "Christchurch"],
  }
}

export const NEW_ZEALAND_VISA_DETAILS: Record<string, VisaDetail> = {
  "NZ:Fee Paying Student Visa": makeNewZealandDetail({
    status: "Study",
    processingTime: "80% within 8 weeks",
    duration: "Up to 4 years, normally linked to the study period paid for",
    costItems: [{ item: "Online visa cost from", amount: 850 }],
    costNote: "The official route page lists the application cost from NZD 850; tuition, insurance, medical checks and living costs are separate.",
    requirements: [
      "Offer of place from an approved New Zealand education provider",
      "Evidence that tuition fees are paid, funded by an acceptable scholarship or covered through approved financial arrangements",
      "Living funds of NZD 20,000 for each year of tertiary, English-language or other non-compulsory study, or NZD 1,667 for each month when studying for less than 1 year",
      "Insurance acceptable to the education provider and a genuine intention to study",
      "Health, character, passport and onward-travel evidence where required",
      "Work only when the eVisa conditions allow it, generally up to 25 hours a week during study and full-time in scheduled holidays",
    ],
  }),
  "NZ:English Language Student Visa": makeNewZealandDetail({
    status: "English-language study",
    processingTime: "80% within 8 weeks",
    duration: "Up to 4 years, linked to the approved English-language course",
    costItems: [{ item: "Online visa cost from", amount: 850 }],
    costNote: "The official route page lists the application cost from NZD 850; course fees, insurance, medical checks and living costs are separate.",
    requirements: [
      "Offer of place for a full-time English-language course from an approved education provider",
      "Evidence of tuition payment, scholarship or acceptable financial support",
      "Living funds of NZD 20,000 for each year or NZD 1,667 for each month when the course is shorter than 1 year",
      "Full medical and travel insurance for the stay",
      "Health, character, passport and genuine-study evidence required by Immigration New Zealand",
      "Part-time work up to 25 hours a week and full-time holiday work only when the visa conditions specifically allow it",
    ],
  }),
  "NZ:Post Study Work Visa": makeNewZealandDetail({
    status: "Post-study work",
    processingTime: "80% within 3 weeks",
    duration: "Up to 3 years, depending on the qualification and study completed",
    costItems: [{ item: "Online visa cost from", amount: 1670 }],
    costNote: "The route page lists the application cost from NZD 1,670. Eligibility changes and a new Short-term Graduate Work Visa are scheduled from 16 November 2026.",
    requirements: [
      "Recently completed an approved New Zealand qualification and have not previously held a Post Study Work Visa",
      "For degree level 7 or higher, normally at least 30 weeks of full-time study in New Zealand",
      "For eligible non-degree level 4 to 7 qualifications, full-time study for the required duration and a qualification on the official eligibility list",
      "Apply no later than 3, 6 or 12 months after the student visa expires, depending on the qualification and previous visa",
      "At least NZD 5,000 for living expenses and the required health and character evidence",
      "Degree level 7 or higher generally allows open work; lower eligible qualifications require work related to the study",
    ],
  }),
  "NZ:Student and Trainee Work Visa": makeNewZealandDetail({
    status: "Practical training",
    processingTime: "80% within 9 weeks",
    duration: "Usually up to 6 months for student practical training or medical and dental training; other trainee categories vary",
    costItems: [{ item: "Online visa cost from", amount: 1455 }],
    costNote: "The route page lists the application cost from NZD 1,455. Training, travel, insurance and professional-registration costs are separate.",
    requirements: [
      "Meet the specific requirements for the relevant field of study, professional training or traineeship",
      "A practical placement, written offer or employment agreement relevant to the applicant's study or training",
      "Enough funds to support the stay or an acceptable sponsor",
      "Health, character and passport evidence required for the intended duration",
      "Professional registration or host-organisation evidence where the training field requires it",
      "Study is limited to up to 3 months in any 12-month period unless a separate student visa is obtained",
    ],
  }),
  "NZ:Accredited Employer Work Visa": makeNewZealandDetail({
    status: "Employer-sponsored work",
    processingTime: "80% within 7 weeks",
    duration: "Up to 5 years, depending on the job offered and visa conditions",
    minSalary: "The pay in the approved job offer must meet the current role and immigration requirements",
    costItems: [{ item: "Online visa cost from", amount: 1540 }],
    costNote: "The route page lists the application cost from NZD 1,540. Employer accreditation, recruitment and job-check costs must not be passed to the worker.",
    requirements: [
      "Current offer of at least 30 hours of work a week from an AEWV-accredited employer",
      "The employer has an approved job check and sends the applicant the official application link",
      "Required work experience, qualification or skill evidence for the job's ANZSCO or National Occupation List level",
      "English-language evidence when required for skill-level 3 to 5 work",
      "Occupational registration when the profession requires it in New Zealand",
      "Work only for the employer and job stated in the visa conditions; a second job or employer change requires the appropriate approval",
    ],
  }),
  "NZ:Skilled Migrant Category Resident Visa": makeNewZealandDetail({
    status: "Skilled residence",
    processingTime: "EOI eligibility is checked immediately; residence application processing varies after invitation",
    duration: "Indefinite residence, with Permanent Resident Visa eligibility possible after meeting the later requirements",
    minSalary: "Current rules through 23 August 2026 use NZD 35/hour for ANZSCO 1–3 and NZD 52.50/hour for ANZSCO 4–5 skilled jobs",
    costItems: [{ item: "Resident visa application cost from", amount: 6450 }],
    costNote: "The route page lists the residence application cost from NZD 6,450 and no fee for the EOI. The points and wage rules change on 24 August 2026, so applicants must recheck the effective criteria.",
    requirements: [
      "Aged 55 or younger",
      "Current skilled job or job offer from an accredited employer for at least 30 hours a week and the required duration",
      "At least 6 skilled resident points from one recognised skill category and, when needed, skilled work experience in New Zealand",
      "English-language ability plus health and character requirements",
      "Submit an Expression of Interest and, if invited, complete the residence application within 4 months",
      "Check the rules effective on the application date because a revised points system and new pathways take effect on 24 August 2026",
    ],
  }),
  "NZ:Working Holiday": makeNewZealandDetail({
    status: "Working holiday",
    processingTime: "Varies by nationality-specific scheme, opening date and annual quota",
    duration: "Normally up to 12 months; Canada can allow up to 23 months and the United Kingdom up to 36 months",
    costNote: "Application cost, available places, opening dates, required funds and employer limits differ by nationality-specific scheme.",
    requirements: [
      "Citizenship of a country that has a current working-holiday agreement with New Zealand",
      "Usually aged 18 to 30, or up to 35 for selected nationalities",
      "Enough funds for the stay plus a return ticket or enough money to buy one",
      "Holiday is the main purpose; work and study are secondary activities",
      "No permanent job and no business operation as an owner; employment conditions vary by scheme",
      "Study or training for no more than 6 months in total and meet the health, character and previous-visa rules for the nationality",
    ],
  }),
}
