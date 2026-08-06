import type { VisaCostItem, VisaDetail } from "./visa-detail"

type JapanDetailInput = {
  status: string
  processingTime: string
  duration: string
  requirements: string[]
  costNote: string
  costItems?: VisaCostItem[]
  minSalary?: string
}

const CONSULAR_VISA_FEE: VisaCostItem = {
  item: "Single-entry visa issuance fee, approximately, if applicable",
  amount: 15000,
  optional: true,
}

function makeJapanDetail(input: JapanDetailInput): VisaDetail {
  return {
    status: input.status,
    processingTime: input.processingTime,
    duration: input.duration,
    minSalary: input.minSalary,
    successRate: "Not published",
    requirements: input.requirements,
    process: [
      {
        step: "Confirm the correct status",
        duration: "Before applying",
        note: "Use the linked Immigration Services Agency or Ministry of Foreign Affairs page and check the exact activity, nationality and institution or employer conditions.",
      },
      {
        step: "Prepare the supporting basis",
        duration: "Preparation stage",
        note: "Obtain the admission, graduation, school recommendation, employment contract, field-test, internship agreement or working-holiday evidence required for the route.",
      },
      {
        step: "Complete the immigration application",
        duration: "Application stage",
        note: "For a new long-term entry, a sponsor in Japan commonly applies for a Certificate of Eligibility before the applicant files for a visa at the responsible Japanese mission. In-country applicants use the relevant status-change or extension procedure.",
      },
      {
        step: "Finish entry and residence steps",
        duration: input.processingTime,
        note: "After approval, complete visa issuance, entry, residence-card, address-registration and any activity-outside-status permission that applies.",
      },
    ],
    totalEstimatedTime: input.processingTime,
    costBreakdown: {
      currency: "JPY",
      items: input.costItems ?? [],
    },
    costNote: `${input.costNote} Government fees, exemptions and local-currency collection can differ by nationality, application date and diplomatic mission; confirm the current amount before applying.`,
    topCities: ["Tokyo", "Osaka", "Fukuoka"],
  }
}

const STANDARD_LONG_STAY_PROCESSING =
  "Visa issuance is normally 5 working days after application acceptance when there is no issue and a Certificate of Eligibility is submitted; Certificate of Eligibility processing is separate and varies"

export const JAPAN_VISA_DETAILS: Record<string, VisaDetail> = {
  "JP:Student status": makeJapanDetail({
    status: "Study",
    processingTime: STANDARD_LONG_STAY_PROCESSING,
    duration: "Individually designated for the programme, up to 4 years and 3 months per grant",
    costItems: [CONSULAR_VISA_FEE],
    costNote: "For overseas applications accepted from 1 July 2026, Japan publishes an approximate JPY 15,000 single-entry visa fee where a fee is required; school, tuition, insurance and living costs are separate.",
    requirements: [
      "Admission to an eligible Japanese university, junior college, graduate school, college of technology, vocational school, Japanese-language school or other recognised education institution",
      "Certificate of Eligibility normally arranged through the accepting institution or another representative in Japan before the visa application",
      "Passport, visa application, photograph, admission and institution documents required by the responsible Japanese mission",
      "Evidence that tuition and living expenses can be covered for the planned period of study",
      "Maintain enrolment, attendance and the activities authorised under Student status",
      "Obtain separate permission for activities outside the status before paid part-time work; the general limit is 28 hours per week during term and 8 hours per day during designated long vacations",
    ],
  }),
  "JP:Post-graduation job hunting": makeJapanDetail({
    status: "Post-study job search",
    processingTime: "Varies by the regional Immigration Services Agency office handling the change or extension application",
    duration: "6 months, renewable once for a maximum of 1 year of continued job hunting",
    costNote: "An in-country change-of-status or extension fee applies; no single applicant total is shown because payment method and current immigration fees must be confirmed at filing.",
    requirements: [
      "Graduated from an eligible Japanese university, junior college, graduate school, college of technology or qualifying specialised training course while holding Student status",
      "Continue a job search that began before graduation rather than starting an unrelated activity",
      "Recommendation letter from the most recent education institution and proof of graduation or expected graduation",
      "For specialised training graduates, the completed field must relate to an activity covered by an eligible work status",
      "Evidence of funds for the continued stay and documents showing ongoing job-hunting activity",
      "Obtain separate permission before any paid activity and change to the appropriate work status before starting regular employment",
    ],
  }),
  "JP:Engineer / Specialist in Humanities / International Services": makeJapanDetail({
    status: "Professional work",
    processingTime: STANDARD_LONG_STAY_PROCESSING,
    duration: "5 years, 3 years, 1 year or 3 months",
    minSalary: "Remuneration must be at least comparable to that of a Japanese worker performing comparable work",
    costItems: [CONSULAR_VISA_FEE],
    costNote: "The listed optional amount is the approximate consular single-entry visa fee for applications accepted from 1 July 2026; in-country status-change fees are separate.",
    requirements: [
      "Contract with a public or private organisation in Japan for qualifying technical, humanities or international-services work",
      "Role requires knowledge in natural science, engineering, humanities or services based on foreign culture, such as engineering, design, translation, marketing or language instruction",
      "Relevant university education, Japanese specialised-training qualification or the required professional experience for the activity",
      "Remuneration and employment conditions comparable to those offered to a Japanese worker in comparable work",
      "Employer category documents, contract, job description and applicant qualification or experience evidence",
      "Obtain the Certificate of Eligibility or change from Student or another status before performing the employment",
    ],
  }),
  "JP:Specified Skilled Worker (i)": makeJapanDetail({
    status: "Sector-based work",
    processingTime: STANDARD_LONG_STAY_PROCESSING,
    duration: "Granted in periods set by the authority, with an aggregate maximum of 5 years under Specified Skilled Worker (i)",
    minSalary: "Pay must be equal to or greater than that of Japanese workers performing the same work",
    costItems: [CONSULAR_VISA_FEE],
    costNote: "The optional amount is the approximate consular single-entry visa fee from 1 July 2026; testing, documents, travel and in-country immigration fees are separate.",
    requirements: [
      "Employment offer in a field currently authorised under the Specified Skilled Worker system",
      "Pass the field-specific skills test and required Japanese-language test unless an official exemption applies",
      "Employment contract meeting remuneration, working-condition and prohibited-deposit or penalty rules",
      "Receiving organisation and any registered support organisation meet the current notification and support-plan requirements",
      "Health examination, identity, test, employment and support-plan documents required for the application",
      "Family accompaniment is generally not permitted under Specified Skilled Worker (i), and the total stay under this category is capped at 5 years",
    ],
  }),
  "JP:University internship": makeJapanDetail({
    status: "Internship",
    processingTime: STANDARD_LONG_STAY_PROCESSING,
    duration: "Individually designated for the approved programme; a summer job route is limited to a period not exceeding 3 months",
    costItems: [CONSULAR_VISA_FEE],
    costNote: "The correct immigration route depends on whether the internship is paid, its duration and how it forms part of the overseas university curriculum.",
    requirements: [
      "Current student at a university outside Japan",
      "Internship forms part of the applicant's academic programme and contributes to the course or future employment",
      "Written agreement among the student, overseas university and Japanese host describing duties, supervision, period and compensation",
      "Activities remain educational and consistent with the approved internship rather than ordinary unrestricted employment",
      "Certificate of Eligibility and Designated Activities application where required for a paid or longer-term internship",
      "For a summer job, use an official university vacation period and remain within the maximum period specified for that route",
    ],
  }),
  "JP:Working Holiday": makeJapanDetail({
    status: "Working holiday",
    processingTime: "The responsible Japanese embassy or consulate publishes local appointment and processing arrangements; uncomplicated visa applications are generally processed under the normal consular timetable",
    duration: "Normally up to 1 year per participation, subject to nationality-specific bilateral rules and repeat-participation arrangements",
    costItems: [CONSULAR_VISA_FEE],
    costNote: "Some working-holiday nationalities or purposes may be fee-exempt or charged differently, so the optional general single-entry amount is not a guaranteed applicant fee.",
    requirements: [
      "Nationality or eligible regional passport covered by Japan's working-holiday programme; Japan listed 32 partner countries and regions as of 1 April 2026",
      "Usually age 18–30 at application, with Australia, Canada, South Korea and Ireland generally using 18–25 unless the bilateral authorities extend eligibility to 30",
      "Holiday and cultural experience remain the primary purpose, with employment only incidental to supplement travel funds",
      "Apply through the Japanese embassy or consulate responsible for the applicant's country or region while meeting the local residence rule",
      "Valid passport, return ticket or funds for one, initial maintenance funds and good health, without accompanying dependants or children",
      "Do not work in bars, cabarets, nightclubs, gambling establishments or other prohibited public-morals businesses; repeat participation is available only for nationalities covered by current exceptions",
    ],
  }),
}
